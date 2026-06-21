import { Input } from '@/ui/inputs/input'
import React from 'react'

export default function RegisterPage() {
    return (
        <form action="">
        <p className="text-black text-base mb-3">Your Details</p>

        <div className="flex gap-4 mb-4">
          

          <div className="flex-1">
           <Input 
           label="Full Name" 
           id="name" 
           type="text" 
           placeholder="Full Name"
           required
           />
          </div>

    
          <div className="flex-1">
        <Input label="Phone" 
        id="phone" 
        type="phone" 
        placeholder="Phone"
        required
         />
          </div>
        </div>

    
        <div className="mb-4">
        <Input 
        label="Email" 
        id="email"
        type="email" 
        placeholder="Enter your email"
        required 
        />


        </div>

        <div className="flex gap-4 mb-6">
        
          <div className="flex-1">
              <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Password"
              required
              
              />
          </div>
         
          <div className="flex-1">
         
         <Input
         label="Confirm Password"
         id="confirm-password"
         type="password"
         placeholder="Confirm Password"
         required
         />
          
          </div>
        </div>

        {/* GUARDIAN DETAILS */}
        <p className="text-black text-base mb-3">Guardian Details</p>

        <div className="flex gap-4 mb-4">
 
          <div className="flex-1">
              <Input
              
              label="Guardian Name"
              id="guardian-name"
              type="text"
              placeholder="Guardian Name"
              required

              />
          </div>
          
          <div className="flex-1">
             <Input
             label="Guardian Phone"
             id="guardian-phone"
             type="phone"
             placeholder="Guardian Phone"
             required

            />

          </div>
        </div>

        <div className="mb-1">
    
         <Input
         label="Guardian Email"
         id="guardian-email"
         type="email"
         placeholder="Guardian Email"
         required
    
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

      
        <button className="w-full h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors">
          CREATE YOUR ACCOUNT
        </button>
      </form>
    )
}