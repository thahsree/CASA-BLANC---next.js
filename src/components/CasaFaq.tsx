"use client";
import { useState } from "react";

const faqData = [
  {
    q: "What warranty do your products have?",
    a: "Most items include a 6–12 month manufacturer warranty. Warranty details are shown on each product page.",
  },
  {
    q: "Do you offer returns or exchanges?",
    a: "7-day hassle-free returns on unused items. Return label provided for defective or incorrect products.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery: 3–7 business days nationwide. Express options at checkout.",
  },
  {
    q: "Are payments secure?",
    a: "We use PCI-compliant gateways with tokenized transactions and buyer protection.",
  },
  {
    q: "Do you provide product setup or support?",
    a: "Basic setup guides included; email support and priority chat available for select products.",
  },
  {
    q: "How do I know products are genuine?",
    a: "Listings include verification badges, supplier origin, and quality checks — curated and tested.",
  },
];

export default function CasaFaq() {
  const [open, setOpen] = useState(0); // open index, default first open
  return (
    <section className="w-full pt-32 max-md:pt-16 py-32 max-md:py-16 bg-[#080808] opacity-95 text-white px-6 relative overflow-hidden flex max-sm:flex-col">
      <div className="space-y-6 px-7 max-sm:px-0 max-md:px-0">
        <h2 className="font-montserrat tracking-tight leading-[1.1] font-medium text-[64px] max-sm:text-[42px] max-md:text-[55px] text-start max-sm:text-center">
          Here Are The Most Asked Questions
        </h2>
        <p className="text-white/70 mt-4 max-md:mt-3 max-sm:mt-2 font-quicksand mx-auto text-[23px] max-sm:text-[17px] max-md:text-[20px] text-start max-sm:text-center">
          Trusted, practical gadgets for a quieter, simpler home.
        </p>
        <img
          src="/images/casa-faq-illustration.svg"
          alt=""
          className="w-52 opacity-80"
        />
      </div>

      <div className="space-y-4">
        {faqData.map((item, i) => (
          <div key={i} className="border rounded-md overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex justify-between items-center p-4 text-left bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-expanded={open === i}
              aria-controls={`faq-${i}`}
            >
              <span className="text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white font-quicksand leading-[1.05]">
                {item.q}
              </span>
              <span className="ml-4 text-xl">{open === i ? "−" : "+"}</span>
            </button>

            <div
              id={`faq-${i}`}
              className={`px-4 pb-0 overflow-hidden transition-all duration-300 
              ${open === i ? "max-h-[500px]" : "max-h-0"}`}
              style={{ transitionProperty: "max-height" }}
            >
              <p className="py-4 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-quicksand leading-[1.05]">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
