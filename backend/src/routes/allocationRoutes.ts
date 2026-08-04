import express from "express";
import { createAllocation, getALLAllocations, getAllocationByID, updateAllocation, deleteAllocation, getAllocationByStudent, getAvailableBeds, getAllocationsByRoom } from "../controllers/allocationController";
import { authenticate, authorize, authorizeStudentScope } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

router.post("/", authorize(Role.ADMIN), createAllocation);
router.get("/", authorize(Role.ADMIN), getALLAllocations);
router.get("/student/:studentId", authorizeStudentScope(), getAllocationByStudent);
router.get("/room/:roomId", authorize(Role.ADMIN), getAllocationsByRoom);
router.get("/available-beds/:roomId", getAvailableBeds);
router.get("/:id", authorize(Role.ADMIN), getAllocationByID);
router.put("/:id", authorize(Role.ADMIN), updateAllocation);
router.delete("/:id", authorize(Role.ADMIN), deleteAllocation);

export default router;
