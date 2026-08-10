"use client";

import { CheckCircle2 } from "lucide-react";
import { useFunnel } from "../FunnelProvider";
import { GhostButton } from "../ui";

export default function CallConfirmedStep() {
  const { closeFunnel } = useFunnel();

  return (
    <div className="py-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
        <CheckCircle2 className="size-8" />
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-white sm:text-3xl">You&apos;re booked.</h3>

      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/60">
        We&apos;ve received your information and your strategy call is confirmed. Check your email
        and WhatsApp for the details.
      </p>

      <div className="mt-8">
        <GhostButton type="button" onClick={closeFunnel} className="mx-auto">
          Close
        </GhostButton>
      </div>
    </div>
  );
}
