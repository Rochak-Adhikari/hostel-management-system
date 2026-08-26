import mongoose from "mongoose";
import { LeaveStatus } from "../types/enum";


const leaveRequestSchema = new mongoose.Schema(
  {

    student: {
      type: mongoose.Schema.Types.ObjectId,  //->this field points to the data which lives somewhere else kinda like pointer jasto 
      ref: "User",
      required: [true, "Student is required"],
    },

    fromDate: {
      type: Date,
      required: [true, "From Date is required"],
    },

    toDate: {
      type: Date,
      required: [true, "To Date is required"],
    },

    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },

    // leave request ko status (Pending, Approved, Rejected)
    status: {
      type: String,
      enum: {
        values: Object.values(LeaveStatus),
        message: "Status must be Pending, Approved, or Rejected",
      },
      default: LeaveStatus.PENDING,
    },

    // admin note (approved/rejected garda admin le lekhne note)
    adminNote: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true } 
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);
