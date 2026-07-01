"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type Complaint = {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  status: "PENDING" | "IN PROGRESS" | "RESOLVED";
  adminResponse: string;
};

const initialComplaints: Complaint[] = [
  {
    id: "CMP-1045",
    type: "Plumbing",
    title: "Leaking Bathroom Tap",
    description: "The tap in room A-001 is leaking continuously despite being shut tightly.",
    date: "12 June 2026",
    status: "IN PROGRESS",
    adminResponse: "Technician has been assigned for inspection.",
  },
  {
    id: "CMP-1042",
    type: "Electricity",
    title: "Ceiling Fan Sparking",
    description: "The ceiling fan in my room is sparking near the junction box. It is a safety hazard.",
    date: "10 June 2026",
    status: "RESOLVED",
    adminResponse: "Fan has been replaced. Please verify.",
  },
  {
    id: "CMP-1039",
    type: "Maintenance",
    title: "Broken Bed Frame",
    description: "One side of the bed frame is completely broken. I cannot sleep properly.",
    date: "05 June 2026",
    status: "PENDING",
    adminResponse: "",
  },
];

const STATUS_STYLES: Record<string, string> = {
  "IN PROGRESS": "border-black text-black",
  PENDING: "border-gray-400 text-gray-500",
  RESOLVED: "bg-black text-white border-black",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

const complaintTypes = ["Plumbing", "Electricity", "Maintenance", "WiFi / Internet", "Furniture", "Cleanliness", "Other"];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selected, setSelected] = useState<Complaint | null>(complaints[0]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "", title: "", description: "" });

  function handleSubmit() {
    if (!form.title.trim() || !form.description.trim()) return;
    const newId = `CMP-${1046 + complaints.length}`;
    const newComplaint: Complaint = {
      id: newId,
      type: form.type || "Other",
      title: form.title,
      description: form.description,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
      status: "PENDING",
      adminResponse: "",
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    setSelected(newComplaint);
    setShowModal(false);
    setForm({ type: "", title: "", description: "" });
  }

  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "PENDING").length,
    inProgress: complaints.filter((c) => c.status === "IN PROGRESS").length,
    resolved: complaints.filter((c) => c.status === "RESOLVED").length,
  };

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
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-900 transition shrink-0"
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
          {/* Recent Complaints */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold">My Complaints</h3>
              <span className="text-xs text-gray-400">{complaints.length} total</span>
            </div>
            <div>
              {complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`p-4 sm:p-5 flex items-center justify-between border-b border-gray-200 cursor-pointer transition gap-3 ${
                    selected?.id === c.id ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-bold text-gray-500 uppercase truncate">
                      {c.id} • {c.type}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-black">{c.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">{c.date}</p>
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
            <section className="xl:hidden bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold">Complaint Details: {selected.id}</h3>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="text-sm font-medium">{selected.type}</p>
                </div>
                <p className="text-gray-700 text-sm">{selected.description}</p>
                {selected.adminResponse && (
                  <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-sm font-semibold mb-1">Admin Response</p>
                    <p className="text-sm text-gray-600 italic">{selected.adminResponse}</p>
                  </div>
                )}
                {!selected.adminResponse && (
                  <p className="text-sm text-gray-400 italic">Awaiting admin response.</p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Detail Panel — shows on xl only */}
          {selected && (
            <section className="hidden xl:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold">Complaint Details: {selected.id}</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="text-sm font-medium">{selected.type}</p>
                </div>
                <p className="text-gray-700 text-sm">{selected.description}</p>
                {selected.adminResponse ? (
                  <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-sm font-semibold mb-2">Admin Response</p>
                    <p className="text-sm text-gray-600 italic">{selected.adminResponse}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Awaiting admin response.</p>
                )}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">Quick Actions</h3>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              <button
                onClick={() => setShowModal(true)}
                className="w-full border border-black rounded-xl py-2 text-sm hover:bg-gray-50 transition"
              >
                Raise Complaint
              </button>
              <button className="w-full border border-black rounded-xl py-2 text-sm hover:bg-gray-50 transition">
                Contact Office
              </button>
            </div>
          </section>

          {/* Emergency */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">Emergency</h3>
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-sm text-gray-500 mb-2">For urgent issues contact:</p>
              <p className="text-lg font-bold">+977 9863564357</p>
            </div>
          </section>
        </div>
      </div>

      {/* Raise Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold">Raise a Complaint</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Complaint Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">Select type...</option>
                  {complaintTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Brief title of the issue"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}