import express from "express";
import { getReportSummary } from "../controllers/reportController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

// Admin summary report route
router.get("/summary", authenticate(), authorize(Role.ADMIN), getReportSummary);

export default router;
