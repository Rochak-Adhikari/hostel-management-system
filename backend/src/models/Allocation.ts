import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       
      required: [true, "Student is required"],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    bed: {
      type: String,
      required: [true, "Bed is required"],
    },
    allocatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Allocation", allocationSchema);