"use client";

import { useState } from "react";
import { Plus, Search, X, Trash2, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getAllFees, createFee, updateFee, deleteFee } from "@/api/feeapi";
import { getAllStudents } from "@/api/studentapi";

type Fee = {
  _id: string;
  student: string | { _id: string; full_name: string; email: string };
  month: string;
  amount: number;
  status: "Unpaid" | "Paid" | "Overdue";
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
};

// Add fee form validation schema
const addFeeSchema = yup.object({
  student: yup.string().required("Please select a student"),
  month: yup.string().required("Billing month is required"),
  amount: yup.number().typeError("Amount must be a number").positive("Amount must be positive").required("Amount is required"),
  dueDate: yup.string().required("Due date is required"),
  paymentMethod: yup.string().optional(),
});

type AddFeeFormValues = yup.InferType<typeof addFeeSchema>;

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-black text-white border-black",
  Unpaid: "border-gray-400 text-gray-500",
  Overdue: "border-red-400 text-red-500",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${STATUS_STYLES[status] || "border-gray-300 text-gray-500"}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFeeForPay, setSelectedFeeForPay] = useState<Fee | null>(null);
  const [payMethodInput, setPayMethodInput] = useState("Cash");

  // React hook form naya fee create garna ko lagi
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<AddFeeFormValues>({
    resolver: yupResolver(addFeeSchema) as any,
    defaultValues: {
      student: "",
      month: "",
      amount: 12000,
      dueDate: "",
      paymentMethod: "",
    },
  });

  // Sabai fee records fetch garne
  const { data: feesRes, isPending: isFeesLoading, isError: isFeesError } = useQuery({
    queryKey: ["fees"],
    queryFn: getAllFees,
  });
  const fees: Fee[] = feesRes?.data ?? [];

  // Sabai student list fetch garne (fee doc ma raw student id vaye name resolve garna)
  const { data: studentsRes } = useQuery({
    queryKey: ["students", "student"],
    queryFn: () => getAllStudents("student"),
  });
  const students: any[] = studentsRes?.data ?? [];

  // Student ID to student object mapping map banaune
  const studentsMap = new Map<string, any>();
  students.forEach((s) => studentsMap.set(s._id, s));

  // Create fee mutation
  const createFeeMutation = useMutation({
    mutationFn: (data: any) => createFee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      setShowAddModal(false);
      resetAdd();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to create fee record");
    },
  });

  // Update fee mutation (Mark as Paid)
  const updateFeeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      setSelectedFeeForPay(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to update fee record");
    },
  });

  // Delete fee mutation
  const deleteFeeMutation = useMutation({
    mutationFn: (id: string) => deleteFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to delete fee record");
    },
  });

  function onAddSubmit(formData: AddFeeFormValues) {
    createFeeMutation.mutate({
      student: formData.student,
      month: formData.month,
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      paymentMethod: formData.paymentMethod || undefined,
    });
  }

  function handleMarkAsPaid() {
    if (!selectedFeeForPay) return;
    updateFeeMutation.mutate({
      id: selectedFeeForPay._id,
      data: {
        status: "Paid",
        paymentMethod: payMethodInput,
      },
    });
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this fee record?")) {
      deleteFeeMutation.mutate(id);
    }
  }

  // Student ko name nikalne helper function
  function getStudentName(studentField: string | { _id: string; full_name: string }): string {
    if (typeof studentField === "object" && studentField !== null) {
      return studentField.full_name || "Unknown Student";
    }
    const studentObj = studentsMap.get(studentField);
    return studentObj?.full_name || "Unknown Student";
  }

  // Filter fees based on search & filter status
  const filteredFees = fees.filter((f) => {
    const studentName = getStudentName(f.student);
    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.month.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = fees.filter((f) => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0);
  const pendingCount = fees.filter((f) => f.status === "Unpaid" || f.status === "Overdue").length;

  if (isFeesLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading payment & fee records...</p>
      </div>
    );
  }

  if (isFeesError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load payment records. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Payments & Fees</h1>
          <p className="text-gray-500 mt-1">Record, track, and manage all student hostel fee billing.</p>
        </div>
        <button
          onClick={() => {
            resetAdd();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          Create Fee Record
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL FEE RECORDS", String(fees.length)],
          ["TOTAL REVENUE (PAID)", `Rs. ${totalRevenue.toLocaleString()}`],
          ["UNPAID / OVERDUE", String(pendingCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or month..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {["Student", "Month / Period", "Amount", "Due Date", "Paid Date", "Method", "Status", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFees.map((f) => {
                const sName = getStudentName(f.student);
                const formattedDue = f.dueDate ? new Date(f.dueDate).toLocaleDateString("en-GB") : "—";
                const formattedPaid = f.paidDate ? new Date(f.paidDate).toLocaleDateString("en-GB") : "—";

                return (
                  <tr key={f._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-5 text-sm font-semibold text-gray-900">{sName}</td>
                    <td className="py-4 px-5 text-sm text-gray-600">{f.month}</td>
                    <td className="py-4 px-5 text-sm font-bold text-gray-900">Rs. {f.amount.toLocaleString()}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{formattedDue}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{formattedPaid}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{f.paymentMethod || "—"}</td>
                    <td className="py-4 px-5">
                      <StatusPill status={f.status} />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {f.status !== "Paid" && (
                          <button
                            onClick={() => {
                              setSelectedFeeForPay(f);
                              setPayMethodInput(f.paymentMethod || "Cash");
                            }}
                            className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                            title="Mark as Paid"
                          >
                            <CheckCircle2 size={13} />
                            Pay
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(f._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition"
                          title="Delete fee record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredFees.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitAdd(onAddSubmit)}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Create Fee Record</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Student</label>
                <select
                  {...registerAdd("student")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">-- Select Student --</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.full_name} ({s.email})
                    </option>
                  ))}
                </select>
                {addErrors.student && (
                  <p className="text-red-500 text-xs mt-1">{addErrors.student.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Billing Month / Period</label>
                <input
                  type="text"
                  placeholder="e.g. July 2026"
                  {...registerAdd("month")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {addErrors.month && (
                  <p className="text-red-500 text-xs mt-1">{addErrors.month.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Amount (Rs.)</label>
                  <input
                    type="number"
                    {...registerAdd("amount")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {addErrors.amount && (
                    <p className="text-red-500 text-xs mt-1">{addErrors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    {...registerAdd("dueDate")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {addErrors.dueDate && (
                    <p className="text-red-500 text-xs mt-1">{addErrors.dueDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Payment Method (optional)</label>
                <select
                  {...registerAdd("paymentMethod")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">None (Unpaid)</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createFeeMutation.isPending}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {createFeeMutation.isPending ? "Creating..." : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mark as Paid Modal */}
      {selectedFeeForPay && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-bold text-gray-800">Mark Fee as Paid</h2>
              <button
                onClick={() => setSelectedFeeForPay(null)}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Student</p>
                <p className="font-semibold text-sm text-gray-900">{getStudentName(selectedFeeForPay.student)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Period & Amount</p>
                <p className="font-semibold text-sm text-gray-900">{selectedFeeForPay.month} — Rs. {selectedFeeForPay.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Select Payment Method</label>
                <select
                  value={payMethodInput}
                  onChange={(e) => setPayMethodInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedFeeForPay(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsPaid}
                disabled={updateFeeMutation.isPending}
                className="px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {updateFeeMutation.isPending ? "Updating..." : "Confirm Paid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
