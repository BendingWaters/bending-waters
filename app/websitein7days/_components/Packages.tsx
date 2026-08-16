"use client";

import { cn } from "@/lib/utils";
import { Container } from "./ui";
import { LAUNCH_PACKAGES, type LaunchPackage } from "@/lib/launch/packages";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";
import { useInViewOnce } from "../_lib/useInViewOnce";

export default function Packages() {
  const viewRef = useInViewOnce<HTMLDivElement>(() => trackEvent("package_viewed"));

  const [starter, standard, business, premium] = LAUNCH_PACKAGES;

  return (
    <section id="packages" className="border-b border-white/8 py-20 sm:py-28" ref={viewRef}>
      <Container>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Packages</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          Every package is a fixed product: an agreed scope, an agreed price and an agreed launch
          date, confirmed in writing before work begins.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <PackageCard pkg={starter} highlighted />
          <PackageCard pkg={standard} />
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-base leading-relaxed text-white/60">
          The upper tiers exist because depth cannot be compressed. Where a business needs
          narrative, commerce or a full platform, we extend the schedule rather than thin the
          work.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <PackageCard pkg={business} />
          <PackageCard pkg={premium} />
        </div>
      </Container>
    </section>
  );
}

function PackageCard({ pkg, highlighted }: { pkg: LaunchPackage; highlighted?: boolean }) {
  const { openCheckout, openFullFunnel } = useFunnel();

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-7",
        highlighted ? "border-primary/50 bg-primary/[0.05]" : "border-white/10 bg-[#111113]"
      )}
    >
      {pkg.badge && (
        <span className="mb-5 inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {pkg.badge}
        </span>
      )}

      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
        {pkg.tier}
      </span>
      <h3 className="mt-2 text-xl font-semibold text-white">{pkg.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{pkg.description}</p>

      <div className="mt-5 border-t border-white/10 pt-5">
        <p className="text-2xl font-semibold text-white">{pkg.priceLabel}</p>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {pkg.deliveryLabel} · Fixed Scope
        </p>
      </div>

      <ul className="mt-5 flex-1 space-y-2.5 border-t border-white/10 pt-5">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-white/65">
            <span className="mt-1.5 size-1.5 shrink-0 bg-primary" />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm italic text-white/40">{pkg.footerNote}</p>

      <button
        type="button"
        onClick={() => {
          trackEvent("hero_cta_clicked", { placement: `package_${pkg.id}` });
          if (pkg.ctaAction === "checkout") {
            openCheckout(pkg.id);
          } else {
            openFullFunnel();
          }
        }}
        className={cn(
          "mt-5 inline-flex items-center justify-center px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wide transition text-white",
          highlighted
            ? "bg-primary hover:brightness-110"
            : "border border-white/15 hover:border-white/30"
        )}
      >
        {pkg.ctaLabel}
      </button>
    </div>
  );
}
