import React from 'react'
import { Input } from '@/ui/inputs/input'




export default function LoginForm () {

    return (
        <form action="">
        
       <div className="mb-4 font-semibold">
        <Input 
        label="Email" 
        id="email" 
        type="email" 
        placeholder="Enter your email" 
        required 
        />
        

        </div>
  
        <div className="mb-4 font-semibold">
            <Input
            label="Password"
            id='password'
            type="password"
            placeholder="Password"
            required
          />
                  <div className="flex justify-end mb-6">
          <a href="/forgot-password" className="text-sm text-black/60 hover:text-black underline">
            Forgot password?
          </a>
        </div>
        </div >
      <button className="w-40 h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors justify-center mx-auto text-center items-center flex-col flex">
          LOG IN
        </button>

        </form>
    )
    
};