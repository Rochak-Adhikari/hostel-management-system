"use client";

import { useState } from "react";
import { Plus, Search, Clock, X } from "lucide-react";

type Visitor = {
  id: string;
  visitorName: string;
  visitorPhone: string;
  visitPurpose: string;
  studentName: string;
  studentRoom: string;
  visitDate: string;
  entryTime: string;
  checkOutTime: string;
};

const initialVisitors: Visitor[] = [
  { id: "VIS-001", visitorName: "Ramesh Sharma", visitorPhone: "9841234567", visitPurpose: "Family Visit", studentName: "Rochak Sharma", studentRoom: "A-101", visitDate: "30 Jun 2026", entryTime: "4:10 PM", checkOutTime: "6:45 PM" },
  { id: "VIS-002", visitorName: "Sita Thapa", visitorPhone: "9852345678", visitPurpose: "Delivering Clothes", studentName: "Srijana Thapa", studentRoom: "C-102", visitDate: "28 Jun 2026", entryTime: "10:30 AM", checkOutTime: "11:15 AM" },
  { id: "VIS-003", visitorName: "Hari Prasad", visitorPhone: "9863456789", visitPurpose: "Family Visit", studentName: "Bikash Adhikari", studentRoom: "A-103", visitDate: "25 Jun 2026", entryTime: "4:00 PM", checkOutTime: "7:00 PM" },
  { id: "VIS-004", visitorName: "Sunita Karki", visitorPhone: "9874567890", visitPurpose: "Dropping Food", studentName: "Aayush Karki", studentRoom: "B-205", visitDate: "22 Jun 2026", entryTime: "11:00 AM", checkOutTime: "11:40 AM" },
  { id: "VIS-005", visitorName: "Deepak Shrestha", visitorPhone: "9885678901", visitPurpose: "Friend Visit", studentName: "Priya Shrestha", studentRoom: "C-201", visitDate: "20 Jun 2026", entryTime: "10:15 AM", checkOutTime: "" },
];

function StatusPill({ checkedOut }: { checkedOut: boolean }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${checkedOut ? "bg-black text-white border-black" : "border-black text-black"}`}>
      {checkedOut ? "CHECKED OUT" : "VISITING"}
    </span>
  );
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Visitor>>({});

  const filtered = visitors.filter(
    (v) =>
      v.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      v.studentName.toLowerCase().includes(search.toLowerCase()) ||
      v.studentRoom.toLowerCase().includes(search.toLowerCase())
  );

  function handleCheckout(id: string) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, checkOutTime: time } : v))
    );
  }

  function handleSave() {
    const newId = `VIS-${String(visitors.length + 1).padStart(3, "0")}`;
    setVisitors((prev) => [
      { ...(form as Visitor), id: newId, checkOutTime: "" },
      ...prev,
    ]);
    setModal(false);
    setForm({});
  }

  const formFields = [
    { key: "visitorName", label: "Visitor Name", placeholder: "Full name" },
    { key: "visitorPhone", label: "Visitor Phone", placeholder: "98XXXXXXXX" },
    { key: "visitPurpose", label: "Purpose of Visit", placeholder: "e.g. Family Visit" },
    { key: "studentName", label: "Student Being Visited", placeholder: "Student full name" },
    { key: "studentRoom", label: "Student Room", placeholder: "e.g. A-101" },
    { key: "visitDate", label: "Visit Date", placeholder: "DD Mon YYYY" },
    { key: "entryTime", label: "Entry Time", placeholder: "e.g. 4:00 PM" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Visitors</h1>
          <p className="text-gray-500 mt-1">Log and track all hostel visitor entries and departures.</p>
        </div>
        <button
          onClick={() => { setForm({}); setModal(true); }}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          Log Visitor
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL VISITS", String(visitors.length)],
          ["CHECKED OUT", String(visitors.filter((v) => v.checkOutTime).length)],
          ["STILL VISITING", String(visitors.filter((v) => !v.checkOutTime).length)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-5 border-b border-gray-200 flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by visitor, student or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {["ID", "Visitor Name", "Phone", "Purpose", "Student", "Room", "Date", "Entry", "Check-out", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4 text-xs font-medium text-gray-400">{v.id}</td>
                  <td className="py-4 px-4 text-sm font-semibold">{v.visitorName}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.visitorPhone}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.visitPurpose}</td>
                  <td className="py-4 px-4 text-sm font-medium">{v.studentName}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.studentRoom}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.visitDate}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.entryTime}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{v.checkOutTime || "—"}</td>
                  <td className="py-4 px-4">
                    <StatusPill checkedOut={!!v.checkOutTime} />
                  </td>
                  <td className="py-4 px-4">
                    {!v.checkOutTime && (
                      <button
                        onClick={() => handleCheckout(v.id)}
                        className="flex items-center gap-1 text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition"
                      >
                        <Clock size={12} />
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-gray-400 text-sm">No visitor records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">Log New Visitor</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={String((form as Record<string, unknown>)[field.key] ?? "")}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition">Log Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
