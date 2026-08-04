import express from "express";
import { createRoomChangeRequest, getALLRoomChangeRequests, getRoomChangeRequestByID, updateRoomChangeRequest, deleteRoomChangeRequest, getRoomChangeRequestsByStudent } from "../controllers/roomChangeRequestController";
import { authenticate, authorize, authorizeStudentScope } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

// student aafai request halna sakxa - controller le student field req.user.id ma force garxa
router.post("/", createRoomChangeRequest);
router.get("/", authorize(Role.ADMIN), getALLRoomChangeRequests);
router.get("/student/:studentId", authorizeStudentScope(), getRoomChangeRequestsByStudent);
// controller ma ownership check cha
router.get("/:id", getRoomChangeRequestByID);
// status/adminNote badalne kaam admin ko matra
router.put("/:id", authorize(Role.ADMIN), updateRoomChangeRequest);
router.delete("/:id", deleteRoomChangeRequest);

export default router;
