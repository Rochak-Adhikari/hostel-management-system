import { LoginSchema } from '@/schema/authschema';
import * as yup from "yup"

export type ILogin = {
  email: string,
  password: string
}

export type ILoginSchema = yup.InferType<typeof LoginSchema>