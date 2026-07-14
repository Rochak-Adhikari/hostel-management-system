import multer from "multer";
import { AppError } from "./errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";

//! Memory storage use garne cloudinary upload ko lagi
const storage = multer.memoryStorage();

//! Image matra upload garna dine
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Only image files are allowed",
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    );
  }
};

//! Multer ko configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});