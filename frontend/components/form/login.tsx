  'use client';
import React from "react";
import { Input,  } from '@/ui/inputs/input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginSchema } from "@/schema/authschema";
import { ILogin } from "@/types/authtype";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { login } from "@/api/authapi";
import { useRouter } from 'next/navigation';


export default function LoginForm () {
  const router = useRouter();
  


         const {register, handleSubmit, formState: {errors}} = useForm<ILogin>({
          defaultValues: {
            email: "",
            password: "",
          },

          resolver: yupResolver(LoginSchema),
         })

         //mutaition function

        

          const {mutate, isPending, error, isError} = useMutation({
            mutationFn: login,
             onSuccess: (data) => {
               const role = data.data.role;
               if (role === 'student') router.push('/student/dashboard');
               else if (role === 'admin') router.push('/admin/dashboard');
               else if (role === 'guardian') router.push('/guardian/dashboard');
    }
           });

          console.log(isError, error)

          const getErrorMessage = (error: unknown): string => {
            if (axios.isAxiosError(error)) {
                        return error.response?.data?.message ?? 'Something went wrong';
                }
                      return 'Something went wrong';
              };

          //onSubmit ma yo function call garxa
         const onSubmit =  async (data: ILogin) => {
          console.log(data)
          mutate(data) 

         }
         

         

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        
       <div className="mb-4 font-semibold">
        <Input 
        name="email"
        label="Email" 
        id="email" 
        type="email" 
        placeholder="Enter your email" 
        required 
        register={register}
        error={errors.email?.message}
        />
        

        </div>
  
        <div className="mb-4 font-semibold">
            <Input
            name="password"
            label="Password"
            id='password'
            type="password"
            placeholder="Password"
            required
            register={register}
            error={errors.password?.message}
            />
            {isError && error&& 
              <p style={{ fontSize: '10px' }} className="text-red-500 text-center bg-red-100  w-fit mx-auto px-2 py-1 mt-2 rounded ">
              {getErrorMessage(error)}
              </p>}
                  <div className="flex justify-end mb-6">
          <a href="/forgot-password" className="text-sm text-black/60 hover:text-black underline">
            Forgot password?
          </a>
        </div>
        </div >
      <button
       type="submit"
          disabled={isPending}
          className="w-40 h-12 bg-black text-white rounded-md text-base font-medium 
          hover:bg-black/90 transition-colors justify-center mx-auto text-center 
          items-center flex-col flex disabled:opacity-50"
            >
              {isPending ? 'Logging in...' : 'LOG IN'}
            </button>
          
       
          
        </form>
    )
    
};