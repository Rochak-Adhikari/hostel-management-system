import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import Allocation from "../models/Allocation";
import Room from "../models/Room";
import User from "../models/user";
import { getBuildingGender } from "../utils/roomUtils";

// CREATE ALLOCATION
// euta student lai euta room allocate garna ko lagi
export const createAllocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, room, allocatedDate } = req.body;

    // validation
    if (!student || !room) {
      throw new AppError(
        "Student and Room are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // find garya room lai fetch garne, capacity check garnu ko lagi
    const existingRoom = await Room.findById(room);
    if (!existingRoom) {
      throw new AppError("Room Not Found", 404, ErrorCodes.ROOM_NOT_FOUND);
    }

    // room ma space cha ki chaina check garne
    if (existingRoom.Occupied >= existingRoom.Capacity) {
      throw new AppError("Room is full", 400, ErrorCodes.ROOM_FULL);
    }

    // student ko full record fetch garera, gender check garnu ko lagi
    const studentUser = await User.findById(student);
    if (!studentUser) {
      throw new AppError("Student Not Found", 404, ErrorCodes.NOT_FOUND);
    }

    // room number ko prefix (A/B) bata kun building ho check garne
    const roomBuilding = getBuildingGender(existingRoom.RoomNumber);

    // student ko gender lai building name ma convert garna ko lagi mapping
    const genderMap: Record<string, string> = { male: "Boys", female: "Girls" };

    // student ko gender ra room ko building match hunu parxa
    if (roomBuilding && genderMap[studentUser.gender] !== roomBuilding) {
      throw new AppError(
        "Room is reserved for a different gender",
        400,
        ErrorCodes.ROOM_NOT_AVAILABLE
      );
    }

    // student lai pahile dekhi kunai room allocate vaisako cha ki check garne
    const existingAllocation = await Allocation.findOne({ student });
    if (existingAllocation) {
      throw new AppError(
        "Student already has a room allocated",
        400,
        ErrorCodes.ALLOCATION_ALREADY_EXISTS
      );
    }

    const allocation = new Allocation({
      student,
      room,
      allocatedDate,
    });

    await allocation.save();

    // allocation vaisake pachi room ko Occupied count 1 le badhaune
    existingRoom.Occupied += 1;
    await existingRoom.save();

    return res.status(201).json({
      message: "Allocated successfully",
      code: "success",
      status: "success",
      data: allocation,
    });

  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return next(
        new AppError(
          `This ${field} is already allocated`,
          400,
          ErrorCodes.ALLOCATION_ALREADY_EXISTS
        )
      );
    }

    return next(error);
  }
};

// student ko id ko basis ma tesko allocation (room) fetch garna ko lagi
export const getAllocationByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const allocation = await Allocation.findOne({ student: studentId });

    if (!allocation) {
      throw new AppError("No room allocated to this student", 404, ErrorCodes.ALLOCATION_NOT_FOUND);
    }

    return res.status(200).json({
      message: "Allocation Fetched Successfully",
      code: "success",
      status: "success",
      data: allocation,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Sabai allocation fetch garna ko lagi
export const getALLAllocations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allocations = await Allocation.find({});

    return res.status(200).json({
      message: "Allocations Fetched Successfully",
      code: "success",
      status: "success",
      data: allocations,
    });

  } catch (error: any) {
    return next(error);
  }
};

// allocation ko id ko basis ma euta allocation fetch garna ko lagi
export const getAllocationByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const allocation = await Allocation.findById(id);

    if (!allocation) {
      throw new AppError(
        "Allocation Not Found",
        404,
        ErrorCodes.ALLOCATION_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Allocation Fetched Successfully",
      code: "success",
      status: "success",
      data: allocation,
    });

  } catch (error: any) {
    return next(error);
  }
};

// Allocation haru update garna ko lagi
export const updateAllocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingAllocation = await Allocation.findById(id);
    if (!existingAllocation) {
      throw new AppError("Allocation Not Found", 404, ErrorCodes.ALLOCATION_NOT_FOUND);
    }

    const updatedAllocation = await Allocation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // true return garxa vney updated data else it's useless send gardaina
        runValidators: true,
      }
    );

    if (!updatedAllocation) {
      throw new AppError(
        "Allocation Not Found",
        404,
        ErrorCodes.ALLOCATION_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Allocation Updated Successfully",
      code: "success",
      status: "success",
      data: updatedAllocation,
    });

  } catch (error: any) {
    return next(error);
  }
};

// allocation haru delete garna ko lagi (student ko room khali garda)
export const deleteAllocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedAllocation = await Allocation.findByIdAndDelete(id);

    if (!deletedAllocation) {
      throw new AppError(
        "Allocation Not Found",
        404,
        ErrorCodes.ALLOCATION_NOT_FOUND
      );
    }

    // allocation hatisake pachi tyo room ko Occupied count 1 le ghataune
    const room = await Room.findById(deletedAllocation.room);
    if (room && room.Occupied > 0) {
      room.Occupied -= 1;
      await room.save();
    }

    return res.status(200).json({
      message: "Allocation Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};