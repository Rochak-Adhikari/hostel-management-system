// app/page.jsx  OR  pages/index.jsx
// Font: add Poppins in your layout.jsx or _app.jsx
// import { Poppins } from "next/font/google"

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-white font-poppins text-black overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="w-full h-[82px] border border-black flex items-center justify-between px-8 bg-white sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/HostelHubLOGO-removebg-preview.png"
            alt="HostelHub Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-10">
          <Link href="#facilities" className="text-xl font-bold hover:opacity-70 transition-opacity">Facilities</Link>
          <Link href="#fees"       className="text-xl font-bold hover:opacity-70 transition-opacity">Fees</Link>
          <Link href="#contact"    className="text-xl font-bold hover:opacity-70 transition-opacity">Contact</Link>
          <Link href="#about"      className="text-xl font-bold hover:opacity-70 transition-opacity">About Us</Link>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="w-[132px] h-[49px] flex items-center justify-center border border-black rounded-[5px] text-2xl font-normal text-black hover:bg-black hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="w-[132px] h-[49px] flex items-center justify-center bg-black rounded-[5px] text-2xl font-normal text-white hover:bg-black/80 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative w-full min-h-screen px-8 pt-16 pb-20 flex items-start">
       
        <div className="flex flex-col max-w-160 mt-8">
         
          <div className="inline-flex w-fit bg-black rounded-[10px] px-4 py-2 mb-8">
            <span className="text-white font-bold text-lg">
              Hostel for students · New Baneshwor, Kathmandu
            </span>
          </div>

     
          <h1 className="text-[60px] font-bold leading-[90px] text-black mb-6">
            A place to stay,<br />a system to trust
          </h1>

          
          <p className="text-[22px] font-bold leading-[33px] text-black mb-10 max-w-[631px]">
            HostelHub is a student hostel with fully digital management — track your room,
            fees, and notices from your phone or laptop, anytime.
          </p>

          
          <div className="flex gap-6 mb-16">
            <Link
              href="/register"
              className="w-[235px] h-[66px] flex items-center justify-center bg-black rounded-[10px] text-white text-[21px] font-bold hover:bg-black/80 transition-colors"
            >
              Apply For Admission
            </Link>
            <Link
              href="#about"
              className="w-[235px] h-[66px] flex items-center justify-center bg-black rounded-[10px] text-white text-[25px] font-bold hover:bg-black/80 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-start gap-16">
            <div>
              <p className="text-[40px] font-bold leading-15">18</p>
              <p className="text-[20px] font-bold leading-7.5">Total Rooms</p>
            </div>
            <div>
              <p className="text-[40px] font-bold leading-15">4</p>
              <p className="text-[20px] font-bold leading-7.5">Floors</p>
            </div>
            <div>
              <p className="text-[40px] font-bold leading-15">15 min</p>
              <p className="text-[20px] font-bold leading-7.5">From KCMIT</p>
            </div>
          </div>
        </div>

        {/* Right: Hero image */}
        <div className="absolute right-8 top-16">
          <Image
            src="/hostel room.png"
            alt="Hostel Room"
            width={724}
            height={724}
            className="rounded-[20px] object-cover"
          />
        </div>
      </section>

      {/* ── ABOUT + HOSTEL DETAILS ── */}
      <section id="about" className="w-full border-t border-black grid grid-cols-2">
        {/* About left */}
        <div className="px-10 py-16 border-r border-black">
          <p className="text-[18px] font-bold text-black mb-4">ABOUT HOSTEL HUB</p>
          <h2 className="text-[40px] font-bold leading-[60px] text-black mb-6">
            Purpose-built for students near Baneshwor
          </h2>
          <p className="text-[22px] font-medium leading-[33px] text-black">
            HostelHub is a student hostel located in New Baneshwor, Kathmandu — walking
            distance from KCMIT and other TU-affiliated colleges. We handle everything
            digitally so students and their families always know what&apos;s going on —
            no phone calls needed for fee status or room details.
          </p>
        </div>

        {/* Hostel details right */}
        <div id="fees" className="px-10 py-16">
          <p className="text-[22px] font-medium text-black mb-6">HOSTEL DETAILS</p>
          {[
            ["Location",         "New Baneshwor, Kathmandu"],
            ["Total Rooms",      "18 Rooms, 4 Floors"],
            ["Room types",       "Single, Double, Triple"],
            ["Monthly fee",      "Rs 11,500 – Rs 18,000"],
            ["Meals",            "Breakfast To Dinner All included"],
            ["Internet",         "Fast Wi-Fi Available on all floor"],
            ["Warden available", "24 / 7"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-black last:border-b-0">
              <span className="text-[22px] font-medium">{label}</span>
              <span className="text-[22px] font-medium">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="facilities" className="px-10 py-16 border-t border-black">
        <p className="text-[22px] font-medium text-black mb-2">Digital management system</p>
        <h2 className="text-[40px] font-bold leading-[60px] text-black mb-4">
          What the system handles
        </h2>
        <p className="text-[22px] font-medium text-black mb-10">
          Eight integrated modules — students and guardians can track everything online.
        </p>

        {/* 4-col grid — alternating black/white like Figma */}
        <div className="grid grid-cols-4 border border-black rounded-[20px] overflow-hidden">
          {[
            { title: "Student Management",   desc: "Register students with guardian info, contact details, and profile photos.",                         dark: true },
            { title: "Fee Management",        desc: "Record monthly payments, track dues, and generate receipts per student.",                           dark: false },
            { title: "Room Management",       desc: "Create rooms with floor, type, and capacity. Allocate, transfer, and track availability in real time.", dark: true },
            { title: "Notice Board",          desc: "Post announcements for all students. Visible on every student dashboard.",                           dark: false },
            { title: "Complaint Management",  desc: "Students submit complaints, admins respond and update resolution status with a full log.",            dark: true },
            { title: "Room Allocation",       desc: "Allocate and transfer students between rooms with a full allocation history.",                        dark: false },
            { title: "Visitor Management",    desc: "Log visitor entries, track visit history, and maintain a secure record per student.",                 dark: true },
            { title: "Guardian Portal",       desc: "Students' guardians can track the student progress, logs, and fee notices.",                          dark: false },
          ].map(({ title, desc, dark }) => (
            <div
              key={title}
              className={`p-6 border-black border ${dark ? "bg-black text-white" : "bg-white text-black"}`}
            >
              <h3 className={`text-[25px] font-bold leading-[38px] mb-4 ${dark ? "text-white" : "text-black"}`}>
                {title}
              </h3>
              <hr className={`border-[3px] mb-4 ${dark ? "border-white" : "border-black"}`} />
              <p className={`text-[18px] font-normal leading-[27px] ${dark ? "text-white" : "text-black"}`}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-10 py-16 border-t border-black">
        <p className="text-[22px] font-medium mb-2">What students say</p>
        <h2 className="text-[40px] font-bold leading-[60px] mb-4">Residents love it</h2>
        <p className="text-[22px] font-medium mb-10">Hear from students currently living at HostelHub.</p>

        <div className="grid grid-cols-3 gap-6">
          {[
            {
              initials: "AS",
              name: "Aarav Sharma",
              course: "BSc CSIT, 2nd year",
              quote: '"   The fee tracking is super helpful — my parents can check if I\'ve paid without calling me every month. Makes life easier for everyone.',
            },
            {
              initials: "PT",
              name: "Priya Thapa",
              course: "BCA, 3rd sem",
              quote: '" Submitting complaints online is way better than going to the office. The admin resolves them fast and I can see the status update live.',
            },
            {
              initials: "RK",
              name: "Rohan Karki",
              course: "BIM, 1st year",
              quote: '" My dad uses the guardian portal to check my room and notices. He stopped worrying so much — and stopped texting me every day.',
            },
          ].map(({ initials, name, course, quote }) => (
            <div key={name} className="bg-black rounded-[20px] p-6 flex flex-col justify-between min-h-[462px] shadow-[5px_4px_4px_rgba(0,0,0,0.25)]">
              <p className="text-[22px] font-bold leading-[33px] text-white flex-1">{quote}</p>
              <div className="flex items-center gap-4 mt-6">
                <div className="w-[62px] h-[63px] rounded-full border border-[#F8F2F2] bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[22px] font-bold">{initials}</span>
                </div>
                <div>
                  <p className="text-white text-[22px] font-bold leading-[33px]">{name}</p>
                  <p className="text-white/70 text-[18px]">{course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="px-10 py-16 border-t border-black">
        <p className="text-[22px] font-medium mb-2">Inside HostelHub</p>
        <h2 className="text-[40px] font-bold leading-15 mb-4">Take a look around</h2>
        <p className="text-[22px] font-medium mb-10">
          Real photos of the hostel — rooms, common areas, and facilities.
        </p>

        <div className="grid grid-cols-4 gap-4">
          {/* Big photo */}
          <div className="col-span-1 row-span-1">
            <div className="relative w-full h-70.75 rounded-[25px] overflow-hidden bg-gray-200">
              <Image src="/HostelRoom.png" alt="Four Seater Room Floor 3" fill className="object-cover" />
              <span className="absolute bottom-3 left-4 font-bold text-[25px] text-black drop-shadow">Four Seater room · Floor 3</span>
            </div>
          </div>
          <div className="relative w-full h-70.75 rounded-[25px] overflow-hidden bg-gray-200">
            <Image src="/Outside hostel.png" alt="Balcony Floor 2" fill className="object-cover" />
            <span className="absolute bottom-3 left-4 font-bold text-[25px] text-black drop-shadow">Balcony · Floor 2</span>
          </div>
          <div className="relative w-full h-70.75 rounded-[25px] overflow-hidden bg-gray-200">
            <Image src="/study hostel.png" alt="Study Room" fill className="object-cover" />
            <span className="absolute bottom-3 left-4 font-bold text-[22px] text-black drop-shadow">Study Room · Ground Floor</span>
          </div>
          <div className="relative w-full h-70.75 rounded-[25px] overflow-hidden bg-gray-200">
            <Image src="/dininga hostel.png" alt="Dining Area" fill className="object-cover" />
            <span className="absolute bottom-3 left-4 font-bold text-[22px] text-black drop-shadow">Dining Area · Top Floor</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-10 py-16 border-t border-black grid grid-cols-[400px_1fr] gap-20">
        <div>
          <p className="text-[22px] font-medium mb-2">FAQ</p>
          <h2 className="text-[40px] font-bold leading-15 mb-4">Common questions</h2>
          <p className="text-[22px] font-medium leading-8.25">
            Everything you need to know before applying for a room at HostelHub.
          </p>
        </div>

        <div className="flex flex-col">
          {[
            {
              q: "How do I apply for a room?",
              a: 'Click "Sign up" on this page, fill in your details and guardian info. The admin will review and confirm your room allocation.',
            },
            {
              q: "What does the monthly fee include?",
              a: "Room rent, breakfast and dinner, Wi-Fi, and access to common areas. Electricity is included up to a fair usage limit.",
            },
            {
              q: "Can I change my room later?",
              a: "Yes. Submit a room transfer request through your student portal. The admin will process it based on availability.",
            },
            {
              q: "How does guardian access work?",
              a: "When you register, login credentials are automatically generated for your guardian and sent to their contact. They can view your room, fee status, and notices.",
            },
            {
              q: "How do I pay the monthly fee?",
              a: "Pay through the QR sent to you on your mail. The admin records it in the system and you'll see it reflected in your fee history immediately.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-black py-5 first:border-t">
              <div className="flex justify-between items-start">
                <p className="text-[22px] font-bold leading-8.25">{q}</p>
                <span className="text-[22px] font-bold ml-4">+</span>
              </div>
              <p className="text-[22px] font-medium leading-8.25 mt-3 text-black/80">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="w-full bg-black text-white px-12 pt-16 pb-10">
        <div className="grid grid-cols-4 gap-12 mb-16">
     
          <div>
            <p className="text-[30px] font-bold mb-4">HOSTEL HUB</p>
            <p className="text-[23px] font-medium leading-8.5 text-white">
              A student hostel in New Baneshwor, Kathmandu — with fully digital management
              for students, guardians, and staff.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[30px] font-bold mb-4">Quick Links</p>
            <div className="flex flex-col gap-2 text-[26px] font-normal leading-9.75">
              <Link href="#about"      className="hover:opacity-70">About us</Link>
              <Link href="#facilities" className="hover:opacity-70">Facilities</Link>
              <Link href="#fees"       className="hover:opacity-70">Fee structure</Link>
              <Link href="#contact"    className="hover:opacity-70">Contact</Link>
              <Link href="/register"     className="hover:opacity-70">Apply now</Link>
            </div>
          </div>

         
          <div>
            <p className="text-[30px] font-bold mb-4">Portals</p>
            <div className="flex flex-col gap-2 text-[26px] font-normal leading-9.75">
              <Link href="/login"  className="hover:opacity-70">Student login</Link>
              <Link href="/register" className="hover:opacity-70">Student sign up</Link>
              <Link href="/login"  className="hover:opacity-70">Guardian login</Link>
            </div>
          </div>

         
          <div>
            <p className="text-[30px] font-bold mb-4">Policies</p>
            <div className="flex flex-col gap-2 text-[26px] font-normal leading-9.75">
              <Link href="#" className="hover:opacity-70">Hostel rules</Link>
              <Link href="#" className="hover:opacity-70">Visitor policy</Link>
              <Link href="#" className="hover:opacity-70">Fee &amp; refund policy</Link>
              <Link href="#" className="hover:opacity-70">Privacy policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-[5px] border-[#808080] pt-6 flex justify-between items-center">
          <p className="text-[20px] font-normal">
            © 2025 HostelHub · New Baneshwor, Kathmandu · All rights reserved
          </p>
          <div className="flex gap-6 text-[20px]">
            <Link href="#" className="hover:opacity-70">Hostel rules</Link>
            <Link href="#" className="hover:opacity-70">Privacy policy</Link>
            <Link href="#" className="hover:opacity-70">Contact</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}