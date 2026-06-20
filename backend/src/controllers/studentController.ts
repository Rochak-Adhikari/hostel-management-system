import { Request, Response } from "express";
import User from "../models/user";

// GET ALL USERS
export const getALL = async (req: Request, res: Response) => {
  try {
    //! db query -> user collection

    const users = await User.find({}); 

    //! success response below
    return res.status(200).json({
      message: "User Fetched",
      code: "success",
      status: "success",
      data: users,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      Code: "Server Error",
      status: "error",
      data: null,
    });
  }
};


// GET BY ID
export const getByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        code: "Not found",
        status: "fail",
        data: null,
      });
    }

    return res.status(200).json({
      message: "User Fetched",
      code: "success",
      status: "success",
      data: user,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      Code: "Server Error",
      status: "error",
      data: null,
    });
  }
};


// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true } //  if true returns updated data else it;s useless wont send anything
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User Not Found",
        status: "fail",
      });
    }

    return res.status(200).json({
      message: "User Updated Successfully",
      status: "success",
      data: updatedUser,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "error",
    });
  }
};


// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User Not Found",
        status: "fail",
      });
    }

    return res.status(200).json({
      message: "User Deleted Successfully",
      status: "success",
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "error",
    });
  }
};