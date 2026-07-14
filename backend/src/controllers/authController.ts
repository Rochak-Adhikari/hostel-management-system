import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { hashText, compareHash } from "../utils/bycrptutils";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import { createOtp } from "../utils/otputils";
import sendEmail from "../utils/nodemailer";
import { otpVerificationHTML } from "../utils/email";


// REGISTER

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, phone, password, guardian, confirm_password, role, gender, address } = req.body;

    // validation
    if (!full_name || !email || !phone || !password || !confirm_password || !gender || !address) {


      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    if (password.length < 6) {
      throw new AppError(
        "Password must be at least 6 characters long",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    if (password !== confirm_password) {
      throw new AppError(
        "Password and confirm password do not match",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

     

    // guardian ko validation
    if (guardian) {
      const { name, phone: guardianPhone, email: guardianEmail } = guardian;

      if (!name || !guardianPhone || !guardianEmail) {
        throw new AppError(
          "Guardian name, phone, and email are required",
          400,
          ErrorCodes.VALIDATION_ERROR
        );
      }
    }

    // password hashing garna ko lagi
    const hashedPassword = await hashText(password);

    const user = new User({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role,
      gender,
      address,
      guardian: guardian || undefined,
    });

    //!OTP ko lagi
    const otp = createOtp(6);
    
    const otp_hash = await hashText(otp);
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.otp_hash = otp_hash;
    user.otp_expiry = otp_expiry;

    await sendEmail({
     to: user.email,
     subject: "OTP for Email Verification",
     html: otpVerificationHTML (user, otp),
  });


    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      code: "success",
      status: "success",
      data: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        guardian: user.guardian,
      },
    });

  } catch (error: any) {

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return next(
        new AppError(
          `Account with this ${field} already exists`,
          400,
          ErrorCodes.ACCOUNT_ALREADY_EXISTS
        )
      );
    }

    return next(error);
  }
};


// LOGIN

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError(
        "User not found",
        404,
        ErrorCodes.NOT_FOUND
      );
    }

    if (!user.password) {
      throw new AppError(
        "Password not set for this user",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // password compare garxa
    const isMatch = await compareHash(password, user.password);

    if (!isMatch) {
      throw new AppError(
        "Email or password does not match",
        401,
        ErrorCodes.INVALID_CREDENTIALS
      );
    }

    return res.status(200).json({
      message: "Logged In Successfully",
      code: "success",
      status: "success",
      data: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error: any) {
    return next(error);
  }
};

//!Otp Verify

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      throw new AppError(
        "Email is required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    if (!otp) {
      throw new AppError(
        "OTP is required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // otp_hash ra otp_expiry select: false xa, tesaile explicitly select garnu parxa
    const user = await User.findOne({ email }).select("+otp_hash +otp_expiry");

    if (!user) {
      throw new AppError(
        "User not found",
        404,
        ErrorCodes.NOT_FOUND
      );
    }

    // yo user ko lagi kunai OTP save nai vaisakeko xaina bhane
    if (!user.otp_hash || !user.otp_expiry) {
      throw new AppError(
        "No OTP found for this account. Please request a new OTP.",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // OTP expire vaisakeko cha ki check garne
    const is_otp_expired = new Date(Date.now()) > user.otp_expiry;

    if (is_otp_expired) {
      throw new AppError(
        "OTP has expired. Please request a new OTP.",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // OTP match vayo ki nai check garne
    const is_otp_matched = await compareHash(otp, user.otp_hash);

    if (!is_otp_matched) {
      throw new AppError(
        "Invalid OTP. Please request a new OTP.",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // sabai check pass vayo vane, account verify garne ra otp data clear garne
    user.isVerified = true;
    user.otp_hash = undefined;
    user.otp_expiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "Account verified successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};


//!Resend OTP


export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError(
        "Email is required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(
        "User not found",
        404,
        ErrorCodes.NOT_FOUND
      );
    }

    if (user.isVerified) {
      throw new AppError(
        "This account is already verified",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const otp = createOtp(6);
    const otp_hash = await hashText(otp);
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otp_hash = otp_hash;
    user.otp_expiry = otp_expiry;

    await sendEmail({
      to: user.email,
      subject: "Your New OTP for Email Verification",
      html: otpVerificationHTML(user, otp),
    });

    await user.save();

    return res.status(200).json({
      message: "OTP resent successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};