import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { hashText, compareHash } from "../utils/bycrptutils";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes, Role } from "../types/enum";
import { createOtp, createToken } from "../utils/otputils";
import sendEmail from "../utils/nodemailer";
import { otpVerificationHTML, setGuardianPasswordHTML, resetPasswordHTML } from "../utils/email";
import { signAccessToken } from "../utils/jwtUtils";
import { ENV_CONFIG } from "../config/env.config";



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

    // Auto-create guardian account if guardian details provided
    if (guardian && guardian.name && guardian.phone && guardian.email) {
      try {
        const rawToken = createToken();
        const reset_token_hash = await hashText(rawToken);
        const reset_token_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const guardianUser = new User({
          full_name: guardian.name,
          email: guardian.email,
          phone: guardian.phone,
          role: Role.GUARDIAN,
          linked_student: user._id,
          isVerified: false,
          reset_token_hash,
          reset_token_expiry,
        });

        await guardianUser.save();

        const setPasswordLink = `${ENV_CONFIG.FRONTEND_URL}/set-password?token=${rawToken}&email=${encodeURIComponent(guardian.email)}`;

        await sendEmail({
          to: guardian.email,
          subject: "Set Your HostelHub Guardian Account Password",
          html: setGuardianPasswordHTML(guardianUser, setPasswordLink),
        });
      } catch (gError) {
        console.error("Error creating guardian account during student signup:", gError);
      }
    }

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

    //generate JWT token
    const accessToken = signAccessToken({
       
        id: user._id,
        email: user.email,
        role: user.role,
     });
     
     console.log("COOKIE_EXPIRES_IN value:", ENV_CONFIG.COOKIE_EXPIRES_IN, typeof ENV_CONFIG.COOKIE_EXPIRES_IN);

    const isProd = ENV_CONFIG.NODE_ENV === "production";

    return res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      maxAge: Number(ENV_CONFIG.COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000,
    }).status(200).json({

      message: "Logged In Successfully",
      code: "success",
      status: "success",
      data: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        linked_student: user.linked_student,
      },
      accessToken,
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


//! FORGOT PASSWORD

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
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
        "User not found with this email",
        404,
        ErrorCodes.NOT_FOUND
      );
    }

    const rawToken = createToken();
    const reset_token_hash = await hashText(rawToken);
    const reset_token_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    user.reset_token_hash = reset_token_hash;
    user.reset_token_expiry = reset_token_expiry;
    await user.save();

    const setPasswordLink = `${ENV_CONFIG.FRONTEND_URL}/set-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your HostelHub Password",
      html: resetPasswordHTML(user, setPasswordLink),
    });

    return res.status(200).json({
      message: "Password reset link sent to your email",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};


//! SET PASSWORD

export const setPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, token, new_password, confirm_password } = req.body;

    if (!email || !token || !new_password || !confirm_password) {
      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    if (new_password.length < 6) {
      throw new AppError(
        "Password must be at least 6 characters long",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    if (new_password !== confirm_password) {
      throw new AppError(
        "Passwords do not match",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const user = await User.findOne({ email }).select("+reset_token_hash +reset_token_expiry");

    if (!user) {
      throw new AppError(
        "User not found",
        404,
        ErrorCodes.NOT_FOUND
      );
    }

    if (!user.reset_token_hash || !user.reset_token_expiry) {
      throw new AppError(
        "No active password reset request found. Please request a new link.",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    if (new Date() > user.reset_token_expiry) {
      throw new AppError(
        "Password reset token has expired. Please request a new link.",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const isMatch = await compareHash(token, user.reset_token_hash);

    if (!isMatch) {
      throw new AppError(
        "Invalid or expired password reset token",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const hashedPassword = await hashText(new_password);
    user.password = hashedPassword;
    user.reset_token_hash = undefined;
    user.reset_token_expiry = undefined;
    user.isVerified = true;
    user.isActive = true;

    await user.save();

    return res.status(200).json({
      message: "Password has been updated successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};