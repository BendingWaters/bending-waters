"use client";

import { ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "./ui";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";

export default function FinalCta() {
  const { openFullFunnel } = useFunnel();

  return (
    <section className="relative overflow-hidden border-b border-white/8 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
      />

      <Container className="relative max-w-3xl text-center">
        <Eyebrow className="justify-center">
          Your next opportunity could be closer than you think
        </Eyebrow>

        <h2 className="mt-6 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
          When someone asks, &ldquo;What&apos;s your website?&rdquo; — have an answer you&apos;re
          proud to send.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
          You&apos;ve put too much work into your business to let an outdated or missing website
          tell the wrong story. Build a digital presence that matches your ambition — and get ready
          for the opportunities ahead.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              trackEvent("hero_cta_clicked", { placement: "final_cta_primary" });
              openFullFunnel();
            }}
            className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-[15px] font-semibold text-white transition hover:brightness-110"
          >
            Build My Website in 7 Days <ArrowRight className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              trackEvent("hero_cta_clicked", { placement: "final_cta_secondary" });
              openFullFunnel();
            }}
            className="inline-flex items-center justify-center gap-2 border border-white/15 px-7 py-4 text-[15px] font-semibold text-white transition hover:border-white/30"
          >
            Talk to a Strategist
          </button>
        </div>

        <p className="mt-6 text-sm text-white/40">
          Limited production capacity. Projects are scheduled based on confirmed payment and
          onboarding readiness.
        </p>
      </Container>
    </section>
  );
}
