import React from "react";

export default function About() {
  return (
    <section
      id="about"
      className="w-full border-t border-black grid grid-cols-1 md:grid-cols-2"
    >
      {/* About left */}
      <div className="px-4 md:px-10 py-12 md:py-16 border-b md:border-b-0 md:border-r border-black">
        <p className="text-[18px] font-bold text-black mb-4">
          ABOUT HOSTEL HUB
        </p>

        <h2 className="text-2xl lg:text-[40px] font-bold leading-tight lg:leading-[60px] text-black mb-6">
          Purpose-built for students near Baneshwor
        </h2>

        <p className="text-base lg:text-[22px] font-medium leading-7 lg:leading-[33px] text-black">
          HostelHub is a student hostel located in New Baneshwor, Kathmandu —
          walking distance from KCMIT and other TU-affiliated colleges. We
          handle everything digitally so students and their families always know
          what's going on — no phone calls needed for fee status or room
          details.
        </p>
      </div>

      {/* Hostel details */}
      <div id="fees" className="px-4 md:px-10 py-12 md:py-16">
        <p className="text-[22px] font-medium text-black mb-6">
          HOSTEL DETAILS
        </p>

        {[
          ["Location", "New Baneshwor, Kathmandu"],
          ["Total Rooms", "18 Rooms, 4 Floors"],
          ["Room types", "Single, Double, Triple"],
          ["Monthly fee", "Rs 11,500 – Rs 18,000"],
          ["Meals", "Breakfast To Dinner All included"],
          ["Internet", "Fast Wi-Fi Available on all floor"],
          ["Warden available", "24 / 7"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 py-3 border-b border-black last:border-b-0"
          >
            <span className="text-[22px] font-medium">{label}</span>

            <span className="text-[22px] font-medium">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}