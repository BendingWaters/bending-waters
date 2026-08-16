"use client";

import { useState } from "react";
import Link from "next/link";
import Image  from "next/image";
import { Menu, X } from "lucide-react";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";

const NAV_LINKS = [
  { name: "How It Works", href: "#process" },
  { name: "What's Included", href: "#included" },
  { name: "Packages", href: "#packages" },
  { name: "Our Work", href: "#work" },
  { name: "FAQs", href: "#faq" },
];

export default function LaunchNav() {
  const { openFullFunnel } = useFunnel();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleCta() {
    trackEvent("hero_cta_clicked", { placement: "nav" });
    openFullFunnel();
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/websitein7days" className="flex items-center">
          <Image src="/images/logo.png" alt="BendingWaters" width={120} height={50} priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCta}
            className="hidden items-center bg-primary px-4 py-2 text-[13px] font-semibold text-white transition hover:brightness-110 sm:inline-flex"
          >
            Build My Website
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/8 px-5 pb-5 pt-2 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <button
            type="button"
            onClick={handleCta}
            className="mt-2 w-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Build My Website
          </button>
        </nav>
      )}
    </header>
  );
}
