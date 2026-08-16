"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Award,
  BookOpen,
  Users,
  Building,
  BrickWall,
  Settings,
  Rocket,
  ArrowRight,
  Play,
  MapPin,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── Data ─────────────────────────────────────────────── */

const stats = [
  {
    value: "1000+",
    label: "Community Members",
    desc: "Growing business owners communities",
  },
  {
    value: "30+",
    label: "Enterprise Clients",
    desc: "Trust our solutions worldwide",
  },
  {
    value: "100+",
    label: "SMBs Served",
    desc: "Leveraging our expertise for growth",
  },
  {
    value: "5",
    label: "Countries",
    desc: "Active presence and support",
  },
];

const values = [
  {
    number: "01",
    Icon: BrickWall,
    title: "The Foundation",
    description:
      "BendingWaters helps you articulate the WHY behind your idea and test its viability. We build essential support systems ensuring your startup has the structural integrity to support massive growth.",
  },
  {
    number: "02",
    Icon: Settings,
    title: "The Process",
    description:
      "We implement seamless digital marketing systems and growth workflows to help you beat the 5-year failure statistic — ensuring your business operates with efficiency, clarity, and sustainable structure.",
  },
  {
    number: "03",
    Icon: Rocket,
    title: "The Flight",
    description:
      "Through data-driven strategies and global positioning, we help your brand take flight — expanding your footprint and evolving into the most powerful, influential version of itself.",
  },
];

const globalStats = [
  {
    Icon: Award,
    value: "+70",
    label: "Awards & Mentions",
    desc: "We make our client partners shine — and we're just getting started.",
  },
  {
    Icon: BookOpen,
    value: "+500",
    label: "Clients",
    desc: "Long-lasting partnerships spanning industries and verticals worldwide.",
  },
  {
    Icon: Users,
    value: "+1,000",
    label: "Employees",
    desc: "A globally distributed team that loves where they work.",
  },
  {
    Icon: Building,
    value: "28",
    label: "Countries",
    desc: "Global team, local relevance — it doesn't matter where you live.",
  },
];

/* Deterministic dot grid — avoids SSR/hydration mismatch */
const DOT_GRID = [
  [0,0,1,0,1,1,0,0,1,0,1,0,0,0,1,0,1,0],
  [0,1,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,0],
  [1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0],
  [0,1,1,0,0,1,1,1,0,1,1,1,1,0,1,1,1,1],
  [0,0,1,0,1,0,1,0,0,0,1,1,0,0,0,1,1,1],
  [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0],
];

/* ─── Page ──────────────────────────────────────────────── */

