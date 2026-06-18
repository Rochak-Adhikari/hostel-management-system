import React from "react";
import Image from "next/image";
export default function LoginPage() {
  return (
   <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 font-poppins">
    <div
        className="w-100 max-w-xl bg-white rounded-3xl px-10 py-8"
        style={{
          boxShadow: "5px 4px 4px 2px rgba(0,0,0,0.25), inset 8px 4px 10px rgba(0,0,0,0.25)",
          border: "2px solid #fff",
        }}
      >
        <div className="mb-4">
                <Image
                  src="/assets/logo.png"
                  alt="HostelHub Logo"
                  width={120}
                  height={120}
                   className="w-32 h-32 object-contain mx-auto "
                />
        </div>
             <h1 className="text-center text-2xl font-bold text-black mb-6">
          LOG IN
        </h1> 

       <div className="mb-4 font-semibold">
         Email:  <input
            type="email"
            placeholder="Email"
            className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
          />
        </div>
  
        <div className="mb-4 font-semibold">
             Password: <input
            type="password"
            placeholder="Password"
            className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
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


        <p className="text-center text-black text-base mt-4">
          Don't have an account?{" "}
          <a href="/register" className="font-semibold underline">
            Sign up
          </a>
        </p>

      </div>
   </div>
  );
}