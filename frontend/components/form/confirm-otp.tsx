"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyOtp, resendOtp } from "@/api/authapi";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function ConfirmOtpFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Countdown timer  Resend OTP ko lagi
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const { mutate: verify, isPending: isVerifying, error: verifyError, isError: isVerifyError } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      router.push("/login?verified=true");
    },
  });

  const { mutate: resend, isPending: isResending, error: resendError, isError: isResendError, isSuccess: isResendSuccess } = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      setTimer(60);
      setCanResend(false);
    },
  });

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message ?? "Something went wrong";
    }
    return "Something went wrong";
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; //  numbers matra allow garxa

    const newOtp = [...otp];
    // Take only the last character if copy-pasting or typing
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Shift focus forward
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Clear previous input and shift focus back
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return; // Validate 6-digit number

    const digits = pasteData.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      verify({ email, otp: otpCode });
    }
  };

  const handleResend = () => {
    if (canResend) {
      resend({ email });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-2">
        <p className="text-sm text-black/60">
          We sent a verification code to <span className="font-semibold text-black break-all">{email || "your email"}</span>.
        </p>
      </div>

      {/* 6 OTP Inputs */}
      <div className="flex justify-center gap-2 sm:gap-4 my-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-black bg-white border-2 border-black/10 rounded-xl focus:border-black focus:outline-none transition-colors"
            required
          />
        ))}
      </div>

      {/* Error Displays */}
      {isVerifyError && verifyError && (
        <p className="text-red-500 text-xs text-center bg-red-100 w-fit mx-auto px-3 py-1.5 rounded">
          {getErrorMessage(verifyError)}
        </p>
      )}

      {isResendError && resendError && (
        <p className="text-red-500 text-xs text-center bg-red-100 w-fit mx-auto px-3 py-1.5 rounded">
          {getErrorMessage(resendError)}
        </p>
      )}

      {isResendSuccess && (
        <p className="text-green-600 text-xs text-center bg-green-50 w-fit mx-auto px-3 py-1.5 rounded">
          Verification code resent successfully!
        </p>
      )}

      {/* Action Button */}
      <button
        type="submit"
        disabled={isVerifying || otp.join("").length < 6}
        className="w-full h-12 bg-black text-white rounded-xl text-base font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
      >
        {isVerifying ? "VERIFYING..." : "VERIFY EMAIL"}
      </button>

      {/* Resend Timer / Action */}
      <div className="text-center text-sm">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-semibold underline hover:text-black/80 transition-colors disabled:opacity-50 font-poppins"
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>
        ) : (
          <p className="text-black/60">
            Resend code in <span className="font-semibold text-black">{timer}s</span>
          </p>
        )}
      </div>
    </form>
  );
}

export default function ConfirmOtpForm() {
  return (
    <Suspense fallback={<div className="text-center py-4 text-sm text-gray-500">Loading form...</div>}>
      <ConfirmOtpFormContent />
    </Suspense>
  );
}
