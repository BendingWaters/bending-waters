"use client";

import { ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "./ui";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";
import BrowserMockup from "./BrowserMockup";

export default function Hero() {
  const { openFullFunnel } = useFunnel();

  return (
    <section id="hero" className="relative overflow-hidden border-b border-white/8 pb-20 pt-16 sm:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]"
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <Eyebrow>For founders ready for their next big opportunity</Eyebrow>

          <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Your next big opportunity will check your business online.{" "}
            <span className="text-white/45">Be ready when it does.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
            Get a professional, institutional-ready website launched in <strong className="text-white">7 days</strong> —
            built to help your business stand confidently in front of investors, grant reviewers,
            partners, customers and other serious opportunities.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => {
                trackEvent("hero_cta_clicked", { placement: "hero_primary" });
                openFullFunnel();
              }}
              className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-[15px] font-semibold text-white transition hover:brightness-110"
            >
              Build My Website in 7 Days <ArrowRight className="size-4" />
            </button>

            <a
              href="#packages"
              className="inline-flex items-center justify-center gap-2 border border-white/15 px-7 py-4 text-[15px] font-semibold text-white transition hover:border-white/30"
            >
              View Packages
            </a>
          </div>

          <p className="mt-5 text-sm text-white/40">
            No complicated process. No months of waiting. Just a focused website sprint designed
            around your business.
          </p>
        </div>

        <BrowserMockup />
      </Container>
    </section>
  );
}
