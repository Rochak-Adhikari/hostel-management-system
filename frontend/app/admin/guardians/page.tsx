"use client";

import { useState } from "react";
import { Search, Eye, Pencil, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStudents, updateStudent, deleteStudent } from "@/api/studentapi";

type LinkedStudent = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
};

type Guardian = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  // backend le populate garxa, tara link nabhaye null aauxa
  linked_student: LinkedStudent | null;
  createdAt: string;
};

type ModalMode = "view" | "edit" | "link" | null;

export default function GuardiansPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Guardian | null>(null);
  const [form, setForm] = useState<Partial<Guardian>>({});
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const { data, isPending, isError } = useQuery({
    queryKey: ["students", "guardian"],
    queryFn: () => getAllStudents("guardian"),
  });
  const guardians: Guardian[] = data?.data ?? [];

  // link garna ko lagi student ko list chahincha
  const { data: studentsData } = useQuery({
    queryKey: ["students", "student"],
    queryFn: () => getAllStudents("student"),
  });
  const students: LinkedStudent[] = studentsData?.data ?? [];

  const filtered = guardians.filter(
    (g) =>
      g.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      g.email?.toLowerCase().includes(search.toLowerCase()) ||
      g.phone?.toLowerCase().includes(search.toLowerCase()) ||
      g.linked_student?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Guardian> | { linked_student: string | null } }) =>
      updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      closeModal();
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message ?? "Something went wrong.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message ?? "Something went wrong.");
    },
  });

  function openView(g: Guardian) {
    setSelected(g);
    setModal("view");
  }

  function openEdit(g: Guardian) {
    setForm({ ...g });
    setSelected(g);
    setModal("edit");
  }

  function openLink(g: Guardian) {
    setSelected(g);
    setSelectedStudentId(g.linked_student?._id ?? "");
    setModal("link");
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setForm({});
    setSelectedStudentId("");
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this guardian?")) {
      deleteMutation.mutate(id);
    }
  }

  function handleSave() {
    if (!selected) return;
    const { full_name, phone, email, address } = form;
    updateMutation.mutate({
      id: selected._id,
      data: { full_name, phone, email, address },
    });
  }

  function handleLink() {
    if (!selected) return;
    updateMutation.mutate({
      id: selected._id,
      data: { linked_student: selectedStudentId || null },
    });
  }

  const formFields: { key: keyof Guardian; label: string; placeholder: string }[] = [
    { key: "full_name", label: "Full Name", placeholder: "e.g. Ram Bahadur Sharma" },
    { key: "phone", label: "Phone", placeholder: "98XXXXXXXX" },
    { key: "email", label: "Email", placeholder: "guardian@example.com" },
    { key: "address", label: "Address", placeholder: "City, Nepal" },
  ];

  const linkedCount = guardians.filter((g) => g.linked_student).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Guardians</h1>
          <p className="text-gray-500 mt-1">
            Manage registered guardians and the student each one is linked to.
          </p>
        </div>
      </div>

      {isPending && <p className="text-sm text-gray-500">Loading guardians...</p>}
      {isError && (
        <p className="text-sm text-red-500">Failed to load guardians. Please try again.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL GUARDIANS", String(guardians.length)],
          ["LINKED", String(linkedCount)],
          ["NOT LINKED", String(guardians.length - linkedCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guardian name, email, phone or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked Student</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-5 text-sm font-semibold">{g.full_name}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{g.phone}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{g.email}</td>
                  <td className="py-4 px-5 text-sm">
                    {g.linked_student ? (
                      <span className="font-medium">{g.linked_student.full_name}</span>
                    ) : (
                      <span className="text-gray-400">Not linked</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-sm text-gray-500">
                    {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openView(g)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => openLink(g)}
                        className="px-2 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-xs font-medium"
                        title="Link Student"
                      >
                        {g.linked_student ? "Change" : "Link"}
                      </button>
                      <button onClick={() => handleDelete(g._id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !isPending && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                    No guardians found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">
                {modal === "view"
                  ? "Guardian Details"
                  : modal === "edit"
                  ? "Edit Guardian"
                  : "Link Student"}
              </h2>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modal === "view" && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Name", selected.full_name],
                    ["Phone", selected.phone],
                    ["Email", selected.email],
                    ["Address", selected.address],
                    ["Linked Student", selected.linked_student?.full_name],
                    ["Student Email", selected.linked_student?.email],
                    ["Student Phone", selected.linked_student?.phone],
                    [
                      "Registered",
                      selected.createdAt
                        ? new Date(selected.createdAt).toLocaleDateString()
                        : "-",
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold mt-0.5">{value || "-"}</p>
                    </div>
                  ))}
                </div>
              )}

              {modal === "edit" && (
                <div className="grid grid-cols-2 gap-4">
                  {formFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={(form as Record<string, string>)[field.key] ?? ""}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  ))}
                </div>
              )}

              {modal === "link" && (
                <div>
                  <p className="text-sm text-gray-500 mb-3">
                    Linking a student to{" "}
                    <span className="font-semibold">{selected.full_name}</span>
                  </p>
                  <label className="block text-xs text-gray-500 mb-1">Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">Not linked</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.full_name} ({s.email})
                      </option>
                    ))}
                  </select>
                  {students.length === 0 && (
                    <p className="text-xs text-gray-400 mt-2">No students registered yet.</p>
                  )}
                </div>
              )}
            </div>

            {modal !== "view" && (
              <div className="p-6 pt-0 flex gap-3 justify-end">
                <button onClick={closeModal} className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={modal === "edit" ? handleSave : handleLink}
                  className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {modal === "edit" ? "Save Changes" : "Save Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
