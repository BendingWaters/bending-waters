"use client";

import { useFunnel } from "../FunnelProvider";
import { GhostButton } from "../ui";
import { LAUNCH_PACKAGES } from "@/lib/launch/packages";

export default function PackageSelectStep() {
  const { updateData, goTo } = useFunnel();

  function choose(packageId: string, ctaAction: "checkout" | "talk") {
    updateData({ selectedPackageId: packageId });

    if (ctaAction === "checkout") {
      goTo("checkout");
    } else {
      goTo("booking");
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Choose your starting point
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
        Which package fits your business?
      </h3>

      <div className="mt-6 space-y-3">
        {LAUNCH_PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => choose(pkg.id, pkg.ctaAction)}
            className="w-full rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-4 text-left transition hover:border-primary hover:bg-primary/5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-semibold text-white">{pkg.name}</span>
              <span className="text-sm font-medium text-primary">{pkg.priceLabel}</span>
            </div>
            <p className="mt-1.5 text-sm text-white/55">{pkg.description}</p>
            {pkg.ctaAction === "talk" && (
              <p className="mt-1.5 text-xs text-white/35">
                Custom quote — we&apos;ll confirm pricing on your strategy call.
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <GhostButton type="button" onClick={() => goTo("qualification")}>
          Back
        </GhostButton>
      </div>
    </div>
  );
}
