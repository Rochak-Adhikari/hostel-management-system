import {
  Users,
  BedDouble,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "245",
    subtitle: "+12 this month",
    icon: Users,
  },
  {
    title: "Total Rooms",
    value: "120",
    subtitle: "",
    icon: BedDouble,
  },
  {
    title: "Occupied Rooms",
    value: "108",
    subtitle: "90%",
    icon: BedDouble,
  },
  {
    title: "Available Rooms",
    value: "12",
    subtitle: "",
    icon: BedDouble,
  },
  {
    title: "Monthly Revenue",
    value: "NPR 1.8M",
    dark: true,
    icon: CreditCard,
  },
  {
    title: "Pending Complaints",
    value: "8",
    danger: true,
    icon: AlertTriangle,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 bg-[#F9F9F9] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-semibold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back. Here's an overview of hostel operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`rounded-xl border p-5 ${
                item.dark
                  ? "bg-black text-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between mb-4">
                <Icon size={18} />
              </div>

              <p className="text-xs uppercase tracking-wider text-gray-500">
                {item.title}
              </p>

              <h2
                className={`text-2xl md:text-3xl font-semibold mt-2 ${
                  item.danger ? "text-red-600" : ""
                }`}
              >
                {item.value}
              </h2>

              {item.subtitle && (
                <p className="text-sm mt-1">
                  {item.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side */}
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Occupancy */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Occupancy Overview
            </h2>

            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div className="w-[90%] h-full bg-black"></div>
            </div>

            <p className="text-2xl md:text-4xl font-bold mb-4">
              90%
            </p>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: 60 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-10 rounded ${
                    index < 54
                      ? "bg-black"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-5">
              <h2 className="text-xl font-semibold">
                Recent Fee Payments
              </h2>

              <button className="text-sm font-semibold">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">
                      Student
                    </th>
                    <th className="text-left py-3">
                      Room
                    </th>
                    <th className="text-left py-3">
                      Date
                    </th>
                    <th className="text-right py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="py-4">
                      Rochak Sharma
                    </td>
                    <td>A-101</td>
                    <td>June 15, 2026</td>
                    <td className="text-right">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                        Paid
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4">
                      Aayush Karki
                    </td>
                    <td>B-205</td>
                    <td>June 14, 2026</td>
                    <td className="text-right">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                        Paid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          {/* Complaints */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Complaints
            </h2>

            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <p className="font-medium">
                  Water Supply Issue
                </p>
                <p className="text-sm text-gray-500">
                  Room A-102
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">
                  WiFi Problem
                </p>
                <p className="text-sm text-gray-500">
                  Room B-205
                </p>
              </div>
            </div>
          </div>

          {/* Notices */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Latest Notices
            </h2>

            <div className="space-y-4">
              <div>
                <p className="font-medium">
                  Visitor Timing Update
                </p>
                <p className="text-sm text-gray-500">
                  Posted today
                </p>
              </div>

              <div>
                <p className="font-medium">
                  Fee Submission Reminder
                </p>
                <p className="text-sm text-gray-500">
                  Posted yesterday
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button className="w-full bg-black text-white py-3 rounded-lg">
                Add Student
              </button>

              <button className="w-full bg-black text-white py-3 rounded-lg">
                Assign Room
              </button>

              <button className="w-full bg-black text-white py-3 rounded-lg">
                Create Notice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
