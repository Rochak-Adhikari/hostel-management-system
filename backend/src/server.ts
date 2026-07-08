import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import cors from "cors";
import dotenv from "dotenv";
import { ENV_CONFIG } from "./config/env.config";
import { AppError, errorHandler } from "./middleware/errorhandlermiddleware"; 

//! routes ko import haru
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/studentRoutes";
import e from "express";
import { from } from "node:stream/iter";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//* database sanga connect garna ko lagi
connectDB();



app.use(cors());


//root ko route
app.get("/", (req:Request, res:Response) => {  
  res.status(200).json({ 
    message: "Server is up and running" ,
  });  
});
//using middleware
app.use(express.json({ limit: "10mb" }));



 // using routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// path not found error ko lagi
app.use(( req:Request, res:Response, next:NextFunction)=>{
  
 
  const message = `Cannot ${req.method} on ${req.url}`;
  // const error:any = new Error(message)
  // error.statusCode = 404;
  // error.code = "Not Found";
  // error.status = "fail";
 const error:any = AppError(message, 404, ErrorCodes.NOT_FOUND);
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



