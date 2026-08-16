"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  ArrowUpRight,
  Zap,
  BarChart3,
  Target,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { BUSINESS_UNITS, SERVICES, STATS } from "@/constants";

gsap.registerPlugin(ScrollTrigger);



export default function ServicesSection() {
  const { openModal } = useModal();
  const container = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (service: string) => {
    setSelected((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(".unit-item", {
        x: -24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
      });

      tl.from(
        ".stat-item",
        {
          y: 16,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      );

      tl.from(
        ".form-element",
        {
          x: 28,
          opacity: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.6"
      );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="w-full flex flex-col lg:flex-row min-h-180 bg- text-white"
    >
      {/* LEFT COLUMN */}
      <div className="relative w-full lg:w-[48%] bg-[#080808] flex flex-col justify-between px-6 py-12 sm:px-10 lg:px-14 lg:py-16 overflow-hidden">
        {/* Primary glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 mb-10">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            Our Ecosystem
          </p>

          <h2 className="text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight">
            Five units.
            <br />
            <span className="text-white/40">One mission.</span>
          </h2>

          <p className="mt-4 max-w-sm text-sm text-white/45 leading-relaxed">
            Bending Waters is built as a flywheel — each unit feeds the next,
            compounding your growth from audience to investment.
          </p>
        </div>

        {/* Business unit list */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-1">
          {BUSINESS_UNITS.map((unit) => (
            <div
              key={unit.code}
              className="unit-item flex items-start gap-4 rounded-xl px-4 py-3.5 transition-colors duration-200"
            >
              <span className="mt-0.5 shrink-0 text-[11px] font-bold tracking-widest text-primary">
                {unit.code}
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-white">
                  {unit.name}
                </p>

                <p className="mt-0.5 text-xs leading-snug text-white/50">
                  {unit.tagline}
                </p>
              </div>

              <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-primary" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-item">
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] leading-tight text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-[52%] bg-[#0f0f0f] border-l border-white/10 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="mx-auto w-full max-w-xl">
          <div className="form-element mb-10">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
              Get Started
            </p>

            <h2 className="text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight text-white">
              How can we
              <br />
              <span className="text-white/40">help you grow?</span>
            </h2>

            <p className="mt-4 text-sm text-white/45 leading-relaxed">
              Select the areas you&apos;re looking to accelerate. We&apos;ll
              match you with the right unit and specialists.
            </p>
          </div>

          {/* Services */}
          <div className="form-element mb-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SERVICES.map((service) => {
              const isSelected = selected.includes(service.label);
              const Icon = service.icon;

              return (
                <button
                  key={service.label}
                  type="button"
                  onClick={() => toggle(service.label)}
                  aria-pressed={isSelected}
                  className={[
                    "group relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-accent",
                    isSelected
                      ? "bg-primary/10 border-primary/50 text-white"
                      : "bg-white/[0.03] border-white/10 text-white/50 hover:border-primary/30 hover:bg-primary/5 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-4 shrink-0 items-center justify-center rounded border transition-all duration-150",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-white/15 bg-white/5",
                    ].join(" ")}
                  >
                    {isSelected && (
                      <Check
                        size={10}
                        strokeWidth={3}
                        className="text-accent"
                      />
                    )}
                  </span>

                  <Icon
                    className={[
                      "size-4 shrink-0 transition-colors",
                      isSelected
                        ? "text-primary"
                        : "text-white/30 group-hover:text-primary",
                    ].join(" ")}
                  />

                  <span className="text-[13px] font-medium leading-tight">
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected count */}
          {selected.length > 0 && (
            <div className="form-element mb-5 flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary">
                  {selected.length} service{selected.length > 1 ? "s" : ""}{" "}
                  selected
                </span>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="form-element flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              onClick={openModal}
              className="group inline-flex items-center justify-center gap-2 bg-primary px-7 py-3.5 text-sm font-bold text-white transition-all duration-150 hover:bg-secondary active:scale-[0.98]"
            >
              Let&apos;s Talk
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <p className="text-xs leading-snug text-white/30">
              No commitment.
              <br />
              We respond within 24hrs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
