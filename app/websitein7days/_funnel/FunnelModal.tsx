"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useFunnel } from "./FunnelProvider";
import LeadCaptureStep from "./steps/LeadCaptureStep";
import QualificationStep from "./steps/QualificationStep";
import PackageSelectStep from "./steps/PackageSelectStep";
import BookingStep from "./steps/BookingStep";
import CallConfirmedStep from "./steps/CallConfirmedStep";
import CheckoutStep from "./steps/CheckoutStep";

export default function FunnelModal() {
  const { step, closeFunnel } = useFunnel();
  const isOpen = step !== null;

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFunnel();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeFunnel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="dialog"
      aria-modal="true"
      onClick={closeFunnel}
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0d0f] p-6 shadow-2xl shadow-black/50 sm:p-8 my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeFunnel}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>

        {step === "lead" && <LeadCaptureStep />}
        {step === "qualification" && <QualificationStep />}
        {step === "package-select" && <PackageSelectStep />}
        {step === "booking" && <BookingStep />}
        {step === "call-confirmed" && <CallConfirmedStep />}
        {step === "checkout" && <CheckoutStep />}
      </div>
    </div>
  );
}
