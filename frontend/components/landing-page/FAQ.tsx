export default function FAQ() {
  const faqs = [
    {
      q: "How do I apply for a room?",
      a: 'Click "Sign up" on this page, fill in your details and guardian information. The admin will review your application and confirm your room allocation.',
    },
    {
      q: "What does the monthly fee include?",
      a: "Room rent, breakfast and dinner, Wi-Fi, and access to common areas. Electricity is included within the hostel's fair usage policy.",
    },
    {
      q: "Can I change my room later?",
      a: "Yes. You can submit a room transfer request through your student portal. The admin will process it based on room availability.",
    },
    {
      q: "How does guardian access work?",
      a: "When a student registers, guardian login credentials are created. Guardians can monitor room information, fee status, and important notices.",
    },
    {
      q: "How do I pay my monthly fee?",
      a: "You can pay using the hostel QR code or approved payment methods. Once verified by the admin, the payment will appear in your fee history.",
    },
  ];

  return (
    <section className="px-4 md:px-10 py-10 md:py-14 border-t border-black grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-20">
      <div>
        <p className="text-base md:text-[22px] font-medium mb-2">FAQ</p>

        <h2 className="text-2xl lg:text-[40px] font-bold leading-tight lg:leading-[60px] mb-4">
          Common questions
        </h2>

        <p className="text-base md:text-[22px] font-medium leading-7 md:leading-8">
          Everything you need to know before applying for a room at HostelHub.
        </p>
      </div>

      <div className="flex flex-col">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group border-b border-black py-5 first:border-t"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="text-lg md:text-[22px] font-bold">
                {faq.q}
              </span>

              <span className="text-2xl font-bold transition-transform group-open:rotate-45">
                +
              </span>
            </summary>

            <p className="mt-3 text-base md:text-[20px] leading-7 text-black/80">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}