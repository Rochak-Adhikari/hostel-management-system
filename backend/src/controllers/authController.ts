import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { hashText, compareHash } from "../utils/bycrptutils";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import { createOtp } from "../utils/otputils";
import { get } from "http";
import { send } from "process";
import sendEmail from "../utils/nodemailer";


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
    user.otp = otp_hash;
    user.otp_expiry = otp_expiry;

   sendEmail({
     to: user.email,
     subject: "OTP for Email Verification",
     html: `
       <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px;">
       <h1 style="font-size: 20px; font-weight: 700; color: #111111; margin: 0 0 16px;">
        Email Verification
      </h1>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 8px;">
        Dear ${user.full_name},
      </p>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 24px;">
        Thank you for registering with HostelHub. Please use the following OTP to verify your email address:
      </p>

      <div style="background-color: #111111; color: #ffffff; text-align: center; font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 16px; border-radius: 8px; margin: 0 0 24px;">
        ${otp}
      </div>

      <p style="font-size: 12px; color: #999999; line-height: 1.5; margin: 0;">
        This OTP is valid for a limited time. If you did not request this, you can safely ignore this email.
      </p>
    </div>
    `,
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
   req.body.otp = req.body.otp.toString();
   get

}
catch (error) {
  return next(error);
}
}


//!Resend OTP