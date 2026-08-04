import mongoose from "mongoose";
import { Role } from "../types/enum";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,

    },

    isVerified: {
    type: Boolean,
   default: false,
},

   otp_hash:{
     type: String,
     select: false,  
  },

  otp_expiry:{
    type: Date,
    select: false,

  },

   reset_token_hash:{
     type: String,
     select: false,  
  },

  reset_token_expiry:{
    type: Date,
    select: false,

  },

  profile_picture: {
  type: {
    url: { 
      type: String,
      default: "",
     },
  public_id: { 
      type: String,
      default: "",
    },
  },
  required: false,
},


    role: {
      type: String,
      enum: {
        values: Object.values(Role),
        message: "Role must be student, guardian, or admin",
      },
      default: Role.STUDENT,
    },

 gender: {
  type: String,
  required: false,
  enum: ["male", "female", "other"],
},

address: {
  type: String,
  required: false,
  trim: true,
},

    

    guardian: {
      name: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
    },

    linked_student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);