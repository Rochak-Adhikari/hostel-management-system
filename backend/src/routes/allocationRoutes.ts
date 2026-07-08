import express from "express";
import { createAllocation, getALLAllocations, getAllocationByID, updateAllocation, deleteAllocation, getAllocationByStudent } from "../controllers/allocationController";

const router = express.Router();

router.post("/", createAllocation);
router.get("/", getALLAllocations);
router.get("/student/:studentId", getAllocationByStudent);
router.get("/:id", getAllocationByID);
router.put("/:id", updateAllocation);
router.delete("/:id", deleteAllocation);

export default router;