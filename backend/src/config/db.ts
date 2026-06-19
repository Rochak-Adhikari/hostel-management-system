import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Database connection error");
    }

    process.exit(1);
  }
};

export default connectDB;