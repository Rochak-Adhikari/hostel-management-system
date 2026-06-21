import { Bed, CreditCard, MessageSquareWarning, Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      
      <h1 className="text-2xl font-medium mb-4">Dashboard</h1>

     
      <div className="bg-[#00C0E8]/30 rounded-[25px] px-6 py-5 mb-6 max-w-[481px]">
        <p className="text-xl font-bold mb-1">Welcome Back, Rochak! 👋</p>
        <p className="text-[15px]">Here is what&apos;s going on your hostel today!</p>
      </div>

      
      <div className="grid grid-cols-3 gap-6 mb-8">
      
        <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.50),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-[#9CC6EB] rounded-[5px] flex items-center justify-center shadow">
              <Bed size={20} strokeWidth={1.5} className="text-[#0069C4]" />
            </div>
            <p className="text-[15px] font-semibold">Room Number</p>
          </div>
          <p className="text-xl font-semibold mb-2">A-001</p>
          <a href="/my-room" className="text-blue-600 text-sm font-medium underline">
            view room details ↗
          </a>
        </div>

        {/* Fee anD paayments */}
        <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.50),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-[#D9EFDF] rounded-[5px] flex items-center justify-center shadow">
              <CreditCard size={20} strokeWidth={1.5} className="text-[#058C27]" />
            </div>
            <p className="text-[15px] font-semibold">Fee Status</p>
          </div>
          <p className="text-xl font-semibold text-[#058C27] mb-2">PAID</p>
          <p className="text-[#058C27] text-sm font-medium">Due on 15th of JUN, 2026</p>
        </div>

        {/* Complaints */}
        <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.50),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-[#F4E3F6] rounded-[5px] flex items-center justify-center shadow">
              <MessageSquareWarning size={20} strokeWidth={1.5} className="text-[#CB30E0]" />
            </div>
            <p className="text-[15px] font-semibold">Complaints</p>
          </div>
          <p className="text-xl font-semibold text-[#CB30E0] mb-2">Complaint</p>
          <a href="/complaints" className="text-blue-600 text-sm font-medium underline">
            view Complaints ↗
          </a>
        </div>
      </div>

      {/* NoticeS */}
      <div className="bg-white rounded-[15px] shadow-[5px_4px_4px_2px_rgba(0,0,0,0.50),inset_5px_4px_4px_2px_rgba(0,0,0,0.25)] p-6 pb-10">
        <h2 className="text-2xl font-bold mb-5 text-center">Notices</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-black rounded-[25px] p-5 min-h-[110px] flex items-start justify-between">
            <div>
              <p className="font-semibold text-lg mb-2">Visitor Timing Update</p>
              <p className="text-sm">visitor hours have been revised to:</p>
            </div>
            <div className="text-right">
              <Bell size={20} className="text-[#CB30E0] mb-2 ml-auto" />
              <p className="text-sm">
                Morning 10:00 AM - 12:00 PM
                <br />
                Evening 4:00 PM - 7:00 PM
              </p>
            </div>
          </div>
          <div className="border border-black rounded-[25px] p-5 min-h-[110px]" />
          <div className="border border-black rounded-[25px] p-5 min-h-[110px]" />
          <div className="border border-black rounded-[25px] p-5 min-h-[110px]" />
          <div className="border border-black rounded-[25px] p-5 min-h-[110px]" />
          <div className="border border-black rounded-[25px] p-5 min-h-[110px]" />
        </div>
      </div>
    </div>
  );
}