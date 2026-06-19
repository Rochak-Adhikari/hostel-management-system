import { Request, Response } from "express";
import { Code } from "mongodb";
import User from "../models/user";

//register

export const register = async (req: Request, res: Response) => {
  try { 
    const { full_name, email, phone, password, guardian } = req.body;
    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({ 
     message: "All fields are required",
      Code: 'Validation Error',
      status: 'error'
       });
    
   
    }
    if (password.length < 6) {
      return res.status(400).json({
         message: "Password must be at least 6 characters long" ,
            Code: 'Validation Error',
             status: 'error'
      });
  

    }
    if (guardian) {
      const { name, phone: guardianPhone, email: guardianEmail } = guardian;
      if (!name || !guardianPhone || !guardianEmail) {
        return res.status(400).json({ 
            message: "All guardian details are required",
            Code: 'Validation Error',
            status: 'error'
         });

      }
    }

    const user = new User({
      full_name,
      email,
      phone,
      password,
      guardian: guardian || undefined
    });

     user.save()
     
        res.status(201).json({ message: "User registered successfully",
            Code: 'Success',
            status: 'success',
             data: user
             });
      
   

  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};