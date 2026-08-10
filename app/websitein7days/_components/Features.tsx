import {
  Target,
  Palette,
  TrendingUp,
  Smartphone,
  MessageSquare,
  Search,
} from "lucide-react";
import { Container, SectionHeading } from "./ui";

const FEATURES = [
  {
    icon: Target,
    title: "Strategic Positioning",
    text: "We clarify what your business does, who it serves and how it should be presented to serious stakeholders.",
  },
  {
    icon: Palette,
    title: "Premium Website Design",
    text: "A modern, professional interface designed around your company's identity and goals.",
  },
  {
    icon: TrendingUp,
    title: "Investor & Grant Readiness",
    text: "Structure your company story so visitors can quickly understand your business, traction, offering and opportunity.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    text: "Your website works beautifully across phones, tablets and desktops.",
  },
  {
    icon: MessageSquare,
    title: "Lead Generation",
    text: "Strategic calls-to-action, contact forms and WhatsApp integration make it easy for interested people to take the next step.",
  },
  {
    icon: Search,
    title: "Search & Analytics Setup",
    text: "Essential technical foundations to help people discover your business and understand how visitors interact with your website.",
  },
];

export default function Features() {
  return (
    <section id="included" className="border-b border-white/8 bg-white/[0.015] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="More than a website"
          title="A digital presence built for where your business is going."
          description="We combine strategy, messaging, design and development into one focused seven-day website sprint."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-[#111113] p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{feature.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
