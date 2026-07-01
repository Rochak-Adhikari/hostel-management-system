import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="w-full bg-black text-white px-4 md:px-12 pt-10 md:pt-16 pb-10"
    >
      {/* TOP GRID */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

        {/* Hostel Info */}
        <div className="col-span-2 xl:col-span-1">
          <h3 className="text-xl md:text-2xl lg:text-[30px] font-bold mb-3 md:mb-4">
            HOSTEL HUB
          </h3>

          <p className="text-sm md:text-lg lg:text-[22px] leading-6 md:leading-8 text-white/90">
            A student hostel in New Baneshwor, Kathmandu with a fully digital
            management system for students, guardians, and administrators.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg md:text-2xl lg:text-[30px] font-bold mb-3 md:mb-4">
            Quick Links
          </h3>

          <div className="flex flex-col gap-1 md:gap-2 text-sm md:text-lg lg:text-[22px]">
            <Link href="#about" className="hover:opacity-70 transition">
              About Us
            </Link>
            <Link href="#facilities" className="hover:opacity-70 transition">
              Facilities
            </Link>
            <Link href="#features" className="hover:opacity-70 transition">
              Features
            </Link>
            <Link href="#contact" className="hover:opacity-70 transition">
              Contact
            </Link>
            <Link href="/register" className="hover:opacity-70 transition">
              Apply Now
            </Link>
          </div>
        </div>

        {/* Portals */}
        <div>
          <h3 className="text-lg md:text-2xl lg:text-[30px] font-bold mb-3 md:mb-4">
            Portals
          </h3>

          <div className="flex flex-col gap-1 md:gap-2 text-sm md:text-lg lg:text-[22px]">
            <Link href="/login" className="hover:opacity-70 transition">
              Student Login
            </Link>
            <Link href="/register" className="hover:opacity-70 transition">
              Student Sign Up
            </Link>
            <Link href="/login" className="hover:opacity-70 transition">
              Guardian Login
            </Link>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg md:text-2xl lg:text-[30px] font-bold mb-3 md:mb-4">
            Policies
          </h3>

          <div className="flex flex-col gap-1 md:gap-2 text-sm md:text-lg lg:text-[22px]">
            <Link href="#" className="hover:opacity-70 transition">
              Hostel Rules
            </Link>
            <Link href="#" className="hover:opacity-70 transition">
              Visitor Policy
            </Link>
            <Link href="#" className="hover:opacity-70 transition">
              Fee & Refund Policy
            </Link>
            <Link href="#" className="hover:opacity-70 transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-600 pt-5 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        <p className="text-xs md:text-lg text-center md:text-left">
          © 2026 HostelHub · New Baneshwor, Kathmandu · All Rights Reserved
        </p>

        <div className="flex flex-wrap justify-center gap-3 md:gap-5 text-xs md:text-lg">
          <Link href="#" className="hover:opacity-70 transition">
            Hostel Rules
          </Link>
          <Link href="#" className="hover:opacity-70 transition">
            Privacy Policy
          </Link>
          <Link href="#contact" className="hover:opacity-70 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}