import { Users, Phone, CalendarDays, Clock } from "lucide-react";

type Visitor = {
  id: number;
  visitorName: string;
  visitorPhone: string;
  visitPurpose: string;
  visitDate: string;
  checkOutTime: string | null;
};

const visitors: Visitor[] = [
  {
    id: 1,
    visitorName: "Ramesh Sharma",
    visitorPhone: "9841234567",
    visitPurpose: "Family Visit",
    visitDate: "30 Jun 2026",
    checkOutTime: "6:45 PM",
  },
  {
    id: 2,
    visitorName: "Sita Thapa",
    visitorPhone: "9852345678",
    visitPurpose: "Delivering Clothes",
    visitDate: "28 Jun 2026",
    checkOutTime: "4:30 PM",
  },
  {
    id: 3,
    visitorName: "Hari Prasad",
    visitorPhone: "9863456789",
    visitPurpose: "Family Visit",
    visitDate: "25 Jun 2026",
    checkOutTime: "7:00 PM",
  },
  {
    id: 4,
    visitorName: "Sunita Karki",
    visitorPhone: "9874567890",
    visitPurpose: "Dropping Food",
    visitDate: "22 Jun 2026",
    checkOutTime: "5:15 PM",
  },
  {
    id: 5,
    visitorName: "Bikash Adhikari",
    visitorPhone: "9885678901",
    visitPurpose: "Friend Visit",
    visitDate: "18 Jun 2026",
    checkOutTime: "3:50 PM",
  },
];

function StatusPill({ checkedOut }: { checkedOut: boolean }) {
  return (
    <span
      className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full border whitespace-nowrap ${
        checkedOut
          ? "bg-black text-white border-black"
          : "border-black text-black"
      }`}
    >
      {checkedOut ? "CHECKED OUT" : "VISITING"}
    </span>
  );
}

function VisitorRow({ visitor, isFirst }: { visitor: Visitor; isFirst: boolean }) {
  const checkedOut = !!visitor.checkOutTime;

  return (
    <div
      className={`p-4 sm:p-5 border-b border-gray-200 transition ${
        isFirst ? "bg-gray-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Users size={13} className="text-gray-400 shrink-0" />
            <span className="text-sm sm:text-base font-semibold text-black">{visitor.visitorName}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 mt-0.5">
            <span className="flex items-center gap-1">
              <Phone size={11} />
              {visitor.visitorPhone}
            </span>
            <span className="hidden xs:inline">•</span>
            <span>{visitor.visitPurpose}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <CalendarDays size={10} />
              {visitor.visitDate}
            </span>
            {visitor.checkOutTime && (
              <span className="flex items-center gap-1">
                <Clock size={10} />
                Out: {visitor.checkOutTime}
              </span>
            )}
          </div>
        </div>
        <StatusPill checkedOut={checkedOut} />
      </div>
    </div>
  );
}

export default function VisitorLogPage() {
  const totalVisits = visitors.length;
  const checkedOut = visitors.filter((v) => v.checkOutTime).length;
  const stillVisiting = totalVisits - checkedOut;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Visitor Log</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          View all visitors who have come to see you at the hostel.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          ["TOTAL VISITS", String(totalVisits)],
          ["CHECKED OUT", String(checkedOut)],
          ["STILL VISITING", String(stillVisiting)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT: Visitor List */}
        <div className="xl:col-span-2">
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold">Visitor History</h3>
              <span className="text-xs text-gray-400">{totalVisits} total visits</span>
            </div>
            <div>
              {visitors.map((v, i) => (
                <VisitorRow key={v.id} visitor={v} isFirst={i === 0} />
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Info panels */}
        <div className="space-y-4 sm:space-y-6">
          {/* Visitor Policy */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">Visitor Policy</h3>
            </div>
            <div className="p-4 sm:p-5 space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-black mb-1">Visiting Hours</p>
                <p>Morning: 10:00 AM – 12:00 PM</p>
                <p>Evening: 4:00 PM – 7:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-black mb-1">Rules</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All visitors must register at the front desk.</li>
                  <li>Visitors are not allowed inside rooms.</li>
                  <li>Guest ID must be presented on entry.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Most Recent Visitor */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">Most Recent Visitor</h3>
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              <p className="font-semibold text-black">{visitors[0].visitorName}</p>
              <p className="text-sm text-gray-500">{visitors[0].visitPurpose}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <CalendarDays size={11} />
                {visitors[0].visitDate}
              </p>
              {visitors[0].checkOutTime && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} />
                  Checked out: {visitors[0].checkOutTime}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}