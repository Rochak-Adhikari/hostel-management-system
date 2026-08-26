import express from "express";

import { register, login, verifyOtp, resendOtp, forgotPassword, setPassword, logout, changePassword } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

//register ko route
router.post("/register", register);

//Otp verification ko route
router.post("/verify-otp", verifyOtp);

//resend otp ko route
router.post("/resend-otp", resendOtp);

//login ko route
router.post("/login", login);

//logout ko route
router.post("/logout", logout);

//forgot password ko route
router.post("/forgot-password", forgotPassword);

//set password ko route
router.post("/set-password", setPassword);

//change password ko route (logged in user ko lagi)
router.post("/change-password", authenticate(), changePassword);

export default router;