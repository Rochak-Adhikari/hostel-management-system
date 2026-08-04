"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SetPasswordForm from "@/components/form/set-password";
import BackButton from "@/components/backbutton/back";

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  if (!token || !email) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 font-medium mb-4">
          Invalid or missing reset token / email in the link.
        </p>
        <Link href="/forgot-password" className="font-semibold text-black underline">
          Request a new password reset link
        </Link>
      </div>
    );
  }

  return <SetPasswordForm token={token} email={email} />;
}

export default function SetPasswordPage() {
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

        <h1 className="text-center text-2xl font-bold text-black mb-3">
          SET NEW PASSWORD
        </h1>

        <p className="text-center text-black/70 text-sm mb-6">
          Enter your new password below to complete setting up or resetting your account password.
        </p>

        <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
          <SetPasswordContent />
        </Suspense>

        <p className="text-center text-black text-base mt-4">
          Back to{" "}
          <Link href="/login" className="font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
