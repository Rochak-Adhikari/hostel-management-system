import express from "express";
import { createRoomChangeRequest, getALLRoomChangeRequests, getRoomChangeRequestByID, updateRoomChangeRequest, deleteRoomChangeRequest  } from "../controllers/roomChangeRequestController";
import { get } from "node:http";


const router = express.Router();

router.post("/", createRoomChangeRequest);
router.get("/", getALLRoomChangeRequests);
router.get("/:id", getRoomChangeRequestByID);
router.put("/:id", updateRoomChangeRequest);
router.delete("/:id", deleteRoomChangeRequest);

export default router;