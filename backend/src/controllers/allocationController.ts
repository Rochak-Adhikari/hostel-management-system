import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import Allocation from "../models/Allocation";
import Room from "../models/Room";
import { getBedList } from "../utils/bedUtils";

// CREATE ALLOCATION
// euta student lai euta room allocate garna ko lagi
export const createAllocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, room, bed, allocatedDate } = req.body;

    // validation
    if (!student || !room || !bed) {
      throw new AppError(
        "Student, Room, and Bed are required",
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

    // Validate requested bed
    const validBeds = getBedList(existingRoom.Capacity);
    if (!validBeds.includes(bed)) {
      throw new AppError("Invalid bed for this room's capacity", 400, ErrorCodes.VALIDATION_ERROR);
    }

    // Check if the bed is already taken in this room
    const existingAllocations = await Allocation.find({ room: existingRoom._id });
    const takenBeds = existingAllocations.map((a) => a.bed);
    if (takenBeds.includes(bed)) {
      throw new AppError("This bed is already occupied", 400, ErrorCodes.VALIDATION_ERROR);
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
      bed,
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

// Room ko available beds fetch garna ko lagi
export const getAvailableBeds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      throw new AppError("Room Not Found", 404, ErrorCodes.ROOM_NOT_FOUND);
    }
    const allBeds = getBedList(room.Capacity);
    const existingAllocations = await Allocation.find({ room: roomId });
    const takenBeds = existingAllocations.map((a) => a.bed);
    const availableBeds = allBeds.filter((b) => !takenBeds.includes(b));

    return res.status(200).json({
      message: "Available beds fetched successfully",
      code: "success",
      status: "success",
      data: availableBeds,
    });
  } catch (error: any) {
    return next(error);
  }
};