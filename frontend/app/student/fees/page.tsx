import {
  CreditCard,
  Wallet,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

export default function FeesPage() {
  return (
    <div className="space-y-8">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-3xl font-bold text-black">Fee & Payments</h1>
        <p className="text-gray-500 mt-2">
          View your hostel fee status, payment history, upcoming dues, and
          download receipts.
        </p>
      </div>

      {/* ================= Summary Cards ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Status */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Current Status</span>

            <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold">PAID</h2>

          <p className="text-sm text-gray-500 mt-2">
            No outstanding payments.
          </p>
        </div>

        {/* Due Date */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Next Due Date</span>

            <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold">15 Jul</h2>

          <p className="text-sm text-gray-500 mt-2">
            2026 Payment Cycle
          </p>
        </div>

        {/* Balance */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">
              Outstanding Balance
            </span>

            <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold">Rs. 0</h2>

          <p className="text-sm text-gray-500 mt-2">
            Everything has been paid.
          </p>
        </div>

        {/* Total Paid */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Total Paid</span>

            <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center">
              <CircleDollarSign size={20} />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold">Rs. 1,20,000</h2>

          <p className="text-sm text-gray-500 mt-2">
            Current academic session.
          </p>
        </div>
      </div>

      {/* ================= Payment Details + Progress ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Payment Details */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-8">
            Current Payment Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <h3 className="font-semibold mt-1">Rochak</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Room Number</p>
              <h3 className="font-semibold mt-1">A-001</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Academic Session</p>
              <h3 className="font-semibold mt-1">2026 / 2027</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Monthly Fee</p>
              <h3 className="font-semibold mt-1">Rs. 12,000</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Security Deposit</p>
              <h3 className="font-semibold mt-1">Rs. 10,000</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Discount</p>
              <h3 className="font-semibold mt-1">Rs. 0</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <h3 className="font-semibold mt-1">Rs. 22,000</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <h3 className="font-semibold mt-1">Rs. 22,000</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Remaining Balance</p>
              <h3 className="font-semibold mt-1">Rs. 0</h3>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-8">
            Payment Progress
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="font-medium">Completed</span>
              <span className="font-semibold">100%</span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div className="w-full h-full bg-black rounded-full"></div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">
                All hostel fees have been paid.
              </p>

              <p className="text-sm text-gray-500">
                Your next payment is scheduled for
                <span className="font-medium text-black">
                  {" "}
                  15 July 2026.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

      {/* ================= Upcoming Payments ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold">Upcoming Payments</h2>
            <p className="text-gray-500 text-sm mt-1">
              Your upcoming hostel fee schedule.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg">July Hostel Fee</h3>

            <div className="space-y-3 mt-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">15 Jul 2026</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">Rs. 12,000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">Upcoming</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg">August Hostel Fee</h3>

            <div className="space-y-3 mt-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">15 Aug 2026</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">Rs. 12,000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">Upcoming</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg">September Hostel Fee</h3>

            <div className="space-y-3 mt-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">15 Sep 2026</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">Rs. 12,000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Payment Methods ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-8">
          Available Payment Methods
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="border rounded-xl p-6 text-center">
            <h3 className="font-semibold">eSewa</h3>
            <p className="text-sm text-gray-500 mt-2">Available</p>
          </div>

          <div className="border rounded-xl p-6 text-center">
            <h3 className="font-semibold">Khalti</h3>
            <p className="text-sm text-gray-500 mt-2">Available</p>
          </div>

          <div className="border rounded-xl p-6 text-center">
            <h3 className="font-semibold">Bank Transfer</h3>
            <p className="text-sm text-gray-500 mt-2">Available</p>
          </div>

          <div className="border rounded-xl p-6 text-center">
            <h3 className="font-semibold">Cash Office</h3>
            <p className="text-sm text-gray-500 mt-2">Available</p>
          </div>
        </div>
      </div>

      {/* ================= Payment Notification ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4">
          Payment Notification
        </h2>

        <p className="text-lg font-medium">
          No pending dues.
        </p>

        <p className="text-gray-500 mt-2">
          Your next hostel payment is scheduled for
          <span className="font-medium text-black">
            {" "}
            15 July 2026.
          </span>
        </p>
      </div>

      {/* ================= Quick Actions ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-8">
          Quick Actions
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <button className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition">
            Pay Hostel Fee
          </button>

          <button className="px-6 py-3 rounded-xl border border-black hover:bg-gray-50 transition">
            Download Receipt
          </button>

          <button className="px-6 py-3 rounded-xl border border-black hover:bg-gray-50 transition">
            View Payment History
          </button>

          <button className="px-6 py-3 rounded-xl border border-black hover:bg-gray-50 transition">
            Contact Accounts Office
          </button>
        </div>
      </div>

            {/* ================= Payment History ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-semibold">Payment History</h2>
            <p className="text-sm text-gray-500 mt-1">
              View all previous hostel fee payments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search receipt..."
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />

            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option>All Months</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
            </select>

            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option>All Methods</option>
              <option>eSewa</option>
              <option>Khalti</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 font-semibold">Receipt No</th>
                <th className="text-left py-4 font-semibold">Payment Date</th>
                <th className="text-left py-4 font-semibold">Amount</th>
                <th className="text-left py-4 font-semibold">Method</th>
                <th className="text-left py-4 font-semibold">Status</th>
                <th className="text-left py-4 font-semibold">Receipt</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-4">REC-1023</td>
                <td>12 Jun 2026</td>
                <td>Rs. 12,000</td>
                <td>eSewa</td>
                <td>Paid</td>
                <td>
                  <button className="underline font-medium">
                    Download
                  </button>
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-4">REC-1018</td>
                <td>12 May 2026</td>
                <td>Rs. 12,000</td>
                <td>Khalti</td>
                <td>Paid</td>
                <td>
                  <button className="underline font-medium">
                    Download
                  </button>
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-4">REC-1012</td>
                <td>12 Apr 2026</td>
                <td>Rs. 12,000</td>
                <td>Bank Transfer</td>
                <td>Paid</td>
                <td>
                  <button className="underline font-medium">
                    Download
                  </button>
                </td>
              </tr>

              <tr>
                <td className="py-4">REC-1007</td>
                <td>12 Mar 2026</td>
                <td>Rs. 12,000</td>
                <td>Cash</td>
                <td>Paid</td>
                <td>
                  <button className="underline font-medium">
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/*   xya Receipts Download garney part   */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-8">
          Recent Receipts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border rounded-xl p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                June 2026 Hostel Fee
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Receipt No: REC-1023
              </p>
            </div>

            <button className="border border-black rounded-lg px-4 py-2 hover:bg-gray-100">
              Download PDF
            </button>
          </div>

          <div className="border rounded-xl p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Security Deposit Receipt
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Receipt No: REC-1001
              </p>
            </div>

            <button className="border border-black rounded-lg px-4 py-2 hover:bg-gray-100">
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/*Fee Breakdown  wala part aba*/}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-8">
          Fee Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-4 font-medium">Hostel Fee</td>
                <td className="text-right">Rs. 12,000</td>
              </tr>

              <tr className="border-b">
                <td className="py-4 font-medium">Security Deposit</td>
                <td className="text-right">Rs. 10,000</td>
              </tr>

              <tr className="border-b">
                <td className="py-4 font-medium">Electricity</td>
                <td className="text-right">Included</td>
              </tr>

              <tr className="border-b">
                <td className="py-4 font-medium">Internet</td>
                <td className="text-right">Included</td>
              </tr>

              <tr className="border-b">
                <td className="py-4 font-medium">Maintenance</td>
                <td className="text-right">Included</td>
              </tr>

              <tr>
                <td className="py-4 font-bold text-lg">Total</td>
                <td className="text-right font-bold text-lg">
                  Rs. 22,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>