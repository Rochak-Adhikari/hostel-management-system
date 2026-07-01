import axios from "axios";
import { ILogin, IRegister, IForgotPassword } from '@/types/authtype';

export const login = async (data: ILogin) => {
  const response = await axios.post('http://localhost:8080/api/v1/auth/login', data)
  return response.data
}

export const register = async (data: IRegister) => {
  const response = await axios.post('http://localhost:8080/api/v1/auth/register', data)
  return response.data
}

export const forgotPassword = async (data: IForgotPassword) => {
  const response = await axios.post('http://localhost:8080/api/v1/auth/forgot-password', data)
  return response.data
}
