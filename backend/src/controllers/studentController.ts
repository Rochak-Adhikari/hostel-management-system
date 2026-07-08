import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { ErrorCodes } from "../types/enum";
import { AppError } from "../middleware/errorhandlermiddleware";

// Sabai user fetch garna ko lagi
export const getALL = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! db query -> user collection

    const users = await User.find({});

    //! success response below
    return res.status(200).json({
      message: "Users Fetched Successfully",
      code: "success",
      status: "success",
      data: users,
    });

  } catch (error: any) {
    return next(error);
  }
};


// user ko id ko basis ma user fetch garna ko lagi ho
export const getByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
    throw new AppError(
      "User Not Found",
      404,
      ErrorCodes.NOT_FOUND
    )
    }

    return res.status(200).json({
      message: "User Fetched Successfully",
      code: "success",
      status: "success",
      data: user,
    });

  } catch (error: any) {
    return next(error);
  }
};


// user haru update garna ko lagi
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
  id,
  req.body,
  {
    new: true, // true return garxa vney updated data else it's useless send gardaina
    runValidators: true,
  }
);

    if (!updatedUser) {
       throw new AppError(
        "User Not Found",
        404,
        ErrorCodes.NOT_FOUND
       )
    }

    return res.status(200).json({
      message: "User Updated Successfully",
      code: "success",
      status: "success",
      data: updatedUser,
    });

  } catch (error: any) {
    return next(error);
  }
};


// user haru delete garna ko lagi
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new AppError(
        "User Not Found",
        404,
        ErrorCodes.NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "User Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};