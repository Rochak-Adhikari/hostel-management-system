"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/form/login";
import BackButton from "@/components/backbutton/back";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "true";

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

        {justVerified && (
          <p className="text-green-600 text-xs text-center bg-green-50 w-fit mx-auto px-3 py-1.5 rounded mb-4">
            Email verified successfully. You can now log in.
          </p>
        )}

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-4 text-sm text-gray-500">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}