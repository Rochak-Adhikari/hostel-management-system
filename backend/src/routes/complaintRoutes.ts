import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsByStudent,
  updateComplaint,
  deleteComplaint
} from "../controllers/complaintController";

const router = express.Router();

// routes haru define garne
router.post("/", createComplaint);
router.get("/", getAllComplaints);

// route conflict na huna ko lagi /student/:studentId lai generic /:id vanda mathi rakhne
router.get("/student/:studentId", getComplaintsByStudent);
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
