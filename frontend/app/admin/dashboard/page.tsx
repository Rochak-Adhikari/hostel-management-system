"use client";

import {
  Users,
  BedDouble,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@/api/studentapi";
import { getAllRooms } from "@/api/roomapi";
import { getAllComplaints } from "@/api/complaintapi";

export default function DashboardPage() {
  // ── DATA FETCHING 
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: getAllStudents,
  });
  const students = studentsData?.data ?? [];

  const { data: roomsData } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });
  const rooms = roomsData?.data ?? [];

  const { data: complaintsData } = useQuery({
    queryKey: ["complaints"],
    queryFn: getAllComplaints,
  });
  const complaints = complaintsData?.data ?? [];
  const pendingComplaintsCount = complaints.filter((c: any) => c.status === "Pending").length;
  const recentComplaints = [...complaints].reverse().slice(0, 4);

  // ── DERIVED STATS (real data bata calculate garx) 
  const totalStudents = students.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r: any) => r.Occupied >= r.Capacity).length;
  const availableRooms = rooms.filter((r: any) => r.Occupied < r.Capacity).length;

  const totalCapacity = rooms.reduce((sum: number, r: any) => sum + r.Capacity, 0);
  const totalOccupied = rooms.reduce((sum: number, r: any) => sum + r.Occupied, 0);
  const occupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const stats = [
    {
      title: "Total Students",
      value: String(totalStudents),
      subtitle: "",
      icon: Users,
    },
    {
      title: "Total Rooms",
      value: String(totalRooms),
      subtitle: "",
      icon: BedDouble,
    },
    {
      title: "Occupied Rooms",
      value: String(occupiedRooms),
      subtitle: `${occupancyPct}%`,
      icon: BedDouble,
    },
    {
      title: "Available Rooms",
      value: String(availableRooms),
      subtitle: "",
      icon: BedDouble,
    },
    {
      // MOCK - Fee module banauna baki xa, so value is 0
      title: "Monthly Revenue",
      value: "NPR 0",
      dark: true,
      icon: CreditCard,
    },
    {
      title: "Pending Complaints",
      value: String(pendingComplaintsCount),
      danger: true,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#F9F9F9] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-semibold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back. Here&apos;s an overview of hostel operations.
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
          
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Occupancy Overview
            </h2>

            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-black" style={{ width: `${occupancyPct}%` }}></div>
            </div>

            <p className="text-2xl md:text-4xl font-bold mb-4">
              {occupancyPct}%
            </p>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {/* harek euta room lai euta block ko shape ma dekhaune, occupied vaye black */}
              {rooms.map((r: any) => (
                <div
                  key={r._id}
                  title={r.RoomNumber}
                  className={`h-10 rounded ${
                    r.Occupied >= r.Capacity ? "bg-black" : "bg-gray-200"
                  }`}
                />
              ))}
              {rooms.length === 0 && (
                <p className="col-span-full text-sm text-gray-400">No rooms added yet.</p>
              )}
            </div>
          </div>

          {/* Recent Fee Payments - MOCK, Fee module build garnu baki xa */}
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
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 text-sm">
                      No fee records yet — Fee module not built.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          {/* Complaints - REAL DATA */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Complaints
            </h2>

            <div className="space-y-4">
              {recentComplaints.map((c: any) => (
                <div key={c._id} className="border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">Student: {c.student?.full_name || "-"}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      c.status === "Resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : c.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentComplaints.length === 0 && (
                <p className="text-sm text-gray-400">No complaints yet.</p>
              )}
            </div>
          </div>

          {/* Notices - MOCK, Notice module build garnu baki xa */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Latest Notices
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-400">No notices yet — Notice module not built.</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="space-y-3">
              
              <Link href="/admin/students">
                <button className="w-full bg-black text-white py-3 rounded-lg">
                  Assign Room
                </button>
              </Link>

              <Link href="/admin/rooms">
                <button className="w-full bg-black text-white py-3 rounded-lg">
                  Manage Rooms
                </button>
              </Link>

              <button className="w-full bg-black text-white py-3 rounded-lg" disabled>
                Create Notice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}