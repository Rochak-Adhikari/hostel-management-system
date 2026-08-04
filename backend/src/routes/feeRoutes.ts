import express from "express";
import { createFee, getALLfee, getFeeByID, updateFee, deleteFee, getfeeByStudent } from "../controllers/feeController";
import { authenticate, authorize, authorizeStudentScope } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

router.post("/", authorize(Role.ADMIN), createFee);
router.get("/", authorize(Role.ADMIN), getALLfee);
router.get("/student/:studentId", authorizeStudentScope(), getfeeByStudent);
// getFeeByID controller ma aafno fee matra herna paunay check cha
router.get("/:id", getFeeByID);
router.put("/:id", authorize(Role.ADMIN), updateFee);
router.delete("/:id", authorize(Role.ADMIN), deleteFee);

export default router;
