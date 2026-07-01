import { LoginSchema, RegisterSchema, ForgotPasswordSchema } from '@/schema/authschema'
import * as yup from "yup"

export type ILogin = {
  email: string
  password: string
}

export type IRegister = {
  full_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
  guardian: {
    name: string
    phone: string
    email: string
  }
}

export type IForgotPassword = {
  email: string
}

export type ILoginSchema = yup.InferType<typeof LoginSchema>
export type IRegisterSchema = yup.InferType<typeof RegisterSchema>
export type IForgotPasswordSchema = yup.InferType<typeof ForgotPasswordSchema>
