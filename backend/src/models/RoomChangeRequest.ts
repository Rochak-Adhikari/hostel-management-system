import mongoose from "mongoose";
import { RoomChangeStatus, RoomType } from "../types/enum";


const roomChangeRequestSchema = new mongoose.Schema(
  {

    student: {
      type: mongoose.Schema.Types.ObjectId,   
      ref: "User",
      required: [true, "Student is required"],
    },

    currentRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Current Room is required"],
    },

    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },

    preferredRoomType: {
      type: String,
      required: [true, "Preferred Room Type is required"],
      trim: true,
      enum: {
        values: Object.values(RoomType),
        message: "Room type must be Single, Double, Triple, or Quadruple",
      },
    },

    // complaint ko status (Pending, In Progress, Resolved)
    status: {
      type: String,
      enum: {
        values: Object.values(RoomChangeStatus),
        message: "Status must be Pending, Approved, or Rejected",
      },
      default: RoomChangeStatus.PENDING,
    },

    // complaint kun category ko ho 
    adminNote: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true } 
);

export default mongoose.model("RoomChangeRequest", roomChangeRequestSchema);