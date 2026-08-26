"use client";

import { useState } from "react";
import { CalendarDays, X, FileText, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLeaveRequestsByStudent } from "@/api/leaveRequestApi";

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

const STATUS_STYLES: Record<string, string> = {
  Pending: "border-gray-400 text-gray-500",
  Approved: "bg-black text-white border-black",
  Rejected: "border-red-400 text-red-500",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${STATUS_STYLES[status] || "border-gray-300 text-gray-500"}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function GuardianLeaveRequests() {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // linked student ko leave requests fetch garne
  const { data: requestsRes, isPending } = useQuery({
    queryKey: ["childLeaveRequests", currentUser?.linked_student],
    queryFn: () => getLeaveRequestsByStudent(currentUser.linked_student),
    enabled: !!currentUser?.linked_student,
  });
  const requests: LeaveRequest[] = requestsRes?.data ?? [];

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
        <p className="text-gray-500">Loading child's leave requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Child's Leave Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View all leave permission applications filed by your linked child.
        </p>
      </div>

      {/* Main Grid: list + detail sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 items-start">
        
        {/* Left: Requests Ledger */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <FileText size={14} className="text-gray-500 mr-2" />
            <h2 className="text-sm font-semibold text-gray-700">Leave Requests Ledger</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <HelpCircle className="mx-auto mb-2 text-gray-300" size={32} />
                <p className="text-xs">No leave requests filed by child yet.</p>
              </div>
            ) : (
              requests.map((r) => (
                <div
                  key={r._id}
                  onClick={() => setSelectedRequest(r)}
                  className={`p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-gray-50/50 cursor-pointer transition ${
                    selectedRequest?._id === r._id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">
                      {new Date(r.fromDate).toLocaleDateString("en-GB")} → {new Date(r.toDate).toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{r.reason}</p>
                    <p className="text-xs text-gray-400">Submitted: {new Date(r.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <StatusPill status={r.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Detailed Sidebar Panel */}
        {selectedRequest ? (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm space-y-4">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Request Details</span>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
            
            <div className="px-5 pb-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Leave Schedule</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  {new Date(selectedRequest.fromDate).toLocaleDateString("en-GB")} → {new Date(selectedRequest.toDate).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Reason</p>
                <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-wrap">{selectedRequest.reason}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Status</p>
                <div className="mt-1">
                  <StatusPill status={selectedRequest.status} />
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Submitted</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{new Date(selectedRequest.createdAt).toLocaleDateString("en-GB")}</p>
              </div>

              {selectedRequest.adminNote && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Admin Note</p>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1 italic">{selectedRequest.adminNote}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden xl:block bg-white border border-gray-200 rounded-2xl p-5 text-center text-gray-400">
            <CalendarDays className="mx-auto mb-2 text-gray-300" size={32} />
            <p className="text-xs">Select a request from the ledger to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
