"use client";

import { useState } from "react";
import { User, Lock, LogOut, ShieldCheck, KeyRound, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { changePassword, logout } from "@/api/authapi";

const changePasswordSchema = yup.object({
  current_password: yup.string().required("Current password is required"),
  new_password: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Confirm password is required"),
});

type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

export default function SettingsComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormValues) => changePassword(data),
    onSuccess: (res) => {
      setSuccessMsg(res?.message || "Password changed successfully!");
      setErrorMsg("");
      reset();
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || "Failed to change password");
      setSuccessMsg("");
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      localStorage.removeItem("user");
      queryClient.clear();
      router.push("/login");
    }
  };

  const onSubmitPassword = (data: ChangePasswordFormValues) => {
    setSuccessMsg("");
    setErrorMsg("");
    changePasswordMutation.mutate(data);
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to manage your settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Account &amp; Security Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your personal account details, change account password, and manage active sessions.
        </p>
      </div>

      {/* 1. Account Details */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <User size={15} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-700">Account Details</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Full Name</p>
              <p className="text-sm font-bold text-gray-900">{currentUser.full_name || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Email Address</p>
              <p className="text-sm font-bold text-gray-900">{currentUser.email || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Account Role</p>
              <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase">
                <ShieldCheck size={11} />
                {currentUser.role || "User"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Security / Change Password */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Lock size={15} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-700">Security &amp; Password</h2>
        </div>
        <div className="p-5 max-w-lg">
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={15} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                {...register("current_password")}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.current_password && (
                <p className="text-red-500 text-xs mt-1">{errors.current_password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                {...register("new_password")}
                placeholder="Enter new password (min. 6 characters)"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                {...register("confirm_password")}
                placeholder="Re-enter new password"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="flex items-center gap-2 bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <KeyRound size={14} />
                {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Active Session & Logout */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <LogOut size={15} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-700">Active Session</h2>
        </div>
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Sign out from HostelHub</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Logging out will end your current session and clear authentication cookies.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
          >
            <LogOut size={14} />
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
