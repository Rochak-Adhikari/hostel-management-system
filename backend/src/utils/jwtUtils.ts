import jwt from 'jsonwebtoken'
import { ENV_CONFIG } from '../config/env.config';
import { IJwtPayload } from '../types/global.types';


//sign in
export const signAccessToken = (payload: IJwtPayload) => {
    return jwt.sign(payload, ENV_CONFIG.JWT_SECRET,
        {
            expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any
        }
    )
}

//verify

export const verifyToken = (token: string) => {

    type IJwtPayloadReturn = IJwtPayload & {exp:number, iat:number}
   
    return jwt.verify(token, ENV_CONFIG.JWT_SECRET) as IJwtPayloadReturn

}