import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import cors from "cors";



import { AppError, errorHandler } from "./middleware/errorhandlermiddleware"; 
import {ErrorCodes} from "./types/enum";


//! routes ko import haru
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/studentRoutes";
import roomRoutes from "./routes/roomRoutes";
import allocationRoutes from "./routes/allocationRoutes";
import profileRoutes from "./routes/profileRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import noticeRoutes from "./routes/noticeRoutes";
import visitorRoutes from "./routes/visitorRoutes";




const app = express();
const PORT = process.env.PORT || 5000;

//* database sanga connect garna ko lagi
connectDB();



app.use(cors());
//using middleware
app.use(express.json({ limit: "10mb" }));

//root ko route
app.get("/", (req:Request, res:Response) => {  
  res.status(200).json({ 
    message: "Server is up and running" ,
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

// path not found error ko lagi
app.use(( req:Request, res:Response, next:NextFunction)=>{
  
 
  const message = `Cannot ${req.method} on ${req.url}`;

 const error= new AppError(
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



