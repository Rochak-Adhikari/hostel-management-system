"use client";

import {
  Users,
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  UserRoundCheck,
  Bell,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReportSummary } from "@/api/reportapi";

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
  const { data: reportRes, isPending, isError } = useQuery({
    queryKey: ["reportSummary"],
    queryFn: getReportSummary,
  });

  const report = reportRes?.data;

  if (isPending) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Reports</h1>
          <p className="text-gray-500 mt-1">Loading real database analytics...</p>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Reports</h1>
          <p className="text-red-500 mt-1">Failed to load report data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const paymentHistory: Array<{ month: string; collected: number }> = report.paymentHistory ?? [];
  const maxRevenue = Math.max(...paymentHistory.map((p) => p.collected), 1);

  const roomBreakdown: Array<{ label: string; total: number; occupied: number }> = report.roomOccupancyBreakdown ?? [];
  const studentFeeStatus: Array<{ id: string; name: string; room: string; fee: string }> = report.studentFeeStatusList ?? [];

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
          { label: "Total Students", value: String(report.totalStudents ?? 0), icon: Users, dark: false },
          { label: "Total Rooms", value: String(report.totalRooms ?? 0), icon: BedDouble, dark: false },
          { label: "Occupied Rooms", value: String(report.occupiedRoomsCount ?? 0), icon: BedDouble, dark: true },
          { label: "Available Rooms", value: String(report.availableRoomsCount ?? 0), icon: BedDouble, dark: false },
          { label: "Total Revenue", value: `Rs. ${(report.totalRevenue ?? 0).toLocaleString()}`, icon: CreditCard, dark: false },
          { label: "Pending Complaints", value: String(report.complaints?.pending ?? 0), icon: MessageSquareWarning, dark: false },
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
        <SectionCard title="Monthly Fee Collection">
          {paymentHistory.length === 0 ? (
            <p className="text-xs text-gray-400">No payment history recorded yet.</p>
          ) : (
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
          )}
        </SectionCard>

        {/* Room Occupancy */}
        <SectionCard title="Room Occupancy Breakdown">
          {roomBreakdown.length === 0 ? (
            <p className="text-xs text-gray-400">No rooms added yet.</p>
          ) : (
            <div className="space-y-4">
              {roomBreakdown.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{r.label}</span>
                    <span className="text-xs text-gray-500">{r.occupied}/{r.total} beds occupied</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${r.total > 0 ? (r.occupied / r.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <TrendingUp size={12} />
                Overall occupancy: {report.overallOccupancyPercent ?? 0}%
              </p>
            </div>
          )}
        </SectionCard>

        {/* Student Fee Status */}
        <SectionCard title="Student Fee Status">
          {studentFeeStatus.length === 0 ? (
            <p className="text-xs text-gray-400">No student records found.</p>
          ) : (
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
                  {studentFeeStatus.map((s) => (
                    <tr key={s.id || s.name} className="border-b border-gray-100">
                      <td className="py-3 text-sm font-medium">{s.name}</td>
                      <td className="py-3 text-sm text-gray-500">{s.room}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          s.fee === "Paid" ? "bg-black text-white border-black" :
                          s.fee === "Overdue" || s.fee === "Unpaid" ? "border-red-400 text-red-500" :
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
          )}
        </SectionCard>

        {/* Complaint Summary */}
        <SectionCard title="Complaint Summary">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              ["Pending", String(report.complaints?.pending ?? 0), "border-gray-400 text-gray-600"],
              ["In Progress", String(report.complaints?.inProgress ?? 0), "border-black text-black"],
              ["Resolved", String(report.complaints?.resolved ?? 0), "bg-black text-white border-black"],
            ].map(([label, count, style]) => (
              <div key={label} className={`border rounded-xl p-4 text-center ${style}`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {report.complaints?.total ?? 0} total complaints recorded. {report.complaints?.resolutionRate ?? 0}% resolution rate.
          </p>
        </SectionCard>
      </div>

      {/* Visitor + Notice Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Visitor Log Summary">
          <div className="flex items-center gap-4">
            <UserRoundCheck size={32} className="text-gray-300" />
            <div>
              <p className="text-3xl font-bold">{report.visitors?.total ?? 0}</p>
              <p className="text-sm text-gray-500 mt-1">Total visitor entries logged in system.</p>
              <p className="text-xs text-gray-400 mt-1">
                {report.visitors?.checkedOut ?? 0} checked out • {report.visitors?.active ?? 0} currently visiting
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notice Board Summary">
          <div className="flex items-center gap-4">
            <Bell size={32} className="text-gray-300" />
            <div>
              <p className="text-3xl font-bold">{report.notices?.total ?? 0}</p>
              <p className="text-sm text-gray-500 mt-1">Active notices posted to all users.</p>
              <p className="text-xs text-gray-400 mt-1">Latest Notice: {report.notices?.latestDate ?? "N/A"}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
