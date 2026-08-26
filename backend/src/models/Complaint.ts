import mongoose from "mongoose";
import { ComplaintStatus } from "../types/enum";


const complaintSchema = new mongoose.Schema(
  {
  
    student: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: [true, "Student is required"],
    },

    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Complaint description is required"],
      trim: true,
    },

    // complaint ko status 
    status: {
      type: String,
      enum: {
        values: Object.values(ComplaintStatus),
        message: "Status must be Pending, In Progress, or Resolved",
      },
      default: ComplaintStatus.PENDING,
    },

    // complaint kun category ko ho 
    category: {
      type: String,
      required: false,
      trim: true,
    },

    // complaint kasle haleko ho 
    submittedByRole: {
      type: String,
      enum: ["student", "guardian", "admin"],
      default: "student",
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Complaint", complaintSchema);
