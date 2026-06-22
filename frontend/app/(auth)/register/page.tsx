"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import RegisterPage from "@/components/form/register.form";
export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 font-poppins">

    

      <div
        className="w-full max-w-xl bg-white rounded-3xl px-10 py-8"
        style={{
          boxShadow: "5px 4px 4px 2px rgba(0,0,0,0.25), inset 8px 4px 10px rgba(0,0,0,0.25)",
          border: "2px solid #fff",
        }}
      >
          {/* Logo above card */}
      <div className="mb-4">
        <Image
          src="/assets/logo.png"
          alt="HostelHub Logo"
          width={160}
          height={50}
           className=" mx-auto "
        />
      </div>
        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-black mb-6">
          Sign up
        </h1> 
        
       {/* Form */} 
              <RegisterPage />

        {/* Already have account */}
        <p className="text-center text-black text-base mt-4">
          Already have an account?{" "}
          <a href="/login" className="font-semibold underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}