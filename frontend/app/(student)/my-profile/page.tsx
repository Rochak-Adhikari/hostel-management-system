"use client";

import {
  MapPin,
  Phone,
  Mail,
  User2,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  MessageSquareWarning,
  Bed,
  Clock,
  Download,
  Lock,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────
const student = {
  id: "STU-2026-014",
  name: "Rochak Adhikari",
  gender: "Male",
  address: "123 Murgiya, Butwal, Lumbini, Nepal",
  phone: "+977 9812543662",
  email: "rochakadhikari24@gmail.com",
  guardianName: "Bindu Adhikari",
  guardianPhone: "+977 9812543662",
  admissionDate: "12 Jan 2025",
};

const roomAllocation = {
  roomNumber: "A-001",
  floor: "2nd Floor",
  roomType: "Quadruple Sharing",
  monthlyFee: "Rs. 12,000",
  allocationDate: "12 Jan 2026",
  status: "Active",
};

const stats = [
  { label: "Fee Status",    value: "PAID",  sub: "June 2026",      icon: CreditCard },
  { label: "Complaints",   value: "3",     sub: "2 resolved",     icon: MessageSquareWarning },
  { label: "Room",         value: "A-001", sub: "2nd Floor",      icon: Bed },
  { label: "Stay Duration",value: "6 mo.", sub: "Since Jan 2026", icon: Clock },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function Field({
  icon: Icon, label, value, accent = false,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string; value: string; accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-0.5">{label}</p>
        <p className={`text-sm font-semibold break-words ${accent ? "text-red-600" : "text-gray-900"}`}>{value}</p>
      </div>
    </div>
  );
}

function Card({
  title, icon: Icon, children,
}: {
  title: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <Icon size={15} className="text-gray-600" />
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MyProfilePage() {
  const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-5">

      {/* ── Hero Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Thin top bar */}
        <div className="h-1.5 bg-black" />

        <div className="px-5 md:px-8 pt-6 pb-5">
          {/* Avatar + name + actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              {/* Plain monochrome avatar */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black flex items-center justify-center shrink-0">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">{initials}</span>
              </div>

              {/* Name + ID */}
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                  {student.name}
                </h1>
                <p className="text-xs text-gray-400 font-mono mt-0.5 tracking-wide">{student.id}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Active Resident
                  </span>
                  <span className="inline-flex items-center gap-1 border border-gray-200 text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <Bed size={10} />
                    Room {roomAllocation.roomNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 border border-gray-200 text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <CalendarDays size={10} />
                    Admitted {student.admissionDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                Edit Profile
              </button>
              <button className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <Download size={12} />
                Download ID
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-4" />

          {/* Stats — 2 cols mobile / 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(({ label, value, sub, icon: Icon }) => (
              <div key={label} className="border border-gray-100 rounded-xl p-3 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={12} className="text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                </div>
                <p className="text-base font-bold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Room Allocation Banner ── */}
      <div className="bg-gray-900 rounded-2xl p-5 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Current Room Allocation</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black">{roomAllocation.roomNumber}</span>
              <div>
                <p className="text-sm font-semibold text-white/90">{roomAllocation.roomType}</p>
                <p className="text-xs text-white/50">{roomAllocation.floor}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-4 md:gap-2 md:text-right">
            {[
              ["Monthly Fee", roomAllocation.monthlyFee],
              ["Allocated On", roomAllocation.allocationDate],
              ["Status", roomAllocation.status],
            ].map(([key, val]) => (
              <div key={key}>
                <p className="text-[10px] uppercase tracking-wider text-white/40">{key}</p>
                <p className="text-sm font-semibold text-white/90">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Info Cards Grid — single col on mobile/tablet, 2 col on xl ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Personal Information */}
        <Card title="Personal Information" icon={User2}>
          <Field icon={User2}        label="Full Name"         value={student.name} />
          <Field icon={User2}        label="Gender"            value={student.gender} />
          <Field icon={CalendarDays} label="Admission Date"    value={student.admissionDate} />
          <Field icon={Phone}        label="Phone Number"      value={student.phone} />
          <Field icon={Mail}         label="Email Address"     value={student.email} />
          <Field icon={MapPin}       label="Permanent Address" value={student.address} />
        </Card>

        {/* Guardian + Account Security */}
        <Card title="Guardian Details" icon={ShieldCheck}>
          <Field icon={User2} label="Guardian Name"    value={student.guardianName} />
          <Field icon={Phone} label="Guardian Phone"   value={student.guardianPhone} />
          <Field icon={Phone} label="Emergency Contact" value={student.guardianPhone} accent />

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={13} className="text-gray-500" />
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Account Security</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500">Username</span>
                <span className="text-xs font-semibold text-gray-800">rochak.adhikari001</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-gray-500">Last Login</span>
                <span className="text-xs font-semibold text-gray-800">Today, 9:42 AM</span>
              </div>
            </div>
            <button className="mt-3 w-full border border-gray-300 text-gray-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
              <Lock size={12} />
              Change Password
            </button>
          </div>
        </Card>
      </div>

      {/* ── Student ID Summary ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User2 size={15} className="text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-700">Student ID Summary</h2>
          </div>
          <button className="text-xs text-gray-500 underline hover:text-gray-800 transition-colors flex items-center gap-1">
            <Download size={11} />
            Export
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              ["Student ID",     student.id],
              ["Name",           student.name],
              ["Gender",         student.gender],
              ["Phone",          student.phone],
              ["Email",          student.email],
              ["Address",        student.address],
              ["Guardian",       student.guardianName],
              ["Guardian Phone", student.guardianPhone],
              ["Admission Date", student.admissionDate],
              ["Room Number",    roomAllocation.roomNumber],
              ["Room Type",      roomAllocation.roomType],
              ["Monthly Fee",    roomAllocation.monthlyFee],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">{label}</p>
                <p className="text-xs font-semibold text-gray-800 break-words">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}