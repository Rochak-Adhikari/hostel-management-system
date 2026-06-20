import express from "express";

import { register, login } from "../controllers/authController";


const router = express.Router();

//register route
//? post , /api/v1/auth/register this is called endpoint

router.post("/register", register);


//login route

router.post("/login", login);


export default router;