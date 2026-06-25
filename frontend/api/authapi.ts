import axios from "axios";
import { ILogin, IRegister } from '@/types/authtype';

export  const login = async (data: ILogin) => {
          try{

            const response = await axios.post('http://localhost:8080/api/v1/auth/login', data)
            console.log(response.data)
            return response.data
            
          }
          catch(error){
            throw error
          }
         }
export  const register = async (data: IRegister) => {
          try{

            const response = await axios.post('http://localhost:8080/api/v1/auth/register', data)
            console.log(response.data)
            return response.data
            
          }
          catch(error){
            throw error
          }
         }