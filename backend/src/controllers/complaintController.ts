import { Request, Response, NextFunction } from "express";
import Complaint from "../models/Complaint";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";

// CREATE COMPLAINT
// student le naya complaint dartaa (create) garna ko lagi
export const createComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, title, description, category } = req.body;

    // validation garne
    if (!student || !title || !description) {
      throw new AppError(
        "Student, Title, and Description are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const complaint = new Complaint({
      student,
      title,
      description,
      category,
    });

    await complaint.save();

    return res.status(201).json({
      message: "Complaint registered successfully",
      code: "success",
      status: "success",
      data: complaint,
    });
  } catch (error: any) {
    return next(error);
  }
};

// GET ALL COMPLAINTS
// admin ko lagi sabai complaints list fetch garna
export const getAllComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // student ko full name details populate garera fetch garne
    const complaints = await Complaint.find({}).populate("student", "full_name email phone");

    return res.status(200).json({
      message: "Complaints Fetched Successfully",
      code: "success",
      status: "success",
      data: complaints,
    });
  } catch (error: any) {
    return next(error);
  }
};

// GET COMPLAINT BY ID
// id ko basis ma specific complaint detail page ko lagi
export const getComplaintById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id).populate("student", "full_name email phone");

    if (!complaint) {
      throw new AppError("Complaint Not Found", 404, ErrorCodes.NOT_FOUND);
    }

    return res.status(200).json({
      message: "Complaint Fetched Successfully",
      code: "success",
      status: "success",
      data: complaint,
    });
  } catch (error: any) {
    return next(error);
  }
};

// GET COMPLAINTS BY STUDENT ID
// student specific or guardian ko dashboard ko lagi complaints fetch garne
export const getComplaintsByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;

    const complaints = await Complaint.find({ student: studentId }).populate("student", "full_name email");

    return res.status(200).json({
      message: "Student Complaints Fetched Successfully",
      code: "success",
      status: "success",
      data: complaints,
    });
  } catch (error: any) {
    return next(error);
  }
};

// UPDATE COMPLAINT
// complaint ko status status update garna (Resolved/In Progress) admin ko batabata
export const updateComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("student", "full_name email");

    if (!updatedComplaint) {
      throw new AppError("Complaint Not Found", 404, ErrorCodes.NOT_FOUND);
    }

    return res.status(200).json({
      message: "Complaint Updated Successfully",
      code: "success",
      status: "success",
      data: updatedComplaint,
    });
  } catch (error: any) {
    return next(error);
  }
};

// DELETE COMPLAINT
// complaint record delete garna ko lagi
export const deleteComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint) {
      throw new AppError("Complaint Not Found", 404, ErrorCodes.NOT_FOUND);
    }

    return res.status(200).json({
      message: "Complaint Deleted Successfully",
      code: "success",
      status: "success",
      data: null,
    });
  } catch (error: any) {
    return next(error);
  }
};
