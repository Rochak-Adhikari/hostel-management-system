"use client";

import { useState } from "react";
import {
  MessageSquareWarning,
  Plus,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

type Complaint = {
  id: string;
  category: "Child Behavior" | "Hostel Facilities" | "Billing/Payments" | "Other";
  title: string;
  description: string;
  submittedDate: string;
  status: "Pending" | "In Progress" | "Resolved";
  adminResponse: string;
};

const initialComplaints: Complaint[] = [
  {
    id: "CMP-G081",
    category: "Hostel Facilities",
    title: "Unstable water heating in B-wing bathrooms",
    description: "The solar water heater is barely warm in the mornings, which is causing inconveniences.",
    submittedDate: "12 Jun 2026",
    status: "In Progress",
    adminResponse: "We have scheduled a technician check for the solar heating system on Friday.",
  },
  {
    id: "CMP-G052",
    category: "Billing/Payments",
    title: "Double billing entry for March payment",
    description: "The payment for March was logged twice on the system. Please adjust the ledger balance.",
    submittedDate: "05 Apr 2026",
    status: "Resolved",
    adminResponse: "Ledger corrected. Duplicate entry has been archived and balance updated.",
  },
];

export default function GuardianComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form State
  const [category, setCategory] = useState<Complaint["category"]>("Hostel Facilities");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAddComplaint(e: React.FormEvent) {
    e.preventDefault();

    const newComplaint: Complaint = {
      id: "CMP-G" + Math.floor(100 + Math.random() * 900),
      category: category as Complaint["category"],
      title: title,
      description: description,
      submittedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Pending",
      adminResponse: "",
    };

    setComplaints([newComplaint, ...complaints]);
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Complaints &amp; Feedback</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            File complaints or submit suggestions regarding both your child and the hostel facilities.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shrink-0"
        >
          <Plus size={14} />
          File a Complaint
        </button>
      </div>

      {/* Main Grid: list + detail sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 items-start">
        
        {/* Left: Complaints Ledger */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <FileText size={14} className="text-gray-500 mr-2" />
            <h2 className="text-sm font-semibold text-gray-700">Guardian Complaints Ledger</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <HelpCircle className="mx-auto mb-2 text-gray-300" size={32} />
                <p className="text-xs">No complaints filed yet.</p>
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-gray-50/50 cursor-pointer transition ${
                    selectedComplaint?.id === c.id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 font-bold">{c.id}</span>
                      <span className="text-xs font-medium text-gray-400">·</span>
                      <span className="text-xs text-gray-500 font-semibold">{c.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate">{c.title}</h3>
                    <p className="text-xs text-gray-400">Submitted: {c.submittedDate}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      c.status === "Resolved"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 text-gray-500"
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
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
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Ticket ID</p>
                <p className="text-xs font-mono font-bold text-gray-800 mt-0.5">{selectedComplaint.id}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Category</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedComplaint.category}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Title</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedComplaint.title}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Description</p>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">{selectedComplaint.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Admin Response</p>
                {selectedComplaint.adminResponse ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-1.5">
                    <p className="text-xs text-gray-700 leading-relaxed">{selectedComplaint.adminResponse}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic mt-1.5">Awaiting administrative response...</p>
                )}
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

      {/* ── Modal: Raise Complaint Form ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareWarning size={15} className="text-gray-900" />
                <h3 className="text-sm font-semibold text-gray-700">File a New Complaint</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddComplaint} className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex gap-2">
                <AlertCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 leading-snug">
                  Your ticket will be dispatched to the hostel warden/admin dashboard for review and reply.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Complaint["category"])}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black"
                >
                  <option value="Hostel Facilities">Hostel Facilities &amp; Amenities</option>
                  <option value="Child Behavior">Child Accommodation / Behavior</option>
                  <option value="Billing/Payments">Billing &amp; Fee Payments</option>
                  <option value="Other">Other Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Summary / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Detailed Explanation
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain the situation in details..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white text-xs font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
