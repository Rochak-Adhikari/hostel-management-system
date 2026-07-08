import {
  CreditCard,
  Wallet,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

const paymentHistory = [
  { receiptNo: "REC-1023", date: "12 Jun 2026", amount: 12000, method: "eSewa", status: "Paid", monthYear: "June 2026" },
  { receiptNo: "REC-1018", date: "12 May 2026", amount: 12000, method: "Khalti", status: "Paid", monthYear: "May 2026" },
  { receiptNo: "REC-1012", date: "12 Apr 2026", amount: 12000, method: "Bank Transfer", status: "Paid", monthYear: "April 2026" },
  { receiptNo: "REC-1007", date: "12 Mar 2026", amount: 12000, method: "Cash", status: "Paid", monthYear: "March 2026" },
];

const upcomingPayments = [
  { label: "July Hostel Fee", dueDate: "15 Jul 2026", amount: "Rs. 12,000", status: "Upcoming" },
  { label: "August Hostel Fee", dueDate: "15 Aug 2026", amount: "Rs. 12,000", status: "Upcoming" },
  { label: "September Hostel Fee", dueDate: "15 Sep 2026", amount: "Rs. 12,000", status: "Upcoming" },
];

const paymentMethods = ["eSewa", "Khalti", "Bank Transfer", "Cash Office"];

const feeBreakdown = [
  { label: "Hostel Fee", value: "Rs. 12,000" },
  { label: "Security Deposit", value: "Rs. 10,000" },
  { label: "Electricity", value: "Included" },
  { label: "Internet", value: "Included" },
  { label: "Maintenance", value: "Included" },
];

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-black text-white",
  Pending: "bg-gray-100 text-gray-600",
  Due: "bg-red-100 text-red-600",
};

export default function FeesPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Fee &amp; Payments</h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          View your hostel fee status, payment history, upcoming dues, and download receipts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Current Status", value: "PAID", sub: "No outstanding payments.", icon: CreditCard },
          { label: "Next Due Date", value: "15 Jul", sub: "2026 Payment Cycle", icon: CalendarDays },
          { label: "Outstanding Balance", value: "Rs. 0", sub: "Everything has been paid.", icon: Wallet },
          { label: "Total Paid", value: "Rs. 48,000", sub: "Current academic session.", icon: CircleDollarSign },
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

      {/* Payment Details + Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Details */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">Current Payment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10">
            {[
              ["Student Name", "Rochak Adhikari"],
              ["Room Number", "A-001"],
              ["Academic Session", "2026 / 2027"],
              ["Monthly Fee", "Rs. 12,000"],
              ["Security Deposit", "Rs. 10,000"],
              ["Discount", "Rs. 0"],
              ["Total Amount", "Rs. 22,000"],
              ["Amount Paid", "Rs. 22,000"],
              ["Remaining Balance", "Rs. 0"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-sm text-gray-500">{label}</p>
                <h3 className="font-semibold mt-1">{value}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8 flex flex-col justify-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">Payment Progress</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Completed</span>
              <span className="font-semibold">100%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div className="w-full h-full bg-black rounded-full" />
            </div>
            <p className="font-medium">All hostel fees have been paid.</p>
            <p className="text-sm text-gray-500">
              Your next payment is scheduled for{" "}
              <span className="font-medium text-black">15 July 2026.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Upcoming Payments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {upcomingPayments.map((p) => (
            <div key={p.label} className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-base sm:text-lg">{p.label}</h3>
              <div className="space-y-2 mt-4">
                {[
                  ["Due Date", p.dueDate],
                  ["Amount", p.amount],
                  ["Status", p.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Available Payment Methods</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {paymentMethods.map((m) => (
            <div key={m} className="border rounded-xl p-4 sm:p-6 text-center">
              <h3 className="font-semibold text-sm sm:text-base">{m}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Available</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {["Pay Hostel Fee", "Download Receipt", "View Payment History", "Contact Accounts Office"].map(
            (label, i) => (
              <button
                key={label}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition ${
                  i === 0
                    ? "bg-black text-white hover:bg-gray-900"
                    : "border border-black hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Payment Notification */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Payment Notification</h2>
        <p className="text-base font-medium">No pending dues.</p>
        <p className="text-gray-500 mt-2 text-sm">
          Your next hostel payment is scheduled for{" "}
          <span className="font-medium text-black">15 July 2026.</span>
        </p>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Payment History</h2>
            <p className="text-sm text-gray-500 mt-1">View all previous hostel fee payments.</p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2">
            <input
              type="text"
              placeholder="Search receipt..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option>All Months</option>
              {["March", "April", "May", "June", "July"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:-mx-8">
          <div className="px-5 sm:px-8">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Receipt No", "Month / Year", "Payment Date", "Amount", "Method", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 text-sm font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p) => (
                  <tr key={p.receiptNo} className="border-b border-gray-100">
                    <td className="py-4 text-sm font-medium">{p.receiptNo}</td>
                    <td className="py-4 text-sm text-gray-500">{p.monthYear}</td>
                    <td className="py-4 text-sm text-gray-500">{p.date}</td>
                    <td className="py-4 text-sm font-medium">Rs. {p.amount.toLocaleString()}</td>
                    <td className="py-4 text-sm text-gray-500">{p.method}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${STATUS_STYLES[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Receipts */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Recent Receipts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { label: "June 2026 Hostel Fee", receipt: "REC-1023" },
            { label: "Security Deposit Receipt", receipt: "REC-1001" },
          ].map((r) => (
            <div key={r.label} className="border rounded-xl p-4 sm:p-6 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-sm sm:text-base">{r.label}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Receipt No: {r.receipt}</p>
              </div>
              <button className="shrink-0 border border-black rounded-lg px-3 sm:px-4 py-2 text-sm hover:bg-gray-100 transition">
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Fee Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[300px]">
            <tbody>
              {feeBreakdown.map(({ label, value }) => (
                <tr key={label} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-sm">{label}</td>
                  <td className="py-3 text-right text-sm">{value}</td>
                </tr>
              ))}
              <tr>
                <td className="py-4 font-bold text-base">Total</td>
                <td className="py-4 text-right font-bold text-base">Rs. 22,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}