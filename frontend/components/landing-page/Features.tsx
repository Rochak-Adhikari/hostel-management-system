import React from "react";

const features = [
  {
    title: "Student Management",
    mobile: "Manage students",
    desktop:
      "Manage student records, guardian details, and profiles.",
    dark: true,
  },
  {
    title: "Fee Management",
    mobile: "Track fees",
    desktop: "Track payments, dues, and generate receipts.",
    dark: false,
  },
  {
    title: "Room Management",
    mobile: "Manage rooms",
    desktop: "Assign rooms and monitor availability in real time.",
    dark: true,
  },
  {
    title: "Notice Board",
    mobile: "Post notices",
    desktop: "Share announcements with all students instantly.",
    dark: false,
  },
  {
    title: "Complaint Management",
    mobile: "Handle complaints",
    desktop: "Receive complaints and track their resolution.",
    dark: true,
  },
  {
    title: "Room Allocation",
    mobile: "Allocate rooms",
    desktop: "Allocate or transfer students between rooms.",
    dark: false,
  },
  {
    title: "Visitor Management",
    mobile: "Visitor logs",
    desktop: "Maintain visitor logs and entry records.",
    dark: true,
  },
  {
    title: "Guardian Portal",
    mobile: "Guardian access",
    desktop:
      "Guardians can monitor fees, notices, and room details.",
    dark: false,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-t border-black px-5 md:px-10 py-12"
    >
      <p className="text-sm sm:text-base lg:text-[22px] font-medium mb-2">
        Digital Management System
      </p>

      <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold mb-4">
        What the system handles
      </h2>

      <p className="text-sm sm:text-base lg:text-[22px] font-medium mb-10 max-w-4xl">
        Eight integrated modules that simplify hostel management for
        students, guardians, and administrators.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-black rounded-2xl overflow-hidden">
        {features.map(({ title, mobile, desktop, dark }) => (
          <div
            key={title}
            className={`border border-black ${
              dark
                ? "bg-black text-white"
                : "bg-white text-black"
            } p-3 sm:p-4 lg:p-6 transition-all duration-200 hover:scale-[1.02]`}
          >
            <h3 className="text-sm sm:text-lg lg:text-[25px] font-bold mb-2 lg:mb-4">
              {title}
            </h3>

            <div
              className={`h-1 w-10 lg:w-16 mb-3 lg:mb-4 ${
                dark ? "bg-white" : "bg-black"
              }`}
            />

            {/* Mobile Description */}
            <p
              className={`block lg:hidden text-xs leading-5 ${
                dark ? "text-white/90" : "text-black/80"
              }`}
            >
              {mobile}
            </p>

            {/* Desktop Description */}
            <p
              className={`hidden lg:block text-base leading-7 ${
                dark ? "text-white/90" : "text-black/80"
              }`}
            >
              {desktop}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}