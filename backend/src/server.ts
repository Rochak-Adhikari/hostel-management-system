import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import cors from "cors";
import dotenv from "dotenv";

//! Import Routes here
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/studentRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//* connect to database
connectDB();



app.use(cors());
app.use(express.json());

//root route
app.get("/", (req:Request, res:Response) => {  
  res.status(200).json({ 
    message: "Welcome to HostelHub API" ,
  });  
});
//using middleware
app.use(express.json({ limit: "10mb" }));

//auth middleware
app.use((error:any, req:Request, res: Response, next:NextFunction)=>{
  console.log("error handler");
  console.log(error);
  res.status(400).json({
    message:error?.message || "Internal Server error"
  })
})

 // using routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);



//listen
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`press CTRL + C to stop the server`);
});