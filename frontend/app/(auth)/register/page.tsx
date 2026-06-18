import React from "react";
import Image from "next/image";
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
          width={120}
          height={120}
           className="w-32 h-32 object-contain mx-auto "
        />
      </div>
        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-black mb-6">
          Sign up
        </h1> 

        {/* ── YOUR DETAILS ── */}
        <p className="text-black text-base mb-3">Your Details</p>

        <div className="flex gap-4 mb-4">
          {/* Full name */}
          <div className="flex-1">
            <input type="text"  placeholder="Full name"  className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          {/* Phone */}
          <div className="flex-1">
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Email — full width */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex gap-4 mb-6">
          {/* Password */}
          <div className="flex-1">
            <input
              type="password"
              placeholder="Password"
              className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          {/* Re-type password */}
          <div className="flex-1">
            <input
              type="password"
              placeholder="Re-Type Password"
              className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* ── GUARDIAN DETAILS ── */}
        <p className="text-black text-base mb-3">Guardian Details</p>

        <div className="flex gap-4 mb-4">
          {/* Guardian name */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Guardian Name"
              className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          {/* Guardian phone */}
          <div className="flex-1">
            <input
              type="tel"
              placeholder="Guardian Phone Number"
              className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Guardian email */}
        <div className="mb-1">
          <label className="text-black text-base block mb-1">Guardian email</label>
          <input
            type="email"
            placeholder="guardian@email.com"
            className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black"
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

        {/* Submit button */}
        <button className="w-full h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors">
          CREATE YOUR ACCOUNT
        </button>

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