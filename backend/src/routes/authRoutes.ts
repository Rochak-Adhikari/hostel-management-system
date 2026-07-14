import express from "express";

import { register, login, verifyOtp, resendOtp } from "../controllers/authController";



const router = express.Router();




//register ko route
//? post , /api/v1/auth/register this is called endpoint

router.post("/register", register);

//Otp verification ko route
router.post("/verify-otp", verifyOtp);

//resend otp ko route

router.post("/resend-otp", resendOtp);

//login ko route

router.post("/login", login);


export default router;