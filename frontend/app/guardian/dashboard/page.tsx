"use client";

import {
  Bed,
  CreditCard,
  MessageSquareWarning,
  Bell,
  Users,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "@/api/studentapi";
import { getAllocationByStudent } from "@/api/allocationapi";
import { getRoomById } from "@/api/roomapi";
import { getComplaintsByStudent } from "@/api/complaintapi";

// ── Static Mock Data ─────────────────────────────────────────────────────────
const paymentsSummary = {
  status: "PAID",
  month: "June 2026",
  nextDueDate: "15 Jul 2026",
  nextAmount: "Rs. 12,000",
};

const recentLogs = [
  { action: "Check-In",  timestamp: "Today, 6:45 PM", status: "Present" },
  { action: "Check-Out", timestamp: "Yesterday, 8:15 AM", status: "Absent" },
  { action: "Check-In",  timestamp: "28 Jun 2026, 7:12 PM", status: "Present" },
];

const notices = [
  { id: 1, title: "Visitor Timing Update", content: "Visitor hours revised — Morning 10:00 AM–12:00 PM, Evening 4:00 PM–7:00 PM.", date: "28 Jun 2026" },
  { id: 2, title: "Water Supply Interruption", content: "Water supply interrupted on 2 July 2026 from 9:00 AM–1:00 PM for maintenance.", date: "27 Jun 2026" },
];

export default function GuardianDashboard() {
  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Linked child fetch garne
  const { data: childData } = useQuery({
    queryKey: ["linkedStudent", currentUser?.linked_student],
    queryFn: () => getStudentById(currentUser.linked_student),
    enabled: !!currentUser?.linked_student,
  });
  const child = childData?.data;

  // Student ko allocation (room) fetch garne
  const { data: allocationData } = useQuery({
    queryKey: ["childAllocation", currentUser?.linked_student],
    queryFn: () => getAllocationByStudent(currentUser.linked_student),
    enabled: !!currentUser?.linked_student,
  });
  const allocation = allocationData?.data;

  // Allocation payepachi room details fetch garne
  const { data: roomData } = useQuery({
    queryKey: ["childRoom", allocation?.room],
    queryFn: () => getRoomById(allocation.room),
    enabled: !!allocation?.room,
  });
  const room = roomData?.data;

  // Student ko complaints fetch garne
  const { data: complaintsDataRes } = useQuery({
    queryKey: ["childComplaints", currentUser?.linked_student],
    queryFn: () => getComplaintsByStudent(currentUser.linked_student),
    enabled: !!currentUser?.linked_student,
  });
  const childComplaints = complaintsDataRes?.data ?? [];
  const complaintsTotal = childComplaints.length;
  const complaintsPending = childComplaints.filter((c: any) => c.status === "Pending").length;
  const complaintsInProgress = childComplaints.filter((c: any) => c.status === "In Progress").length;
  const complaintsActive = complaintsPending + complaintsInProgress;

  const childName = child?.full_name ?? "No linked student";
  const childId = child?._id ?? "-";
  const childAdmissionDate = child?.createdAt ? new Date(child.createdAt).toLocaleDateString("en-GB") : "-";
  const hostelStatus = allocation ? "In Hostel" : "Not Assigned";
  const roomNumberDisplay = room ? `${room.RoomNumber} (Block ${room.block}, Bed ${allocation?.bed?.toUpperCase()})` : "Unassigned";
  const roomTypeDisplay = room?.RoomType ?? "N/A";
  const floorDisplay = room?.Floor ?? "N/A";

  return (
    <div className="space-y-5">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Guardian Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {currentUser?.full_name || "Guardian"} · Linked child: <span className="font-semibold text-gray-800">{childName}</span>
          </p>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* ── 4 Monochrome Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Child status */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users size={15} className="text-gray-600" />
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Hostel Status</p>
          <p className="text-lg font-black text-gray-900">{hostelStatus}</p>
          <p className="text-xs text-gray-400 mt-0.5">{room ? `Room ${room.RoomNumber}` : "No room yet"}</p>
        </div>

        {/* Child Fee Status */}
        <Link href="/guardian/payments" className="group">
          <div className="bg-black border border-gray-900 rounded-2xl p-4 hover:bg-gray-900 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <CreditCard size={15} className="text-white/80" />
              </div>
              <ChevronRight size={13} className="text-white/30" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium mb-1">Payment Status</p>
            <p className="text-lg font-black text-white">{paymentsSummary.status}</p>
            <p className="text-xs text-white/50 mt-0.5">{paymentsSummary.month}</p>
          </div>
        </Link>

        {/* Guardian complaints */}
        <Link href="/guardian/complaints" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <MessageSquareWarning size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Child's Complaints</p>
            <p className="text-lg font-black text-gray-900">{complaintsTotal}</p>
            <p className="text-xs text-gray-400 mt-0.5">{complaintsActive} active</p>
          </div>
        </Link>

        {/* Last active log */}
        <Link href="/guardian/leaves" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Clock size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Last Activity</p>
            <p className="text-lg font-black text-gray-900">{recentLogs[0].action}</p>
            <p className="text-xs text-gray-400 mt-0.5">{recentLogs[0].timestamp}</p>
          </div>
        </Link>
      </div>

      {/* ── Linked Child Profile Card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <Users size={14} className="text-gray-500 mr-2" />
          <h2 className="text-sm font-semibold text-gray-700">Linked Student Profile</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Student Name", childName],
              ["Student ID", childId],
              ["Admitted On", childAdmissionDate],
              ["Current Room / Bed", roomNumberDisplay],
              ["Room Type", roomTypeDisplay],
              ["Floor Location", floorDisplay],
              ["Status", hostelStatus],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-0.5">{k}</p>
                <p className="text-sm font-semibold text-gray-900">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2 Col Detail Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Entry / Exit Activity Logs */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Recent Entry/Exit Logs</h2>
            </div>
            <Link href="/guardian/leaves" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
              View all logs ↗
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentLogs.map((log, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{log.timestamp}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  log.action === "Check-In"
                    ? "bg-gray-100 text-gray-800 border border-gray-200"
                    : "border border-gray-300 text-gray-400"
                }`}>
                  {log.action.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Notice Board Feed</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {notices.map((n) => (
              <div key={n.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                  <Bell size={12} className="text-gray-300 shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{n.content}</p>
                <p className="text-[10px] text-gray-400 mt-2">Posted: {n.date}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
