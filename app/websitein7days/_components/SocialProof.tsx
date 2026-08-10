import { Quote, MessageSquareText } from "lucide-react";
import { Container, SectionHeading } from "./ui";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  business: string;
}

/**
 * Intentionally empty until real, verified testimonials are supplied.
 * Structure is ready to accept genuine client proof without a redesign.
 */
const TESTIMONIALS: Testimonial[] = [];

export default function SocialProof() {
  return (
    <section id="proof" className="border-b border-white/8 bg-white/[0.015] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Trusted by founders & businesses"
          title="Good work should speak for itself."
        />

        {TESTIMONIALS.length > 0 ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border border-white/10 bg-[#111113] p-6">
                <Quote className="size-5 text-primary/60" />
                <p className="mt-4 text-[15px] leading-relaxed text-white/75">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-xs text-white/45">
                  {testimonial.role}, {testimonial.business}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-14 text-center">
            <MessageSquareText className="mx-auto size-8 text-white/25" />
            <p className="mt-4 text-[15px] leading-relaxed text-white/50">
              Client testimonials will appear here as our founders share their results. We only
              publish real feedback from real clients — never fabricated quotes or numbers.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
