"use client";

import { useState } from "react";
import { MessageSquareWarning, X, FileText, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getComplaintsByStudent } from "@/api/complaintapi";

type Complaint = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  category?: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  "In Progress": "border-black text-black",
  Pending: "border-gray-400 text-gray-500",
  Resolved: "bg-black text-white border-black",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${STATUS_STYLES[status] || "border-gray-300 text-gray-500"}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function GuardianComplaints() {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Real complaints fetching for linked student
  const { data: complaintsRes, isPending, isError } = useQuery({
    queryKey: ["childComplaints", currentUser?.linked_student],
    queryFn: () => getComplaintsByStudent(currentUser.linked_student),
    enabled: !!currentUser?.linked_student,
  });
  const complaints: Complaint[] = complaintsRes?.data ?? [];

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to view complaints.</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading child's complaints...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Child's Complaints &amp; Feedback</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View all complaints and suggestion tickets filed by your linked child.
        </p>
      </div>

      {/* Main Grid: list + detail sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 items-start">
        
        {/* Left: Complaints Ledger */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <FileText size={14} className="text-gray-500 mr-2" />
            <h2 className="text-sm font-semibold text-gray-700">Student Complaints Ledger</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <HelpCircle className="mx-auto mb-2 text-gray-300" size={32} />
                <p className="text-xs">No complaints filed by child yet.</p>
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-gray-50/50 cursor-pointer transition ${
                    selectedComplaint?._id === c._id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-550 font-semibold">{c.category || "General"}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate">{c.title}</h3>
                    <p className="text-xs text-gray-400">Submitted: {new Date(c.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <StatusPill status={c.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Detailed Sidebar Panel */}
        {selectedComplaint ? (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm space-y-4">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Complaint Details</span>
              <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
            
            <div className="px-5 pb-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Category</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedComplaint.category || "General"}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Title</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedComplaint.title}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Description</p>
                <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Status</p>
                <div className="mt-1">
                  <StatusPill status={selectedComplaint.status} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden xl:block bg-white border border-gray-200 rounded-2xl p-5 text-center text-gray-400">
            <MessageSquareWarning className="mx-auto mb-2 text-gray-300" size={32} />
            <p className="text-xs">Select a complaint ticket from the ledger to view detailed responses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
