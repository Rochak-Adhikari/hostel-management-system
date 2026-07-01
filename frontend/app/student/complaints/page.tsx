"use client";

function StatusPill({ status }: { status: string }) {
  const base =
    "px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";

  const styles: Record<string, string> = {
    "IN PROGRESS": "border-black text-black",
    PENDING: "border-gray-400 text-gray-500",
    RESOLVED: "bg-black text-white border-black",
  };

  return <span className={`${base} ${styles[status]}`}>{status}</span>;
}

function ComplaintRow({
  code,
  type,
  title,
  date,
  status,
  active = false,
}: {
  code: string;
  type: string;
  title: string;
  date: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div
      className={`p-5 flex items-center justify-between border-b border-gray-200 cursor-pointer transition
      ${active ? "bg-gray-50" : "hover:bg-gray-50"}`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-gray-500 uppercase">
          {code} • {type}
        </span>
        <h4 className="text-base font-semibold text-black">{title}</h4>
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      <StatusPill status={status} />
    </div>
  );
}

function Card({
  title,
  children,
  rightAction,
}: {
  title: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold">{title}</h3>
        {rightAction}
      </div>
      {children}
    </section>
  );
}

export default function ComplaintsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">My Complaints</h1>
        <p className="text-gray-500 mt-2">
          Track, manage, and submit hostel-related complaints.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          ["TOTAL", "12"],
          ["PENDING", "2"],
          ["IN PROGRESS", "3"],
          ["RESOLVED", "7"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-2xl p-5"
          >
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          <Card title="Recent Complaints" rightAction={<button className="text-sm font-medium hover:underline">View All</button>}>
            <div>
              <ComplaintRow
                code="CMP-1045"
                type="Plumbing"
                title="Leaking Bathroom Tap"
                date="12 June 2026"
                status="IN PROGRESS"
                active
              />
              <ComplaintRow
                code="CMP-1042"
                type="Electricity"
                title="Ceiling Fan Sparking"
                date="10 June 2026"
                status="RESOLVED"
              />
              <ComplaintRow
                code="CMP-1039"
                type="Maintenance"
                title="Broken Bed Frame"
                date="05 June 2026"
                status="PENDING"
              />
            </div>
          </Card>

          {/* Details */}
          <Card title="Complaint Details: CMP-1045">
            <div className="p-5 space-y-4">
              <p className="text-gray-700">
                The tap in room 302 is leaking continuously despite being shut tightly.
              </p>

              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-sm font-semibold mb-2">Admin Response</p>
                <p className="text-sm text-gray-600 italic">
                  Technician has been assigned for inspection.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="p-5 space-y-3">
              <button className="w-full border border-black rounded-xl py-2 hover:bg-gray-50">
                Raise Complaint
              </button>
              <button className="w-full border border-black rounded-xl py-2 hover:bg-gray-50">
                View History
              </button>
              <button className="w-full border border-black rounded-xl py-2 hover:bg-gray-50">
                Contact Office
              </button>
            </div>
          </Card>

          <Card title="Emergency">
            <div className="p-5">
              <p className="text-sm text-gray-500 mb-2">
                For urgent issues contact:
              </p>
              <p className="text-lg font-bold">+977 9863564357</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}