"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { navLinks, globalLocations } from "@/constants";

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);

  // Header entrance animation
  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    },
    { scope: headerRef }
  );

  // Mobile menu open/close animation
  useGSAP(
    () => {
      if (!mobileMenuRef.current) return;
      if (mobileOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [mobileOpen], scope: mobileMenuRef }
  );

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
  };

  return (
    <header
      ref={headerRef}
      className="sticky py-4 top-0 z-50 border-b border-white/6 bg-[#0a0a0a]/95 backdrop-blur-2xl"
    >
      <div className="mx-auto flex-between px-5 py-3.5">
        <div className="relative flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Replace with your actual logo path */}
            <div className="flex items-center gap-2">
              <Image
                src={`/images/logo.png`}
                alt="lod"
                width={120}
                height={50}
              />
            </div>
          </Link>

          {/* Divider */}
          <span className="text-white/20 text-lg font-light select-none">
            /
          </span>

          {/* Region trigger */}
          <button
            type="button"
            onClick={() => setIsGlobalOpen((v) => !v)}
            className="flex items-center gap-1 group"
          >
            <span className="text-primary text-[13px] font-medium tracking-wide">
              Africa
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-primary transition-transform duration-200 ${
                isGlobalOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Region dropdown panel */}
          {isGlobalOpen && (
            <div className="absolute top-full left-0 pt-4 z-50 min-w-70">
              <div className="bg-background border border-white/8 shadow-2xl shadow-black/60 p-6 rounded-2xl">
                {globalLocations.map((region, idx) => (
                  <div key={region.region} className={idx ? "mt-6" : ""}>
                    <h3 className="text-[10px] font-semibold tracking-[0.15em] text-white/30 uppercase mb-3">
                      {region.region}
                    </h3>
                    <ul className="space-y-1">
                      {region.countries.map((country) => (
                        <li key={country.name}>
                          <Link
                            href={country.link}
                            onClick={() => setIsGlobalOpen(false)}
                            className="flex items-center gap-2.5 text-[13px] text-white/70 hover:text-white py-1.5 px-2 rounded-lg hover:bg-white/4 transition-all"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                            {country.name}
                          </Link>
                          {country.subItems && (
                            <ul className="ml-5 mt-0.5 border-l border-white/6 pl-3 space-y-0.5">
                              {country.subItems.map((sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.link}
                                    onClick={() => setIsGlobalOpen(false)}
                                    className="block text-[12px] text-white/40 hover:text-white/80 py-1 transition-colors"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* ── LEFT: Logo + Region picker ── */}
        <div className="flex items-center gap-8">
          {/* Logo + region dropdown */}

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const hasDropdown = "dropdown" in item && item.dropdown;

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    hasDropdown && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.link ?? "#"}
                    className={`flex items-center gap-1 text-[13px] font-medium px-3 py-2 rounded-lg transition-all duration-150
                      ${
                        activeDropdown === item.name
                          ? "text-white bg-white/6"
                          : "text-white/60 hover:text-white hover:bg-white/4"
                      }`}
                  >
                    {item.name}
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          activeDropdown === item.name
                            ? "rotate-180 text-primary"
                            : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mega dropdown panel */}
                  {hasDropdown && activeDropdown === item.name && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50">
                      {/* width: 4-column = ~860px, 2-column = ~480px */}
                      <div
                        className={`
                          bg-[#111111] border border-white/8 shadow-2xl shadow-black/70
                          p-7 rounded-2xl grid gap-8
                          ${item.dropdown.length === 4 ? "grid-cols-4 w-215" : ""}
                          ${item.dropdown.length === 3 ? "grid-cols-3 w-160" : ""}
                          ${item.dropdown.length === 2 ? "grid-cols-2 w-110" : ""}
                        `}
                      >
                        {item.dropdown.map((section, sIdx) => (
                          <div key={section.title}>
                            {/* Section divider — teal accent on first column only */}
                            <div className="flex items-center gap-2 mb-4">
                              {sIdx === 0 && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              )}
                              <h3 className="text-[11px] font-semibold tracking-[0.12em] text-white/40 uppercase">
                                {section.title}
                              </h3>
                            </div>

                            <ul className="space-y-1.5">
                              {section.items.map((sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.link ?? "#"}
                                    className="group flex items-center justify-between text-[13px] text-white/65 hover:text-white py-1.5 px-2 rounded-lg hover:bg-white/4 transition-all duration-150"
                                  >
                                    <span>{sub.name}</span>
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── RIGHT: CTA + mobile toggle ── */}
        <div className="flex items-center gap-3">
          {/* "Let's Talk" CTA — desktop */}
          <Link
            href="/contact"
            className="hidden lg:flex items-center gap-1.5 bg-primary text-white px-4 py-2 text-[13px] font-semibold
              hover:bg-primary transition-colors duration-150 group"
          >
            Let&apos;s Talk
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div ref={mobileMenuRef} className="h-0 overflow-hidden lg:hidden">
        <nav className="px-5 pb-6 pt-2 space-y-1 border-t border-white/6">
          {navLinks.map((item) => {
            const hasDropdown = "dropdown" in item && item.dropdown;
            const isOpen = openMobileDropdown === item.name;

            return (
              <div key={item.name}>
                {hasDropdown ? (
                  <button
                    className="flex w-full items-center justify-between text-[14px] font-medium text-white/70 hover:text-white py-3 px-3 rounded-xl hover:bg-white/4 transition-all"
                    onClick={() =>
                      setOpenMobileDropdown((prev) =>
                        prev === item.name ? null : item.name
                      )
                    }
                  >
                    {item.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : "text-white/30"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.link ?? "#"}
                    onClick={closeMobile}
                    className="block text-[14px] font-medium text-white/70 hover:text-white py-3 px-3 rounded-xl hover:bg-white/4 transition-all"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Mobile sub-items */}
                {hasDropdown && isOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l border-white/8 space-y-4 pb-2">
                    {item.dropdown.map((section) => (
                      <div key={section.title}>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-white/30 uppercase mt-3 mb-2 px-2">
                          {section.title}
                        </p>
                        {section.items.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.link ?? "#"}
                            className="block text-[13px] text-white/60 hover:text-white py-1.5 px-2 rounded-lg hover:bg-white/4 transition-all"
                            onClick={closeMobile}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile CTA */}
          <div className="pt-4 border-t border-white/6">
            <Link
              href="/contact"
              onClick={closeMobile}
              className="flex items-center justify-center gap-2 bg-primary text-white font-semibold text-[14px] py-3 hover:bg-primary transition-colors"
            >
              Let&apos;s Talk
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
