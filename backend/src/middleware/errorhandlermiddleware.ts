import { Request, Response, NextFunction } from "express";
import { ENV_CONFIG } from "../config/env.config";
import { ErrorCodes } from "../types/enum";

export class AppError extends Error {
  public readonly status: "error" | "fail";
  public readonly code: ErrorCodes;
  public readonly statusCode: number;

  constructor(message: string, statusCode: number, code: ErrorCodes) {
    super(message);

    this.code = code;
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
 export const errorHandler = (error:any, req:Request, res: Response, next:NextFunction)=>{
  const message = error?.message || "Internal Server error";
  const statusCode = error?.statusCode || 500;
  const code = error?.code || ErrorCodes.SERVER_ERROR;
  const status = error?.status || "error"; 

  res.status(statusCode).json({
    message,
    code,
    status,
    data: null,
    originalError:ENV_CONFIG.NODE_ENV === "development" ? error : null
  })
}