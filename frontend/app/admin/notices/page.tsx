"use client";

import { useState } from "react";
import { Plus, Trash2, X, Bell } from "lucide-react";

type Notice = {
  id: string;
  noticeId: string;
  title: string;
  content: string;
  postedDate: string;
  postedBy: string;
};

const initialNotices: Notice[] = [
  { id: "NOT-001", noticeId: "NOT-001", title: "Visitor Timing Update", content: "Visitor hours have been revised. Morning: 10:00 AM – 12:00 PM. Evening: 4:00 PM – 7:00 PM. All visitors must register at the front desk.", postedDate: "28 Jun 2026", postedBy: "Admin" },
  { id: "NOT-002", noticeId: "NOT-002", title: "Water Supply Interruption", content: "Water supply will be interrupted on 2 July 2026 from 9:00 AM to 1:00 PM due to maintenance work in the main pipeline.", postedDate: "27 Jun 2026", postedBy: "Admin" },
  { id: "NOT-003", noticeId: "NOT-003", title: "Fee Payment Deadline", content: "All students must clear their hostel fee dues before 15 July 2026. Late payments will attract a penalty of Rs. 500 per week.", postedDate: "25 Jun 2026", postedBy: "Admin" },
  { id: "NOT-004", noticeId: "NOT-004", title: "Hostel Inspection Notice", content: "A general room inspection will be conducted on 5 July 2026. Please ensure rooms are clean, tidy, and personal belongings are organised.", postedDate: "22 Jun 2026", postedBy: "Admin" },
  { id: "NOT-005", noticeId: "NOT-005", title: "Mess Menu Change", content: "The mess menu has been updated effective 1 July 2026. A printed copy is available at the hostel notice board near the main entrance.", postedDate: "20 Jun 2026", postedBy: "Admin" },
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  function handleDelete(id: string) {
    if (confirm("Delete this notice?")) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    }
  }

  function handlePost() {
    if (!form.title.trim() || !form.content.trim()) return;
    const newId = `NOT-${String(notices.length + 1).padStart(3, "0")}`;
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    setNotices((prev) => [
      { id: newId, noticeId: newId, title: form.title, content: form.content, postedDate: today, postedBy: "Admin" },
      ...prev,
    ]);
    setModal(false);
    setForm({ title: "", content: "" });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Notices</h1>
          <p className="text-gray-500 mt-1">Post and manage official hostel notices for all students.</p>
        </div>
        <button
          onClick={() => { setForm({ title: "", content: "" }); setModal(true); }}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          Post Notice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ["TOTAL NOTICES", String(notices.length)],
          ["POSTED THIS MONTH", String(notices.filter((n) => n.postedDate.includes("Jun 2026") || n.postedDate.includes("Jul 2026")).length)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Notice Board */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold">All Notices</h2>
          <span className="text-xs text-gray-400">{notices.length} total</span>
        </div>

        <div className="divide-y divide-gray-100">
          {notices.map((n) => (
            <div key={n.id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell size={15} className="text-[#CB30E0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{n.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>Posted: {n.postedDate}</span>
                    <span>•</span>
                    <span>By: {n.postedBy}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(n.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition shrink-0"
                title="Delete notice"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {notices.length === 0 && (
            <p className="py-10 text-center text-gray-400 text-sm">No notices posted yet.</p>
          )}
        </div>
      </div>

      {/* Post Notice Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">Post New Notice</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fee Payment Reminder"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Content</label>
                <textarea
                  rows={5}
                  placeholder="Write the full notice content here..."
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handlePost} className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition">Post Notice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
