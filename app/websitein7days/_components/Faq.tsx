"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Container, SectionHeading } from "./ui";

const FAQS = [
  {
    q: "How long does the website actually take?",
    a: "Our standard website sprint is completed within seven working days, provided required content, assets, feedback and approvals are supplied on schedule.",
  },
  {
    q: "What do I need to provide?",
    a: "We'll need your company information, logo and brand assets, relevant images, service information, contact details and any existing content you want included. We'll guide you through everything during onboarding.",
  },
  {
    q: "Do you write the website content?",
    a: "Content support depends on the package selected. Our Institutional Ready package includes messaging and positioning refinement designed to help communicate your business clearly.",
  },
  {
    q: "Can I pay immediately?",
    a: "Yes. If you already know which package is right for you, you can proceed directly to checkout.",
  },
  {
    q: "Can I speak to someone before paying?",
    a: "Absolutely. You can book a 20-minute Website Readiness Call with our team.",
  },
  {
    q: "What happens after I pay?",
    a: "You'll receive your onboarding instructions immediately. We'll collect the required business information and schedule your project kickoff.",
  },
  {
    q: "Does the seven-day period start immediately after payment?",
    a: "The production timeline begins once payment is confirmed and all required onboarding materials have been received.",
  },
  {
    q: "Do you provide hosting and domain?",
    a: "We can assist with domain connection and deployment. Hosting and domain costs are separate unless explicitly included in your selected package.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes. We'll first assess the existing website and determine whether a redesign or a new build is the better approach.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-white/8 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading align="center" title="Frequently asked questions" />

        <div className="mt-12 divide-y divide-white/8 rounded-2xl border border-white/10 bg-[#111113]">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-medium text-white">{item.q}</span>
                  {isOpen ? (
                    <Minus className="size-4 shrink-0 text-primary" />
                  ) : (
                    <Plus className="size-4 shrink-0 text-white/40" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-white/55">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
