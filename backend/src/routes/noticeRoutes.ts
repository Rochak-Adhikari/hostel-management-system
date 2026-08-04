import express from "express";
import { createNotice, getALLNotices, getNoticeByID, updateNotice, deleteNotice, } from "../controllers/noticeController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { Role } from "../types/enum";

const router = express.Router();

router.use(authenticate());

router.post("/", authorize(Role.ADMIN), createNotice);
router.get("/", getALLNotices);
router.get("/:id", getNoticeByID);
router.put("/:id", authorize(Role.ADMIN), updateNotice);
router.delete("/:id", authorize(Role.ADMIN), deleteNotice);

export default router;
