"use client";

import {
  Bed,
  Building2,
  Users,
  CheckCircle,
  AlertTriangle,
  Wifi,
  Droplets,
  Wind,
  DoorOpen,
  KeyRound,
  VolumeX,
  Wrench,
  Clock,
  Plug,
  FileText,
  MessageSquareWarning,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

// ── Data ─────────────────────────────────────────────────────────────────────
const room = {
  roomNumber: "A-001",
  floor: "2nd Floor",
  roomType: "Quadruple Sharing",
  capacity: 4,
  occupied: 4,
  status: "Occupied",
  monthlyFee: "Rs. 12,000",
  allocationDate: "12 Jan 2026",
};

const roommates = [
  { name: "Rochak Adhikari", course: "BCA – 4th Sem", isYou: true },
  { name: "Nhujaw Tandukar", course: "BCA – 4th Sem", isYou: false },
  { name: "Shakti Sherpa",   course: "BCA – 4th Sem", isYou: false },
  { name: "Lizan Gurung",    course: "BCA – 4th Sem", isYou: false },
];

const guidelines = [
  { icon: CheckCircle, text: "Maintain hygiene — dispose of trash in designated bins daily." },
  { icon: VolumeX,     text: "No loud music or noise after 10:00 PM. Respect study hours." },
  { icon: Wrench,      text: "Report any damage to room facilities via the complaint portal." },
  { icon: Clock,       text: "Guests allowed between 10:00 AM and 8:00 PM only. No overnight stays." },
  { icon: Plug,        text: "High-wattage appliances (heaters, hot plates) are strictly prohibited." },
];

const complaints = [
  { icon: Wifi,     title: "WiFi connectivity issue",    date: "15 Jun 2026", status: "Resolved" },
  { icon: Droplets, title: "Leaking tap in bathroom",    date: "16 Jun 2026", status: "Resolved" },
  { icon: Wind,     title: "Fan regulator broken",       date: "17 Jun 2026", status: "Pending"  },
  { icon: DoorOpen, title: "Door not closing properly",  date: "18 Jun 2026", status: "Pending"  },
  { icon: KeyRound, title: "Wardrobe key lost",          date: "19 Jun 2026", status: "Pending"  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, accent = false,
}: {
  icon: React.ComponentType<{ size: number; className?: string; strokeWidth?: number }>;
  label: string; value: string; accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-gray-900" : "bg-gray-100"}`}>
          <Icon size={14} strokeWidth={1.8} className={accent ? "text-white" : "text-gray-600"} />
        </div>
      </div>
      <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
    </div>
  );
}

function RoommateCard({ name, course, isYou }: { name: string; course: string; isYou: boolean }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`relative rounded-2xl border p-4 flex flex-col items-center text-center transition ${isYou ? "border-gray-900 bg-gray-900" : "border-gray-200 bg-white hover:border-gray-300"}`}>
      {isYou && (
        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold bg-white text-gray-900 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
          You
        </span>
      )}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shrink-0 ${isYou ? "bg-white/20" : "bg-gray-100"}`}>
        <span className={`text-base font-bold ${isYou ? "text-white" : "text-gray-600"}`}>{initials}</span>
      </div>
      <p className={`text-xs font-semibold leading-tight ${isYou ? "text-white" : "text-gray-800"}`}>{name}</p>
      <p className={`text-[10px] mt-1 ${isYou ? "text-white/60" : "text-gray-400"}`}>{course}</p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MyRoomPage() {
  const occupancyPct = Math.round((room.occupied / room.capacity) * 100);

  return (
    <div className="space-y-5">

      {/* ── Hero Banner ── */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <div className="px-5 md:px-8 py-6 md:py-8 relative">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }}
          />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">My Room</p>

            {/* Room number + details side by side on md+ */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-black text-white leading-none">{room.roomNumber}</span>
                <div className="pb-0.5">
                  <p className="text-base font-semibold text-white/80">{room.roomType}</p>
                  <p className="text-xs text-white/50">{room.floor}</p>
                </div>
              </div>

              {/* Meta details — horizontal on mobile, vertical on md+ */}
              <div className="flex flex-row flex-wrap md:flex-col gap-x-5 gap-y-1.5 md:text-right">
                {[
                  ["Monthly Fee", room.monthlyFee],
                  ["Allocated",   room.allocationDate],
                  ["Capacity",    `${room.occupied}/${room.capacity} Occupied`],
                  ["Status",      room.status],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">{k}</p>
                    <p className="text-sm font-semibold text-white/90">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Occupancy bar */}
            <div className="mt-5">
              <div className="flex justify-between text-[11px] text-white/50 mb-1.5">
                <span>Room Occupancy</span>
                <span>{occupancyPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${occupancyPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Bed}         label="Room Number" value={room.roomNumber} accent />
        <StatCard icon={Users}       label="Room Type"   value={room.roomType} />
        <StatCard icon={Building2}   label="Floor"       value={room.floor} />
        <StatCard icon={CheckCircle} label="Status"      value={room.status} />
      </div>

      {/* ── Quick Info Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: CreditCard,  label: "Monthly Fee",    value: room.monthlyFee },
          { icon: CalendarDays,label: "Allocation Date", value: room.allocationDate },
          { icon: Users,       label: "Capacity",        value: `${room.occupied} of ${room.capacity} beds occupied` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">{label}</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Roommates ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Users size={15} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-700">Roommates</h2>
          <span className="ml-auto text-xs text-gray-400">{roommates.length} members</span>
        </div>
        <div className="p-5">
          {/* 2 cols mobile → 4 cols from md */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {roommates.map((r) => (
              <RoommateCard key={r.name} {...r} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Guidelines + Complaints — stacked on <xl, side-by-side on xl ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Guidelines */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <FileText size={15} className="text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-700">Room Guidelines</h2>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-500 mb-4">
              Adhere to these rules to maintain a harmonious environment in Room {room.roomNumber}.
            </p>
            <ul className="space-y-3">
              {guidelines.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={13} className="text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">{text}</p>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
              Violations may result in warnings or disciplinary action per hostel policy.
            </p>
          </div>
        </div>

        {/* Complaints */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <AlertTriangle size={15} className="text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-700">Recent Room Complaints</h2>
            <Link href="/student/complaints" className="ml-auto text-xs text-blue-600 hover:underline shrink-0">
              View all ↗
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {complaints.map((c, i) => {
              const Icon = c.icon;
              const resolved = c.status === "Resolved";
              return (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{c.date}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                    resolved ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-500"
                  }`}>
                    {c.status}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <Link href="/student/complaints">
              <button className="w-full flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <MessageSquareWarning size={12} />
                Raise a New Complaint
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}