import bcrypt from "bcryptjs";

export const hashText = async(input:string) => {
    try{
        const salt = await bcrypt.genSalt(11)
        return await bcrypt.hash(input, salt);
    }
    catch (error){
        console.log(error)
        throw error
            
        };
    }


    export const compareHash = async(text:string, hash:string) => {
        try{
            return await bcrypt.compare(text, hash);
        }
        catch (error){
            console.log(error)
            throw error

        }
    }