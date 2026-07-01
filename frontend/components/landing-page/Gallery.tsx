import Image from "next/image";

export default function Gallery() {
  return (
    <section
      id="facilities"
      className="scroll-mt-24 px-4 md:px-10 py-10 md:py-14 border-t border-black"
    >
      <p className="text-base md:text-[22px] font-medium mb-2">
        Inside HostelHub
      </p>

      <h2 className="text-2xl lg:text-[40px] font-bold leading-tight lg:leading-[60px] mb-4">
        Take a look around
      </h2>

      <p className="text-base md:text-[22px] font-medium mb-8 md:mb-10">
        Real photos of the hostel — rooms, common areas, and facilities.
      </p>

      {/* ONLY CHANGE: grid layout */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        
        <div className="relative w-full h-48 rounded-[25px] overflow-hidden">
          <Image
            src="/HostelRoom.jpg"
            alt="Four Seater Room"
            fill
            className="object-cover"
          />
          <span className="absolute bottom-3 left-4 text-lg lg:text-[22px] font-bold text-white drop-shadow-lg">
            Four Seater Room · Floor 3
          </span>
        </div>

        <div className="relative w-full h-48 rounded-[25px] overflow-hidden">
          <Image
            src="/Outside hostel.jpg"
            alt="Balcony"
            fill
            className="object-cover"
          />
          <span className="absolute bottom-3 left-4 text-lg lg:text-[22px] font-bold text-white drop-shadow-lg">
            Balcony · Floor 2
          </span>
        </div>

        <div className="relative w-full h-48 rounded-[25px] overflow-hidden">
          <Image
            src="/study hostel.jpg"
            alt="Study Room"
            fill
            className="object-cover"
          />
          <span className="absolute bottom-3 left-4 text-lg lg:text-[22px] font-bold text-white drop-shadow-lg">
            Study Room · Ground Floor
          </span>
        </div>

        <div className="relative w-full h-48 rounded-[25px] overflow-hidden">
          <Image
            src="/dininga hostel.jpg"
            alt="Dining Area"
            fill
            className="object-cover"
          />
          <span className="absolute bottom-3 left-4 text-lg lg:text-[22px] font-bold text-white drop-shadow-lg">
            Dining Area · Top Floor
          </span>
        </div>

      </div>
    </section>
  );
}