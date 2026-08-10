"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "../_components/ui";
import { trackEvent } from "../_lib/analytics";

type VerifyState =
  | { status: "loading" }
  | { status: "success"; packageName: string; amount: number; reference: string }
  | { status: "failed"; message: string };

const STEPS = [
  { title: "Complete onboarding", text: "Tell us everything we need to know about your business." },
  { title: "Send your assets", text: "Upload your logo, images, documents and existing content." },
  { title: "Kickoff", text: "We'll confirm your project schedule and begin the seven-day sprint." },
];

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [state, setState] = useState<VerifyState>(() =>
    reference ? { status: "loading" } : { status: "failed", message: "Missing payment reference." }
  );

  useEffect(() => {
    if (!reference) return;

    fetch(`/api/launch/payments/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.status === "PAYMENT_SUCCESSFUL") {
          setState({
            status: "success",
            packageName: result.packageName,
            amount: result.amount,
            reference: result.reference,
          });
          trackEvent("payment_successful", { reference: result.reference });
        } else {
          setState({
            status: "failed",
            message:
              result.status === "PAYMENT_FAILED"
                ? "This payment was not successful. Please try again or contact us on WhatsApp."
                : result.message || "We couldn't confirm this payment yet.",
          });
          trackEvent("payment_failed", { reference });
        }
      })
      .catch(() => {
        setState({ status: "failed", message: "We couldn't verify this payment. Please contact us on WhatsApp." });
        trackEvent("payment_failed", { reference });
      });
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Container className="flex min-h-screen max-w-2xl flex-col items-center justify-center py-20 text-center">
        {state.status === "loading" && (
          <>
            <div className="size-10 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
            <p className="mt-6 text-white/60">Confirming your payment…</p>
          </>
        )}

        {state.status === "success" && (
          <>
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="size-9" />
            </div>

            <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
              You&apos;re officially on the list. 🎉
            </h1>
            <p className="mt-3 text-[17px] text-white/60">Your website project has been confirmed.</p>

            <div className="mt-10 w-full space-y-3 text-left">
              {STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-[#111113] p-5">
                  <span className="text-lg font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[15px] font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm text-white/55">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/websitein7days/onboarding?reference=${state.reference}`}
              className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-white transition hover:brightness-110"
            >
              Complete My Onboarding <ArrowRight className="size-4" />
            </Link>

            <Link
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
            >
              <MessageCircle className="size-4" /> Need Help? Chat on WhatsApp
            </Link>
          </>
        )}

        {state.status === "failed" && (
          <>
            <div className="flex size-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <XCircle className="size-9" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-white">Payment not confirmed</h1>
            <p className="mt-3 max-w-md text-[15px] text-white/60">{state.message}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/websitein7days#packages"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Try Again
              </Link>
              <Link
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:text-white"
              >
                <MessageCircle className="size-4" /> Chat on WhatsApp
              </Link>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
