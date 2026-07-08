import express from "express";
import { createAllocation, getALLAllocations, getAllocationByID, updateAllocation, deleteAllocation} from "../controllers/allocationController";

//! Allocation ko route haru
const router = express.Router();

router.post("/", createAllocation);
router.get("/", getALLAllocations);
router.get("/:id", getAllocationByID);
router.put("/:id", updateAllocation);
router.delete("/:id", deleteAllocation);

export default router;