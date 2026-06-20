import express from "express";
import { getALL, getByID, updateUser, deleteUser } from "../controllers/studentController";

const router = express.Router();

// GET all users
router.get("/", getALL);

// GET user by id
router.get("/:id", getByID);

// UPDATE user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

export default router;