"use client";

import { useState } from "react";
import { Plus, X, MessageSquareWarning } from "lucide-react";
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

  // React hook form setup matching pattern in Rooms CRUD
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
      alert("Complaint raised successfully.");
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">My Complaints</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Track, manage, and submit hostel-related complaints.
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
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT: Complaints list */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-700">My Complaints</h3>
              <span className="text-xs text-gray-400">{complaints.length} total</span>
            </div>
            <div className="divide-y divide-gray-100">
              {complaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelected(c)}
                  className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer transition gap-3 ${
                    selected?._id === c._id ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-bold text-gray-400 uppercase truncate">
                      {c.category || "General"} • {new Date(c.createdAt).toLocaleDateString("en-GB")}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{c.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                  </div>
                  <StatusPill status={c.status} />
                </div>
              ))}
              {complaints.length === 0 && (
                <p className="py-10 text-center text-gray-400 text-sm">No complaints submitted yet.</p>
              )}
            </div>
          </section>

          {/* Detail Panel — shows inline on mobile below list */}
          {selected && (
            <section className="xl:hidden bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-700">Complaint Details</h3>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type / Category</p>
                  <p className="text-sm font-semibold text-gray-900">{selected.category || "General"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Title</p>
                  <p className="text-sm font-semibold text-gray-900">{selected.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <StatusPill status={selected.status} />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Detail Panel — shows on xl only */}
          {selected && (
            <section className="hidden xl:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Complaint Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-650">
                  <X size={15} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type / Category</p>
                  <p className="text-sm font-semibold text-gray-900">{selected.category || "General"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Title</p>
                  <p className="text-sm font-semibold text-gray-900">{selected.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <StatusPill status={selected.status} />
                </div>
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-700">Quick Actions</h3>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              <button
                onClick={() => {
                  reset();
                  setShowModal(true);
                }}
                className="w-full border border-black rounded-xl py-2 text-sm hover:bg-gray-50 transition font-medium"
              >
                Raise Complaint
              </button>
            </div>
          </section>

          {/* Emergency */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-700">Emergency</h3>
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-sm text-gray-500 mb-2">For urgent issues contact Warden:</p>
              <p className="text-lg font-bold text-gray-950">+977 9863564357</p>
            </div>
          </section>
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
                  {complaintTypes.map((t) => <option key={t} value={t}>{t}</option>)}
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
                {createMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}