import express, { Request, Response } from "express";

const app = express();
const PORT = 8000;

//* connect to database


//*using middleware


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