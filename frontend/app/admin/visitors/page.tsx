"use client";

import { useState } from "react";
import { Search, Eye, Clock, X, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStudents } from "@/api/studentapi";
import { getAllVisitors, getVisitorsByStudent, updateVisitor } from "@/api/visitorapi";

type Student = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
};

type Visitor = {
  _id: string;
  student: string | { _id: string; full_name: string };
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string | null;
  createdAt: string;
};

function StatusPill({ checkedOut }: { checkedOut: boolean }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${
        checkedOut ? "bg-black text-white border-black" : "border-gray-400 text-gray-600"
      }`}
    >
      {checkedOut ? "CHECKED OUT" : "STILL VISITING"}
    </span>
  );
}

export default function AdminVisitorsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Fetch full student list
  const { data: studentsRes, isPending: isStudentsPending, isError: isStudentsError } = useQuery({
    queryKey: ["students", "student"],
    queryFn: () => getAllStudents("student"),
  });
  const students: Student[] = studentsRes?.data ?? [];

  // Fetch all visitors to calculate counts
  const { data: visitorsRes, isPending: isVisitorsPending } = useQuery({
    queryKey: ["visitors"],
    queryFn: getAllVisitors,
  });
  const allVisitors: Visitor[] = visitorsRes?.data ?? [];

  // Fetch selected student's specific visitor logs
  const { data: studentVisitorsRes, isPending: isStudentVisitorsPending } = useQuery({
    queryKey: ["studentVisitors", selectedStudent?._id],
    queryFn: () => getVisitorsByStudent(selectedStudent!._id),
    enabled: !!selectedStudent?._id,
  });
  const studentVisitors: Visitor[] = studentVisitorsRes?.data ?? [];

  // Check out mutation
  const checkOutMutation = useMutation({
    mutationFn: (visitorId: string) =>
      updateVisitor(visitorId, { checkOutTime: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      if (selectedStudent?._id) {
        queryClient.invalidateQueries({ queryKey: ["studentVisitors", selectedStudent._id] });
      }
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to check out visitor");
    },
  });

  // Calculate summary counts
  const totalVisits = allVisitors.length;
  const checkedOutCount = allVisitors.filter((v) => !!v.checkOutTime).length;
  const stillVisitingCount = totalVisits - checkedOutCount;

  // Filter students by search query
  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to count visitor entries per student
  function getStudentVisitorCount(studentId: string) {
    return allVisitors.filter((v) => {
      const vStudentId = typeof v.student === "object" ? v.student?._id : v.student;
      return vStudentId === studentId;
    }).length;
  }

  function handleCheckOut(visitorId: string) {
    checkOutMutation.mutate(visitorId);
  }

  if (isStudentsPending || isVisitorsPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading visitors and student data...</p>
      </div>
    );
  }

  if (isStudentsError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Visitors Log</h1>
          <p className="text-gray-500 mt-1">Track visitor logs and manage guest check-outs by student.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL VISITS", String(totalVisits)],
          ["CHECKED OUT", String(checkedOutCount)],
          ["STILL VISITING", String(stillVisitingCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Student List Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student by name, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor Logs</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((s) => {
                const count = getStudentVisitorCount(s._id);
                return (
                  <tr key={s._id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-5 text-sm font-semibold text-gray-900">{s.full_name}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{s.phone}</td>
                    <td className="py-4 px-5 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {count} {count === 1 ? "visitor log" : "visitors logged"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition text-gray-700"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400 text-sm">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Logs Popup Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedStudent.full_name}'s Visitor Logs</h2>
                <p className="text-xs text-gray-500">{selectedStudent.phone} • {selectedStudent.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {isStudentVisitorsPending ? (
                <p className="text-xs text-gray-400 italic py-6 text-center">Loading visitor logs...</p>
              ) : studentVisitors.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Users size={40} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium text-gray-600">No visitor logs found for this student.</p>
                  <p className="text-xs text-gray-400 mt-1">Visitors registered for {selectedStudent.full_name} will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {studentVisitors.map((v) => (
                    <div key={v._id} className="p-4 space-y-2 hover:bg-gray-50/50 transition">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-gray-900">{v.visitorName}</p>
                        <StatusPill checkedOut={!!v.checkOutTime} />
                      </div>
                      <p className="text-xs text-gray-500">Phone: {v.visitorPhone}</p>
                      <p className="text-xs text-gray-700 font-medium">Purpose: {v.purpose}</p>

                      <div className="text-[11px] text-gray-400 pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span>
                          Check In: {new Date(v.checkInTime).toLocaleString("en-GB", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <span>
                          Check Out: {v.checkOutTime ? (
                            new Date(v.checkOutTime).toLocaleString("en-GB", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          ) : (
                            <span className="text-amber-600 font-semibold">Not checked out yet</span>
                          )}
                        </span>
                      </div>

                      {!v.checkOutTime && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleCheckOut(v._id)}
                            disabled={checkOutMutation.isPending}
                            className="flex items-center gap-1.5 text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
                          >
                            <Clock size={13} />
                            {checkOutMutation.isPending ? "Checking Out..." : "Check Out Visitor"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
