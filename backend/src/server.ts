import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";



import { AppError, errorHandler } from "./middleware/errorhandlermiddleware";
import { ErrorCodes } from "./types/enum";


//! routes ko import haru
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/studentRoutes";
import roomRoutes from "./routes/roomRoutes";
import allocationRoutes from "./routes/allocationRoutes";
import profileRoutes from "./routes/profileRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import noticeRoutes from "./routes/noticeRoutes";
import visitorRoutes from "./routes/visitorRoutes";
import feeRoutes from "./routes/feeRoutes";
import roomChangeRequestRoutes from "./routes/roomChangeRequestRoutes";
import leaveRequestRoutes from "./routes/leaveRequestRoutes";
import reportRoutes from "./routes/reportRoutes";



import { ENV_CONFIG } from "./config/env.config";

const app = express();
const PORT = ENV_CONFIG.PORT;

//* database sanga connect garna ko lagi
connectDB();



app.use(
  cors({
    origin: ENV_CONFIG.FRONTEND_URL,
    credentials: true,
  })
);

//using middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

//root ko route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is up and running",
  });
});




// using routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/allocations", allocationRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/visitors", visitorRoutes);
app.use("/api/v1/fees", feeRoutes);
app.use("/api/v1/room-change-requests", roomChangeRequestRoutes);
app.use("/api/v1/leave-requests", leaveRequestRoutes);
app.use("/api/v1/reports", reportRoutes);

// path not found error ko lagi
app.use((req: Request, res: Response, next: NextFunction) => {


  const message = `Cannot ${req.method} on ${req.url}`;

  const error = new AppError(
    message, 404,
    ErrorCodes.NOT_FOUND);
  next(error)

}
)

//error handler ko middleware
app.use(errorHandler);

//listen
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`press CTRL + C to stop the server`);
});



