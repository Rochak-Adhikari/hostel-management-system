import { Bell } from "lucide-react";

type Notice = {
  id: number;
  title: string;
  content: string;
  postedDate: string;
  isNew: boolean;
};

const notices: Notice[] = [
  {
    id: 1,
    title: "Visitor Timing Update",
    content:
      "Visitor hours have been revised. Morning: 10:00 AM – 12:00 PM. Evening: 4:00 PM – 7:00 PM.",
    postedDate: "28 Jun 2026",
    isNew: true,
  },
  {
    id: 2,
    title: "Water Supply Interruption",
    content:
      "Water supply will be interrupted on 2 July 2026 from 9:00 AM to 1:00 PM due to maintenance work.",
    postedDate: "27 Jun 2026",
    isNew: true,
  },
  {
    id: 3,
    title: "Fee Payment Deadline",
    content:
      "All students must clear their hostel fee dues before 15 July 2026. Late payments will attract a penalty.",
    postedDate: "25 Jun 2026",
    isNew: false,
  },
  {
    id: 4,
    title: "Hostel Inspection Notice",
    content:
      "A general room inspection will be conducted on 5 July 2026. Please ensure rooms are clean and tidy.",
    postedDate: "22 Jun 2026",
    isNew: false,
  },
  {
    id: 5,
    title: "Mess Menu Change",
    content:
      "The mess menu has been updated effective 1 July 2026. A printed copy is available at the notice board.",
    postedDate: "20 Jun 2026",
    isNew: false,
  },
  {
    id: 6,
    title: "Internet Maintenance",
    content:
      "Internet services will be unavailable on 3 July 2026 from 11:00 PM to 2:00 AM for system upgrades.",
    postedDate: "18 Jun 2026",
    isNew: false,
  },
];

function NoticeCard({ title, content, postedDate, isNew }: Notice) {
  return (
    <div className="border border-black rounded-[25px] p-4 sm:p-5 min-h-[100px] flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-semibold text-sm sm:text-base leading-snug">{title}</p>
            {isNew && (
              <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                New
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">{content}</p>
        </div>
        <Bell size={16} className="text-[#CB30E0] shrink-0 mt-0.5" />
      </div>
      <p className="text-xs text-gray-400">Posted: {postedDate}</p>
    </div>
  );
}

export default function NoticesPage() {
  const newCount = notices.filter((n) => n.isNew).length;
  const olderCount = notices.filter((n) => !n.isNew).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Notices</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          All official hostel notices and announcements posted by the admin.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          ["TOTAL NOTICES", String(notices.length)],
          ["NEW", String(newCount)],
          ["OLDER", String(olderCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Notice Board */}
      <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.50),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-5 sm:p-6 pb-8 sm:pb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center">Notice Board</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} {...notice} />
          ))}
        </div>
      </div>
    </div>
  );
}