"use client";

import { useState } from "react";
import { Plus, X, MessageSquareWarning, FileText, HelpCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ComplaintSchema } from "@/schema/complaintschema";
import { getComplaintsByStudent, createComplaint } from "@/api/complaintapi";

type Complaint = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  category?: string;
  submittedByRole?: string;
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

const complaintTypes = ["Plumbing", "Electricity", "Maintenance", "WiFi / Internet", "Furniture", "Cleanliness", "Other"];

type ComplaintFormValues = {
  category: string;
  title: string;
  description: string;
};

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [showModal, setShowModal] = useState(false);

  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // React hook form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: yupResolver(ComplaintSchema),
    defaultValues: {
      category: "",
      title: "",
      description: "",
    },
  });

  // Query my complaints
  const { data: complaintsRes, isPending, isError } = useQuery({
    queryKey: ["myComplaints", currentUser?.id],
    queryFn: () => getComplaintsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const complaints: Complaint[] = complaintsRes?.data ?? [];

  // Create complaint mutation
  const createMutation = useMutation({
    mutationFn: (newComplaint: any) => createComplaint(newComplaint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myComplaints", currentUser?.id] });
      setShowModal(false);
      reset();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to submit complaint");
    },
  });

  const onSubmit = (formData: ComplaintFormValues) => {
    if (!currentUser?.id) {
      alert("Please log in to raise a complaint.");
      return;
    }
    createMutation.mutate({
      student: currentUser.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
    });
  };

  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

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
        <p className="text-gray-500">Loading complaints...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load complaints. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Complaints</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track, manage, and submit hostel-related maintenance or support tickets.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-900 transition shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} />
          Raise Complaint
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          ["TOTAL", String(counts.total)],
          ["PENDING", String(counts.pending)],
          ["IN PROGRESS", String(counts.inProgress)],
          ["RESOLVED", String(counts.resolved)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: list + detail sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 items-start">
        
        {/* Left: Complaints Ledger */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <FileText size={14} className="text-gray-500 mr-2" />
              <h2 className="text-sm font-semibold text-gray-700">Complaint Ledger</h2>
            </div>
            <span className="text-xs text-gray-400">{complaints.length} total</span>
          </div>

          <div className="divide-y divide-gray-100">
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <HelpCircle className="mx-auto mb-2 text-gray-300" size={32} />
                <p className="text-xs">No complaints submitted yet.</p>
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelected(c)}
                  className={`p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-gray-50/50 cursor-pointer transition ${
                    selected?._id === c._id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-semibold">{c.category || "General"}</span>
                      {c.submittedByRole === "guardian" && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                          Filed by Guardian
                        </span>
                      )}
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

        {/* Right: Detail Sidebar Panel + Emergency Support */}
        <div className="space-y-5">
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm space-y-4">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Complaint Details</span>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              </div>
              
              <div className="px-5 pb-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Category</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{selected.category || "General"}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Filed By</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {selected.submittedByRole === "guardian" ? "Guardian" : "Student"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Title</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{selected.title}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Description</p>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-wrap">{selected.description}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Status</p>
                  <div className="mt-1">
                    <StatusPill status={selected.status} />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Submission Date</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{new Date(selected.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden xl:block bg-white border border-gray-200 rounded-2xl p-5 text-center text-gray-400">
              <MessageSquareWarning className="mx-auto mb-2 text-gray-300" size={32} />
              <p className="text-xs">Select a complaint ticket from the ledger to view details.</p>
            </div>
          )}

          {/* Emergency Contacts */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">Emergency Support</h3>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-1">For urgent hostel issues contact Warden:</p>
              <p className="text-base font-bold text-gray-950">+977 9863564357</p>
            </div>
          </div>
        </div>

      </div>

      {/* Raise Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Raise a Complaint</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-gray-150 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Complaint Type / Category</label>
                <select
                  {...register("category")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">Select type...</option>
                  {complaintTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Brief title of the issue"
                  {...register("title")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  {...register("description")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
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
                {createMutation.isPending ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}