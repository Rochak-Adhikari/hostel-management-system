import mongoose from 'mongoose'
import { Role } from './enum';

export interface IJwtPayload {
    id: mongoose.Types.ObjectId;
    role: Role;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}