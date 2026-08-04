import express from "express";
import { createComplaint, getAllComplaints, getComplaintById, getComplaintsByStudent, updateComplaint, deleteComplaint} from "../controllers/complaintController";
import { authenticate, authorize, authorizeStudentScope } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

// student aafai complaint halna sakxa - controller le student field req.user.id ma force garxa
router.post("/", createComplaint);
router.get("/", authorize(Role.ADMIN), getAllComplaints);
router.get("/student/:studentId", authorizeStudentScope(), getComplaintsByStudent);
// controller ma ownership check cha
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
