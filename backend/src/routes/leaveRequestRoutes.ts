import express from "express";
import { createLeaveRequest, getALLLeaveRequests, getLeaveRequestByID, updateLeaveRequest, deleteLeaveRequest, getLeaveRequestsByStudent } from "../controllers/leaveRequestController";
import { authenticate, authorize, authorizeStudentScope } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

// student aafai request halna sakxa - controller le student field req.user.id ma force garxa
router.post("/", createLeaveRequest);
router.get("/", authorize(Role.ADMIN), getALLLeaveRequests);
router.get("/student/:studentId", authorizeStudentScope(), getLeaveRequestsByStudent);
// controller ma ownership check cha
router.get("/:id", getLeaveRequestByID);
// status/adminNote badalne kaam admin ko matra
router.put("/:id", authorize(Role.ADMIN), updateLeaveRequest);
router.delete("/:id", deleteLeaveRequest);

export default router;
