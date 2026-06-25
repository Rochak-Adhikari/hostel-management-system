import AdminSidebar from "@/components/AdminSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen ...">
     <AdminSidebar />
      <div className="flex-1 p-5 overflow-y-auto">{children}</div>
</div>
  );
}