import { Container, SectionHeading } from "./ui";

const ITEMS = [
  { title: "Your Company", text: "Who you are, what you do and why your business exists." },
  { title: "Your Offering", text: "What you sell, who you serve and the problem you solve." },
  { title: "Your Traction", text: "Customers, milestones, achievements, partnerships and evidence of progress." },
  { title: "Your Leadership", text: "Introduce the people building the company and the experience behind the business." },
  { title: "Your Vision", text: "Show where you're going — not just where you've been." },
  { title: "Your Next Step", text: "Give investors, partners, customers and other stakeholders a clear way to continue the conversation." },
];

export default function InformationArchitecture() {
  return (
    <section className="border-b border-white/8 bg-white/[0.015] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          title="Give serious people the information they're looking for."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, index) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-[#111113] p-6">
              <span className="text-xs font-semibold tracking-[0.2em] text-white/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[15px] font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
