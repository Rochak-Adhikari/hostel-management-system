import mongoose from "mongoose";
import {  RoomChangeStatus } from "../types/enum";


const roomChangeRequestSchema = new mongoose.Schema(
  {
  
    student: {
      type: mongoose.Schema.Types.ObjectId,  //->this field points to the data which lives somewhere else kinda like pointer jasto 
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

    // complaint ko status (Pending, In Progress, Resolved)
    status: {
      type: String,
      enum: {
        values: Object.values(RoomChangeStatus),
        message: "Status must be Pending, In Progress, or Resolved",
      },
      default: RoomChangeStatus.PENDING,
    },

    // complaint kun category ko ho (WiFi, Cleanliness, Maintenance, etc)
    adminNote: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true } // automatically createdAt ra updatedAt date handle garna
);

export default mongoose.model("RoomChangeRequest", roomChangeRequestSchema);
