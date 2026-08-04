import { NextFunction, Request, Response } from "express"
import { AppError } from "./errorhandlermiddleware";
import { ErrorCodes, Role } from "../types/enum";
import { verifyToken } from "../utils/jwtUtils";
import User from "../models/user";


export const authenticate = () => {

    //!MIDDLEware
    return (req:Request, res: Response, next:NextFunction) => {
         
        try {     
        //cookies
         const cookies = req.cookies;
        //get token
        const token = cookies['accessToken']

        if(!token){
            throw new AppError("Not authorized", 401, ErrorCodes.INVALID_CREDENTIALS);
        }
        // verify token
         const decodedData =verifyToken(token)

         if (!decodedData) {
            throw new AppError("Invalid token", 401, ErrorCodes.INVALID_CREDENTIALS);
         }
        // check expired
        if (decodedData.exp * 1000 < Date.now()) {
            throw new AppError("Token expired", 401, ErrorCodes.INVALID_CREDENTIALS);
        }
        // is user exist
        if (!decodedData.id) {
            throw new AppError("User not found", 404, ErrorCodes.NOT_FOUND);
        }

        
        req.user = decodedData;
        return next();
        } catch (error) {
            return next(error);
        }
    };
};

// role based access control - authenticate() pachi matra chalaunu parxa
export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError("Not authorized", 401, ErrorCodes.INVALID_CREDENTIALS));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError("Forbidden: insufficient permissions", 403, ErrorCodes.INVALID_CREDENTIALS));
        }
        return next();
    };
};

// admin sabai herna sakxa, student aafno matra, guardian aafno linked_student ko matra
export const assertCanAccessStudent = async (req: Request, studentId: any) => {
    if (!req.user) {
        throw new AppError("Not authorized", 401, ErrorCodes.INVALID_CREDENTIALS);
    }
    if (req.user.role === Role.ADMIN) return;

    if (req.user.role === Role.STUDENT) {
        if (String(req.user.id) === String(studentId)) return;
    } else if (req.user.role === Role.GUARDIAN) {
        const guardian = await User.findById(req.user.id).select("linked_student");
        if (guardian?.linked_student && String(guardian.linked_student) === String(studentId)) return;
    }

    throw new AppError("Forbidden: not your record", 403, ErrorCodes.INVALID_CREDENTIALS);
};

// :studentId wala route ko lagi
export const authorizeStudentScope = (param = "studentId") => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await assertCanAccessStudent(req, req.params[param]);
            return next();
        } catch (error) {
            return next(error);
        }
    };
};