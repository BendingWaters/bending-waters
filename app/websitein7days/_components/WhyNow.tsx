"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "./ui";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";

export default function WhyNow() {
  const { openFullFunnel } = useFunnel();

  return (
    <section className="border-b border-white/8 bg-white/[0.015] py-20 sm:py-28">
      <Container className="max-w-3xl text-center">
        <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl">
          The right time to fix your digital presence is before you need it.
        </h2>

        <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-white/60">
          <p>Don&apos;t wait until an investor asks for your website.</p>
          <p>Don&apos;t wait until a grant deadline is tomorrow.</p>
          <p>
            Don&apos;t wait until a potential partner searches your company and finds an outdated
            page — or nothing at all.
          </p>
        </div>

        <p className="mt-8 text-xl font-semibold text-white">
          Build the asset before the opportunity arrives.
        </p>

        <button
          type="button"
          onClick={() => {
            trackEvent("hero_cta_clicked", { placement: "why_now" });
            openFullFunnel();
          }}
          className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-white transition hover:brightness-110"
        >
          Get Website-Ready <ArrowRight className="size-4" />
        </button>
      </Container>
    </section>
  );
}
