"use client";

import { useState } from "react";
import { CalendarDays, Plus, X, Clock, FileText, CheckCircle, HelpCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getLeaveRequestsByStudent, createLeaveRequest } from "@/api/leaveRequestApi";

type LeaveRequest = {
  _id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
};

// Leave request validation schema (toDate must be strictly after fromDate)
const leaveSchema = yup.object({
  fromDate: yup.string().required("From Date is required"),
  toDate: yup
    .string()
    .required("To Date is required")
    .test("is-after", "To Date must be strictly after From Date", function (value) {
      const { fromDate } = this.parent;
      if (!fromDate || !value) return true;
      return new Date(value) > new Date(fromDate);
    }),
  reason: yup.string().required("Reason is required").min(10, "Please provide at least 10 characters"),
});

type LeaveFormValues = yup.InferType<typeof leaveSchema>;

const STATUS_STYLES: Record<string, string> = {
  Pending: "border-gray-400 text-gray-500",
  Approved: "bg-black text-white border-black",
  Rejected: "border-red-400 text-red-500",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${
        STATUS_STYLES[status] || "border-gray-300 text-gray-500"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}

export default function StudentLeaveRequestsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // react-hook-form leave request ko lagi
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: yupResolver(leaveSchema),
    defaultValues: {
      fromDate: "",
      toDate: "",
      reason: "",
    },
  });

  // Yo student ko leave requests fetch garne
  const { data: leaveRes, isPending, isError } = useQuery({
    queryKey: ["myLeaveRequests", currentUser?.id],
    queryFn: () => getLeaveRequestsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });

  const leaveRequests: LeaveRequest[] = leaveRes?.data ?? [];
  const pendingRequest = leaveRequests.find((r) => r.status === "Pending");
  const pastRequests = leaveRequests.filter((r) => r.status !== "Pending");

  // Create leave request mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLeaveRequests", currentUser?.id] });
      setShowModal(false);
      reset();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to submit leave request");
    },
  });

  const onSubmit = (formData: LeaveFormValues) => {
    if (!currentUser?.id) return;
    createMutation.mutate({
      student: currentUser.id,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason,
    });
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to view leave requests.</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading your leave requests...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load leave requests. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Leave Requests</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Apply for hostel leave and track your permission approvals.
          </p>
        </div>
        {!pendingRequest && (
          <button
            onClick={() => {
              reset();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-900 transition shrink-0 self-start sm:self-auto"
          >
            <Plus size={15} />
            Apply for Leave
          </button>
        )}
      </div>

      {/* Main Leave Request Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-700">My Leave Applications</h2>
          </div>
          <span className="text-xs text-gray-400">{leaveRequests.length} total</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Pending request indicator */}
          {pendingRequest && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Pending Application</p>
                <StatusPill status={pendingRequest.status} />
              </div>
              <p className="text-xs font-bold text-gray-800 mb-1">
                Schedule: {new Date(pendingRequest.fromDate).toLocaleDateString("en-GB")} → {new Date(pendingRequest.toDate).toLocaleDateString("en-GB")}
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{pendingRequest.reason}</p>
              <p className="text-[10px] text-gray-400 mt-2">Submitted: {new Date(pendingRequest.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
          )}

          {/* Past / Processed requests history */}
          {pastRequests.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Leave History</p>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {pastRequests.map((r) => (
                  <div key={r._id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50/50 transition">
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-bold text-gray-900">
                        {new Date(r.fromDate).toLocaleDateString("en-GB")} → {new Date(r.toDate).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-sm text-gray-700 truncate">{r.reason}</p>
                      <p className="text-[10px] text-gray-400">Applied: {new Date(r.createdAt).toLocaleDateString("en-GB")}</p>
                      {r.adminNote && (
                        <p className="text-xs text-gray-500 mt-1 italic">Admin Note: {r.adminNote}</p>
                      )}
                    </div>
                    <div className="shrink-0">
                      <StatusPill status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!pendingRequest && pastRequests.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <HelpCircle size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">No leave applications submitted yet.</p>
              <p className="text-xs text-gray-400 mt-1">Click "Apply for Leave" above to submit a new leave request.</p>
            </div>
          )}
        </div>
      </div>

      {/* Apply for Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Apply for Hostel Leave</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-gray-150 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From Date</label>
                  <input
                    type="date"
                    {...register("fromDate")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {errors.fromDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.fromDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">To Date</label>
                  <input
                    type="date"
                    {...register("toDate")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {errors.toDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.toDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Reason for Leave</label>
                <textarea
                  rows={4}
                  placeholder="Explain the reason for your leave application..."
                  {...register("reason")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {createMutation.isPending ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
