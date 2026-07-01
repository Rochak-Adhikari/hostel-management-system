"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/form/login";
import BackButton from "@/components/backbutton/back";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 font-poppins">
      <div
        className="w-full max-w-md bg-white rounded-3xl px-8 sm:px-10 py-8"
        style={{
          boxShadow:
            "5px 4px 4px 2px rgba(0,0,0,0.25), inset 8px 4px 10px rgba(0,0,0,0.25)",
          border: "2px solid #fff",
        }}
      >
        <BackButton />

        <div className="mb-4">
          <Image
            src="/assets/logo.png"
            alt="HostelHub Logo"
            width={160}
            height={50}
            className="mx-auto"
          />
        </div>

        <h1 className="text-center text-2xl font-bold text-black mb-6">
          LOG IN
        </h1>

        <LoginForm />

        <p className="text-center text-black text-base mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}