import React from "react";

export default function Testimonials() {
  return (
    <section className="px-4 md:px-10 py-10 md:py-14 border-t border-black">
      <p className="text-base md:text-[22px] font-medium mb-2">
        What students say
      </p>

      <h2 className="text-2xl lg:text-[40px] font-bold leading-tight lg:leading-[60px] mb-4">
        Residents love it
      </h2>

      <p className="text-base md:text-[22px] font-medium mb-8 md:mb-10">
        Hear from students currently living at HostelHub.
      </p>

      {/* 
        MOBILE: horizontal scroll row banako xa
        DESKTOP: normal grid change gareko xaina
      */}
      <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 pb-2 md:pb-0">
        
        {[
          {
            initials: "AS",
            name: "Aarav Sharma",
            course: "BSc CSIT, 2nd year",
            quote:
              '" The fee tracking is super helpful — my parents can check if I\'ve paid without calling me every month. Makes life easier for everyone.',
          },
          {
            initials: "PT",
            name: "Priya Thapa",
            course: "BCA, 3rd sem",
            quote:
              '" Submitting complaints online is way better than going to the office. The admin resolves them fast and I can see the status update live.',
          },
          {
            initials: "RK",
            name: "Rohan Karki",
            course: "BIM, 1st year",
            quote:
              '" My dad uses the guardian portal to check my room and notices. He stopped worrying so much — and stopped texting me every day.',
          },
        ].map(({ initials, name, course, quote }) => (
          <div
            key={name}
            className="
              bg-black rounded-[20px] p-5 md:p-6 
              flex flex-col justify-between 
              min-h-[320px] lg:min-h-[420px] 
              shadow-[5px_4px_4px_rgba(0,0,0,0.25)]
              min-w-[280px] md:min-w-0
            "
          >
            <p className="text-base md:text-[22px] font-bold leading-7 md:leading-[33px] text-white flex-1">
              {quote}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <div className="w-[62px] h-[63px] rounded-full border border-[#F8F2F2] bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[22px] font-bold">
                  {initials}
                </span>
              </div>

              <div>
                <p className="text-white text-lg md:text-[22px] font-bold leading-7 md:leading-[33px]">
                  {name}
                </p>

                <p className="text-white/70 text-[18px]">
                  {course}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}