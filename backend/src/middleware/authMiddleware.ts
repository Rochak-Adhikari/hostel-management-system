import { NextFunction, Request, Response } from "express"
import { AppError } from "./errorhandlermiddleware";
import { ErrorCodes } from "../types/enum";
import { verifyToken } from "../utils/jwtUtils";


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
        //check role

        //next()
        } catch (error) {
            return next(error)
        }
        

}
}