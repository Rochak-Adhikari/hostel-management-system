import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes, RoomChangeStatus } from "../types/enum";
import RoomChangeRequest from "../models/RoomChangeRequest";

// CREATE RoomChangeRequests

export const createRoomChangeRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, currentRoom, reason, preferredRoomType } = req.body;

    // validation - adminNote yaha chaidaina, tyo admin le pachi bharne ho
    if (!student || !currentRoom || !reason || !preferredRoomType) {
      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // student sanga pahile dekhi kunai Pending request cha ki check garne
    const existingPending = await RoomChangeRequest.findOne({
      student,
      status: RoomChangeStatus.PENDING,
    });

    if (existingPending) {
      throw new AppError(
        "You already have a pending room change request",
        400,
        ErrorCodes.ROOM_CHANGE_REQUEST_ALREADY_EXISTS
      );
    }

    const roomChange = new RoomChangeRequest({
      student,
      currentRoom,
      reason,
      preferredRoomType,
    });

    await roomChange.save();

    return res.status(201).json({
      message: "Room Change Request created successfully",
      code: "success",
      status: "success",
      data: roomChange,
    });

  } catch (error: any) {

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return next(
        new AppError(
          `Room Change Request with this ${field} already exists`,
          400,
          ErrorCodes.ROOM_CHANGE_REQUEST_ALREADY_EXISTS
        )
      );
    }

    return next(error);
  }
};

// Sabai room change request fetch garna ko lagi
export const getALLRoomChangeRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomChangeRequests = await RoomChangeRequest.find({})
      .populate("student", "full_name email phone")
      .populate("currentRoom", "RoomNumber block Floor")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Room Change Requests Fetched Successfully",
      code: "success",
      status: "success",
      data: roomChangeRequests,
    });

  } catch (error: any) {
    return next(error);
  }
};

// id ko basis ma euta room change request fetch garna ko lagi
export const getRoomChangeRequestByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const roomChangeRequest = await RoomChangeRequest.findById(id);

    if (!roomChangeRequest) {
      throw new AppError(
        "Room Change Request Not Found",
        404,
        ErrorCodes.ROOM_CHANGE_REQUEST_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Room Change Request Fetched Successfully",
      code: "success",
      status: "success",
      data: roomChangeRequest,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Room change request update garna ko lagi (admin le status/adminNote badalne)
export const updateRoomChangeRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingRoomChangeRequest = await RoomChangeRequest.findById(id);
    if (!existingRoomChangeRequest) {
      throw new AppError("Room Change Request Not Found", 404, ErrorCodes.ROOM_CHANGE_REQUEST_NOT_FOUND);
    }

    const updatedRoomChangeRequest = await RoomChangeRequest.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // true return garxa vney updated data else it's useless send gardaina
        runValidators: true,
      }
    );

    if (!updatedRoomChangeRequest) {
      throw new AppError(
        "Room Change Request Not Found",
        404,
        ErrorCodes.ROOM_CHANGE_REQUEST_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Room Change Request Updated Successfully",
      code: "success",
      status: "success",
      data: updatedRoomChangeRequest,
    });

  } catch (error: any) {
    return next(error);
  }
};

// room change request delete garna ko lagi
export const deleteRoomChangeRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedRoomChangeRequest = await RoomChangeRequest.findByIdAndDelete(id);

    if (!deletedRoomChangeRequest) {
      throw new AppError(
        "Room Change Request Not Found",
        404,
        ErrorCodes.ROOM_CHANGE_REQUEST_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Room Change Request Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};

// student ko id ko basis ma tesko sabai room change request fetch garna ko lagi
export const getRoomChangeRequestsByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const roomChangeRequests = await RoomChangeRequest.find({ student: studentId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Room Change Requests Fetched Successfully",
      code: "success",
      status: "success",
      data: roomChangeRequests,
    });

  } catch (error: any) {
    return next(error);
  }
};