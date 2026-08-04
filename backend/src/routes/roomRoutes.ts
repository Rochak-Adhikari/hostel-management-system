import express from "express";
import { createRoom, getALLRooms, getRoomByID, deleteRoom, updateRoom }  from "../controllers/roomController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

//! Room ko route haru
 const router = express.Router();

 // sabai room route ma login chaiyo
 router.use(authenticate());

 //Room Create ko route
 router.post("/", authorize(Role.ADMIN), createRoom);

 //Room Fetch ko route
 router.get("/", getALLRooms);

 //Room Fetch by ID ko route
 router.get("/:id", getRoomByID);

 //Room Update ko route
 router.put("/:id", authorize(Role.ADMIN), updateRoom);

 //Room Delete ko route
 router.delete("/:id", authorize(Role.ADMIN), deleteRoom);

 export default router;
