import express from "express";
import { createRoomChangeRequest, getALLRoomChangeRequests, getRoomChangeRequestByID, updateRoomChangeRequest, deleteRoomChangeRequest, getRoomChangeRequestsByStudent } from "../controllers/roomChangeRequestController";

const router = express.Router();

router.post("/", createRoomChangeRequest);
router.get("/", getALLRoomChangeRequests);
router.get("/student/:studentId", getRoomChangeRequestsByStudent);
router.get("/:id", getRoomChangeRequestByID);
router.put("/:id", updateRoomChangeRequest);
router.delete("/:id", deleteRoomChangeRequest);

export default router;