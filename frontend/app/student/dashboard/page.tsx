"use client";

import {
  Bed,
  CreditCard,
  MessageSquareWarning,
  Bell,
  Users,
  CheckCircle,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllocationByStudent } from "@/api/allocationapi";
import { getRoomById } from "@/api/roomapi";
import { getComplaintsByStudent } from "@/api/complaintapi";
import { getAllNotices } from "@/api/noticeapi";
import { getFeesByStudent } from "@/api/feeapi";
import { getVisitorsByStudent } from "@/api/visitorapi";

const STATUS_PILL: Record<string, string> = {
  "Pending":     "border border-gray-300 text-gray-500",
  "In Progress": "border border-gray-900 text-gray-900",
  "Resolved":    "bg-gray-900 text-white",
};

export default function DashboardPage() {
  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Yo student ko allocation (room) fetch garne
  const { data: allocationData } = useQuery({
    queryKey: ["myAllocation", currentUser?.id],
    queryFn: () => getAllocationByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const allocation = allocationData?.data;

  // Allocation vaye pachi, tyo room ko full detail fetch garne
  const { data: roomData } = useQuery({
    queryKey: ["myRoom", allocation?.room],
    queryFn: () => getRoomById(allocation.room),
    enabled: !!allocation?.room,
  });
  const room = roomData?.data;

  // Real complaints fetching
  const { data: complaintsDataRes } = useQuery({
    queryKey: ["myComplaints", currentUser?.id],
    queryFn: () => getComplaintsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const myComplaints = complaintsDataRes?.data ?? [];
  const complaintsTotal = myComplaints.length;
  const complaintsPending = myComplaints.filter((c: any) => c.status === "Pending").length;
  const complaintsInProgress = myComplaints.filter((c: any) => c.status === "In Progress").length;
  const complaintsResolved = myComplaints.filter((c: any) => c.status === "Resolved").length;
  const recentComplaints = [...myComplaints].reverse().slice(0, 3);

  // Real fees fetching
  const { data: feesDataRes } = useQuery({
    queryKey: ["myFees", currentUser?.id],
    queryFn: () => getFeesByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const myFees: any[] = feesDataRes?.data ?? [];
  const latestFee = myFees[0];
  const unpaidFeesCount = myFees.filter((f: any) => f.status === "Unpaid" || f.status === "Overdue").length;

  // Real visitors fetching
  const { data: visitorsDataRes } = useQuery({
    queryKey: ["myVisitors", currentUser?.id],
    queryFn: () => getVisitorsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const myVisitors: any[] = visitorsDataRes?.data ?? [];
  const recentVisitorsList = [...myVisitors].slice(0, 2);

  // Real notices fetching
  const { data: noticesDataRes } = useQuery({
    queryKey: ["notices"],
    queryFn: getAllNotices,
  });
  const liveNotices: any[] = noticesDataRes?.data ?? [];

  const firstName = currentUser?.full_name?.split(" ")[0] ?? "Student";

  return (
    <div className="space-y-5">

      {/* ── Welcome ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here&apos;s what&apos;s going on in your hostel today.
          </p>
        </div>
        <span className="text-xs text-gray-400 font-mono shrink-0">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* ── 4 Quick Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Room - REAL DATA */}
        <Link href="/student/my-room" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Bed size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">My Room</p>
            <p className="text-xl font-black text-gray-900">
              {room ? `${room.RoomNumber} (Bed ${allocation?.bed?.toUpperCase()})` : "Unassigned"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {room ? `Block ${room.block} · ${room.RoomType}` : "No room yet"}
            </p>
          </div>
        </Link>

        {/* Fee Status - REAL DATA */}
        <Link href="/student/fees" className="group">
          <div className="bg-black border border-gray-900 rounded-2xl p-4 hover:bg-gray-900 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <CreditCard size={15} className="text-white/80" />
              </div>
              <ChevronRight size={13} className="text-white/30" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium mb-1">Fee Status</p>
            <p className="text-xl font-black text-white">{latestFee ? latestFee.status.toUpperCase() : "NO FEES"}</p>
            <p className="text-xs text-white/50 mt-0.5">{latestFee ? latestFee.month : "No billing yet"}</p>
          </div>
        </Link>

        {/* Complaints - REAL DATA */}
        <Link href="/student/complaints" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <MessageSquareWarning size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Complaints</p>
            <p className="text-xl font-black text-gray-900">{complaintsTotal}</p>
            <p className="text-xs text-gray-400 mt-0.5">{complaintsPending} pending</p>
          </div>
        </Link>

        {/* Visitors - REAL DATA */}
        <Link href="/student/visitor-log" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Users size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Visitors</p>
            <p className="text-xl font-black text-gray-900">{myVisitors.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total visitor logs</p>
          </div>
        </Link>
      </div>

      {/* ── Room + Fee Details ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room Detail - REAL DATA */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bed size={14} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Room Details</h2>
            </div>
            <Link href="/student/my-room" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
              View room ↗
            </Link>
          </div>
          {room ? (
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                ["Room Number",   room.RoomNumber],
                ["Block",         `Block ${room.block}`],
                ["Bed",           `Bed ${allocation?.bed?.toUpperCase()}`],
                ["Room Type",     room.RoomType],
                ["Floor",         room.Floor],
                ["Monthly Fee",   `Rs. ${room.MonthlyFee?.toLocaleString()}`],
                ["Allocated On",  allocation?.allocatedDate ? new Date(allocation.allocatedDate).toLocaleDateString() : "-"],
                ["Status",        room.Occupied >= room.Capacity ? "Occupied" : "Available"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5">
              <p className="text-sm text-gray-500">No room has been allocated to you yet.</p>
            </div>
          )}
        </div>

        {/* Fee Details - REAL DATA */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Fee &amp; Payments</h2>
            </div>
            <Link href="/student/fees" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
              View all ↗
            </Link>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Current Status</p>
                <p className="text-xl font-black text-white mt-0.5">{latestFee ? latestFee.status.toUpperCase() : "N/A"}</p>
                <p className="text-xs text-white/50 mt-0.5">{latestFee ? latestFee.month : "No billing period"}</p>
              </div>
              <CheckCircle size={28} className="text-white/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Next Due Date</p>
                <p className="text-sm font-bold text-gray-900">
                  {latestFee?.dueDate ? new Date(latestFee.dueDate).toLocaleDateString("en-GB") : "—"}
                </p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Fee Amount</p>
                <p className="text-sm font-bold text-gray-900">
                  {latestFee ? `Rs. ${latestFee.amount?.toLocaleString()}` : "—"}
                </p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-xl p-3 flex items-center gap-2">
              <Clock size={13} className="text-gray-400 shrink-0" />
              <p className="text-xs text-gray-500">
                Unpaid / Overdue Dues: <span className="font-semibold text-gray-900">{unpaidFeesCount} fee record(s)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Complaints + Visitors ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Complaints */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareWarning size={14} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">My Complaints</h2>
            </div>
            <Link href="/student/complaints" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
              View all ↗
            </Link>
          </div>

          <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
            {[
              ["Pending", complaintsPending],
              ["In Progress", complaintsInProgress],
              ["Resolved", complaintsResolved],
            ].map(([label, count]) => (
              <span key={String(label)} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_PILL[String(label)]}`}>
                {label} · {count}
              </span>
            ))}
          </div>

          <div className="divide-y divide-gray-100">
            {recentComplaints.map((c: any, i) => (
              <div key={c._id || i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_PILL[c.status]}`}>
                  {c.status}
                </span>
              </div>
            ))}
            {recentComplaints.length === 0 && (
              <p className="p-5 text-center text-xs text-gray-400">No complaints submitted yet.</p>
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-100">
            <Link href="/student/complaints">
              <button className="w-full bg-gray-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                Raise a Complaint
              </button>
            </Link>
          </div>
        </div>

        {/* Visitors - REAL DATA */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Recent Visitors</h2>
            </div>
            <Link href="/student/visitor-log" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
              View all ↗
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentVisitorsList.map((v: any) => (
              <div key={v._id} className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-gray-600">
                      {v.visitorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{v.visitorName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{v.purpose}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Phone: {v.visitorPhone}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Status</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">
                    {v.checkOutTime ? `Out: ${new Date(v.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Checked In"}
                  </p>
                </div>
              </div>
            ))}
            {recentVisitorsList.length === 0 && (
              <p className="p-5 text-center text-xs text-gray-400">No visitors logged yet.</p>
            )}
          </div>
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle size={12} />
              <span>Visitor hours: 10 AM–12 PM &amp; 4–7 PM daily.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notice Board - REAL DATA ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-700">Notice Board</h2>
            <span className="text-[10px] bg-gray-900 text-white font-bold px-2 py-0.5 rounded-full">{liveNotices.length}</span>
          </div>
          <Link href="/student/notices" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
            View all ↗
          </Link>
        </div>
        {liveNotices.length === 0 ? (
          <div className="p-5 text-center text-xs text-gray-400">No notices posted yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="divide-y divide-gray-100">
              {liveNotices.slice(0, 2).map((n) => (
                <div key={n._id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                    <Bell size={12} className="text-gray-300 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.content}</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Posted: {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
            <div className="divide-y divide-gray-100">
              {liveNotices.slice(2, 4).map((n) => (
                <div key={n._id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                    <Bell size={12} className="text-gray-300 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.content}</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Posted: {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}