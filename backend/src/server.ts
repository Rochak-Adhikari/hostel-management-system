import express, { Request, Response } from "express";
import connectDB from "./config/db";
import cors from "cors";
import dotenv from "dotenv";

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
//listen
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`press CTRL + C to stop the server`);
});