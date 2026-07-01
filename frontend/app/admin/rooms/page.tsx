"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Room = {
  id: string;
  roomNumber: string;
  floor: string;
  roomType: string;
  capacity: number;
  occupied: number;
  monthlyFee: number;
};

const initialRooms: Room[] = [
  { id: "RM-001", roomNumber: "A-101", floor: "Ground", roomType: "Single", capacity: 1, occupied: 1, monthlyFee: 12000 },
  { id: "RM-002", roomNumber: "A-102", floor: "Ground", roomType: "Double", capacity: 2, occupied: 2, monthlyFee: 9000 },
  { id: "RM-003", roomNumber: "A-103", floor: "Ground", roomType: "Triple", capacity: 3, occupied: 2, monthlyFee: 7000 },
  { id: "RM-004", roomNumber: "B-201", floor: "First", roomType: "Single", capacity: 1, occupied: 0, monthlyFee: 12000 },
  { id: "RM-005", roomNumber: "B-205", floor: "First", roomType: "Double", capacity: 2, occupied: 2, monthlyFee: 9000 },
  { id: "RM-006", roomNumber: "C-102", floor: "Ground", roomType: "Double", capacity: 2, occupied: 1, monthlyFee: 9000 },
  { id: "RM-007", roomNumber: "C-201", floor: "First", roomType: "Triple", capacity: 3, occupied: 3, monthlyFee: 7000 },
  { id: "RM-008", roomNumber: "D-301", floor: "Second", roomType: "Single", capacity: 1, occupied: 0, monthlyFee: 12000 },
];

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${
        status === "Occupied"
          ? "bg-black text-white border-black"
          : "border-gray-300 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

type ModalMode = "add" | "edit" | null;

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Room | null>(null);
  const [form, setForm] = useState<Partial<Room>>({});

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.occupied >= r.capacity).length;
  const availableRooms = rooms.filter((r) => r.occupied < r.capacity).length;

  function openAdd() {
    setForm({});
    setSelected(null);
    setModal("add");
  }

  function openEdit(r: Room) {
    setForm({ ...r });
    setSelected(r);
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setForm({});
  }

  function handleDelete(id: string) {
    if (confirm("Delete this room record?")) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
    }
  }

  function handleSave() {
    if (modal === "add") {
      const newId = `RM-${String(rooms.length + 1).padStart(3, "0")}`;
      setRooms((prev) => [
        ...prev,
        {
          ...(form as Room),
          id: newId,
          capacity: Number(form.capacity),
          occupied: Number(form.occupied ?? 0),
          monthlyFee: Number(form.monthlyFee),
        },
      ]);
    } else if (modal === "edit" && selected) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === selected.id
            ? {
                ...r,
                ...form,
                capacity: Number(form.capacity),
                occupied: Number(form.occupied),
                monthlyFee: Number(form.monthlyFee),
              }
            : r
        )
      );
    }
    closeModal();
  }

  const formFields = [
    { key: "roomNumber", label: "Room Number", placeholder: "e.g. A-101" },
    { key: "floor", label: "Floor", placeholder: "e.g. Ground / First" },
    { key: "roomType", label: "Room Type", placeholder: "Single / Double / Triple" },
    { key: "capacity", label: "Capacity", placeholder: "Max occupants" },
    { key: "occupied", label: "Currently Occupied", placeholder: "Current count" },
    { key: "monthlyFee", label: "Monthly Fee (Rs.)", placeholder: "e.g. 12000" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Rooms</h1>
          <p className="text-gray-500 mt-1">Manage hostel room records and availability.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["TOTAL ROOMS", String(totalRooms)],
          ["OCCUPIED", String(occupiedRooms)],
          ["AVAILABLE", String(availableRooms)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold">All Rooms</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room No.</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Floor</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Fee</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => {
                const status = r.occupied >= r.capacity ? "Occupied" : "Available";
                return (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-5 text-sm font-semibold">{r.roomNumber}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.floor}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.roomType}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.capacity}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.occupied} / {r.capacity}</td>
                    <td className="py-4 px-5 text-sm font-medium">Rs. {r.monthlyFee.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <StatusPill status={status} />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">
                {modal === "add" ? "Add New Room" : "Edit Room"}
              </h2>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={String((form as Record<string, unknown>)[field.key] ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSave} className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition">
                {modal === "add" ? "Add Room" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
