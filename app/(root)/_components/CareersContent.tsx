import Link from "next/link";
import CareersStats from "./CareersStats";

const CareersContent = () => {
  return (
    <div className="flex-1 flex items-center py-24 md:py-36 lg:py-44 px-6 md:px-12 lg:px-20 xl:px-28">
      <div className="w-full max-w-7xl mx-auto">
        {/* ── Grid: headline (left) | body + CTA (right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 xl:gap-32 items-end">
          {/* ── LEFT: eyebrow + display headline ── */}
          <div className="space-y-7">
            {/* Eyebrow row */}
            <div data-reveal className="flex items-center gap-4">
              <div className="h-px w-10 bg-primary" />
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
                Careers at Bending Waters
              </span>
            </div>

            {/* Display headline — editorial split across three lines */}
            <h2
              data-reveal
              className="text-5xl md:text-6xl lg:text-7xl xl:text-[82px] font-black text-white leading-[1.02] tracking-tight"
            >
              Build Africa&apos;s
              <br />
              <span className="text-primary font-serif italic">next</span> digital
              <br />
              frontier.
            </h2>

            {/* Tri-colour accent underline — echoes brand Kente pattern */}
            <div data-reveal className="flex items-center gap-px pt-1">
              <div className="h-0.75 w-14 bg-primary" />
              <div className="h-[3px] w-7  bg-red-600" />
              <div className="h-[3px] w-3  bg-white/20" />
            </div>
          </div>

          {/* ── RIGHT: description + stats + dual CTA ── */}
          <div className="space-y-8">
            <p
              data-reveal
              className="text-neutral-300 text-base md:text-lg lg:text-xl leading-relaxed"
            >
              We don&apos;t validate ideas — we accelerate brands that have already
              earned the right to grow. Join a team of zebras: resilient,
              profitable, community-rooted. Fast ownership. Real impact. Built
              for the next 50 years of African innovation.
            </p>

            {/* Stats row */}
            <CareersStats />

            {/* CTA buttons */}
            <div data-reveal className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Primary — filled orange */}
              <Link
                href="/careers"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs transition-all duration-300 hover:bg-white hover:text-black"
              >
                <span>Search &amp; Apply</span>
                {/* Arrow that nudges right on hover */}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              {/* Secondary — ghost */}
              <Link
                href="/culture"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/25 text-white/75 font-semibold uppercase tracking-widest text-xs transition-all duration-300 hover:border-white hover:text-white"
              >
                Our Culture
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersContent;
