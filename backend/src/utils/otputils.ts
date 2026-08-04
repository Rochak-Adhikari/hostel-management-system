import crypto from "crypto"; 

export const createOtp = (length = 6) => {

    let otp =''
    for( let i = 0; i < length; i++){
        otp += crypto.randomInt(10);
    }

    return otp;
};

export const createToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};