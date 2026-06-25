import { Request, Response } from "express";
import User from "../models/user";
import { hashText, compareHash } from "../utils/bycrptutils";


// REGISTER

export const register = async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone, password, guardian, confirm_password } = req.body;

    // validation
    if (!full_name || !email || !phone || !password || !confirm_password) {
      return res.status(400).json({
        message: "All fields are required",
        Code: "Validation Error",
        status: "error",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        Code: "Validation Error",
        status: "error",
      });
    }

    if (password !== confirm_password) {
  return res.status(400).json({
    message: "Passwords do not match",
    code: "Validation Error",
    status: "error",
  });
}

    // guardian validation
    if (guardian) {
      const { name, phone: guardianPhone, email: guardianEmail } = guardian;

      if (!name || !guardianPhone || !guardianEmail) {
        return res.status(400).json({
          message: "All guardian details are required",
          Code: "Validation Error",
          status: "error",
        });
      }
    }

    //  CHANGED: hash BEFORE saving (cleaner + safer flow)
    const hashedPassword = await hashText(password);

    const user = new User({
      full_name,
      email,
      phone,
      password: hashedPassword,
      guardian: guardian || undefined,
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      Code: "Success",
      status: "success",
      data: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        guardian: user.guardian,
      },
    });

  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return res.status(400).json({
        message: `${field} already exists`,
        Code: "Duplicate Error",
        status: "error",
      });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
      Code: "Server Error",
      status: "error",
    });
  }
};


// LOGIN

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        Code: "Validation Error",
        status: "error",
      });
    }

    // find user
const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "EMAIL OR PASSWORD DOESN'T EXIST",
        code: "Auth error",
        status: "fail",
      });
    }

    //  CHANGED: SAFE CHECK (prevents bcrypt crash)
    if (!user.password) {
      return res.status(500).json({
        message: "User password missing in database",
        status: "error",
      });
    }

    // compare password
    const isMatch = await compareHash(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "EMAIL OR PASSWORD DOESN'T MATCH",
        code: "Auth error",
        status: "fail",
      });
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
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

