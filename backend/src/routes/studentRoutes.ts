import express from "express";
import { getALL, getByID, updateUser, deleteUser } from "../controllers/studentController";
import { authenticate, authorize, authorizeStudentScope } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

// GET all users
router.get("/", authorize(Role.ADMIN), getALL);

// GET user by id - aafno matra (guardian le linked_student ko)
router.get("/:id", authorizeStudentScope("id"), getByID);

// UPDATE user - aafno profile matra, admin le sabai ko
router.put("/:id", authorizeStudentScope("id"), updateUser);

// DELETE user
router.delete("/:id", authorize(Role.ADMIN), deleteUser);

export default router;
