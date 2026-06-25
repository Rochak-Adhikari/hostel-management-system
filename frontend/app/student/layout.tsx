import Sidebar from "@/components/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen ...">
     <Sidebar />
      <div className="flex-1 p-5 overflow-y-auto">{children}</div>
</div>
  );
}