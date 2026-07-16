import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import Visitor from "../models/Visitor";

// CREATE Visitors

export const createVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, visitorName, visitorPhone, purpose, checkInTime, checkOutTime } = req.body;

    // validation - checkOutTime yaha chaidaina, visitor pahilo chotti aauda checkout time huna nai sakdaina
    if (!student || !visitorName || !visitorPhone || !purpose || !checkInTime) {
      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const visitor = new Visitor({
      student,
      visitorName,
      visitorPhone,
      purpose,
      checkInTime,
      checkOutTime,
    });

    await visitor.save();

    return res.status(201).json({
      message: "Visitor Logs created successfully",
      code: "success",
      status: "success",
      data: visitor,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Sabai visitor log fetch garna ko lagi
export const getALLVisitors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const visitors = await Visitor.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Visitors Fetched Successfully",
      code: "success",
      status: "success",
      data: visitors,
    });

  } catch (error: any) {
    return next(error);
  }
};

// visitor ko id ko basis ma visitor fetch garna ko lagi ho
export const getVisitorByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id);

    if (!visitor) {
      throw new AppError(
        "Visitor Not Found",
        404,
        ErrorCodes.VISITOR_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Visitor Fetched Successfully",
      code: "success",
      status: "success",
      data: visitor,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Visitor haru update garna ko lagi
export const updateVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingVisitor = await Visitor.findById(id);
    if (!existingVisitor) {
      throw new AppError("Visitor Not Found", 404, ErrorCodes.VISITOR_NOT_FOUND);
    }

    const updatedVisitor = await Visitor.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // true return garxa vney updated data else it's useless send gardaina
        runValidators: true,
      }
    );

    if (!updatedVisitor) {
      throw new AppError(
        "Visitor Not Found",
        404,
        ErrorCodes.VISITOR_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Visitor Updated Successfully",
      code: "success",
      status: "success",
      data: updatedVisitor,
    });

  } catch (error: any) {
    return next(error);
  }
};

// visitor haru delete garna ko lagi
export const deleteVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedVisitor = await Visitor.findByIdAndDelete(id);

    if (!deletedVisitor) {
      throw new AppError(
        "Visitor Not Found",
        404,
        ErrorCodes.VISITOR_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Visitor Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};

// student ko id ko basis ma tesko sabai visitor log fetch garna ko lagi
export const getVisitorsByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const visitors = await Visitor.find({ student: studentId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Visitors Fetched Successfully",
      code: "success",
      status: "success",
      data: visitors,
    });

  } catch (error: any) {
    return next(error);
  }
};