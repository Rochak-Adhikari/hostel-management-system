"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Complaint = {
  id: string;
  studentName: string;
  room: string;
  description: string;
  submittedDate: string;
  resolvedDate: string;
  status: "Pending" | "In Progress" | "Resolved";
  adminResponse: string;
};

const initialComplaints: Complaint[] = [
  { id: "CMP-1045", studentName: "Rochak Adhikari", room: "A-101", description: "The tap in my bathroom is leaking continuously despite being shut tightly.", submittedDate: "12 Jun 2026", resolvedDate: "", status: "In Progress", adminResponse: "Technician has been assigned for inspection." },
  { id: "CMP-1042", studentName: "Nujhaw Tandukar", room: "B-205", description: "The ceiling fan in my room is sparking near the junction box.", submittedDate: "10 Jun 2026", resolvedDate: "13 Jun 2026", status: "Resolved", adminResponse: "Fan has been replaced. Please verify." },
  { id: "CMP-1039", studentName: "Shakti Sherpa", room: "A-103", description: "One side of my bed frame is broken. Cannot sleep properly.", submittedDate: "05 Jun 2026", resolvedDate: "", status: "Pending", adminResponse: "" },
  { id: "CMP-1036", studentName: "Lizan Gurung", room: "C-102", description: "WiFi signal is very weak in my room and disconnects frequently.", submittedDate: "01 Jun 2026", resolvedDate: "", status: "In Progress", adminResponse: "Network team is looking into it." },
  { id: "CMP-1030", studentName: "Sabin Shrestha", room: "C-201", description: "The bathroom door lock is broken and cannot be locked from inside.", submittedDate: "25 May 2026", resolvedDate: "28 May 2026", status: "Resolved", adminResponse: "Lock has been replaced." },
];

const STATUS_STYLES: Record<string, string> = {
  "In Progress": "border-black text-black",
  Pending: "border-gray-400 text-gray-500",
  Resolved: "bg-black text-white border-black",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState<Complaint["status"]>("Pending");

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function openDetail(c: Complaint) {
    setSelected(c);
    setResponseText(c.adminResponse);
    setNewStatus(c.status);
  }

  function handleUpdate() {
    if (!selected) return;
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
            ...c,
            status: newStatus,
            adminResponse: responseText,
            resolvedDate: newStatus === "Resolved" ? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : c.resolvedDate,
          }
          : c
      )
    );
    setSelected(null);
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
                placeholder="Search by student or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
          <div>
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => openDetail(c)}
                className={`p-5 border-b border-gray-100 cursor-pointer flex items-center justify-between gap-3 transition ${selected?.id === c.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {c.id} • {c.room}
                  </span>
                  <p className="font-semibold text-sm">{c.studentName}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                  <p className="text-xs text-gray-400">Submitted: {c.submittedDate}</p>
                </div>
                <StatusPill status={c.status} />
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
            <>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold">Complaint: {selected.id}</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Student</p>
                    <p className="font-semibold">{selected.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Room</p>
                    <p className="font-semibold">{selected.room}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 border border-gray-200 rounded-lg p-3 bg-gray-50">
                      {selected.description}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Complaint["status"])}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Admin Response</label>
                    <textarea
                      rows={3}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response here..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                    />
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
                  >
                    Save Response
                  </button>
                </div>
              </div>
            </>
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
