import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },

    visitorName: {
      type: String,
      required: [true, "Visitor name is required"],
      trim: true,
    },

    visitorPhone: {
      type: String,
      required: [true, "Visitor phone is required"],
      trim: true,
    },

    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
    },

    checkInTime: {
      type: Date,
      required: [true, "Check-in time is required"],
      default: Date.now,
    },

    checkOutTime: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);