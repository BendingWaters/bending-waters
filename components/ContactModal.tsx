"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { X, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitContactForm } from "@/app/actions/contact";

// ── Budget options localised for the Nigerian / pan-African market ────────
const BUDGET_OPTIONS = [
  { value: "", label: "Monthly Marketing Budget", disabled: true },
  { value: "<500k", label: "Under ₦500,000" },
  { value: "500k-2m", label: "₦500,000 – ₦2,000,000" },
  { value: "2m-10m", label: "₦2,000,000 – ₦10,000,000" },
  { value: "10m+", label: "₦10,000,000+" },
  { value: "usd-5k", label: "$5,000 – $50,000 (USD)" },
  { value: "usd-50k+", label: "$50,000+ (USD)" },
];

// ── Shared field wrapper ───────────────────────────────────────────────────
function Field({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
        focus-within:border-primary/50 focus-within:bg-white/[0.05] transition-all duration-150 ${className}`}
    >
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-transparent outline-none text-[13.5px] text-white placeholder-white/25 font-medium";

export default function ContactModal() {
  const { isOpen, closeModal } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitContactForm(formData);
      setStatus(result);
      if (result.success) {
        setTimeout(() => {
          closeModal();
          setStatus(null);
        }, 2400);
      }
    });
  };

  // Open animation
  useGSAP(
    () => {
      if (isOpen) {
        gsap.to(backdropRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.fromTo(
          contentRef.current,
          { scale: 0.94, opacity: 0, y: 24 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "back.out(1.5)",
          }
        );
        gsap.from(".modal-field", {
          y: 10,
          opacity: 0,
          stagger: 0.055,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.15,
        });
      }
    },
    { scope: modalRef, dependencies: [isOpen] }
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      {/* ── Backdrop ── */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/75 backdrop-blur-md opacity-0"
        onClick={closeModal}
      />

      {/* ── Modal card ── */}
      <div
        ref={contentRef}
        className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80
          overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Teal ambient glow — top-right */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #f94d03, transparent 70%)",
          }}
        />

        {/* ── Header strip ── */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 relative z-10">
          <div>
            {/* Logo — dark-mode logo, no invert needed */}
            <div className="relative w-28 h-9 mb-4">
              <Image
                src="/images/logo.png"
                alt="Bending Waters"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
              Let&apos;s build something
              <br />
              <span className="text-white/35">that moves the needle.</span>
            </h2>
            <p className="mt-2 text-[13px] text-white/38 leading-relaxed max-w-md">
              Fill in your details and we&apos;ll match you with the right unit
              and a specialist — usually within 24 hours.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 flex items-center justify-center w-8 h-8
              rounded-full border border-white/[0.1] text-white/40 hover:text-white hover:border-white/20
              transition-all duration-150"
            aria-label="Close"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/[0.06] mx-8" />

        {/* ── Success state ── */}
        {status?.success ? (
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 relative z-10">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/30">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">
                You&apos;re all set!
              </p>
              <p className="text-[13px] text-white/40 mt-1">{status.message}</p>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <form
            onSubmit={handleSubmit}
            className="px-8 py-7 relative z-10 space-y-3"
          >
            {/* Row 1: Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="modal-field">
                <Field>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Work email"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="modal-field">
                <Field>
                  <div className="flex items-center gap-2.5">
                    {/* Nigerian flag inline */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 pr-2.5 border-r border-white/[0.1]">
                      <svg
                        width="18"
                        height="12"
                        viewBox="0 0 18 12"
                        fill="none"
                      >
                        <rect width="6" height="12" fill="#008751" />
                        <rect x="6" width="6" height="12" fill="#fff" />
                        <rect x="12" width="6" height="12" fill="#008751" />
                      </svg>
                      <span className="text-[12px] text-white/40 font-medium">
                        +234
                      </span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      className={inputClass}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Row 2: First + Last name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="modal-field">
                <Field>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="First name"
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="modal-field">
                <Field>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Last name"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            {/* Row 3: Website + Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="modal-field">
                <Field>
                  <input
                    type="url"
                    name="website"
                    placeholder="Company website (optional)"
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="modal-field">
                <Field>
                  <select
                    name="budget"
                    defaultValue=""
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {BUDGET_OPTIONS.map((o) => (
                      <option
                        key={o.value}
                        value={o.value}
                        disabled={o.disabled}
                        className="bg-[#111] text-white"
                      >
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {/* Message */}
            <div className="modal-field">
              <Field>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Brief description of what you're working on (optional)"
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>

            {/* Disclaimer */}
            <p className="modal-field text-[11px] text-white/22 leading-relaxed pt-1">
              By submitting you consent to BendingWaters and partners contacting
              you at the details provided. This consent is not required to make
              a purchase.{" "}
              <a
                href="/privacy"
                className="underline underline-offset-2 hover:text-white/40 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* Error message */}
            {status && !status.success && (
              <p className="text-[12px] text-red-400 text-center">
                {status.message}
              </p>
            )}

            {/* Submit */}
            <div className="modal-field flex items-center justify-between pt-2 pb-1">
              <p className="text-[11.5px] text-white/25 leading-snug">
                We typically respond
                <br />
                within 24 hours.
              </p>

              <button
                type="submit"
                disabled={isPending}
                className="group flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60
                  text-white font-bold text-[13.5px] px-7 py-3.5
                  transition-all duration-150 active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Submit
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
