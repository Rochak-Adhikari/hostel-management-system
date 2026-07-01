"use client";

import {
  Bed,
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
  VolumeX,
  Wrench,
  Clock,
  Plug,
  FileText,
  Wifi,
  Droplets,
  Wind,
  DoorOpen,
  KeyRound,
} from "lucide-react";

// ─── Static data (replace with real API calls) ──────────────────────────────
const roomInfo = {
  number: "A-001",
  type: "Quadruple Sharing",
  floor: "Second Floor",
  status: "Occupied",
};

const roommates = [
  { name: "Rochak Adhikari", course: "BCA - Fourth Semester", isYou: true },
  { name: "Nhujaw Tandukari", course: "BCA - Fourth Semester", isYou: false },
  { name: "Shakti Sherpa", course: "BCA - Fourth Semester", isYou: false },
  { name: "Lizan Gurung", course: "BCA - Fourth Semester", isYou: false },
];

const guidelines = [
  {
    icon: <CheckCircle size={18} className="text-black shrink-0 mt-0.5" />,
    text: "Cleanliness: Maintain hygiene. Dispose of trash in designated bins daily.",
  },
  {
    icon: <VolumeX size={18} className="text-black shrink-0 mt-0.5" />,
    text: "Quiet Hours: Strictly no loud music or noise after 10:00 PM to respect study hours.",
  },
  {
    icon: <Wrench size={18} className="text-black shrink-0 mt-0.5" />,
    text: "Property: Promptly report any damages to room facilities via the complaint portal.",
  },
  {
    icon: <Clock size={18} className="text-black shrink-0 mt-0.5" />,
    text: "Visitor Hours: Guests are allowed only between 10:00 AM and 8:00 PM. No overnight stays.",
  },
  {
    icon: <Plug size={18} className="text-black shrink-0 mt-0.5" />,
    text: "Appliances: High-wattage appliances (heaters, hot plates) are strictly prohibited.",
  },
];

const complaints = [
  { title: "WiFi connectivity issue", date: "2026-06-15", status: "Resolved" },
  { title: "Leaking tap in attached bathroom", date: "2026-06-16", status: "Resolved" },
  { title: "Fan regulator broken", date: "2026-06-17", status: "Pending" },
  { title: "Door not closing", date: "2026-06-18", status: "Pending" },
  { title: "Wardrobe key lost", date: "2026-06-19", status: "Pending" },
];

