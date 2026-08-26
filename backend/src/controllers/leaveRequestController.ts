import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes, LeaveStatus, Role } from "../types/enum";
import { assertCanAccessStudent } from "../middleware/authMiddleware";
import LeaveRequest from "../models/LeaveRequest";

// CREATE LeaveRequests

export const createLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, fromDate, toDate, reason } = req.body;

    // student aafai halda aafno id matra; admin le aru ko lagi halna sakxa
    const owner = req.user?.role === Role.ADMIN ? student : req.user?.id;

    // validation - adminNote yaha chaidaina, tyo admin le pachi bharne ho
    if (!owner || !fromDate || !toDate || !reason) {
      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // toDate must be strictly after fromDate
    if (new Date(toDate) <= new Date(fromDate)) {
      throw new AppError(
        "To Date must be after From Date",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // student sanga pahile dekhi kunai Pending request cha ki check garne
    const existingPending = await LeaveRequest.findOne({
      student: owner,
      status: LeaveStatus.PENDING,
    });

    if (existingPending) {
      throw new AppError(
        "You already have a pending leave request",
        400,
        ErrorCodes.LEAVE_REQUEST_ALREADY_EXISTS
      );
    }

    const leaveRequest = new LeaveRequest({
      student: owner,
      fromDate,
      toDate,
      reason,
    });

    await leaveRequest.save();

    return res.status(201).json({
      message: "Leave Request created successfully",
      code: "success",
      status: "success",
      data: leaveRequest,
    });

  } catch (error: any) {

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return next(
        new AppError(
          `Leave Request with this ${field} already exists`,
          400,
          ErrorCodes.LEAVE_REQUEST_ALREADY_EXISTS
        )
      );
    }

    return next(error);
  }
};

// Sabai leave request fetch garna ko lagi
export const getALLLeaveRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaveRequests = await LeaveRequest.find({})
      .populate("student", "full_name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Leave Requests Fetched Successfully",
      code: "success",
      status: "success",
      data: leaveRequests,
    });

  } catch (error: any) {
    return next(error);
  }
};

// id ko basis ma euta leave request fetch garna ko lagi
export const getLeaveRequestByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      throw new AppError(
        "Leave Request Not Found",
        404,
        ErrorCodes.LEAVE_REQUEST_NOT_FOUND
      );
    }

    await assertCanAccessStudent(req, leaveRequest.student);

    return res.status(200).json({
      message: "Leave Request Fetched Successfully",
      code: "success",
      status: "success",
      data: leaveRequest,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Leave request update garna ko lagi (admin le status/adminNote badalne)
export const updateLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingLeaveRequest = await LeaveRequest.findById(id);
    if (!existingLeaveRequest) {
      throw new AppError("Leave Request Not Found", 404, ErrorCodes.LEAVE_REQUEST_NOT_FOUND);
    }

    const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // true return garxa vney updated data else it's useless send gardaina
        runValidators: true,
      }
    );

    if (!updatedLeaveRequest) {
      throw new AppError(
        "Leave Request Not Found",
        404,
        ErrorCodes.LEAVE_REQUEST_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Leave Request Updated Successfully",
      code: "success",
      status: "success",
      data: updatedLeaveRequest,
    });

  } catch (error: any) {
    return next(error);
  }
};

// leave request delete garna ko lagi
export const deleteLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await LeaveRequest.findById(id);
    if (!existing) {
      throw new AppError(
        "Leave Request Not Found",
        404,
        ErrorCodes.LEAVE_REQUEST_NOT_FOUND
      );
    }
    await assertCanAccessStudent(req, existing.student);

    const deletedLeaveRequest = await LeaveRequest.findByIdAndDelete(id);

    if (!deletedLeaveRequest) {
      throw new AppError(
        "Leave Request Not Found",
        404,
        ErrorCodes.LEAVE_REQUEST_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Leave Request Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};

// student ko id ko basis ma tesko sabai leave request fetch garna ko lagi
export const getLeaveRequestsByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const leaveRequests = await LeaveRequest.find({ student: studentId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Leave Requests Fetched Successfully",
      code: "success",
      status: "success",
      data: leaveRequests,
    });

  } catch (error: any) {
    return next(error);
  }
};
