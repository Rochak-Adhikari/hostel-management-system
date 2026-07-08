import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import Room from "../models/Room";

// CREATE ROOM

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { RoomType, RoomNumber, Floor, Capacity,Occupied,  MonthlyFee} = req.body;

    // validation
    if (!RoomType || !RoomNumber || !Floor || !Capacity || !MonthlyFee) {


      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Occupied value Capacity bhanda badi vaye error throw garxa
    if (Occupied > Capacity) {
      throw new AppError(
    "Occupied cannot be greater than room capacity",
    400,
    ErrorCodes.VALIDATION_ERROR
     );
    }



    const room = new Room({
    RoomType,
    RoomNumber,
    Floor,
    Capacity,
    Occupied,
    MonthlyFee
    });

    await room.save();

    return res.status(201).json({
      message: "Room created successfully",
      code: "success",
      status: "success",
      data: {
        id: room._id,
        RoomType: room.RoomType,
        RoomNumber: room.RoomNumber,
        Floor: room.Floor,
        Capacity: room.Capacity,
        Occupied: room.Occupied,
        MonthlyFee: room.MonthlyFee
      },
    });

  } catch (error: any) {

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return next(
        new AppError(
          `Room with this ${field} already exists`,
          400,
          ErrorCodes.ROOM_ALREADY_EXISTS
        )
      );
    }

    return next(error);
  }
};




// Sabai room fetch garna ko lagi
export const getALLRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! db query -> Room collection

    const rooms = await Room.find({});

    //! success response below
    return res.status(200).json({
      message: "Rooms Fetched Successfully",
      code: "success",
      status: "success",
      data: rooms,
    });

  } catch (error: any) {
    return next(error);
  }
};


// room ko id ko basis ma room fetch garna ko lagi ho
export const getRoomByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
    throw new AppError(
      "Room Not Found",
      404,
      ErrorCodes.ROOM_NOT_FOUND    )
    }

    return res.status(200).json({
      message: "Room Fetched Successfully",
      code: "success",
      status: "success",
      data: room,
    });

  } catch (error: any) {
    return next(error);
  }
};


// Room haru update garna ko lagi
export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existingRoom = await Room.findById(id);
       if (!existingRoom) {
      throw new AppError("Room Not Found", 404, ErrorCodes.ROOM_NOT_FOUND);
    }
     
 const capacity = req.body.Capacity ?? existingRoom.Capacity;
    const occupied = req.body.Occupied ?? existingRoom.Occupied;

    if (occupied > capacity) {
      throw new AppError(
        "Occupied cannot be greater than room capacity",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const updatedRoom = await Room.findByIdAndUpdate(
  id,
  req.body,
  {
    new: true, // true return garxa vney updated data else it's useless send gardaina
    runValidators: true,
  }
);

    if (!updatedRoom) {
       throw new AppError(
        "Room Not Found",
        404,
        ErrorCodes.ROOM_NOT_FOUND
       )
    }

    return res.status(200).json({
      message: "Room Updated Successfully",
      code: "success",
      status: "success",
      data: updatedRoom,
    });

  } catch (error: any) {
    return next(error);
  }
};


// room haru delete garna ko lagi
export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      throw new AppError(
        "Room Not Found",
        404,
        ErrorCodes.ROOM_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Room Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};