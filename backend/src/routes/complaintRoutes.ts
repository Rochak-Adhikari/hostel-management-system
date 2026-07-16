import express from "express";
import { createComplaint, getAllComplaints, getComplaintById, getComplaintsByStudent, updateComplaint, deleteComplaint} from "../controllers/complaintController";

const router = express.Router();


router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.get("/student/:studentId", getComplaintsByStudent);
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
