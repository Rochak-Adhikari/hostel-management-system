import { Request, Response, NextFunction } from "express";
import Complaint from "../models/Complaint";
import { AppError } from "../middleware/errorhandlermiddleware";
import { ErrorCodes, Role } from "../types/enum";
import { assertCanAccessStudent } from "../middleware/authMiddleware";

// CREATE COMPLAINT
// student le new complaint create garna ko lagi
export const createComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student, title, description, category } = req.body;

    // student aafai halda aafno id matra prayog huncha; admin le aru ko lagi halna sakxa
    const owner = req.user?.role === Role.ADMIN ? student : req.user?.id;

    if (!owner || !title || !description) {
      throw new AppError(
        "Student, Title, and Description are required",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const complaint = new Complaint({
      student: owner,
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

export const getAllComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // student ko full name details populate garera fetch garna ko lagi 
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



export const getComplaintById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id).populate("student", "full_name email phone");

    if (!complaint) {
      throw new AppError("Complaint Not Found", 404, ErrorCodes.NOT_FOUND);
    }

    await assertCanAccessStudent(req, (complaint.student as any)?._id ?? complaint.student);

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


export const updateComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await Complaint.findById(id);
    if (!existing) {
      throw new AppError("Complaint Not Found", 404, ErrorCodes.NOT_FOUND);
    }
    await assertCanAccessStudent(req, existing.student);

    const updateData = { ...req.body };
    // student/guardian le status ni student field badalna paudaina
    if (req.user?.role !== Role.ADMIN) {
      delete updateData.status;
      delete updateData.student;
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
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


export const deleteComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await Complaint.findById(id);
    if (!existing) {
      throw new AppError("Complaint Not Found", 404, ErrorCodes.NOT_FOUND);
    }
    await assertCanAccessStudent(req, existing.student);

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
