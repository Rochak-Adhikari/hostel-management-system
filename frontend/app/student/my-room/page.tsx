"use client";

import { useState } from "react";
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
  MessageSquareWarning,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getAllocationByStudent, getAllocationsByRoom } from "@/api/allocationapi";
import { getRoomById } from "@/api/roomapi";
import { getComplaintsByStudent } from "@/api/complaintapi";
import { getStudentById } from "@/api/studentapi";
import { getRoomChangeRequestsByStudent, createRoomChangeRequest } from "@/api/roomChangeRequestApi";

// Room guidelines - yo hardcoded nai rakhya, kina bhane sabai room ko lagi same rule ho, database ma rakhnu jaruri xaina
const guidelines = [
  { icon: CheckCircle, text: "Maintain hygiene — dispose of trash in designated bins daily." },
  { icon: VolumeX,     text: "No loud music or noise after 10:00 PM. Respect study hours." },
  { icon: Wrench,      text: "Report any damage to room facilities via the complaint portal." },
  { icon: Clock,       text: "Guests allowed between 10:00 AM and 8:00 PM only. No overnight stays." },
  { icon: Plug,        text: "High-wattage appliances (heaters, hot plates) are strictly prohibited." },
];

// Room change request form ko validation schema
const roomChangeSchema = yup.object({
  reason: yup.string().required("Reason is required").min(10, "Please provide at least 10 characters"),
  preferredRoomType: yup.string().required("Preferred room type is required"),
});

type RoomChangeFormValues = {
  reason: string;
  preferredRoomType: string;
};

