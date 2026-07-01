"use client";

import {
  Pencil,
  Download,
  MessageSquareWarning,
  CreditCard,
  Clock,
  User,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

const student = {
  name: "Rochak Adhikari",
  id: "STU-2026-014",
  program: "BCA • 3rd Semester • XYZ College",
  status: "Active Resident",
};

const room = {
  number: "A-001",
  type: "Quadruple Sharing • 2nd Floor",
  allocatedOn: "Jan 12, 2026",
};

const stats = [
  {
    label: "Complaints",
    value: "3",
    valueColor: "text-[#CB30E0]",
    iconBg: "bg-[#F4E3F6]",
    icon: <MessageSquareWarning size={16} strokeWidth={1.5} className="text-[#CB30E0]" />,
  },
  {
    label: "Fee Status",
    value: "PAID",
    valueColor: "text-[#058C27]",
    iconBg: "bg-[#D9EFDF]",
    icon: <CreditCard size={16} strokeWidth={1.5} className="text-[#058C27]" />,
  },
  {
    label: "Duration",
    value: "8 Months",
    valueColor: "text-black",
    iconBg: "bg-[#9CC6EB]",
    icon: <Clock size={16} strokeWidth={1.5} className="text-[#0069C4]" />,
  },
];

const personalInfo = [
  { label: "FULL NAME", value: "Rochak Adhikari" },
  { label: "GENDER", value: "MALE" },
  { label: "DATE OF BIRTH", value: "2004-06-12" },
  { label: "PHONE NUMBER", value: "+977 9812543662" },
  { label: "EMAIL ADDRESS", value: "rochakadhikari24@gmail.com" },
  { label: "Permanent Address", value: "123 Murgiya, Butwal, Lumbini, Nepal" },
];

const guardianInfo = [
  { label: "GUARDIAN NAME", value: "BINDU Adhikari" },
  { label: "PHONE NUMBER", value: "+977 9812543662" },
  { label: "RELATIONSHIP", value: "Father" },
  { label: "EMERGENCY CONTACT", value: "+977 9812543662", valueColor: "text-[#E00808]" },
];

const accountSecurity = [
  { label: "Username", value: "rochak.adhikari001" },
  { label: "Last Login", value: "Today, 9:42 AM" },
];

const academicInfo = [
  { label: "Program", value: "BCA" },
  { label: "Year", value: "2nd" },
  { label: "Semester", value: "3rd" },
  { label: "Work Status", value: "None" },
  { label: "Admitted ON", value: "12 Jan 2025" },
];

function InfoRow({ label, value, valueColor = "text-black" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-black/10 last:border-0">
      <p className="text-[11px] font-light text-black/60 uppercase tracking-wide">{label}</p>
      <p className={`text-[14px] font-medium ${valueColor}`}>{value}</p>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[25px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.25),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-6 self-start">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-black">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function MyProfilePage() {
  const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="font-poppins space-y-5">
      <h1 className="text-2xl font-medium">My Profile</h1>

      {/* Profile Header Card */}
      <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.25),inset_5px_4px_4px_rgba(0,0,0,0.25)] p-5">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-[90px] h-[90px] rounded-full bg-[#D9D9D9] flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-black/50">{initials}</span>
            </div>
            <div className="min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-lg font-semibold text-black">{student.name}</p>
                <Pencil size={14} className="text-black/40 shrink-0" />
              </div>
              <p className="text-[11px] font-light text-black/60 mt-0.5">{student.id}</p>
              <p className="text-[11px] font-light text-black/60">{student.program}</p>
              <span className="inline-block mt-2 bg-[#B9C6E2] text-black text-[10px] font-light px-3 py-0.5 rounded-full">
                {student.status}
              </span>
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button className="bg-black text-white text-sm font-semibold px-4 py-2 rounded hover:bg-black/80 transition-colors">
              Edit Profile
            </button>
            <button className="border border-black text-black text-sm font-semibold px-4 py-2 rounded hover:bg-black/5 transition-colors flex items-center gap-1">
              <Download size={14} />
              Download ID
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.25),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-3 flex items-center gap-3">
              <div className={`w-9 h-9 ${s.iconBg} rounded-[5px] flex items-center justify-center shadow-sm shrink-0`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-black leading-tight truncate">{s.label}</p>
                <p className={`text-base font-semibold ${s.valueColor} leading-tight`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Details Banner */}
      <div className="bg-black rounded-[25px] p-6 text-white">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-white/60">Room Details</p>
        <p className="text-5xl font-bold mb-1">{room.number}</p>
        <p className="text-base font-medium text-white/80">{room.type}</p>
        <div className="flex items-center gap-2 mt-3">
          <Clock size={14} className="text-white/60 shrink-0" />
          <p className="text-sm font-medium text-white/80">
            Allocated on <span className="font-bold text-white">{room.allocatedOn}</span>
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">

        {/* Left */}
        <div className="space-y-5">
          <SectionCard title="Personal Information" icon={<User size={18} className="text-black shrink-0" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {personalInfo.map((item) => (
                <InfoRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Guardian Details" icon={<User size={18} className="text-black shrink-0" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {guardianInfo.map((item) => (
                <InfoRow key={item.label} label={item.label} value={item.value} valueColor={item.valueColor} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <SectionCard title="Account Security" icon={<ShieldCheck size={18} className="text-black shrink-0" />}>
            {accountSecurity.map((item) => (
              <InfoRow key={item.label} label={item.label} value={item.value} />
            ))}
            <button className="mt-4 w-full border border-black text-black text-sm font-semibold py-2 rounded hover:bg-black/5 transition-colors">
              Change Password
            </button>
          </SectionCard>

          <SectionCard title="Academic Information" icon={<BookOpen size={18} className="text-black shrink-0" />}>
            {academicInfo.map((item) => (
              <InfoRow key={item.label} label={item.label} value={item.value} />
            ))}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}