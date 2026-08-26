"use client";

import { useState } from "react";
import { Users, Phone, CalendarDays, Clock, Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getVisitorsByStudent, createVisitor, updateVisitor } from "@/api/visitorapi";

type Visitor = {
  _id: string;
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string | null;
  createdAt: string;
};

const visitorSchema = yup.object({
  visitorName: yup.string().required("Visitor name is required"),
  visitorPhone: yup.string().required("Visitor phone number is required"),
  purpose: yup.string().required("Purpose of visit is required"),
});

type VisitorFormValues = yup.InferType<typeof visitorSchema>;

function StatusPill({ checkedOut }: { checkedOut: boolean }) {
  return (
    <span
      className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full border whitespace-nowrap ${
        checkedOut
          ? "bg-black text-white border-black"
          : "border-gray-400 text-gray-600"
      }`}
    >
      {checkedOut ? "CHECKED OUT" : "STILL VISITING"}
    </span>
  );
}

function VisitorRow({
  visitor,
  isFirst,
  onCheckOut,
  isCheckingOut,
}: {
  visitor: Visitor;
  isFirst: boolean;
  onCheckOut: (id: string) => void;
  isCheckingOut: boolean;
}) {
  const checkedOut = !!visitor.checkOutTime;

  return (
    <div
      className={`p-4 sm:p-5 border-b border-gray-200 transition ${
        isFirst ? "bg-gray-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Users size={13} className="text-gray-400 shrink-0" />
            <span className="text-sm sm:text-base font-semibold text-black">{visitor.visitorName}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 mt-0.5">
            <span className="flex items-center gap-1">
              <Phone size={11} />
              {visitor.visitorPhone}
            </span>
            <span className="hidden xs:inline">•</span>
            <span>{visitor.purpose}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <CalendarDays size={10} />
              In: {new Date(visitor.checkInTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
            </span>
            {visitor.checkOutTime ? (
              <span className="flex items-center gap-1">
                <Clock size={10} />
                Out: {new Date(visitor.checkOutTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            ) : (
              <span className="text-amber-600 font-medium">Not checked out yet</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusPill checkedOut={checkedOut} />
          {!checkedOut && (
            <button
              onClick={() => onCheckOut(visitor._id)}
              disabled={isCheckingOut}
              className="flex items-center gap-1 text-xs font-semibold bg-black text-white px-2.5 py-1 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
            >
              <Clock size={12} />
              Check Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VisitorLogPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  // localStorage bata login garda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // React hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitorFormValues>({
    resolver: yupResolver(visitorSchema),
    defaultValues: {
      visitorName: "",
      visitorPhone: "",
      purpose: "",
    },
  });

  // Query my visitors
  const { data: visitorsRes, isPending, isError } = useQuery({
    queryKey: ["myVisitors", currentUser?.id],
    queryFn: () => getVisitorsByStudent(currentUser.id),
    enabled: !!currentUser?.id,
  });
  const visitors: Visitor[] = visitorsRes?.data ?? [];

  // Create visitor log mutation
  const createMutation = useMutation({
    mutationFn: (newVisitor: any) => createVisitor(newVisitor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myVisitors", currentUser?.id] });
      setShowModal(false);
      reset();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to log visitor");
    },
  });

  // Student mark checked out mutation
  const checkOutMutation = useMutation({
    mutationFn: (visitorId: string) =>
      updateVisitor(visitorId, { checkOutTime: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myVisitors", currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to mark visitor checked out");
    },
  });

  const onSubmit = (formData: VisitorFormValues) => {
    if (!currentUser?.id) {
      alert("Please log in to log a visitor.");
      return;
    }
    createMutation.mutate({
      student: currentUser.id,
      visitorName: formData.visitorName,
      visitorPhone: formData.visitorPhone,
      purpose: formData.purpose,
      checkInTime: new Date().toISOString(),
    });
  };

  const handleCheckOut = (visitorId: string) => {
    checkOutMutation.mutate(visitorId);
  };

  const totalVisits = visitors.length;
  const checkedOutCount = visitors.filter((v) => !!v.checkOutTime).length;
  const stillVisitingCount = totalVisits - checkedOutCount;

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Please log in to view your visitor log.</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading visitor logs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load visitor logs. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Visitor Log</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            View and log all visitors who come to see you at the hostel.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-900 transition shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} />
          Log a Visitor
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          ["TOTAL VISITS", String(totalVisits)],
          ["CHECKED OUT", String(checkedOutCount)],
          ["STILL VISITING", String(stillVisitingCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT: Visitor List */}
        <div className="xl:col-span-2">
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold">Visitor History</h3>
              <span className="text-xs text-gray-400">{totalVisits} total visits</span>
            </div>
            <div>
              {visitors.map((v, i) => (
                <VisitorRow
                  key={v._id}
                  visitor={v}
                  isFirst={i === 0}
                  onCheckOut={handleCheckOut}
                  isCheckingOut={checkOutMutation.isPending}
                />
              ))}
              {visitors.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  <Users size={36} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No visitor logs found.</p>
                  <p className="text-xs text-gray-400 mt-1">Use the "Log a Visitor" button above to record a new guest.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT: Info panels */}
        <div className="space-y-4 sm:space-y-6">
          {/* Visitor Policy */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">Visitor Policy</h3>
            </div>
            <div className="p-4 sm:p-5 space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-black mb-1">Visiting Hours</p>
                <p>Morning: 10:00 AM – 12:00 PM</p>
                <p>Evening: 4:00 PM – 7:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">Rules</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All visitors must register at the front desk.</li>
                  <li>Visitors are not allowed inside rooms.</li>
                  <li>Guest ID must be presented on entry.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Most Recent Visitor */}
          {visitors.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold">Most Recent Visitor</h3>
              </div>
              <div className="p-4 sm:p-5 space-y-2">
                <p className="font-semibold text-black">{visitors[0].visitorName}</p>
                <p className="text-sm text-gray-500">{visitors[0].purpose}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <CalendarDays size={11} />
                  {new Date(visitors[0].checkInTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                {visitors[0].checkOutTime && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    Checked out: {new Date(visitors[0].checkOutTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Log Visitor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Log a Visitor</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-gray-150 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Visitor Name</label>
                <input
                  type="text"
                  placeholder="Full name of visitor"
                  {...register("visitorName")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {errors.visitorName && (
                  <p className="text-red-500 text-xs mt-1">{errors.visitorName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Visitor Phone</label>
                <input
                  type="text"
                  placeholder="98XXXXXXXX"
                  {...register("visitorPhone")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {errors.visitorPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.visitorPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Delivering clothes, Family visit"
                  {...register("purpose")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {errors.purpose && (
                  <p className="text-red-500 text-xs mt-1">{errors.purpose.message}</p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {createMutation.isPending ? "Logging..." : "Log Visitor"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}