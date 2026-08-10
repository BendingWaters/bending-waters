import { Container, SectionHeading } from "./ui";

export default function Problem() {
  return (
    <section id="problem" className="border-b border-white/8 py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading
          align="center"
          eyebrow="The moment every founder dreads"
          title="You've built the business. But does your online presence show it?"
        />

        <div className="mx-auto mt-10 max-w-2xl space-y-5 text-center text-[17px] leading-relaxed text-white/60">
          <p>
            You may already have customers, revenue, a great product and years of work behind you.
          </p>
          <p>Then an opportunity comes along.</p>
          <p>
            A grant application asks for your website. An investor wants to research your company.
            A potential partner wants to know who they are dealing with.
          </p>
          <p>Suddenly, your online presence becomes part of the pitch.</p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/25 bg-primary/[0.06] px-6 py-6 text-center sm:px-10">
          <p className="text-lg font-semibold leading-snug text-white sm:text-xl">
            Your business may be ready for the opportunity. Your website should be ready too.
          </p>
        </div>
      </Container>
    </section>
  );
}
