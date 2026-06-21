import React from "react";
import Image from "next/image";
import Link from "next/link";
import ForgotPassword from "@/components/form/forgot";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 font-poppins">
      <div
        className="w-full max-w-xl bg-white rounded-3xl px-10 py-8"
        style={{
          boxShadow:
            "5px 4px 4px 2px rgba(0,0,0,0.25), inset 8px 4px 10px rgba(0,0,0,0.25)",
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

    
        <h1 className="text-center text-2xl font-bold text-black mb-3">
          FORGOT PASSWORD
        </h1>

   
        <p className="text-center text-black/70 text-sm mb-6">
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

    
        {/* Form */}
        <ForgotPassword />

       
        <p className="text-center text-black text-base mt-4">
          Remember your password?{" "}
          <a href="/login" className="font-semibold underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}