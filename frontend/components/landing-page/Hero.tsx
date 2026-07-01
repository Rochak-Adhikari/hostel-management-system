import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full min-h-[calc(100vh-82px)] px-4 md:px-8 py-10 md:py-14 flex flex-col lg:flex-row items-center justify-between gap-10">

      {/* IMAGE (Mobile first, appears on top) */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2">
        <div className="w-full max-w-[520px] lg:max-w-[700px]">
          <Image
            src="/hostel room.png"
            alt="Hostel Room"
            width={724}
            height={724}
            priority
            className="w-full h-auto rounded-[18px] object-cover shadow-lg"
          />
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="w-full lg:w-1/2 flex flex-col order-2 lg:order-1">

        {/* Badge */}
        <div className="inline-flex w-fit bg-black text-white rounded-full px-4 py-2 mb-6">
          <span className="text-xs sm:text-sm md:text-base font-semibold">
            Hostel for students · New Baneshwor, Kathmandu
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold leading-tight text-black mb-5">
          A place to stay,
          <br />
          a system to trust
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-[20px] font-medium text-black/80 leading-6 md:leading-7 mb-8 max-w-[600px]">
          HostelHub is a student hostel with fully digital management — track
          your room, fees, and notices from your phone or laptop anytime.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 h-12 sm:h-14 flex items-center justify-center bg-black text-white rounded-lg font-semibold hover:bg-black/80 transition"
          >
            Apply For Admission
          </Link>

          <Link
            href="#about"
            className="w-full sm:w-auto px-6 h-12 sm:h-14 flex items-center justify-center border border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">18</p>
            <p className="text-sm sm:text-base text-black/70">Rooms</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">4</p>
            <p className="text-sm sm:text-base text-black/70">Floors</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              15 min
            </p>
            <p className="text-sm sm:text-base text-black/70">
              From KCMIT
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}