import express from "express";
import { createRoom, getALLRooms, getRoomByID, deleteRoom, updateRoom }  from "../controllers/roomController";

//! Room ko route haru
 const router = express.Router();

 //Room Create ko route
 router.post("/", createRoom);

 //Room Fetch ko route
 router.get("/", getALLRooms);

 //Room Fetch by ID ko route
 router.get("/:id", getRoomByID);

 //Room Update ko route
 router.put("/:id", updateRoom);

 //Room Delete ko route
 router.delete("/:id", deleteRoom);

 export default router;

