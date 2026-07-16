import express from "express";
import { createFee, getALLfee, getFeeByID, updateFee, deleteFee, getfeeByStudent } from "../controllers/feeController";

const router = express.Router();

router.post("/", createFee);
router.get("/", getALLfee);
router.get("/student/:studentId", getfeeByStudent);
router.get("/:id", getFeeByID);
router.put("/:id", updateFee);
router.delete("/:id", deleteFee);

export default router;