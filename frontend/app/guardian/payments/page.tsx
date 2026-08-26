"use client";

import { CreditCard, Calendar, DollarSign, FileText, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFeesByStudent } from "@/api/feeapi";
import { getStudentById } from "@/api/studentapi";

type Fee = {
  _id: string;
  student: string;
  month: string;
  amount: number;
  status: "Unpaid" | "Paid" | "Overdue";
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-black text-white border-black",
  Unpaid: "border-gray-400 text-gray-500",
  Overdue: "border-red-400 text-red-500 bg-red-50 font-bold",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${STATUS_STYLES[status] || "border-gray-300 text-gray-500"}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function GuardianPayments() {
  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Linked student record fetch garne
  const { data: childRes } = useQuery({
    queryKey: ["linkedStudent", currentUser?.linked_student],
    queryFn: () => getStudentById(currentUser.linked_student),
    enabled: !!currentUser?.linked_student,
  });
  const child = childRes?.data;

  // linked student ko fee records fetch garne
  const { data: feesRes, isPending } = useQuery({
    queryKey: ["childFees", currentUser?.linked_student],
    queryFn: () => getFeesByStudent(currentUser.linked_student),
    enabled: !!currentUser?.linked_student,
  });
  const fees: Fee[] = feesRes?.data ?? [];

  const childName = child?.full_name ?? "Linked Student";
  const unpaidFees = fees.filter((f) => f.status === "Unpaid" || f.status === "Overdue");
  const totalOutstanding = unpaidFees.reduce((sum, f) => sum + f.amount, 0);
  const latestFee = fees[0];

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to view fee records.</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading child's fee records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Child's Payments &amp; Fees</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor billing history and fee payment status for <span className="font-semibold text-gray-800">{childName}</span>.
          </p>
        </div>
      </div>

      {/* Outstanding dues notice */}
      {unpaidFees.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900">
          <AlertCircle size={20} className="shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold">Pending Dues Alert</p>
            <p className="text-xs mt-0.5 opacity-90">
              There is an outstanding fee balance of <span className="font-bold">Rs. {totalOutstanding.toLocaleString()}</span> for {childName}.
            </p>
          </div>
        </div>
      )}

      {/* Overview strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <CreditCard size={16} className="text-gray-900" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Current Status</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {latestFee ? latestFee.status.toUpperCase() : "NO FEES"}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-gray-900" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Next Due Date</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {latestFee?.dueDate ? new Date(latestFee.dueDate).toLocaleDateString("en-GB") : "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign size={16} className="text-gray-900" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Outstanding Dues</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">Rs. {totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Payment Ledger */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center">
            <FileText size={14} className="text-gray-500 mr-2" />
            <h2 className="text-sm font-semibold text-gray-700">Billing &amp; Payment Ledger</h2>
          </div>
          <span className="text-xs text-gray-400">{fees.length} total records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Billing Period</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Due Date</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Paid On</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Method</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((f) => (
                <tr key={f._id} className="hover:bg-gray-50/40">
                  <td className="px-5 py-4 text-xs font-semibold text-gray-800">{f.month}</td>
                  <td className="px-5 py-4 text-xs font-bold text-gray-900">Rs. {f.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {f.dueDate ? new Date(f.dueDate).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {f.paidDate ? new Date(f.paidDate).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{f.paymentMethod || "—"}</td>
                  <td className="px-5 py-4 text-xs">
                    <StatusPill status={f.status} />
                  </td>
                </tr>
              ))}
              {fees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-gray-400">
                    No fee records found for child.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
