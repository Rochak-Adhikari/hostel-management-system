"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  CheckCircle,
  Calendar,
  DollarSign,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";

type Payment = {
  receiptNo: string;
  monthYear: string;
  amount: string;
  date: string;
  method: string;
  status: "Paid" | "Pending" | "Due";
};

const initialPayments: Payment[] = [
  { receiptNo: "REC-9941", monthYear: "June 2026", amount: "Rs. 12,000", date: "10 Jun 2026", method: "Online (Khalti)", status: "Paid" },
  { receiptNo: "REC-9905", monthYear: "May 2026", amount: "Rs. 12,000", date: "08 May 2026", method: "Online (eSewa)", status: "Paid" },
  { receiptNo: "REC-9812", monthYear: "Apr 2026", amount: "Rs. 12,000", date: "05 Apr 2026", method: "Cash", status: "Paid" },
];

export default function GuardianPayments() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [month, setMonth] = useState("July 2026");
  const [amount, setAmount] = useState("12000");
  const [method, setMethod] = useState("Online");

  function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();

    const newPayment: Payment = {
      receiptNo: "REC-" + Math.floor(1000 + Math.random() * 9000),
      monthYear: month,
      amount: `Rs. ${parseInt(amount).toLocaleString()}`,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      method: method,
      status: "Paid",
    };

    setPayments([newPayment, ...payments]);
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payments &amp; Fees</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor billing history and pay hostel fees for <span className="font-semibold text-gray-800">Rochak Adhikari</span>.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shrink-0"
        >
          <Plus size={14} />
          Pay Hostel Fee
        </button>
      </div>

      {/* Overview strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle size={16} className="text-gray-900" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Billing Status</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">June Fees Paid</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-gray-900" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Next Due Date</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">15 July 2026</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign size={16} className="text-gray-900" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Monthly Fee Rate</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">Rs. 12,000</p>
          </div>
        </div>
      </div>

      {/* Payment Ledger */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <FileText size={14} className="text-gray-500 mr-2" />
          <h2 className="text-sm font-semibold text-gray-700">Billing &amp; Payment Ledger</h2>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Receipt No</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Billing Period</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Paid On</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Method</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.receiptNo} className="hover:bg-gray-50/40">
                  <td className="px-5 py-4 text-xs font-mono font-bold text-gray-900">{p.receiptNo}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-gray-800">{p.monthYear}</td>
                  <td className="px-5 py-4 text-xs font-bold text-gray-900">{p.amount}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{p.date}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{p.method}</td>
                  <td className="px-5 py-4 text-xs">
                    <span className="inline-flex items-center bg-gray-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gray-900">
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Payment Form Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={15} className="text-gray-900" />
                <h3 className="text-sm font-semibold text-gray-700">Pay Hostel Fee</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddPayment} className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex gap-2">
                <AlertCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 leading-snug">
                  You are making a mock fee payment for <span className="font-semibold text-gray-700">Rochak Adhikari</span>.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Billing Period
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black"
                >
                  <option value="July 2026">July 2026</option>
                  <option value="August 2026">August 2026</option>
                  <option value="September 2026">September 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black"
                >
                  <option value="Online (Khalti)">Online (Khalti)</option>
                  <option value="Online (eSewa)">Online (eSewa)</option>
                  <option value="Cash">Cash / Manual</option>
                </select>
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
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
