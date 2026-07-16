import mongoose from "mongoose";
import { feeStatus } from "../types/enum";

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },

     month: {
      type: String,
      required: [true, "Month is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },

    status: {
      type: String,
       enum: {
              values: Object.values(feeStatus),
              message: "Status must be Unpaid, Paid, or Overdue",
            },
            default: feeStatus.UNPAID,

    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },

    paidDate: {
      type: Date,
      required: false,
    },

    paymentMethod: {
      type: String,
      required: false,
      trim: true,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Fee", feeSchema);