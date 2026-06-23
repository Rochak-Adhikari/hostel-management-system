  'use client';
import React from "react";
import { Input,  } from '@/ui/inputs/input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginSchema } from "@/schema/authschema";
import { ILogin } from "@/types/authtype";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


export default function LoginForm () {

         const {register, handleSubmit, formState: {errors}} = useForm<ILogin>({
          defaultValues: {
            email: "",
            password: "",
          },

          resolver: yupResolver(LoginSchema),
         })

         //mutaition function

         const login = async (data: ILogin) => {
          try{

            const response = await axios.post('http://localhost:8080/api/v1/auth/login', data)
            console.log(response.data)
            return response.data
            
          }
          catch(error){
            throw error
          }
         }

          const {mutate, isPending} = useMutation({
            mutationFn: login
          })

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
                  <div className="flex justify-end mb-6">
          <a href="/forgot-password" className="text-sm text-black/60 hover:text-black underline">
            Forgot password?
          </a>
        </div>
        </div >
      <button
      type="submit"
      disabled={isPending}
      className="w-40 h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors justify-center mx-auto text-center items-center flex-col flex">
          LOG IN
        </button>
          
        </form>
    )
    
};