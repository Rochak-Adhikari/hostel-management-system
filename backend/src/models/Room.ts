
import mongoose from "mongoose";
import { RoomType } from "../types/enum";

const roomSchema = new mongoose.Schema(
  {
    RoomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
      match: [/^[AB]-/i, "Room number must start with A- (Boys) or B- (Girls)"],
    },

    Floor: {
      type: String,
      required: [true, "Floor is required"],
      
      trim: true,
    },

    RoomType: {
      type: String,
      required: [true, "Room Type is required"],
      
      trim: true,
        enum: {
          values: Object.values(RoomType),
          message: "Room type must be Single, Double, Triple, or Quadruple",
        },
    },

     Capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"]
        
    },



    Occupied: {
      type: Number,
       default: 0,
    },

    MonthlyFee: {
      type: Number,
      required: [true, "Monthly fee is required"],
      
    },

 
  },

  
    { timestamps: true },
);

export default mongoose.model("Room", roomSchema);