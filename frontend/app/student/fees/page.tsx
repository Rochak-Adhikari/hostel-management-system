"use client";

import { CreditCard, Wallet, CalendarDays, CircleDollarSign, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFeesByStudent } from "@/api/feeapi";
import { getAllocationByStudent } from "@/api/allocationapi";
import { getRoomById } from "@/api/roomapi";

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
  Paid: "bg-black text-white",
  Unpaid: "bg-gray-100 text-gray-700 border border-gray-300",
  Overdue: "bg-red-100 text-red-700 border border-red-300 font-bold",
};

export default function StudentFeesPage() {
  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Yo student ko sabai fee records fetch garne
  const { data: feesRes, isPending: isFeesLoading, isError: isFeesError } = useQuery({
    queryKey: ["myFees", currentUser?.id],
    queryFn: () => getFeesByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const fees: Fee[] = feesRes?.data ?? [];

  // Student ko room allocation fetch garne (monthly fee breakdown ko lagi)
  const { data: allocationRes } = useQuery({
    queryKey: ["myAllocation", currentUser?.id],
    queryFn: () => getAllocationByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const allocation = allocationRes?.data;

  // Room details fetch garne
  const { data: roomRes } = useQuery({
    queryKey: ["myRoom", allocation?.room],
    queryFn: () => getRoomById(allocation.room),
    enabled: !!allocation?.room,
  });
  const room = roomRes?.data;

  const totalPaid = fees.filter((f) => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0);
  const unpaidFees = fees.filter((f) => f.status === "Unpaid" || f.status === "Overdue");
  const totalOutstanding = unpaidFees.reduce((sum, f) => sum + f.amount, 0);
  const hasOverdue = fees.some((f) => f.status === "Overdue");

  const latestFee = fees[0];

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to view fee records.</p>
      </div>
    );
  }

  if (isFeesLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading your fee history...</p>
      </div>
    );
  }

  if (isFeesError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load fee records. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Fee &amp; Payments</h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Track your hostel billing status, payment history, and due dates.
        </p>
      </div>

      {/* Overdue / Unpaid Alert Banner */}
      {unpaidFees.length > 0 && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${hasOverdue ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <AlertCircle size={20} className="shrink-0" />
          <div>
            <p className="text-sm font-bold">
              {hasOverdue ? "Action Required: You have overdue hostel fee payments!" : "Payment Pending: You have pending hostel fee dues."}
            </p>
            <p className="text-xs mt-0.5 opacity-90">
              Total outstanding balance: <span className="font-bold">Rs. {totalOutstanding.toLocaleString()}</span>. Please clear your dues at the hostel office.
            </p>
          </div>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            label: "Current Status",
            value: latestFee ? latestFee.status.toUpperCase() : "NO FEES",
            sub: latestFee ? `Latest period: ${latestFee.month}` : "No billing history yet",
            icon: CreditCard,
          },
          {
            label: "Next Due Date",
            value: latestFee?.dueDate ? new Date(latestFee.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "N/A",
            sub: latestFee?.dueDate ? new Date(latestFee.dueDate).getFullYear().toString() : "No active dues",
            icon: CalendarDays,
          },
          {
            label: "Outstanding Balance",
            value: `Rs. ${totalOutstanding.toLocaleString()}`,
            sub: totalOutstanding > 0 ? "Pending payment" : "Everything cleared",
            icon: Wallet,
          },
          {
            label: "Total Paid",
            value: `Rs. ${totalPaid.toLocaleString()}`,
            sub: "Total payments settled",
            icon: CircleDollarSign,
          },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">{label}</span>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-gray-200 flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
            </div>
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold">{value}</h2>
            <p className="text-sm text-gray-500 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {/* Room Fee Details */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Current Room Fee Allocation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["Student Name", currentUser?.full_name || "—"],
            ["Allocated Room", room ? `Room ${room.RoomNumber} (Block ${room.block})` : "Unassigned"],
            ["Room Type", room?.RoomType || "—"],
            ["Monthly Room Fee", room ? `Rs. ${room.MonthlyFee?.toLocaleString()}` : "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 uppercase font-medium">{label}</p>
              <h3 className="font-semibold text-base text-gray-900 mt-1">{value}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Ledger */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Fee &amp; Payment History</h2>
            <p className="text-sm text-gray-500 mt-1">Full record of all your monthly hostel billings and receipts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {["Billing Month", "Amount", "Due Date", "Paid Date", "Payment Method", "Status"].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((f) => {
                const isWarning = f.status === "Unpaid" || f.status === "Overdue";

                return (
                  <tr key={f._id} className={`hover:bg-gray-50/50 transition ${isWarning ? "bg-red-50/20" : ""}`}>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">{f.month}</td>
                    <td className="py-4 px-4 text-sm font-bold text-gray-900">Rs. {f.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {f.dueDate ? new Date(f.dueDate).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {f.paidDate ? new Date(f.paidDate).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{f.paymentMethod || "—"}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[f.status] || "bg-gray-100 text-gray-600"}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {fees.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                    No fee records found.
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