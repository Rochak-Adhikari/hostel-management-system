"use client";import { Input } from '@/ui/inputs/input'
import React from 'react'
import { useForm } from 'react-hook-form'
import { IRegister } from '@/types/authtype'
import { RegisterSchema } from '@/schema/authschema'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { register as registerUser } from '@/api/authapi'
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  
  const router = useRouter();

   const {register, handleSubmit, formState: {errors}} = useForm<IRegister>({
   defaultValues: {
     full_name: "",
     email: "",
     phone: "",
     password: "",
     confirm_password: "",
     guardian: {
       name: "",
       phone: "",
       email: "",
     },
   }, 
    resolver: yupResolver(RegisterSchema),

   })
      const {mutate, isPending, error, isError} = useMutation({
            mutationFn: registerUser,
              onSuccess: () => {
                  router.push('/login');  
                }
              });

               console.log(isError, error)


          //onSubmit ma yo function call garxa
         const onSubmit =  async (data: IRegister) => {
          console.log(data)
          mutate(data) 

         }
         

         


    return (
        <form onSubmit={handleSubmit(onSubmit)} >
        <p className="text-black text-sm mb-3 font-bold text-center">Your Details</p>
        <div className="flex gap-4 mb-4">
          

          <div className="flex-1">
           <Input 
           name='full_name'
           label="Full Name" 
           id="name" 
           type="text" 
           placeholder="Full Name"
           required
           register={register}
           />
          </div>

    
          <div className="flex-1">
        <Input 
        name='phone'
        label="Phone" 
        id="phone" 
        type="phone" 
        placeholder="Phone"
        required
        register={register}
         />
          </div>
        </div>

    
        <div className="mb-4">
        <Input 
        name='email'
        label="Email" 
        id="email"
        type="email" 
        placeholder="Enter your email"
        required 
        register={register}
        />


        </div>

        <div className="flex gap-4 mb-6">
        
          <div className="flex-1">
              <Input
              name='password'
              label="Password"
              id="password"
              type="password"
              placeholder="Password"
              required
              register={register}
              
              />
          </div>
         
          <div className="flex-1">
         
         <Input
         name='confirm_password'
         label="Confirm Password"
         id="confirm-password"
         type="password"
         placeholder="Confirm Password"
         required
         register={register}
         />
          
          </div>
        </div>

        {/* GUARDIAN DETAILS */}
        <p className="text-black text-sm  mb-3 font-bold text-center">GUARDIAN DETAILS</p>

        <div className="flex gap-4 mb-4">
 
          <div className="flex-1">
              <Input
              
              name='guardian.name'
              label="Guardian Name"
              id="guardian-name"
              type="text"
              placeholder="Guardian Name"
              required
              register={register}

              />
          </div>
          
          <div className="flex-1">
             <Input
             name='guardian.phone'
             label="Guardian Phone"
             id="guardian-phone"
             type="phone"
             placeholder="Guardian Phone"
             required
             register={register}

            />

          </div>
        </div>

        <div className="mb-1">
    
         <Input
         name='guardian.email'
         label="Guardian Email"
         id="guardian-email"
         type="email"
         placeholder="Guardian Email"
         required
         register={register}
    
            />
        </div>
        <p className="text-black/70 text-sm mb-2">
          Login credentials will be sent here automatically.
        </p>

        {/* Terms */}
        <p className="text-black/70 text-sm mb-5 leading-snug">
          By creating an account, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Use</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>

      
        <button 
        type="submit" 
        disabled={isPending}
        className="w-full h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors">
          {isPending ? "Signing up..." : "CREATE ACCOUNT"}
        </button>
      </form>
    )
}