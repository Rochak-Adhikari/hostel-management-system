"use client";

import { useState } from "react";
import { Clock, Calendar, ArrowRightLeft, ShieldAlert } from "lucide-react";

type EntryExitLog = {
  id: string;
  action: "Check-In" | "Check-Out";
  time: string;
  date: string;
  gatekeeper: string;
};

type LeaveRequest = {
  id: string;
  type: "Short Term" | "Long Term";
  purpose: string;
  from: string;
  to: string;
  duration: string;
  status: "Approved" | "Pending" | "Completed" | "Rejected";
};

const mockLogs: EntryExitLog[] = [
  { id: "LOG-0491", action: "Check-In",  time: "6:45 PM", date: "01 Jul 2026", gatekeeper: "Shyam Thapa" },
  { id: "LOG-0482", action: "Check-Out", time: "8:15 AM", date: "30 Jun 2026", gatekeeper: "Shyam Thapa" },
  { id: "LOG-0475", action: "Check-In",  time: "7:12 PM", date: "28 Jun 2026", gatekeeper: "Kiran Rimal" },
  { id: "LOG-0461", action: "Check-Out", time: "2:30 PM", date: "28 Jun 2026", gatekeeper: "Kiran Rimal" },
  { id: "LOG-0450", action: "Check-In",  time: "8:00 PM", date: "25 Jun 2026", gatekeeper: "Shyam Thapa" },
  { id: "LOG-0442", action: "Check-Out", time: "9:00 AM", date: "25 Jun 2026", gatekeeper: "Shyam Thapa" },
];

const mockLeaves: LeaveRequest[] = [
  { id: "LV-201", type: "Short Term", purpose: "Medical appointment (dentist)", from: "30 Jun, 8:00 AM", to: "30 Jun, 12:00 PM", duration: "4 Hours", status: "Completed" },
  { id: "LV-194", type: "Long Term",  purpose: "Dashain festival vacation family stay", from: "12 Oct, 2026", to: "25 Oct, 2026", duration: "13 Days", status: "Approved" },
  { id: "LV-185", type: "Short Term", purpose: "Buying reference college books", from: "28 Jun, 2:00 PM", to: "28 Jun, 6:00 PM", duration: "4 Hours", status: "Completed" },
  { id: "LV-170", type: "Long Term",  purpose: "Semester break home visit", from: "15 Jan, 2026", to: "30 Jan, 2026", duration: "15 Days", status: "Completed" },
];

export default function GuardianLeaves() {
  const [activeTab, setActiveTab] = useState<"logs" | "leaves">("logs");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Logs &amp; Leaves</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Track hostel gate entry/exit activity, short-term leave logs, and long-term permissions for <span className="font-semibold text-gray-800">Rochak Adhikari</span>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "logs"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Gate Entry/Exit Logs
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "leaves"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Leave Permissions &amp; History
        </button>
      </div>

      {/* Content Canvas */}
      {activeTab === "logs" ? (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <ArrowRightLeft size={14} className="text-gray-500 mr-2" />
            <h2 className="text-sm font-semibold text-gray-700">Real-Time Attendance Log</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Log ID</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Timestamp</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/40">
                    <td className="px-5 py-4 text-xs font-mono font-bold text-gray-900">{log.id}</td>
                    <td className="px-5 py-4 text-xs">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        log.action === "Check-In"
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-300 text-gray-500"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-gray-800">{log.time}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{log.date}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{log.gatekeeper}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <Calendar size={14} className="text-gray-500 mr-2" />
            <h2 className="text-sm font-semibold text-gray-700">Leave History (Short &amp; Long Term)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Leave ID</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Reason / Purpose</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Duration</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Schedule</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockLeaves.map((lv) => (
                  <tr key={lv.id} className="hover:bg-gray-50/40">
                    <td className="px-5 py-4 text-xs font-mono font-bold text-gray-900">{lv.id}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-gray-800">{lv.type}</td>
                    <td className="px-5 py-4 text-xs text-gray-600 max-w-xs truncate">{lv.purpose}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-gray-800">{lv.duration}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {lv.from} <span className="text-gray-300">→</span> {lv.to}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        lv.status === "Approved" || lv.status === "Completed"
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-300 text-gray-500"
                      }`}>
                        {lv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
