import Sidebar from "@/components/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-5 pt-[72px] lg:pt-5">
        {children}
      </div>
    </div>
  );
}
