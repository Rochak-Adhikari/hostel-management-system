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

// ── Static Mock Data ─────────────────────────────────────────────────────────
const guardian = {
  name: "Bindu Adhikari",
  relationship: "Parent",
};

const child = {
  name: "Rochak Adhikari",
  id: "STU-2026-014",
  roomNumber: "A-001",
  roomType: "Quadruple Sharing",
  floor: "2nd Floor",
  admissionDate: "12 Jan 2025",
  hostelStatus: "In Hostel",
};

const paymentsSummary = {
  status: "PAID",
  month: "June 2026",
  nextDueDate: "15 Jul 2026",
  nextAmount: "Rs. 12,000",
};

const complaintsSummary = {
  total: 2,
  pending: 1,
  resolved: 1,
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
  return (
    <div className="space-y-5">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Guardian Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {guardian.name} ({guardian.relationship}) · Linked child: <span className="font-semibold text-gray-800">{child.name}</span>
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
          <p className="text-lg font-black text-gray-900">{child.hostelStatus}</p>
          <p className="text-xs text-gray-400 mt-0.5">Room {child.roomNumber}</p>
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
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">My Complaints</p>
            <p className="text-lg font-black text-gray-900">{complaintsSummary.total}</p>
            <p className="text-xs text-gray-400 mt-0.5">{complaintsSummary.pending} active</p>
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
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <Users size={14} className="text-gray-500 mr-2" />
          <h2 className="text-sm font-semibold text-gray-700">Linked Student Profile</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Student Name", child.name],
              ["Student ID", child.id],
              ["Admitted On", child.admissionDate],
              ["Current Room", child.roomNumber],
              ["Room Type", child.roomType],
              ["Floor Location", child.floor],
              ["Status", child.hostelStatus],
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
