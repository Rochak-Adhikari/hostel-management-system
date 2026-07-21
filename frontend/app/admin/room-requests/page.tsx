"use client";

import { useState } from "react";
import { Search, Trash2, Eye, X, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRoomChangeRequests, updateRoomChangeRequest, deleteRoomChangeRequest } from "@/api/roomChangeRequestApi";

type RoomChangeRequest = {
  _id: string;
  student: {
    _id: string;
    full_name: string;
    email: string;
    phone?: string;
  } | null;
  currentRoom: {
    _id: string;
    RoomNumber: string;
    block: string;
    Floor: string;
  } | null;
  reason: string;
  preferredRoomType?: string;
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

export default function RoomRequestsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<RoomChangeRequest | null>(null);
  const [newStatus, setNewStatus] = useState<RoomChangeRequest["status"]>("Pending");
  const [adminNote, setAdminNote] = useState("");

  // Sabai room change requests fetch garne
  const { data: requestsRes, isPending, isError } = useQuery({
    queryKey: ["roomChangeRequests"],
    queryFn: getAllRoomChangeRequests,
  });
  const requests: RoomChangeRequest[] = requestsRes?.data ?? [];

  // Update mutation (admin le status/adminNote update garne)
  const updateMutation = useMutation({
    mutationFn: ({ id, status, adminNote }: { id: string; status: RoomChangeRequest["status"]; adminNote?: string }) =>
      updateRoomChangeRequest(id, { status, adminNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomChangeRequests"] });
      setSelected(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to update request");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRoomChangeRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomChangeRequests"] });
      setSelected(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to delete request");
    },
  });

  const filtered = requests.filter((r) => {
    const studentName = r.student?.full_name || "";
    const roomNumber = r.currentRoom?.RoomNumber || "";
    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function openDetail(r: RoomChangeRequest) {
    setSelected(r);
    setNewStatus(r.status);
    setAdminNote(r.adminNote || "");
  }

  function handleUpdate() {
    if (!selected) return;
    updateMutation.mutate({ id: selected._id, status: newStatus, adminNote });
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this request?")) {
      deleteMutation.mutate(id);
    }
  }

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading room change requests...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load room change requests. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Room Change Requests</h1>
        <p className="text-gray-500 mt-1">Review, approve, or reject student room change requests.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          ["TOTAL", String(requests.length)],
          ["PENDING", String(requests.filter((r) => r.status === "Pending").length)],
          ["APPROVED", String(requests.filter((r) => r.status === "Approved").length)],
          ["REJECTED", String(requests.filter((r) => r.status === "Rejected").length)],
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
                placeholder="Search by student, room, or reason..."
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
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <div
                key={r._id}
                onClick={() => openDetail(r)}
                className={`p-5 flex items-center justify-between gap-3 cursor-pointer transition ${selected?._id === r._id ? "bg-gray-50" : "hover:bg-gray-50"}`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Room {r.currentRoom?.RoomNumber || "N/A"} • {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <p className="font-semibold text-sm text-gray-900 truncate">{r.student?.full_name || "Unknown"}</p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{r.reason}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusPill status={r.status} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(r._id);
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
              <p className="py-10 text-center text-gray-400 text-sm">No room change requests found.</p>
            )}
          </div>
        </div>

        {/* Right: Detail + Response */}
        <div className="space-y-6">
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold">Request Details</h3>
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
                  <p className="text-xs text-gray-500">Current Room</p>
                  <p className="font-semibold text-gray-900">
                    {selected.currentRoom?.RoomNumber || "N/A"} — Block {selected.currentRoom?.block}, {selected.currentRoom?.Floor}
                  </p>
                </div>
                {selected.preferredRoomType && (
                  <div>
                    <p className="text-xs text-gray-500">Preferred Room Type</p>
                    <p className="font-semibold text-gray-900">{selected.preferredRoomType}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reason</p>
                  <p className="text-sm text-gray-700 border border-gray-200 rounded-lg p-3 bg-gray-50 whitespace-pre-wrap">
                    {selected.reason}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as RoomChangeRequest["status"])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Admin Note (optional)</label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note for the student..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                  />
                </div>

                {/* Inline reminder — approve gareko bhane manually room reassign garnu parne */}
                {newStatus === "Approved" && (
                  <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <Info size={14} className="text-gray-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500">
                      Approving this request does not automatically move the student. Please reassign their room manually via the <span className="font-semibold">Students → Assign Room</span> flow.
                    </p>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
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
              Select a request to view details and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
