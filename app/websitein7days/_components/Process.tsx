import { Container, SectionHeading } from "./ui";

const DAYS = [
  { day: "01", title: "Discover", text: "We understand your business, audience, goals and the opportunity you're preparing for." },
  { day: "02", title: "Strategy", text: "We define the structure, messaging and content direction for your website." },
  { day: "03", title: "Design", text: "Your website begins taking shape with a high-converting visual direction." },
  { day: "04", title: "Build", text: "We turn the approved design into a responsive, production-ready website." },
  { day: "05", title: "Refine", text: "We review the experience, content and interactions and make the necessary refinements." },
  { day: "06", title: "Test", text: "We test responsiveness, forms, links, performance and essential functionality." },
  { day: "07", title: "Launch", text: "Your website goes live and you receive everything needed to take ownership." },
];

export default function Process() {
  return (
    <section id="process" className="border-b border-white/8 py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Simple. Focused. Fast."
          title="From brief to live website in 7 days."
        />

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DAYS.map((item) => (
            <div key={item.day} className="rounded-2xl border border-white/10 bg-[#111113] p-6">
              <span className="text-2xl font-semibold text-primary">{item.day}</span>
              <h3 className="mt-2 text-[15px] font-semibold uppercase tracking-wide text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-lg font-medium leading-snug text-white sm:text-xl">
          Seven days. One focused sprint. One website ready for your next opportunity.
        </p>
      </Container>
    </section>
  );
}
