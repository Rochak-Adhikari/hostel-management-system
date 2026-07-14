"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRooms, deleteRoom, createRoom, updateRoom as updateRoomApi } from "@/api/roomapi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RoomSchema } from "@/schema/roomschema";
import * as yup from "yup";

// yup schema bata form ko type nikalne (RoomNumber, Floor, RoomType, Capacity, Occupied, MonthlyFee)
type RoomFormValues = yup.InferType<typeof RoomSchema>;

// backend bata aaune Room document ko shape (yesma _id pani cha, MongoDB le auto generate garcha)
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

type ModalMode = "add" | "edit" | null;

// Occupied/Capacity ko basis ma "Occupied" ya "Available" badge dekhaune sano component
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

export default function RoomsPage() {
  // ── DATA FETCHING ──────────────────────────────────────────────────────
  // sabai room haru backend bata fetch garna ko lagi (GET /api/v1/rooms)
  const { data, isPending, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });

  // backend le { message, code, status, data } pathaucha, tesaile data.data ma matra actual array huncha
  const rooms: Room[] = data?.data ?? [];

  // ── MODAL / SELECTION STATE ────────────────────────────────────────────
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Room | null>(null);

  // ── FORM (react-hook-form + yup validation) ───────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: yupResolver(RoomSchema),
  });

  // ── SUMMARY COUNTS ─────────────────────────────────────────────────────
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.Occupied >= r.Capacity).length;
  const availableRooms = rooms.filter((r) => r.Occupied < r.Capacity).length;

  // ── MUTATIONS (Create / Update / Delete) ──────────────────────────────
  const queryClient = useQueryClient();

  // room delete garna ko lagi
  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      // delete pachi "rooms" cache lai stale mani refetch garaune
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  // naya room create garna ko lagi
  const createMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      closeModal();
    },
     onError: (error: any) => {
    alert(error?.response?.data?.message ?? "Something went wrong.");
  },
  });

  // existing room update garna ko lagi
  // updateRoomApi lai id ra data dubai chaine bhaye pani, mutate() le euta matra argument dincha,
  // tesaile euta object { id, data } ko form ma wrap garya
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Room> }) =>
      updateRoomApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      closeModal();
    },
  });

  // ── MODAL HELPERS ──────────────────────────────────────────────────────

  // "Add Room" button click garda modal add mode ma khulcha, form khali huncha
  function openAdd() {
    reset();
    setSelected(null);
    setModal("add");
  }

  // "Edit" button click garda modal edit mode ma khulcha, form ma existing room ko data prefill huncha
  function openEdit(r: Room) {
    reset(r);
    setSelected(r);
    setModal("edit");
  }

  // modal band garda form pani reset garne
  function closeModal() {
    setModal(null);
    setSelected(null);
    reset();
  }

  // ── ACTIONS ─────────────────────────────────────────────────────────────

  function handleDelete(id: string) {
    if (confirm("Delete this room record?")) {
      deleteMutation.mutate(id);
    }
  }

  // handleSubmit(handleSave) le yup validation pass vaye pachi matra yo function call garcha,
  // ra validated data lai formData ko roop ma dincha - form state manually padhnu pardaina
  function handleSave(formData: RoomFormValues) {
    const payload = {
      RoomNumber: formData.RoomNumber,
      block: formData.block,
      Floor: formData.Floor,
      RoomType: formData.RoomType,
      Capacity: Number(formData.Capacity),
      Occupied: Number(formData.Occupied ?? 0),
      MonthlyFee: Number(formData.MonthlyFee),
    };

    if (modal === "add") {
      createMutation.mutate(payload);
    } else if (modal === "edit" && selected) {
      updateMutation.mutate({ id: selected._id, data: payload });
    }
  }

  // modal ma dekhine input fields ko list (label + placeholder + register key)
  const formFields: { key: keyof RoomFormValues; label: string; placeholder: string; isSelect?: boolean; options?: string[] }[] = [
    { key: "RoomNumber", label: "Room Number", placeholder: "e.g. A-101" },
    { key: "block", label: "Block", placeholder: "", isSelect: true, options: ["A", "B", "C", "D", "E"] },
    { key: "Floor", label: "Floor", placeholder: "e.g. Ground / First" },
    { key: "RoomType", label: "Room Type", placeholder: "Single / Double / Triple" },
    { key: "Capacity", label: "Capacity", placeholder: "Max occupants" },
    { key: "Occupied", label: "Currently Occupied", placeholder: "Current count" },
    { key: "MonthlyFee", label: "Monthly Fee (Rs.)", placeholder: "e.g. 12000" },
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

      {/* Loading / Error states - backend bata data aaudai garda samma ko lagi  loading rooms dekhauney kam garxa*/}
      {isPending && (
        <p className="text-sm text-gray-500">Loading rooms...</p>
      )}
      {isError && (
        <p className="text-sm text-red-500">Failed to load rooms. Please try again.</p>
      )}

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
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Block</th>
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
                // capacity bhanda occupied badi ya barabar vaye "Occupied", hoina vaye "Available"
                const status = r.Occupied >= r.Capacity ? "Occupied" : "Available";
                return (
                  <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-5 text-sm font-semibold">{r.RoomNumber}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.block}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.Floor}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.RoomType}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.Capacity}</td>
                    <td className="py-4 px-5 text-sm text-gray-500">{r.Occupied} / {r.Capacity}</td>
                    <td className="py-4 px-5 text-sm font-medium">Rs. {r.MonthlyFee.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <StatusPill status={status} />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition" title="Delete">
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

      {/* Modal (Add / Edit) */}
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

            {/* yaha <form> tag chaidaina, kina bhane Save button le nai handleSubmit(handleSave) call garcha */}
            <div className="p-6 grid grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                  {field.isSelect ? (
                    <select
                      {...register(field.key)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="">Select Block</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      {...register(field.key)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  )}
                  {/* yup schema le fail garya vane, field ko tala error message dekhaune */}
                  {errors[field.key] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.key]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              {/* handleSubmit(handleSave): pahila yup validation chalcha, pass vaye matra handleSave lai validated data pathaucha */}
              <button
                onClick={handleSubmit(handleSave)}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition"
              >
                {modal === "add" ? "Add Room" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}