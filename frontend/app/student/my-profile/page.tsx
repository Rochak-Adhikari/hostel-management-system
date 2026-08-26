"use client";

import { useState } from "react";
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
  X,
  Pencil,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getStudentById, updateStudent } from "@/api/studentapi";
import { getAllocationByStudent } from "@/api/allocationapi";
import { getRoomById } from "@/api/roomapi";
import { getFeesByStudent } from "@/api/feeapi";
import { getComplaintsByStudent } from "@/api/complaintapi";

// Profile update validation schema using nested guardian object
const editProfileSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().optional(),
  gender: yup.string().optional(),
  guardian: yup.object({
    name: yup.string().optional(),
    phone: yup.string().optional(),
    email: yup.string().email("Invalid email format").optional(),
  }).optional(),
});

type EditProfileFormValues = {
  full_name: string;
  phone: string;
  address?: string;
  gender?: string;
  guardian?: {
    name?: string;
    phone?: string;
    email?: string;
  };
};

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
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);

  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Real student profile data backend bata fetch garne
  const { data: studentRes, isPending, isError } = useQuery({
    queryKey: ["studentProfile", currentUser?.id],
    queryFn: () => getStudentById(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const student = studentRes?.data;

  // Student ko room allocation details fetch garne
  const { data: allocationRes } = useQuery({
    queryKey: ["myAllocation", currentUser?.id],
    queryFn: () => getAllocationByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const allocation = allocationRes?.data;

  // Room details fetch garne
  const { data: roomRes } = useQuery({
    queryKey: ["myRoom", allocation?.room],
    queryFn: () => getRoomById(allocation.room),
    enabled: !!allocation?.room,
  });
  const room = roomRes?.data;

  // Fee details fetch garne
  const { data: feesRes } = useQuery({
    queryKey: ["myFees", currentUser?.id],
    queryFn: () => getFeesByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const fees: any[] = feesRes?.data ?? [];
  const latestFee = fees[0];

  // Complaints fetch garne
  const { data: complaintsRes } = useQuery({
    queryKey: ["myComplaints", currentUser?.id],
    queryFn: () => getComplaintsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const complaints: any[] = complaintsRes?.data ?? [];
  const resolvedCount = complaints.filter((c: any) => c.status === "Resolved").length;

  // React hook form for profile edit using nested guardian
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: yupResolver(editProfileSchema) as any,
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: EditProfileFormValues) => updateStudent(currentUser.id, data),
    onSuccess: (updatedRes) => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile", currentUser?.id] });
      if (storedUser && updatedRes?.data) {
        const updatedUser = { ...currentUser, ...updatedRes.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setShowEditModal(false);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to update profile");
    },
  });

  function openEditModal() {
    if (student) {
      setValue("full_name", student.full_name || "");
      setValue("phone", student.phone || "");
      setValue("address", student.address || "");
      setValue("gender", student.gender || "Male");
      setValue("guardian.name", student.guardian?.name || "");
      setValue("guardian.phone", student.guardian?.phone || "");
      setValue("guardian.email", student.guardian?.email || "");
    }
    setShowEditModal(true);
  }

  function onEditSubmit(formData: EditProfileFormValues) {
    updateProfileMutation.mutate(formData);
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading student profile...</p>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load student profile. Please try again later.</p>
      </div>
    );
  }

  const name = student.full_name || "Student";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const admissionDate = student.createdAt ? new Date(student.createdAt).toLocaleDateString("en-GB") : "N/A";
  const studentId = student._id;

  const roomNumberDisplay = room ? room.RoomNumber : "Unassigned";
  const roomTypeDisplay = room ? room.RoomType : "N/A";
  const floorDisplay = room ? room.Floor : "N/A";
  const monthlyFeeDisplay = room ? `Rs. ${room.MonthlyFee?.toLocaleString()}` : "N/A";
  const allocationDateDisplay = allocation?.allocatedDate ? new Date(allocation.allocatedDate).toLocaleDateString("en-GB") : "N/A";

  const guardianNameDisplay = student.guardian?.name || "Not assigned";
  const guardianPhoneDisplay = student.guardian?.phone || "—";
  const guardianEmailDisplay = student.guardian?.email || "—";

  const stats = [
    { label: "Fee Status", value: latestFee ? latestFee.status.toUpperCase() : "NO FEES", sub: latestFee ? latestFee.month : "No billing", icon: CreditCard },
    { label: "Complaints", value: String(complaints.length), sub: `${resolvedCount} resolved`, icon: MessageSquareWarning },
    { label: "Room", value: roomNumberDisplay, sub: floorDisplay, icon: Bed },
    { label: "Admitted On", value: admissionDate, sub: "Registered Date", icon: Clock },
  ];

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
                  {name}
                </h1>
                <p className="text-xs text-gray-400 font-mono mt-0.5 tracking-wide">{studentId}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {room ? "Active Resident" : "Registered Student"}
                  </span>
                  <span className="inline-flex items-center gap-1 border border-gray-200 text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <Bed size={10} />
                    Room {roomNumberDisplay}
                  </span>
                  <span className="inline-flex items-center gap-1 border border-gray-200 text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <CalendarDays size={10} />
                    Admitted {admissionDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={openEditModal}
                className="flex items-center gap-1.5 bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Pencil size={13} />
                Edit Profile
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
              <span className="text-4xl md:text-5xl font-black">{roomNumberDisplay}</span>
              <div>
                <p className="text-sm font-semibold text-white/90">{roomTypeDisplay}</p>
                <p className="text-xs text-white/50">{floorDisplay}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-4 md:gap-2 md:text-right">
            {[
              ["Monthly Fee", monthlyFeeDisplay],
              ["Allocated On", allocationDateDisplay],
              ["Status", allocation ? "Active" : "Unassigned"],
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
          <Field icon={User2}        label="Full Name"         value={student.full_name || "—"} />
          <Field icon={User2}        label="Gender"            value={student.gender || "Not specified"} />
          <Field icon={CalendarDays} label="Registration Date" value={admissionDate} />
          <Field icon={Phone}        label="Phone Number"      value={student.phone || "—"} />
          <Field icon={Mail}         label="Email Address"     value={student.email || "—"} />
          <Field icon={MapPin}       label="Permanent Address" value={student.address || "Not provided"} />
        </Card>

        {/* Guardian Details */}
        <Card title="Guardian Details" icon={ShieldCheck}>
          <Field icon={User2} label="Guardian Name"  value={guardianNameDisplay} />
          <Field icon={Phone} label="Guardian Phone" value={guardianPhoneDisplay} />
          <Field icon={Mail}  label="Guardian Email" value={guardianEmailDisplay} />
          <Field icon={Phone} label="Emergency Contact" value={guardianPhoneDisplay !== "—" ? guardianPhoneDisplay : (student.phone || "—")} accent />
        </Card>
      </div>

      {/* ── Student ID Summary ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User2 size={15} className="text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-700">Student Identity Summary</h2>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              ["Student ID",     studentId],
              ["Name",           student.full_name || "—"],
              ["Gender",         student.gender || "—"],
              ["Phone",          student.phone || "—"],
              ["Email",          student.email || "—"],
              ["Address",        student.address || "—"],
              ["Guardian",       guardianNameDisplay],
              ["Guardian Phone", guardianPhoneDisplay],
              ["Admission Date", admissionDate],
              ["Room Number",    roomNumberDisplay],
              ["Room Type",      roomTypeDisplay],
              ["Monthly Fee",    monthlyFeeDisplay],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">{label}</p>
                <p className="text-xs font-semibold text-gray-800 break-words">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit(onEditSubmit)}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-bold text-gray-800">Edit My Profile</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  {...register("full_name")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {errors.full_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Permanent Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-3">
                <p className="text-xs font-bold text-gray-700">Guardian Information</p>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    {...register("guardian.name")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    {...register("guardian.phone")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Guardian Email</label>
                  <input
                    type="email"
                    {...register("guardian.email")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {errors.guardian?.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.guardian.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 pt-3 border-t border-gray-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}