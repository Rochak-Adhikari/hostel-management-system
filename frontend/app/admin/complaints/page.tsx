"use client";

import { useState } from "react";
import { Search, Trash2, Eye, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllComplaints, updateComplaint, deleteComplaint } from "@/api/complaintapi";

type Complaint = {
  _id: string;
  student: {
    _id: string;
    full_name: string;
    email: string;
    phone?: string;
  } | null;
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

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<Complaint["status"]>("Pending");

  // Real data fetching ko lagi TanStack Query
  const { data: complaintsRes, isPending, isError } = useQuery({
    queryKey: ["complaints"],
    queryFn: getAllComplaints,
  });
  const complaints: Complaint[] = complaintsRes?.data ?? [];

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Complaint["status"] }) =>
      updateComplaint(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      setSelected(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to update complaint status");
    },
  });

  // Delete complaint mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComplaint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      setSelected(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to delete complaint");
    },
  });

  const filtered = complaints.filter((c) => {
    const studentName = c.student?.full_name || "";
    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function openDetail(c: Complaint) {
    setSelected(c);
    setNewStatus(c.status);
  }

  function handleUpdate() {
    if (!selected) return;
    updateMutation.mutate({ id: selected._id, status: newStatus });
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this complaint?")) {
      deleteMutation.mutate(id);
    }
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Complaints</h1>
        <p className="text-gray-500 mt-1">View, respond to, and update all student complaints.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          ["TOTAL", String(complaints.length)],
          ["PENDING", String(complaints.filter((c) => c.status === "Pending").length)],
          ["IN PROGRESS", String(complaints.filter((c) => c.status === "In Progress").length)],
          ["RESOLVED", String(complaints.filter((c) => c.status === "Resolved").length)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: List */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student, title, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <div
                key={c._id}
                onClick={() => openDetail(c)}
                className={`p-5 flex items-center justify-between gap-3 cursor-pointer transition ${selected?._id === c._id ? "bg-gray-50" : "hover:bg-gray-50"}`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {c.category || "General"} • {new Date(c.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <p className="font-semibold text-sm text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-500">Student: <span className="font-medium text-gray-700">{c.student?.full_name || "Unknown"}</span></p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{c.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusPill status={c.status} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c._id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-gray-400 text-sm">No complaints found.</p>
            )}
          </div>
        </div>

        {/* Right: Detail + Response */}
        <div className="space-y-6">
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold">Complaint Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="font-semibold text-gray-900">{selected.student?.full_name || "Unknown"}</p>
                  <p className="text-xs text-gray-400">{selected.student?.email} • {selected.student?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-semibold text-gray-900">{selected.category || "General"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Title</p>
                  <p className="font-semibold text-gray-950">{selected.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700 border border-gray-200 rounded-lg p-3 bg-gray-50 whitespace-pre-wrap">
                    {selected.description}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Complaint["status"])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Status"}
                  </button>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="px-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
              Select a complaint to view details and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
