import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "./ui";

const CARDS = [
  {
    before: "We have a business, but our online presence doesn't reflect it.",
    after: "We have a professional digital home we can confidently send to serious opportunities.",
  },
  {
    before: "We keep explaining what we do.",
    after: "Our website explains the business before the conversation starts.",
  },
  {
    before: "We look like we're still figuring things out.",
    after: "We look prepared for the next stage.",
  },
  {
    before: "I hope they take us seriously.",
    after: "We're ready to be taken seriously.",
  },
];

export default function Transformation() {
  return (
    <section id="transformation" className="border-b border-white/8 py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="From business owner to institution"
          title="Look as serious online as you are about your business."
          description={
            <>
              Your website shouldn&apos;t simply tell people what you sell. It should communicate
              what you stand for, what you&apos;ve achieved, where you&apos;re going and why people
              should trust you.
            </>
          }
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {CARDS.map((card, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-[#111113] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Before
                  </span>
                  <p className="mt-2 text-[15px] italic leading-relaxed text-white/55">
                    &ldquo;{card.before}&rdquo;
                  </p>
                </div>

                <ArrowRight className="hidden size-5 shrink-0 text-primary sm:block" />

                <div className="flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    After
                  </span>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-white">
                    &ldquo;{card.after}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