export default function About() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.7 })
        .from(".hero-heading", { y: 60, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.4")
        .from(".hero-divider", { scaleX: 0, transformOrigin: "left", duration: 0.7, ease: "power2.inOut" }, "-=0.5")
        .from(".hero-body", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.4")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(".hero-footer", { opacity: 0, duration: 0.6 }, "-=0.3");
    },
    { scope: heroRef }
  );

  return (
    <main className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-zinc-950 overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/about-hero-bg.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        </div>

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Left accent strip */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/50 to-transparent" />

        {/* Orange ambient glow */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-orange-600 opacity-[0.06] blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 container mx-auto px-8 md:px-16 lg:px-24 pt-36 pb-28">
          <div className="max-w-5xl">

            {/* Eyebrow */}
            <div className="hero-eyebrow flex items-center gap-3 mb-10">
              <div className="w-6 h-px bg-orange-500" />
              <span
                className="text-orange-500 text-[11px] tracking-[0.35em] uppercase"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Bending Waters — Our Story
              </span>
            </div>

            {/* Headline */}
            <h1
              className="leading-[0.92] tracking-tight mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span className="hero-heading block text-white text-7xl md:text-8xl lg:text-[7rem] font-black">
                Built for
              </span>
              <span className="hero-heading block text-white italic text-7xl md:text-8xl lg:text-[7rem] font-black">
                clarity.
              </span>
              <span className="hero-heading block text-[#FF5722] text-7xl md:text-8xl lg:text-[7rem] font-black">
                Designed
              </span>
              <span className="hero-heading block text-white text-7xl md:text-8xl lg:text-[7rem] font-black">
                for growth.
              </span>
            </h1>

            {/* Divider */}
            <div className="hero-divider w-20 h-0.5 bg-orange-500 mb-10" />

            {/* Body copy */}
            <div className="max-w-xl space-y-4 mb-12">
              <p className="hero-body text-gray-300 text-lg leading-relaxed">
                BendingWaters helps African founders and small business owners
                who have built something real, but struggle to turn attention
                into consistent revenue.
              </p>
              <p className="hero-body text-gray-500 text-sm leading-relaxed">
                We define who you're for, what problem you solve, and why
                customers choose you — then build the marketing systems that
                drive trust, engagement, and growth.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="hero-cta group flex items-center gap-3 bg-[#FF5722] hover:bg-orange-500 text-white px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300"
              >
                Let&apos;s Talk
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
              <Link
                href="/careers"
                className="hero-cta flex items-center gap-3 border border-white/15 hover:border-orange-500/60 hover:text-orange-400 text-white/70 px-8 py-4 text-sm font-medium transition-all duration-300"
              >
                Join the Team
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom status bar */}
        <div
          className="hero-footer absolute bottom-0 left-0 right-0 border-t border-white/[0.04] px-8 md:px-16 lg:px-24 py-4 flex items-center justify-between"
        >
          <span
            className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Lagos, Nigeria — EMEA Markets
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse block" />
            <span
              className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Open to Partnerships
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="bg-[#FF5722] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-orange-400/50 lg:divide-x lg:divide-y-0">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group py-14 px-10 hover:bg-orange-600 transition-colors duration-300 border-orange-400/50 sm:[&:nth-child(odd)]:border-r sm:border-b lg:border-b-0 lg:[&:nth-child(odd)]:border-r-0"
            >
              <div
                className="text-7xl md:text-8xl font-black text-white leading-none mb-4 group-hover:text-black/10 transition-colors duration-300"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {stat.value}
              </div>
              <div
                className="text-[11px] font-semibold tracking-[0.25em] text-orange-200 group-hover:text-orange-300/70 uppercase mb-2 transition-colors duration-300"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {stat.label}
              </div>
              <p className="text-sm text-orange-100/70 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────── */}
      <section className="bg-[#F7F4EF] text-zinc-900 py-28 px-8 md:px-16 lg:px-24">
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-6">
            <div>
              <span
                className="text-[#FF5722] text-[11px] tracking-[0.35em] uppercase block mb-5"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Our Values
              </span>
              <h2
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Why We Do
                <br />
                <em>What We Do.</em>
              </h2>
            </div>
            <p className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right shrink-0">
              Bridging the gap between a brilliant idea and a global legacy —
              three critical stages of evolution.
            </p>
          </div>

          <div className="h-px bg-zinc-200 mb-0" />

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {values.map(({ number, Icon, title, description }, i) => (
              <div
                key={i}
                className={`group py-12 px-10 border-b border-zinc-200 md:border-b-0 ${
                  i < 2 ? "md:border-r border-zinc-200" : ""
                } hover:bg-[#FF5722] transition-all duration-500 cursor-default`}
              >
                <span
                  className="text-[11px] text-[#FF5722] group-hover:text-orange-200 tracking-[0.3em] uppercase mb-8 block transition-colors duration-500"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {number}
                </span>
                <div className="text-zinc-700 group-hover:text-white mb-6 transition-colors duration-500">
                  <Icon size={40} strokeWidth={1.2} />
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold text-zinc-900 group-hover:text-white mb-4 transition-colors duration-500"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-zinc-500 group-hover:text-orange-100/80 leading-relaxed transition-colors duration-500">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="h-px bg-zinc-200" />
        </div>
      </section>

      {/* ── GLOBAL SUPPORT ───────────────────────────────── */}
      <section className="bg-zinc-950 text-white py-28 px-8 md:px-16 lg:px-24">
        <div className="container mx-auto max-w-7xl">

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start mb-20">

            {/* Left: text */}
            <div className="lg:w-5/12 lg:sticky lg:top-24">
              <span
                className="text-orange-500 text-[11px] tracking-[0.35em] uppercase block mb-6"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Global Reach
              </span>
              <h2
                className="text-5xl md:text-6xl font-black leading-tight mb-8"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Global support,
                <br />
                <em className="text-[#FF5722]">local relevancy.</em>
              </h2>
              <div className="h-px bg-white/10 mb-8" />
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                We orchestrate the right mix of talent to build the perfect team
                — with strong focus on chemistry, relevant experience, and
                proximity. For our employees, it doesn't matter where you live.
              </p>
            </div>

            {/* Right: dot-grid world map */}
            <div className="lg:w-7/12">
              <div className="aspect-[2/1] bg-zinc-900 border border-white/5 relative overflow-hidden">
                {/* World map image — falls back to dot grid in dev */}
                <div
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-40"
                  style={{ backgroundImage: "url('/images/world-map-about-01.png')" }}
                />

                {/* Animated dot overlay */}
                <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6">
                  {DOT_GRID.map((row, ri) => (
                    <div key={ri} className="flex gap-2.5 justify-center">
                      {row.map((dot, di) => (
                        <div
                          key={di}
                          className={`w-2 h-2 rounded-full ${
                            dot
                              ? "bg-orange-500 animate-pulse"
                              : "bg-zinc-700"
                          }`}
                          style={dot ? { animationDelay: `${(ri * 18 + di) * 80}ms` } : undefined}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-4 right-5">
                  <span
                    className="text-[10px] text-zinc-600 tracking-widest uppercase"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    28 Countries
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="border-t border-white/5 pt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {globalStats.map(({ Icon, value, label, desc }, i) => (
              <div
                key={i}
                className="bg-zinc-950 p-8 hover:bg-zinc-900 transition-colors duration-300 group"
              >
                <div className="text-orange-500 mb-5">
                  <Icon size={32} strokeWidth={1.2} />
                </div>
                <div
                  className="text-5xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {value}
                </div>
                <div
                  className="text-[11px] text-zinc-500 tracking-[0.2em] uppercase mb-3"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {label}
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── ANNUAL RECAP ─────────────────────────────────── */}
      <section className="bg-black py-28 px-8 md:px-16 lg:px-24 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-7xl">

          <div className="flex flex-col lg:flex-row lg:items-center gap-16">

            {/* Left: text */}
            <div className="lg:w-5/12">
              <span
                className="text-orange-500 text-[11px] tracking-[0.35em] uppercase block mb-6"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Annual Recap
              </span>
              <h2
                className="text-5xl md:text-6xl font-black leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Another year
                <br />
                of{" "}
                <em className="text-[#FF5722]">explosive</em>
                <br />
                growth.
              </h2>
              <div className="h-px bg-white/10 mb-8" />
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                2024 brought significant technology enhancements to both
                Ubersuggest and AnswerThePublic, new client growth, industry
                recognition, and another strategic acquisition.
              </p>
              <button className="group flex items-center gap-3 border border-white/15 hover:border-orange-500 text-white px-8 py-4 text-sm font-medium transition-all duration-300">
                <Play
                  size={14}
                  className="fill-current group-hover:fill-orange-400"
                />
                Watch Full Recap
              </button>
            </div>

            {/* Right: video */}
            <div className="lg:w-7/12">
              <div className="aspect-video bg-zinc-950 border border-white/5 relative overflow-hidden group cursor-pointer">
                <video
                  src="/videos/videeo.mp4"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-black/40" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500 group-hover:bg-orange-400 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                    <Play size={20} className="fill-white text-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom meta */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 px-5 py-3 flex items-center justify-between">
                  <span
                    className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    BendingWaters — 2024 Annual Recap
                  </span>
                  <span
                    className="text-[10px] text-orange-500 tracking-widest"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    02:47
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}