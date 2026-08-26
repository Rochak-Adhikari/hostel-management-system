"use client";

import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllNotices } from "@/api/noticeapi";

type Notice = {
  _id: string;
  title: string;
  content: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
};

// Check if notice was posted within last 7 days
function checkIsNew(createdAt: string): boolean {
  const diffTime = Math.abs(Date.now() - new Date(createdAt).getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export default function StudentNoticesPage() {
  // Sabai notice fetch garne
  const { data: noticesRes, isPending, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: getAllNotices,
  });

  const notices: Notice[] = noticesRes?.data ?? [];
  const newCount = notices.filter((n) => checkIsNew(n.createdAt)).length;
  const olderCount = notices.length - newCount;

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading notices...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load notices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Notices</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          All official hostel notices and announcements posted by the admin.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL NOTICES", String(notices.length)],
          ["NEW NOTICES", String(newCount)],
          ["OLDER NOTICES", String(olderCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Notice Board Container (Matching Admin Panel Style) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Notice Board</h2>
          <span className="text-xs text-gray-400">{notices.length} total</span>
        </div>

        <div className="divide-y divide-gray-100">
          {notices.map((n) => {
            const isNew = checkIsNew(n.createdAt);
            const postedDate = new Date(n.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div key={n._id} className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell size={16} className="text-[#CB30E0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-sm sm:text-base text-gray-900">{n.title}</p>
                    {isNew && (
                      <span className="text-[10px] font-bold bg-black text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mt-1">{n.content}</p>
                  <p className="text-xs text-gray-400 mt-2">Posted: {postedDate}</p>
                </div>
              </div>
            );
          })}
          {notices.length === 0 && (
            <p className="py-12 text-center text-gray-400 text-sm">No notices posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}