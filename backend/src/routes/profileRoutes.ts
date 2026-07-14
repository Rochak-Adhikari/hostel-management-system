import express from "express";
import { upload } from "../middleware/uploadMiddleware";
import { uploadProfilePicture } from "../controllers/profileController";

//! Profile ko route haru
const router = express.Router();

// Profile picture upload garnay ko  route
// router.patch(
//   "/profile-picture",
//   upload.single("profile_picture"),
//   uploadProfilePicture
// );

export default router;