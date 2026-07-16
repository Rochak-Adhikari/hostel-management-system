import mongoose from "mongoose";
import { ComplaintStatus } from "../types/enum";


const complaintSchema = new mongoose.Schema(
  {
  
    student: {
      type: mongoose.Schema.Types.ObjectId,  //->this field points to the data which lives somewhere else kinda like pointer jasto 
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

    // complaint ko status (Pending, In Progress, Resolved)
    status: {
      type: String,
      enum: {
        values: Object.values(ComplaintStatus),
        message: "Status must be Pending, In Progress, or Resolved",
      },
      default: ComplaintStatus.PENDING,
    },

    // complaint kun category ko ho (WiFi, Cleanliness, Maintenance, etc)
    category: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true } // automatically createdAt ra updatedAt date handle garna
);

export default mongoose.model("Complaint", complaintSchema);
