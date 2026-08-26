import axiosInstance from "@/lib/axiosInstance";
import { ILogin, IRegister, IForgotPassword, IOtp, ISetPassword } from '@/types/authtype';

export const login = async (data: ILogin) => {
  const response = await axiosInstance.post('http://localhost:8080/api/v1/auth/login', data)
  return response.data
}

export const register = async (data: IRegister) => {
  const response = await axiosInstance.post('http://localhost:8080/api/v1/auth/register', data)
  return response.data
}

export const forgotPassword = async (data: IForgotPassword) => {
  const response = await axiosInstance.post('http://localhost:8080/api/v1/auth/forgot-password', data)
  return response.data
}

export const verifyOtp = async (data: IOtp) => {
  const response = await axiosInstance.post('http://localhost:8080/api/v1/auth/verify-otp', data)
  return response.data
}

export const resendOtp = async (data: { email: string }) => {
  const response = await axiosInstance.post('http://localhost:8080/api/v1/auth/resend-otp', data)
  return response.data
}

export const setPassword = async (data: ISetPassword) => {
  const response = await axiosInstance.post('http://localhost:8080/api/v1/auth/set-password', data)
  return response.data
}
