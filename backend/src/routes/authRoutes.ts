import express from "express";

import { register, login, verifyOtp, resendOtp, forgotPassword, setPassword } from "../controllers/authController";

const router = express.Router();

//register ko route
router.post("/register", register);

//Otp verification ko route
router.post("/verify-otp", verifyOtp);

//resend otp ko route
router.post("/resend-otp", resendOtp);

//login ko route
router.post("/login", login);

//forgot password ko route
router.post("/forgot-password", forgotPassword);

//set password ko route
router.post("/set-password", setPassword);

export default router;