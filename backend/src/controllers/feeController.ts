import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import { assertCanAccessStudent } from "../middleware/authMiddleware";
import Fee from "../models/Fee";

// CREATE fee

export const createFee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, month, amount, dueDate, paymentMethod } = req.body;

    // validation
    if (!student || !month || !amount || !dueDate) {
      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const fee = new Fee({
        student,
        month,
        amount,
        dueDate,
        paymentMethod

    });

    await fee.save();

    return res.status(201).json({
      message: "fee created successfully",
      code: "success",
      status: "success",
      data: fee,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Sabai fee log fetch garna ko lagi
export const getALLfee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fee = await Fee.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "fee Fetched Successfully",
      code: "success",
      status: "success",
      data: fee,
    });

  } catch (error: any) {
    return next(error);
  }
};

// fee ko id ko basis ma fee fetch garna ko lagi ho
export const getFeeByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findById(id);

    if (!fee) {
      throw new AppError(
        "Fee Not Found",
        404,
        ErrorCodes.FEE_NOT_FOUND
      );
    }

    await assertCanAccessStudent(req, fee.student);

    return res.status(200).json({
      message: "Fee Fetched Successfully",
      code: "success",
      status: "success",
      data: fee,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Fee haru update garna ko lagi
export const updateFee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingFee = await Fee.findById(id);
    if (!existingFee) {
      throw new AppError("Fee Not Found", 404, ErrorCodes.FEE_NOT_FOUND);
    }

    // status "Paid" ma badlida cha, ra pahile paid thiyena vane, paidDate auto set garne
    const updateData = { ...req.body };
    if (req.body.status === "Paid" && existingFee.status !== "Paid") {
      updateData.paidDate = new Date();
    }

    const updatedFee = await Fee.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // true return garxa vney updated data else it's useless send gardaina
        runValidators: true,
      }
    );

    if (!updatedFee) {
      throw new AppError(
        "Fee Not Found",
        404,
        ErrorCodes.FEE_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Fee Updated Successfully",
      code: "success",
      status: "success",
      data: updatedFee,
    });

  } catch (error: any) {
    return next(error);
  }
};

// fee haru delete garna ko lagi
export const deleteFee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedFee = await Fee.findByIdAndDelete(id);

    if (!deletedFee) {
      throw new AppError(
        "Fee Not Found",
        404,
        ErrorCodes.FEE_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Fee Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};

// student ko id ko basis ma tesko sabai fee log fetch garna ko lagi
export const getfeeByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const fee = await Fee.find({ student: studentId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "fee Fetched Successfully",
      code: "success",
      status: "success",
      data: fee,
    });

  } catch (error: any) {
    return next(error);
  }
};