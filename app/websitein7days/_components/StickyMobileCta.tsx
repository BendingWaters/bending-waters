"use client";

import { useEffect, useState } from "react";
import { useFunnel } from "../_funnel/FunnelProvider";
import { trackEvent } from "../_lib/analytics";

export default function StickyMobileCta() {
  const { openFullFunnel, step } = useFunnel();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (step !== null) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0a0a]/95 p-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          trackEvent("hero_cta_clicked", { placement: "sticky_mobile" });
          openFullFunnel();
        }}
        className="flex w-full items-center justify-center bg-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-primary/20"
      >
        Build My Website in 7 Days
      </button>
    </div>
  );
}
