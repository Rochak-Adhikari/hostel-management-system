"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="inline-flex items-center gap-2 text-sm font-medium text-black hover:underline mb-6"
    >
      <ArrowLeft size={18} />
      
    </button>
  );
}