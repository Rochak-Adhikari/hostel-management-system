import express from "express";
import { createNotice, getALLNotices, getNoticeByID, updateNotice, deleteNotice, } from "../controllers/noticeController";


const router = express.Router();

router.post("/", createNotice);
router.get("/", getALLNotices);
router.get("/:id", getNoticeByID);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;