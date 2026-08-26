import express from "express";
import { createVisitor, getALLVisitors, getVisitorByID, updateVisitor, deleteVisitor, getVisitorsByStudent } from "../controllers/visitorController";
import { authenticate, authorize, authorizeStudentScope } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

// visitor log entry create garna ko lagi
router.post("/", createVisitor);
router.get("/", authorize(Role.ADMIN), getALLVisitors);
router.get("/student/:studentId", authorizeStudentScope(), getVisitorsByStudent);
router.get("/:id", authorize(Role.ADMIN), getVisitorByID);
router.put("/:id", updateVisitor);
router.delete("/:id", authorize(Role.ADMIN), deleteVisitor);

export default router;