const complaintIcons: Record<string, React.ReactNode> = {
  "WiFi connectivity issue": <Wifi size={16} className="text-black/60 shrink-0" />,
  "Leaking tap in attached bathroom": <Droplets size={16} className="text-black/60 shrink-0" />,
  "Fan regulator broken": <Wind size={16} className="text-black/60 shrink-0" />,
  "Door not closing": <DoorOpen size={16} className="text-black/60 shrink-0" />,
  "Wardrobe key lost": <KeyRound size={16} className="text-black/60 shrink-0" />,
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function RoomStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.25),inset_5px_4px_4px_rgba(0,0,0,0.25)] p-4 flex items-center gap-3 min-w-0">
      <div className="w-12 h-12 bg-[#E5E5E5] rounded-[50px] flex items-center justify-center shadow-[2px_4px_4px_rgba(0,0,0,0.25)] shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-black leading-tight">{label}</p>
        <p className="text-[15px] font-normal text-black mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function RoommateCard({
  name,
  course,
  isYou,
}: {
  name: string;
  course: string;
  isYou: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.5),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-4 flex flex-col items-center text-center relative">
      {isYou && (
        <span className="absolute top-3 right-3 bg-black text-white text-[9px] font-normal px-2 py-0.5 rounded-[5px]">
          You
        </span>
      )}
      {/* Avatar */}
      <div className="w-[70px] h-[70px] rounded-full bg-[#D9D9D9] flex items-center justify-center mb-2 shrink-0">
        <span className="text-lg font-bold text-black/60">{initials}</span>
      </div>
      <p className="text-[12px] font-medium text-black leading-tight">{name}</p>
      <p className="text-[11px] font-medium text-black/60 mt-0.5">{course}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function MyRoomPage() {
  return (
    <div className="font-poppins">
      <h1 className="text-2xl font-medium mb-5">My Room</h1>

      {/* ── Room Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <RoomStatCard
          icon={<Bed size={22} strokeWidth={1.5} className="text-[#0069C4]" />}
          label="Room Number"
          value={roomInfo.number}
        />
        <RoomStatCard
          icon={<Users size={22} strokeWidth={1.5} className="text-black" />}
          label="Room Type"
          value={roomInfo.type}
        />
        <RoomStatCard
          icon={<Building2 size={22} strokeWidth={1.5} className="text-black" />}
          label="Floor"
          value={roomInfo.floor}
        />
        <RoomStatCard
          icon={<CheckCircle size={22} strokeWidth={1.5} className="text-black" />}
          label="Room Status"
          value={roomInfo.status}
        />
      </div>

      {/* ── Middle row: Roommates + Guidelines ── */}
      <div className="flex flex-col xl:flex-row items-start gap-5 mb-5">

        {/* Roommates */}
        <div className="bg-white rounded-[25px] shadow-[5px_4px_4px_rgba(0,0,0,0.25),inset_5px_4px_4px_rgba(0,0,0,0.25)] p-6 flex-1 min-w-0 self-start">
          <div className="flex items-center gap-2 mb-5">
            <Users size={20} className="text-black shrink-0" />
            <h2 className="text-xl font-bold text-black">Roommates</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {roommates.map((r) => (
              <RoommateCard key={r.name} {...r} />
            ))}
          </div>
        </div>

        {/* Room Guidelines */}
        <div className="bg-white rounded-[25px] shadow-[5px_4px_4px_rgba(0,0,0,0.25),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-6 xl:w-[380px] shrink-0 self-start">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-black shrink-0" />
            <h2 className="text-xl font-bold text-black">Room Guidelines</h2>
          </div>
          <p className="text-[13px] font-light text-black mb-4 leading-snug">
            Please adhere to the following rules to ensure a harmonious living
            environment for everyone in {roomInfo.number}.
          </p>
          <ul className="flex flex-col gap-3">
            {guidelines.map((g, i) => (
              <li key={i} className="flex items-start gap-2">
                {g.icon}
                <p className="text-[13px] font-semibold text-black leading-snug">{g.text}</p>
              </li>
            ))}
          </ul>
          <p className="text-[12px] font-light text-black/70 mt-4 leading-snug border-t border-black/10 pt-3">
            Violation of these guidelines may result in warnings or disciplinary
            action as per hostel policy.
          </p>
        </div>
      </div>

      {/* ── Recent Room Complaints ── */}
      <div className="bg-white rounded-[25px] shadow-[5px_4px_4px_rgba(0,0,0,0.25),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-6 max-w-3xl">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle size={20} className="text-black shrink-0" />
          <h2 className="text-xl font-bold text-black">Recent Room Complaints</h2>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-2 mb-2">
          <p className="text-[13px] font-bold text-black">Complaint Title</p>
          <p className="text-[13px] font-bold text-black w-28 text-center">Date</p>
          <p className="text-[13px] font-bold text-black w-24 text-center">Status</p>
        </div>

        <div className="flex flex-col divide-y divide-black/10">
          {complaints.map((c, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-1 sm:gap-4 py-3 px-2 items-center"
            >
              <div className="flex items-center gap-2">
                {complaintIcons[c.title]}
                <p className="text-[14px] font-normal text-black">{c.title}</p>
              </div>
              <p className="text-[13px] text-black/60 sm:w-28 sm:text-center">{c.date}</p>
              <div className="sm:w-24 flex sm:justify-center">
                <span
                  className={`text-[13px] font-normal px-3 py-0.5 rounded-[8px] ${
                    c.status === "Resolved"
                      ? "bg-[#A6A5A5] text-white"
                      : "border border-black text-black"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}