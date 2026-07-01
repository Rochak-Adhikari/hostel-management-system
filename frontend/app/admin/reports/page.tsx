import {
  Users,
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  UserRoundCheck,
  Bell,
  TrendingUp,
} from "lucide-react";

const studentData = [
  { name: "Rochak Sharma", room: "A-101", fee: "Paid", complaints: 1 },
  { name: "Aayush Karki", room: "B-205", fee: "Paid", complaints: 0 },
  { name: "Srijana Thapa", room: "C-102", fee: "Pending", complaints: 1 },
  { name: "Bikash Adhikari", room: "A-103", fee: "Paid", complaints: 1 },
  { name: "Priya Shrestha", room: "C-201", fee: "Due", complaints: 0 },
];

const paymentHistory = [
  { month: "January", collected: 49000 },
  { month: "February", collected: 49000 },
  { month: "March", collected: 49000 },
  { month: "April", collected: 49000 },
  { month: "May", collected: 49000 },
  { month: "June", collected: 30000 },
];

const maxRevenue = Math.max(...paymentHistory.map((p) => p.collected));

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Reports</h1>
        <p className="text-gray-500 mt-1">
          Overview of hostel operations — students, rooms, payments, complaints, and visitors.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: "5", icon: Users, dark: false },
          { label: "Total Rooms", value: "8", icon: BedDouble, dark: false },
          { label: "Occupied Rooms", value: "6", icon: BedDouble, dark: true },
          { label: "Available Rooms", value: "2", icon: BedDouble, dark: false },
          { label: "Total Revenue (Jun)", value: "Rs. 30,000", icon: CreditCard, dark: false },
          { label: "Pending Complaints", value: "2", icon: MessageSquareWarning, dark: false },
        ].map(({ label, value, icon: Icon, dark }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 ${dark ? "bg-black text-white border-black" : "bg-white border-gray-200"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <Icon size={18} />
            </div>
            <p className={`text-xs uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Fee Collection Bar Chart */}
        <SectionCard title="Monthly Fee Collection (2026)">
          <div className="space-y-3">
            {paymentHistory.map((p) => (
              <div key={p.month} className="flex items-center gap-3">
                <span className="w-20 text-xs text-gray-500 shrink-0">{p.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all"
                    style={{ width: `${(p.collected / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-24 text-right">
                  Rs. {p.collected.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Room Occupancy */}
        <SectionCard title="Room Occupancy Breakdown">
          <div className="space-y-4">
            {[
              { label: "Single Rooms", total: 3, occupied: 2 },
              { label: "Double Rooms", total: 3, occupied: 3 },
              { label: "Triple Rooms", total: 2, occupied: 2 },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-xs text-gray-500">{r.occupied}/{r.total} occupied</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${(r.occupied / r.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              <TrendingUp size={12} />
              Overall occupancy: 87.5%
            </p>
          </div>
        </SectionCard>

        {/* Student Fee Status */}
        <SectionCard title="Student Fee Status">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase">Student</th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase">Room</th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase">Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((s) => (
                  <tr key={s.name} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium">{s.name}</td>
                    <td className="py-3 text-sm text-gray-500">{s.room}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        s.fee === "Paid" ? "bg-black text-white border-black" :
                        s.fee === "Due" ? "border-red-400 text-red-500" :
                        "border-gray-400 text-gray-500"
                      }`}>
                        {s.fee}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Complaint Summary */}
        <SectionCard title="Complaint Summary">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              ["Pending", "1", "border-gray-400 text-gray-600"],
              ["In Progress", "1", "border-black text-black"],
              ["Resolved", "3", "bg-black text-white border-black"],
            ].map(([label, count, style]) => (
              <div key={label} className={`border rounded-xl p-4 text-center ${style}`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            5 total complaints recorded. 60% resolution rate.
          </p>
        </SectionCard>
      </div>

      {/* Visitor + Notice Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Visitor Log Summary">
          <div className="flex items-center gap-4">
            <UserRoundCheck size={32} className="text-gray-300" />
            <div>
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-gray-500 mt-1">Total visitor entries logged this month.</p>
              <p className="text-xs text-gray-400 mt-1">4 checked out • 1 still visiting</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notice Board Summary">
          <div className="flex items-center gap-4">
            <Bell size={32} className="text-gray-300" />
            <div>
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-gray-500 mt-1">Active notices posted to all students.</p>
              <p className="text-xs text-gray-400 mt-1">Latest: Visitor Timing Update (28 Jun 2026)</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
