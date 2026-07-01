"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";

type Payment = {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  room: string;
  amount: number;
  paymentDate: string;
  monthYear: string;
  paymentMethod: string;
  status: "Paid" | "Pending" | "Due";
};

const initialPayments: Payment[] = [
  { id: "PAY-001", receiptNo: "REC-1023", studentId: "STU-001", studentName: "Rochak Adhikari", room: "A-101", amount: 12000, paymentDate: "12 Jun 2026", monthYear: "June 2026", paymentMethod: "eSewa", status: "Paid" },
  { id: "PAY-002", receiptNo: "REC-1022", studentId: "STU-002", studentName: "Nujhaw Tandukar", room: "B-205", amount: 9000, paymentDate: "10 Jun 2026", monthYear: "June 2026", paymentMethod: "Khalti", status: "Paid" },
  { id: "PAY-003", receiptNo: "REC-1021", studentId: "STU-003", studentName: "Srijana Thapa", room: "C-102", amount: 9000, paymentDate: "", monthYear: "June 2026", paymentMethod: "", status: "Pending" },
  { id: "PAY-004", receiptNo: "REC-1020", studentId: "STU-004", studentName: "Bikash Adhikari", room: "A-103", amount: 7000, paymentDate: "08 Jun 2026", monthYear: "June 2026", paymentMethod: "Cash", status: "Paid" },
  { id: "PAY-005", receiptNo: "REC-1019", studentId: "STU-005", studentName: "Priya Shrestha", room: "C-201", amount: 7000, paymentDate: "", monthYear: "June 2026", paymentMethod: "", status: "Due" },
  { id: "PAY-006", receiptNo: "REC-1018", studentId: "STU-001", studentName: "Rochak Adhikari", room: "A-101", amount: 12000, paymentDate: "12 May 2026", monthYear: "May 2026", paymentMethod: "Bank Transfer", status: "Paid" },
];

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-black text-white border-black",
  Pending: "border-gray-400 text-gray-500",
  Due: "border-red-400 text-red-500",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

type ModalMode = "add" | null;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState<ModalMode>(null);
  const [form, setForm] = useState<Partial<Payment>>({});

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status === "Pending" || p.status === "Due").length;

  function handleSave() {
    const newId = `PAY-${String(payments.length + 1).padStart(3, "0")}`;
    const newReceipt = `REC-${1023 + payments.length + 1}`;
    setPayments((prev) => [
      {
        ...(form as Payment),
        id: newId,
        receiptNo: newReceipt,
        amount: Number(form.amount),
        status: "Paid",
      },
      ...prev,
    ]);
    setModal(null);
    setForm({});
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Payments</h1>
          <p className="text-gray-500 mt-1">Record and track all hostel fee payments.</p>
        </div>
        <button
          onClick={() => { setForm({}); setModal("add"); }}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          Record Payment
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL PAYMENTS", String(payments.length)],
          ["TOTAL REVENUE", `Rs. ${totalRevenue.toLocaleString()}`],
          ["PENDING / DUE", String(pendingCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student or receipt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Due</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {["Receipt No", "Student", "Room", "Month / Year", "Amount", "Method", "Payment Date", "Status"].map((h) => (
                  <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-5 text-sm font-medium">{p.receiptNo}</td>
                  <td className="py-4 px-5 text-sm font-semibold">{p.studentName}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{p.room}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{p.monthYear}</td>
                  <td className="py-4 px-5 text-sm font-medium">Rs. {p.amount.toLocaleString()}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{p.paymentMethod || "—"}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{p.paymentDate || "—"}</td>
                  <td className="py-4 px-5">
                    <StatusPill status={p.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal === "add" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">Record New Payment</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { key: "studentName", label: "Student Name", placeholder: "Full name" },
                { key: "studentId", label: "Student ID", placeholder: "STU-XXX" },
                { key: "room", label: "Room", placeholder: "e.g. A-101" },
                { key: "amount", label: "Amount (Rs.)", placeholder: "e.g. 12000" },
                { key: "monthYear", label: "Month & Year", placeholder: "e.g. July 2026" },
                { key: "paymentMethod", label: "Payment Method", placeholder: "Cash / eSewa / Khalti" },
                { key: "paymentDate", label: "Payment Date", placeholder: "DD Mon YYYY" },
              ].map((field) => (
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
              <button onClick={() => setModal(null)} className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition">Record Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
