import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import Notice from "../models/Notice";

// CREATE Notices

export const createNotice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, postedBy } = req.body;

    // validation
    if (!title || !content || !postedBy) {
      throw new AppError(
        "All fields are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

  

    const notice = new Notice({
      title,
      content,
      postedBy
    });

    await notice.save();

    return res.status(201).json({
      message: "Notice created successfully",
      code: "success",
      status: "success",
        data: notice,
    });

  } catch (error: any) {

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return next(
        new AppError(
          `Notice with this ${field} already exists`,
          400,
          ErrorCodes.NOTICE_ALREADY_EXISTS
        )
      );
    }

    return next(error);
  }
};





export const getALLNotices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! db query -> Notice collection

    const notices = await Notice.find({}).sort({ createdAt: -1 });

    //! success response below
    return res.status(200).json({
      message: "Notices Fetched Successfully",
      code: "success",
      status: "success",
      data: notices,
    });

  } catch (error: any) {
    return next(error);
  }
};


// room ko id ko basis ma room fetch garna ko lagi ho
export const getNoticeByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id);

    if (!notice) {
    throw new AppError(
      "Notice Not Found",
      404,
      ErrorCodes.NOTICE_NOT_FOUND    )
    }

    return res.status(200).json({
      message: "Notice Fetched Successfully",
      code: "success",
      status: "success",
      data: notice,
    });

  } catch (error: any) {
    return next(error);
  }
};


// Room haru update garna ko lagi
export const updateNotice= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existingNotice = await Notice.findById(id);
       if (!existingNotice) {
      throw new AppError("Notice Not Found", 404, ErrorCodes.NOTICE_NOT_FOUND);
    }
     




    const updatedNotice = await Notice.findByIdAndUpdate(
  id,
  req.body,
  {
    new: true, // true return garxa vney updated data else it's useless send gardaina
    runValidators: true,
  }
);

    if (!updatedNotice) {
       throw new AppError(
        "Notice Not Found",
        404,
        ErrorCodes.NOTICE_NOT_FOUND
       )
    }

    return res.status(200).json({
      message: "Notice Updated Successfully",
      code: "success",
      status: "success",
      data: updatedNotice,
    });

  } catch (error: any) {
    return next(error);
  }
};


// room haru delete garna ko lagi
export const deleteNotice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      throw new AppError(
        "Notice Not Found",
        404,
        ErrorCodes.NOTICE_NOT_FOUND
      );
    }

    return res.status(200).json({
      message: "Notice Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });

  } catch (error: any) {
    return next(error);
  }
};