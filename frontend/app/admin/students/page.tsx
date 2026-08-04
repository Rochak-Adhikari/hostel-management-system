"use client";

import { useState } from "react";
import { Search, Eye, Pencil, Trash2, X, Home } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStudents, updateStudent, deleteStudent } from "@/api/studentapi";
import { getAllAllocations, createAllocation, deleteAllocation, getAvailableBeds } from "@/api/allocationapi";
import { getAllRooms } from "@/api/roomapi";

type Student = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  guardian: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
};

type Room = {
  _id: string;
  RoomNumber: string;
  block: string;
  Floor: string;
  RoomType: string;
  Capacity: number;
  Occupied: number;
  MonthlyFee: number;
};

type Allocation = {
  _id: string;
  student: string;
  room: string;
  bed: string;
};

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

type ModalMode = "view" | "edit" | "assign" | null;



export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Student | null>(null);
  const [form, setForm] = useState<Partial<Student>>({});
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedBed, setSelectedBed] = useState<string>("");

  const { data, isPending, isError } = useQuery({
    queryKey: ["students", "student"],
    queryFn: () => getAllStudents("student"),
  });
  const students: Student[] = data?.data ?? [];

  const { data: allocationsData } = useQuery({
    queryKey: ["allocations"],
    queryFn: getAllAllocations,
  });
  const allocations: Allocation[] = allocationsData?.data ?? [];

  const { data: roomsData } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });
  const rooms: Room[] = roomsData?.data ?? [];

  const { data: availableBedsData } = useQuery({
    queryKey: ["availableBeds", selectedRoomId],
    queryFn: () => getAvailableBeds(selectedRoomId),
    enabled: !!selectedRoomId,
  });
  const availableBeds: string[] = availableBedsData?.data ?? [];

  // TESTING KO LAGI: console ma data haru check garne
  console.log("rooms fetched:", rooms);
  console.log("allocations fetched:", allocations);

  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.toLowerCase().includes(search.toLowerCase())
  );

  function getAllocationForStudent(studentId: string): Allocation | undefined {
    return allocations.find((a) => a.student === studentId);
  }

  function getAssignedRoom(studentId: string): Room | undefined {
    const allocation = getAllocationForStudent(studentId);
    if (!allocation) return undefined;
    return rooms.find((r) => r._id === allocation.room);
  }

  function getAvailableRoomsForStudent(student: Student): Room[] {
    const available = rooms.filter((r) => {
      const hasSpace = r.Occupied < r.Capacity;
      return hasSpace;
    });
    // TESTING KO LAGI: yesle available rooms dekhauxa console ma
    console.log("available rooms for", student.full_name, ":", available);
    return available;
  }

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
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

  const assignMutation = useMutation({
    mutationFn: createAllocation,
    onSuccess: (res) => {
      // TESTING KO LAGI
      console.log("assign SUCCESS response:", res);
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      closeModal();
    },
    onError: (error: any) => {
      // TESTING KO LAGI: full error console ma print garne
      console.log("assign ERROR:", error);
      console.log("assign ERROR response data:", error?.response?.data);
      alert(error?.response?.data?.message ?? "Something went wrong.");
    },
  });

  const unassignMutation = useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message ?? "Something went wrong.");
    },
  });

  function openEdit(s: Student) {
    setForm({ ...s });
    setSelected(s);
    setModal("edit");
  }

  function openView(s: Student) {
    setSelected(s);
    setModal("view");
  }

  function openAssign(s: Student) {
    // TESTING KO LAGI
    console.log("openAssign clicked for:", s.full_name, s._id);
    setSelected(s);
    setSelectedRoomId("");
    setSelectedBed("");
    setModal("assign");
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setForm({});
    setSelectedRoomId("");
    setSelectedBed("");
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id);
    }
  }

  function handleSave() {
    if (selected) {
      updateMutation.mutate({ id: selected._id, data: form });
    }
  }

  function handleAssign() {
    // TESTING KO LAGI
    console.log("handleAssign called. selected:", selected?._id, "selectedRoomId:", selectedRoomId, "selectedBed:", selectedBed);
    if (!selected || !selectedRoomId || !selectedBed) {
      alert("Please select a room and a bed.");
      return;
    }
    assignMutation.mutate({ student: selected._id, room: selectedRoomId, bed: selectedBed });
  }

  function handleUnassign(studentId: string) {
    const allocation = getAllocationForStudent(studentId);
    if (allocation && confirm("Remove this student from their room?")) {
      unassignMutation.mutate(allocation._id);
    }
  }

  const formFields: { key: keyof Student; label: string; placeholder: string }[] = [
    { key: "full_name", label: "Full Name", placeholder: "e.g. Ramesh Sharma" },
    { key: "gender", label: "Gender", placeholder: "male / female / other" },
    { key: "address", label: "Address", placeholder: "City, Nepal" },
    { key: "phone", label: "Phone", placeholder: "98XXXXXXXX" },
    { key: "email", label: "Email", placeholder: "student@example.com" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Students</h1>
          <p className="text-gray-500 mt-1">Manage all registered hostel students.</p>
        </div>
      </div>

      {isPending && <p className="text-sm text-gray-500">Loading students...</p>}
      {isError && <p className="text-sm text-red-500">Failed to load students. Please try again.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL STUDENTS", String(students.length)],
          ["MALE", String(students.filter((s) => s.gender === "male").length)],
          ["FEMALE", String(students.filter((s) => s.gender === "female").length)],
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
              placeholder="Search by name, email or phone..."
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
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const assignedRoom = getAssignedRoom(s._id);
                return (
                  <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-5 text-sm font-semibold">{s.full_name}</td>
                    <td className="py-4 px-5">
                      <StatusPill label={s.gender} type={s.gender === "male" ? "neutral" : "active"} />
                    </td>
                    <td className="py-4 px-5 text-sm text-gray-500">{s.phone}</td>
                    <td className="py-4 px-5 text-sm">
                      {assignedRoom ? (
                        <span className="font-medium">
                          {assignedRoom.RoomNumber} (Block {assignedRoom.block}, Bed {getAllocationForStudent(s._id)?.bed})
                        </span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-sm text-gray-500">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openView(s)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="View">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="Edit">
                          <Pencil size={14} />
                        </button>
                        {assignedRoom ? (
                          <button onClick={() => handleUnassign(s._id)} className="p-1.5 rounded-lg border border-orange-200 text-orange-500 hover:bg-orange-50 transition" title="Remove from Room">
                            <Home size={14} />
                          </button>
                        ) : (
                          <button type="button" onClick={() => openAssign(s)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="Assign Room">
                            <Home size={14} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !isPending && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                    No students found.
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
                {modal === "view" ? "Student Details" : modal === "edit" ? "Edit Student" : "Assign Room"}
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
                    ["Gender", selected.gender],
                    ["Phone", selected.phone],
                    ["Email", selected.email],
                    ["Address", selected.address],
                    ["Guardian Name", selected.guardian?.name],
                    ["Guardian Phone", selected.guardian?.phone],
                    ["Guardian Email", selected.guardian?.email],
                    ["Room Allocation", (() => {
                      const assignedRoom = getAssignedRoom(selected._id);
                      const allocation = getAllocationForStudent(selected._id);
                      return assignedRoom ? `${assignedRoom.RoomNumber} (Block ${assignedRoom.block}, Bed ${allocation?.bed})` : "Unassigned";
                    })()],
                    ["Registered", selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "-"],
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

              {modal === "assign" && (
                <div>
                  <p className="text-sm text-gray-500 mb-3">
                    Assigning a room for <span className="font-semibold">{selected.full_name}</span>
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Available Room</label>
                      <select
                        value={selectedRoomId}
                        onChange={(e) => {
                          setSelectedRoomId(e.target.value);
                          setSelectedBed("");
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="">Select a room</option>
                        {getAvailableRoomsForStudent(selected).map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.RoomNumber} - {r.RoomType} ({r.Occupied}/{r.Capacity})
                          </option>
                        ))}
                      </select>
                      {getAvailableRoomsForStudent(selected).length === 0 && (
                        <p className="text-xs text-gray-400 mt-2">
                          No available rooms right now.
                        </p>
                      )}
                    </div>

                    {selectedRoomId && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Available Beds</label>
                        <select
                          value={selectedBed}
                          onChange={(e) => setSelectedBed(e.target.value)}
                          className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="">Select a bed</option>
                          {availableBeds.map((b) => (
                            <option key={b} value={b}>
                              Bed {b.toUpperCase()}
                            </option>
                          ))}
                        </select>
                        {availableBeds.length === 0 && (
                          <p className="text-xs text-red-500 mt-1">No beds available in this room.</p>
                        )}
                      </div>
                    )}
                  </div>
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
                  disabled={modal === "assign" && (!selectedRoomId || !selectedBed)}
                  onClick={modal === "edit" ? handleSave : handleAssign}
                  className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {modal === "edit" ? "Save Changes" : "Assign Room"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}