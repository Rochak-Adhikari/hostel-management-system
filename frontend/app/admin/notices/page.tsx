"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getAllNotices, createNotice, updateNotice, deleteNotice } from "@/api/noticeapi";

type Notice = {
  _id: string;
  title: string;
  content: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
};

// Notice form ko validation schema
const noticeSchema = yup.object({
  title: yup.string().required("Notice title is required"),
  content: yup.string().required("Notice content is required"),
});

type NoticeFormValues = yup.InferType<typeof noticeSchema>;

type ModalMode = "add" | "edit" | null;

export default function AdminNoticesPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Notice | null>(null);

  // localStorage bata login gargda save vaisako user info nikalne
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // React hook form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NoticeFormValues>({
    resolver: yupResolver(noticeSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Sabai notice fetch garne
  const { data: noticesRes, isPending, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: getAllNotices,
  });
  const notices: Notice[] = noticesRes?.data ?? [];

  // Create notice mutation
  const createMutation = useMutation({
    mutationFn: (newNotice: any) => createNotice(newNotice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      closeModal();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to post notice");
    },
  });

  // Update notice mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateNotice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      closeModal();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to update notice");
    },
  });

  // Delete notice mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to delete notice");
    },
  });

  function openAdd() {
    reset({ title: "", content: "" });
    setSelected(null);
    setModal("add");
  }

  function openEdit(notice: Notice) {
    setSelected(notice);
    setValue("title", notice.title);
    setValue("content", notice.content);
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    reset();
  }

  function onSubmit(formData: NoticeFormValues) {
    if (modal === "add") {
      createMutation.mutate({
        title: formData.title,
        content: formData.content,
        postedBy: currentUser?.id || currentUser?._id,
      });
    } else if (modal === "edit" && selected) {
      updateMutation.mutate({
        id: selected._id,
        data: {
          title: formData.title,
          content: formData.content,
        },
      });
    }
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this notice?")) {
      deleteMutation.mutate(id);
    }
  }

  const currentMonthNotices = notices.filter((n) => {
    const d = new Date(n.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading notices...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-red-500">
        <p>Failed to load notices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Notices</h1>
          <p className="text-gray-500 mt-1">Post and manage official hostel notices for all students.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          Post Notice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ["TOTAL NOTICES", String(notices.length)],
          ["POSTED THIS MONTH", String(currentMonthNotices)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Notice Board */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold">All Notices</h2>
          <span className="text-xs text-gray-400">{notices.length} total</span>
        </div>

        <div className="divide-y divide-gray-100">
          {notices.map((n) => (
            <div key={n._id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell size={15} className="text-[#CB30E0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{n.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>Posted: {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(n)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-600"
                  title="Edit notice"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                  title="Delete notice"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {notices.length === 0 && (
            <p className="py-10 text-center text-gray-400 text-sm">No notices posted yet.</p>
          )}
        </div>
      </div>

      {/* Add / Edit Notice Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold">
                {modal === "add" ? "Post New Notice" : "Edit Notice"}
              </h2>
              <button type="button" onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fee Payment Reminder"
                  {...register("title")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Content</label>
                <textarea
                  rows={5}
                  placeholder="Write the full notice content here..."
                  {...register("content")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
                )}
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {modal === "add"
                  ? createMutation.isPending ? "Posting..." : "Post Notice"
                  : updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
