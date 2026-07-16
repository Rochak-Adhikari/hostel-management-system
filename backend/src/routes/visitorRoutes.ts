import express from "express";
import { createVisitor, getALLVisitors, getVisitorByID, updateVisitor, deleteVisitor, getVisitorsByStudent } from "../controllers/visitorController";

const router = express.Router();

router.post("/", createVisitor);
router.get("/", getALLVisitors);
router.get("/student/:studentId", getVisitorsByStudent);
router.get("/:id", getVisitorByID);
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);

export default router;