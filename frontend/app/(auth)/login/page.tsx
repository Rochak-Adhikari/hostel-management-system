"use client";
import React from "react";
import Image from "next/image";
import LoginForm from "@/components/form/login";

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
          width={160}
          height={50}
           className=" mx-auto "
        />
      </div>
             <h1 className="text-center text-2xl font-bold text-black mb-6">
          LOG IN
        </h1> 

               {/*form*/}
               

               <LoginForm />
               
        <p className="text-center text-black text-base mt-4">
          Don't have an account?{""}
          <a href="/register" className="font-semibold underline">
            Sign up
          </a>
        </p>

      </div>
   </div>
  );
}