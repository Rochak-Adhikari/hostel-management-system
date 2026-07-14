"use client";

import {
  Bed,
  Building2,
  Users,
  CheckCircle,
  VolumeX,
  Wrench,
  Clock,
  Plug,
  FileText,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllocationByStudent } from "@/api/allocationapi";
import { getRoomById } from "@/api/roomapi";

// Room guidelines - yo hardcoded nai rakhya, kina bhane sabai room ko lagi same rule ho, database ma rakhnu jaruri xaina
const guidelines = [
  { icon: CheckCircle, text: "Maintain hygiene — dispose of trash in designated bins daily." },
  { icon: VolumeX,     text: "No loud music or noise after 10:00 PM. Respect study hours." },
  { icon: Wrench,      text: "Report any damage to room facilities via the complaint portal." },
  { icon: Clock,       text: "Guests allowed between 10:00 AM and 8:00 PM only. No overnight stays." },
  { icon: Plug,        text: "High-wattage appliances (heaters, hot plates) are strictly prohibited." },
];

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

export default function MyRoomPage() {
  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // yo student ko allocation (room) fetch garne
  const { data: allocationData, isPending: allocationPending, isError: allocationError } = useQuery({
    queryKey: ["myAllocation", currentUser?.id],
    queryFn: () => getAllocationByStudent(currentUser.id),
    enabled: !!currentUser?.id, // currentUser cha vaye matra yo query chalne
  });

  const allocation = allocationData?.data;

  // allocation vaye pachi, tyo room ko full detail fetch garne
  const { data: roomData, isPending: roomPending } = useQuery({
    queryKey: ["myRoom", allocation?.room],
    queryFn: () => getRoomById(allocation.room),
    enabled: !!allocation?.room,
  });

  const room = roomData?.data;

  // login vayeko chaina bhane
  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to view your room.</p>
      </div>
    );
  }

  // room fetch huda samma loading dekhaune
  if (allocationPending || roomPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading your room...</p>
      </div>
    );
  }

  // kunai room allocate vaisakeko chaina bhane
  if (allocationError || !allocation || !room) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No room has been allocated to you yet.</p>
        <p className="text-sm text-gray-400 mt-1">Please contact the hostel admin.</p>
      </div>
    );
  }

  const occupancyPct = Math.round((room.Occupied / room.Capacity) * 100);
  const status = room.Occupied >= room.Capacity ? "Occupied" : "Available";

  return (
    <div className="space-y-5">

      {/* ── Hero Banner ── */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <div className="px-5 md:px-8 py-6 md:py-8 relative">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }}
          />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">My Room</p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-black text-white leading-none">{room.RoomNumber}</span>
                <div className="pb-0.5">
                  <p className="text-base font-semibold text-white/80">{room.RoomType}</p>
                  <p className="text-xs text-white/50">{room.Floor} · Block {room.block} · Bed {allocation.bed?.toUpperCase()}</p>
                </div>
              </div>

              <div className="flex flex-row flex-wrap md:flex-col gap-x-5 gap-y-1.5 md:text-right">
                {[
                  ["Block",       `Block ${room.block}`],
                  ["Bed",         `Bed ${allocation.bed?.toUpperCase()}`],
                  ["Monthly Fee", `Rs. ${room.MonthlyFee.toLocaleString()}`],
                  ["Allocated",   allocation.allocatedDate ? new Date(allocation.allocatedDate).toLocaleDateString() : "-"],
                  ["Capacity",    `${room.Occupied}/${room.Capacity} Occupied`],
                  ["Status",      status],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">{k}</p>
                    <p className="text-sm font-semibold text-white/90">{v}</p>
                  </div>
                ))}
              </div>
            </div>

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Bed}         label="Room / Bed" value={`${room.RoomNumber} (Bed ${allocation.bed?.toUpperCase()})`} accent />
        <StatCard icon={Building2}   label="Block"       value={`Block ${room.block}`} />
        <StatCard icon={Users}       label="Room Type"   value={room.RoomType} />
        <StatCard icon={CheckCircle} label="Status"      value={status} />
      </div>

      {/* ── Quick Info Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: CreditCard,  label: "Monthly Fee",    value: `Rs. ${room.MonthlyFee.toLocaleString()}` },
          { icon: CalendarDays,label: "Allocation Date", value: allocation.allocatedDate ? new Date(allocation.allocatedDate).toLocaleDateString() : "-" },
          { icon: Users,       label: "Capacity",        value: `${room.Occupied} of ${room.Capacity} beds occupied` },
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

      {/* ── Guidelines (rakhya, kina bhane requested) ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <FileText size={15} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-700">Room Guidelines</h2>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-4">
            Adhere to these rules to maintain a harmonious environment in Room {room.RoomNumber}.
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
    </div>
  );
}