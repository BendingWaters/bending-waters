"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "./ui";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";

const STEPS = [
  {
    step: "01",
    label: "The Application",
    text: "You're filling out an important grant, funding or partnership application.",
  },
  {
    step: "02",
    label: "The Question",
    text: "“Company Website”",
    quote: true,
  },
  {
    step: "03",
    label: "The Problem",
    text: "You either paste a link that doesn't represent the business — or you leave the opportunity with one less reason to take you seriously.",
  },
  {
    step: "04",
    label: "The Solution",
    text: 'Imagine having a website you can confidently send to anyone asking: "Tell me more about your company."',
  },
];

export default function ApplicationStory() {
  const { openFullFunnel } = useFunnel();

  return (
    <section className="border-b border-white/8 bg-white/[0.015] py-20 sm:py-28">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-white/10 bg-[#111113] p-6"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-primary">
                STEP {item.step}
              </span>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-white/50">
                {item.label}
              </h3>
              <p
                className={
                  item.quote
                    ? "mt-3 text-2xl font-semibold text-white"
                    : "mt-3 text-[15px] leading-relaxed text-white/65"
                }
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              trackEvent("hero_cta_clicked", { placement: "application_story" });
              openFullFunnel();
            }}
            className="inline-flex items-center gap-2 bg-primary px-7 py-4 text-[15px] font-semibold text-white transition hover:brightness-110"
          >
            I Want That Website <ArrowRight className="size-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}
