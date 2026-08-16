"use client";

import Link from "next/link";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Container } from "./ui";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";
import Image from "next/image";

const COMPANY_LINKS = [
  { name: "About", href: "/about" },
  { name: "Our Work", href: "/work" },
  { name: "Contact", href: "/contact" },
];

const SERVICE_LINKS = [
  { name: "Website Design", href: "/solutions/creative/web-design" },
  { name: "Website Development", href: "/solutions/frontend-dev" },
  { name: "Brand & Digital Strategy", href: "/solutions/branding" },
];

const RESOURCE_LINKS = [
  { name: "FAQs", href: "#faq" },
  { name: "Privacy Policy", href: "/legal" },
  { name: "Terms", href: "/legal" },
];

export default function LaunchFooter() {
  const { openFullFunnel } = useFunnel();

  return (
    <footer className="bg-[#0a0a0a]">
      <div className="border-b border-white/8 py-16">
        <Container className="max-w-3xl text-center">
          <p className="text-xl font-semibold text-white sm:text-2xl">
            Ready for your next opportunity?
          </p>
          <button
            type="button"
            onClick={() => {
              trackEvent("hero_cta_clicked", { placement: "footer" });
              openFullFunnel();
            }}
            className="mt-6 inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-[15px] font-semibold text-white transition hover:brightness-110"
          >
            Build My Website in 7 Days <ArrowRight className="size-4" />
          </button>
        </Container>
      </div>

      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/websitein7days" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="BendingWaters"
              width={120}
              height={50}
              priority
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
            Digital experiences for businesses ready for what&apos;s next.
          </p>
        </div>

        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Services" links={SERVICE_LINKS} />
        <FooterColumn title="Resources" links={RESOURCE_LINKS} />

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Contact
          </h3>
          <div className="mt-4 space-y-2.5">
            <Link
              href="mailto:outreach@bendingwaters.africa"
              className="flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
            >
              <Mail className="size-3.5" /> outreach@bendingwaters.africa
            </Link>
            <Link
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
            >
              <MessageCircle className="size-3.5" /> Chat on WhatsApp
            </Link>
          </div>
        </div>
      </Container>

      <Container className="border-t border-white/8 py-6">
        <p className="text-center text-xs text-white/30">
          © {new Date().getFullYear()} BendingWaters. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="text-sm text-white/55 transition hover:text-white">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
