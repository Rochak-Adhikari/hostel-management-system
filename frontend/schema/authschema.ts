import * as yup from 'yup'

export const LoginSchema = yup.object({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
})

export const RegisterSchema = yup.object({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email().required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().required('Password is required'),
  confirm_password: yup.string().required('Confirm password is required'),
  guardian: yup.object({
    name: yup.string().required('Guardian name is required'),
    phone: yup.string().required('Guardian phone is required'),
    email: yup.string().email().required('Guardian email is required'),
  }),
})

export const ForgotPasswordSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
})
