import jwt from 'jsonwebtoken'
import { ENV_CONFIG } from '../config/env.config';
import { IJwtPayload } from '../types/global.types';

export const signAccessToken = (payload: IJwtPayload) => {
    return jwt.sign(payload, ENV_CONFIG.JWT_SECRET,
        {
            expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any
        }
    )
}