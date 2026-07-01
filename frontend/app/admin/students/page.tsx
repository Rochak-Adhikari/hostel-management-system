"use client";

import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, X } from "lucide-react";

type Student = {
  id: string;
  name: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  guardianName: string;
  guardianPhone: string;
  admissionDate: string;
  room: string;
};

const initialStudents: Student[] = [
  {
    id: "STU-001",
    name: "Rochak Sharma",
    gender: "Male",
    address: "Kathmandu, Nepal",
    phone: "9841234567",
    email: "rochak@example.com",
    guardianName: "Ram Sharma",
    guardianPhone: "9812345678",
    admissionDate: "2025-01-10",
    room: "A-101",
  },
  {
    id: "STU-002",
    name: "Aayush Karki",
    gender: "Male",
    address: "Pokhara, Nepal",
    phone: "9852345678",
    email: "aayush@example.com",
    guardianName: "Hari Karki",
    guardianPhone: "9823456789",
    admissionDate: "2025-01-15",
    room: "B-205",
  },
  {
    id: "STU-003",
    name: "Srijana Thapa",
    gender: "Female",
    address: "Lalitpur, Nepal",
    phone: "9863456789",
    email: "srijana@example.com",
    guardianName: "Sita Thapa",
    guardianPhone: "9834567890",
    admissionDate: "2025-02-01",
    room: "C-102",
  },
  {
    id: "STU-004",
    name: "Bikash Adhikari",
    gender: "Male",
    address: "Bhaktapur, Nepal",
    phone: "9874567890",
    email: "bikash@example.com",
    guardianName: "Gopal Adhikari",
    guardianPhone: "9845678901",
    admissionDate: "2025-02-10",
    room: "A-103",
  },
  {
    id: "STU-005",
    name: "Priya Shrestha",
    gender: "Female",
    address: "Chitwan, Nepal",
    phone: "9885678901",
    email: "priya@example.com",
    guardianName: "Mohan Shrestha",
    guardianPhone: "9856789012",
    admissionDate: "2025-03-01",
    room: "C-201",
  },
];

function StatusPill({ label, type }: { label: string; type: "active" | "neutral" }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${
        type === "active"
          ? "bg-black text-white border-black"
          : "border-gray-300 text-gray-500"
      }`}
    >
      {label}
    </span>
  );
}

type ModalMode = "view" | "add" | "edit" | null;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Student | null>(null);
  const [form, setForm] = useState<Partial<Student>>({});

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.room.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({});
    setSelected(null);
    setModal("add");
  }

  function openEdit(s: Student) {
    setForm({ ...s });
    setSelected(s);
    setModal("edit");
  }

  function openView(s: Student) {
    setSelected(s);
    setModal("view");
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setForm({});
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function handleSave() {
    if (modal === "add") {
      const newId = `STU-${String(students.length + 1).padStart(3, "0")}`;
      setStudents((prev) => [...prev, { ...(form as Student), id: newId }]);
    } else if (modal === "edit" && selected) {
      setStudents((prev) =>
        prev.map((s) => (s.id === selected.id ? { ...s, ...form } : s))
      );
    }
    closeModal();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Students</h1>
          <p className="text-gray-500 mt-1">
            Manage all registered hostel students.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          Add Student
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL STUDENTS", String(students.length)],
          ["MALE", String(students.filter((s) => s.gender === "Male").length)],
          ["FEMALE", String(students.filter((s) => s.gender === "Female").length)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl">
        {/* Search */}
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admission Date</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-5 text-sm font-medium">{s.id}</td>
                  <td className="py-4 px-5 text-sm font-semibold">{s.name}</td>
                  <td className="py-4 px-5">
                    <StatusPill label={s.gender} type={s.gender === "Male" ? "neutral" : "active"} />
                  </td>
                  <td className="py-4 px-5 text-sm text-gray-500">{s.phone}</td>
                  <td className="py-4 px-5 text-sm font-medium">{s.room}</td>
                  <td className="py-4 px-5 text-sm text-gray-500">{s.admissionDate}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openView(s)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">
                {modal === "view" ? "Student Details" : modal === "add" ? "Add New Student" : "Edit Student"}
              </h2>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modal === "view" && selected ? (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Student ID", selected.id],
                    ["Name", selected.name],
                    ["Gender", selected.gender],
                    ["Phone", selected.phone],
                    ["Email", selected.email],
                    ["Address", selected.address],
                    ["Room", selected.room],
                    ["Admission Date", selected.admissionDate],
                    ["Guardian Name", selected.guardianName],
                    ["Guardian Phone", selected.guardianPhone],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "e.g. Ramesh Sharma" },
                    { key: "gender", label: "Gender", placeholder: "Male / Female" },
                    { key: "address", label: "Address", placeholder: "City, Nepal" },
                    { key: "phone", label: "Phone", placeholder: "98XXXXXXXX" },
                    { key: "email", label: "Email", placeholder: "student@example.com" },
                    { key: "room", label: "Room Number", placeholder: "e.g. A-101" },
                    { key: "guardianName", label: "Guardian Name", placeholder: "e.g. Hari Sharma" },
                    { key: "guardianPhone", label: "Guardian Phone", placeholder: "98XXXXXXXX" },
                    { key: "admissionDate", label: "Admission Date", placeholder: "YYYY-MM-DD" },
                  ].map((field) => (
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
            </div>
            {modal !== "view" && (
              <div className="p-6 pt-0 flex gap-3 justify-end">
                <button onClick={closeModal} className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition">
                  {modal === "add" ? "Add Student" : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