const STATUS_STYLES: Record<string, string> = {
  Pending: "border-gray-400 text-gray-500",
  Approved: "bg-black text-white border-black",
  Rejected: "border-red-400 text-red-500",
};

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
  const queryClient = useQueryClient();
  const [showRoomChangeModal, setShowRoomChangeModal] = useState(false);

  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // react-hook-form room change request ko lagi
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomChangeFormValues>({
    resolver: yupResolver(roomChangeSchema),
    defaultValues: { reason: "", preferredRoomType: "" },
  });

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

  // Yo room ko sabai allocations fetch garne
  const { data: roomAllocationsRes } = useQuery({
    queryKey: ["roomAllocations", room?._id],
    queryFn: () => getAllocationsByRoom(room._id),
    enabled: !!room?._id,
  });
  const roomAllocations: any[] = roomAllocationsRes?.data ?? [];

  // Current student filter out garne roommates allocation pathauna
  const roommateAllocations = roomAllocations.filter((a) => {
    const studentId = typeof a.student === "object" ? a.student._id : a.student;
    return studentId !== currentUser?.id;
  });

  // Batch query roommates ko details retrieve garna
  const roommateQueries = useQueries({
    queries: roommateAllocations.map((alloc) => {
      const studentId = typeof alloc.student === "object" ? alloc.student._id : alloc.student;
      return {
        queryKey: ["studentProfile", studentId],
        queryFn: () => getStudentById(studentId),
        enabled: !!studentId,
      };
    }),
  });

  // Roommates details mapping
  const roommates = roommateQueries
    .map((query, idx) => {
      const studentProfile = query.data?.data;
      const alloc = roommateAllocations[idx];
      if (!studentProfile) return null;
      return {
        _id: studentProfile._id,
        full_name: studentProfile.full_name,
        email: studentProfile.email,
        phone: studentProfile.phone,
        bed: alloc.bed,
      };
    })
    .filter(Boolean) as { _id: string; full_name: string; email: string; phone: string; bed: string }[];

  // Yo student ko complaints fetch garne
  const { data: complaintsRes } = useQuery({
    queryKey: ["myComplaints", currentUser?.id],
    queryFn: () => getComplaintsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const complaints = complaintsRes?.data ?? [];
  const recentComplaints = [...complaints].reverse().slice(0, 3);

  // Yo student ko room change requests fetch garne
  const { data: roomChangeRes } = useQuery({
    queryKey: ["myRoomChangeRequests", currentUser?.id],
    queryFn: () => getRoomChangeRequestsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const roomChangeRequests: any[] = roomChangeRes?.data ?? [];
  const pendingRequest = roomChangeRequests.find((r: any) => r.status === "Pending");
  const pastRequests = roomChangeRequests.filter((r: any) => r.status !== "Pending");

  // Room change request create garne mutation
  const createRoomChangeMutation = useMutation({
    mutationFn: (data: any) => createRoomChangeRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRoomChangeRequests", currentUser?.id] });
      setShowRoomChangeModal(false);
      reset();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to submit room change request");
    },
  });

  const onSubmitRoomChange = (formData: RoomChangeFormValues) => {
    if (!currentUser?.id || !room?._id) return;
    createRoomChangeMutation.mutate({
      student: currentUser.id,
      currentRoom: room._id,
      reason: formData.reason,
      preferredRoomType: formData.preferredRoomType,
    });
  };

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

      {/* ── Roommates Card ── */}
      {room.Capacity > 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Users size={15} className="text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-700">Roommates</h2>
          </div>
          <div className="p-5">
            {roommateQueries.some((q) => q.isPending) ? (
              <p className="text-xs text-gray-400 italic">Loading roommate profiles...</p>
            ) : roommates.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No roommates sharing this room yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {roommates.map((mate) => (
                  <div key={mate._id} className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {mate.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{mate.full_name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Bed {mate.bed?.toUpperCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Guidelines & Complaints Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guidelines Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
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
            </div>
          </div>
          <div className="p-5 pt-0">
            <p className="text-[11px] text-gray-400 pt-3 border-t border-gray-100">
              Violations may result in warnings or disciplinary action per hostel policy.
            </p>
          </div>
        </div>

        {/* Complaints Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareWarning size={15} className="text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-700">Recent Complaints</h2>
              </div>
              <a href="/student/complaints" className="text-xs text-gray-500 hover:underline">
                View all
              </a>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500">
                Track status updates on your raised room maintenance and amenity complaints.
              </p>
              <div className="divide-y divide-gray-100">
                {recentComplaints.map((c: any, i) => (
                  <div key={c._id || i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString("en-GB")}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                      c.status === "Resolved"
                        ? "bg-black text-white border-black"
                        : c.status === "In Progress"
                        ? "border-black text-black"
                        : "border-gray-300 text-gray-500"
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                ))}
                {recentComplaints.length === 0 && (
                  <p className="text-center py-6 text-xs text-gray-400">No complaints raised yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="p-5 pt-0">
            <a href="/student/complaints" className="block w-full">
              <button className="w-full bg-black text-white text-xs font-bold py-2.5 rounded-xl hover:bg-gray-900 transition-colors">
                File a Complaint
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* ── Room Change Request Section ── */}
      {room && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft size={15} className="text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-700">Room Change Request</h2>
            </div>
            {!pendingRequest && (
              <button
                onClick={() => {
                  reset();
                  setShowRoomChangeModal(true);
                }}
                className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition"
              >
                Request Change
              </button>
            )}
          </div>
          <div className="p-5 space-y-4">
            {/* Pending request indicator */}
            {pendingRequest && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Pending Request</p>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-400 text-gray-500">PENDING</span>
                </div>
                {pendingRequest.preferredRoomType && (
                  <p className="text-xs font-semibold text-gray-700 mb-1">Preferred Type: {pendingRequest.preferredRoomType}</p>
                )}
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{pendingRequest.reason}</p>
                <p className="text-[10px] text-gray-400 mt-2">Submitted: {new Date(pendingRequest.createdAt).toLocaleDateString("en-GB")}</p>
              </div>
            )}

            {/* Past requests history */}
            {pastRequests.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Past Requests</p>
                <div className="divide-y divide-gray-100">
                  {pastRequests.map((r: any) => (
                    <div key={r._id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {r.preferredRoomType && (
                          <p className="text-xs font-semibold text-gray-700 mb-0.5">Preferred Type: {r.preferredRoomType}</p>
                        )}
                        <p className="text-sm text-gray-700 truncate">{r.reason}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString("en-GB")}</p>
                        {r.adminNote && (
                          <p className="text-xs text-gray-500 mt-1 italic">Admin: {r.adminNote}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap shrink-0 ${STATUS_STYLES[r.status] || "border-gray-300 text-gray-500"}`}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!pendingRequest && pastRequests.length === 0 && (
              <p className="text-xs text-gray-400 italic">No room change requests submitted yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Room Change Request Modal */}
      {showRoomChangeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSubmit(onSubmitRoomChange)}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Request Room Change</h2>
              <button
                type="button"
                onClick={() => setShowRoomChangeModal(false)}
                className="p-1 rounded hover:bg-gray-150 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Room</p>
                <p className="text-sm font-semibold text-gray-900">{room?.RoomNumber} — Block {room?.block}, Bed {allocation?.bed?.toUpperCase()}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Preferred Room Type</label>
                <select
                  {...register("preferredRoomType")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">Select type...</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Quadruple">Quadruple</option>
                </select>
                {errors.preferredRoomType && (
                  <p className="text-red-500 text-xs mt-1">{errors.preferredRoomType.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Reason for Change</label>
                <textarea
                  rows={4}
                  placeholder="Explain why you'd like a room change..."
                  {...register("reason")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
                )}
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowRoomChangeModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createRoomChangeMutation.isPending}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {createRoomChangeMutation.isPending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}