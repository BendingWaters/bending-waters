"use client";

import { ArrowRight } from "lucide-react";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";

export default function AnnouncementBar() {
  const { openFullFunnel } = useFunnel();

  return (
    <div className="bg-primary text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center text-[13px] font-medium sm:px-8">
        <span>
          7-DAY WEBSITE LAUNCH PROGRAMME — Limited production slots available this month.
        </span>
        <button
          type="button"
          onClick={() => {
            trackEvent("hero_cta_clicked", { placement: "announcement_bar" });
            openFullFunnel();
          }}
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline"
        >
          Get Started <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
