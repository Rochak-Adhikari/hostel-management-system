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

// ── Static data (replace with real API calls) ─────────────────────────────────
const student = {
  name: "Rochak",
  fullName: "Rochak Adhikari",
  id: "STU-2026-014",
};

const roomData = {
  number: "A-001",
  type: "Quadruple Sharing",
  floor: "2nd Floor",
  monthlyFee: "Rs. 12,000",
  allocationDate: "12 Jan 2026",
};

const feeData = {
  status: "PAID" as const,
  month: "June 2026",
  nextDueDate: "15 Jul 2026",
  nextAmount: "Rs. 12,000",
};

const complaintsData = {
  total: 3,
  pending: 1,
  inProgress: 1,
  resolved: 1,
};

const recentComplaints = [
  { title: "Leaking bathroom tap",    date: "12 Jun 2026", status: "In Progress" },
  { title: "Ceiling fan sparking",    date: "10 Jun 2026", status: "Resolved" },
  { title: "Broken bed frame",        date: "05 Jun 2026", status: "Pending" },
];

const recentVisitors = [
  { name: "Ramesh Sharma",  purpose: "Family Visit",       date: "30 Jun 2026", checkOut: "6:45 PM" },
  { name: "Sita Thapa",     purpose: "Delivering Clothes", date: "28 Jun 2026", checkOut: "4:30 PM" },
];

const notices = [
  { id: 1, title: "Visitor Timing Update",     content: "Visitor hours revised — Morning 10:00 AM–12:00 PM, Evening 4:00 PM–7:00 PM.", date: "28 Jun 2026" },
  { id: 2, title: "Water Supply Interruption", content: "Water supply interrupted on 2 July 2026 from 9:00 AM–1:00 PM for maintenance.", date: "27 Jun 2026" },
  { id: 3, title: "Fee Payment Deadline",      content: "All students must clear hostel fee dues before 15 July 2026.", date: "25 Jun 2026" },
  { id: 4, title: "Hostel Inspection Notice",  content: "General room inspection on 5 July 2026. Please keep rooms clean and tidy.", date: "22 Jun 2026" },
];

const STATUS_PILL: Record<string, string> = {
  "Pending":     "border border-gray-300 text-gray-500",
  "In Progress": "border border-gray-900 text-gray-900",
  "Resolved":    "bg-gray-900 text-white",
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="space-y-5">

      {/* ── Welcome ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome back, {student.name} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {student.id} · Here&apos;s what&apos;s going on in your hostel today.
          </p>
        </div>
        <span className="text-xs text-gray-400 font-mono shrink-0">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* ── 4 Quick Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Room */}
        <Link href="/student/my-room" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Bed size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">My Room</p>
            <p className="text-xl font-black text-gray-900">{roomData.number}</p>
            <p className="text-xs text-gray-400 mt-0.5">{roomData.type}</p>
          </div>
        </Link>

        {/* Fee Status */}
        <Link href="/student/fees" className="group">
          <div className="bg-black border border-gray-900 rounded-2xl p-4 hover:bg-gray-900 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <CreditCard size={15} className="text-white/80" />
              </div>
              <ChevronRight size={13} className="text-white/30" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium mb-1">Fee Status</p>
            <p className="text-xl font-black text-white">{feeData.status}</p>
            <p className="text-xs text-white/50 mt-0.5">{feeData.month}</p>
          </div>
        </Link>

        {/* Complaints */}
        <Link href="/student/complaints" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <MessageSquareWarning size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Complaints</p>
            <p className="text-xl font-black text-gray-900">{complaintsData.total}</p>
            <p className="text-xs text-gray-400 mt-0.5">{complaintsData.pending} pending</p>
          </div>
        </Link>

        {/* Visitors */}
        <Link href="/student/visitor-log" className="group">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 transition-colors h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Users size={15} className="text-gray-600" />
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Visitors</p>
            <p className="text-xl font-black text-gray-900">2</p>
            <p className="text-xs text-gray-400 mt-0.5">This month</p>
          </div>
        </Link>
      </div>

      {/* ── Room + Fee Details ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room Detail */}
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
          <div className="p-5 grid grid-cols-2 gap-4">
            {[
              ["Room Number",    roomData.number],
              ["Room Type",      roomData.type],
              ["Floor",         roomData.floor],
              ["Monthly Fee",   roomData.monthlyFee],
              ["Allocated On",  roomData.allocationDate],
              ["Status",        "Occupied"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Details */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Fee & Payments</h2>
            </div>
            <Link href="/student/fees" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
              View all ↗
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {/* Status strip */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Current Status</p>
                <p className="text-xl font-black text-white mt-0.5">{feeData.status}</p>
                <p className="text-xs text-white/50 mt-0.5">{feeData.month}</p>
              </div>
              <CheckCircle size={28} className="text-white/20" />
            </div>
            {/* Next due */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Next Due</p>
                <p className="text-sm font-bold text-gray-900">{feeData.nextDueDate}</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Amount</p>
                <p className="text-sm font-bold text-gray-900">{feeData.nextAmount}</p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-xl p-3 flex items-center gap-2">
              <Clock size={13} className="text-gray-400 shrink-0" />
              <p className="text-xs text-gray-500">
                Outstanding Balance: <span className="font-semibold text-gray-900">Rs. 0</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Complaints + Visitors ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Complaints */}
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

          {/* Summary pills */}
          <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
            {[
              ["Pending", complaintsData.pending],
              ["In Progress", complaintsData.inProgress],
              ["Resolved", complaintsData.resolved],
            ].map(([label, count]) => (
              <span key={String(label)} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_PILL[String(label)]}`}>
                {label} · {count}
              </span>
            ))}
          </div>

          <div className="divide-y divide-gray-100">
            {recentComplaints.map((c, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{c.date}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_PILL[c.status]}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-gray-100">
            <Link href="/student/complaints">
              <button className="w-full bg-gray-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                Raise a Complaint
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Visitors */}
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
            {recentVisitors.map((v, i) => (
              <div key={i} className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-gray-600">
                      {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{v.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{v.purpose}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{v.date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Checked out</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">{v.checkOut}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle size={12} />
              <span>Visitor hours: 10 AM–12 PM &amp; 4–7 PM daily.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notice Board ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-700">Notice Board</h2>
            <span className="text-[10px] bg-gray-900 text-white font-bold px-2 py-0.5 rounded-full">{notices.length}</span>
          </div>
          <Link href="/student/notices" className="text-[11px] text-gray-500 hover:text-gray-800 underline underline-offset-2">
            View all ↗
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Left column */}
          <div className="divide-y divide-gray-100">
            {notices.slice(0, 2).map((n) => (
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
          {/* Right column */}
          <div className="divide-y divide-gray-100">
            {notices.slice(2).map((n) => (
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
