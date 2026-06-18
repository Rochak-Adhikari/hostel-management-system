import React from "react";
import Image from "next/image";

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
        {/* Logo */}
        <div className="mb-4">
          <Image
            src="/assets/logo.png"
            alt="HostelHub Logo"
            width={120}
            height={120}
            className="w-32 h-32 object-contain mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-black mb-3">
          FORGOT PASSWORD
        </h1>

        {/* Description */}
        <p className="text-center text-black/70 text-sm mb-6">
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        {/* Email Input */}
        <div className="mb-6 font-semibold">
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black mt-1"
          />
        </div>

        {/* Button */}
        <button className="w-full h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors">
          SEND RESET LINK
        </button>

        {/* Back to Login */}
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