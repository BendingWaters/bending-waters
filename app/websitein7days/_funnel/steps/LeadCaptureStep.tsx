"use client";

import { useState, type FormEvent } from "react";
import { useFunnel } from "../FunnelProvider";
import { Field, fieldInputClass, PrimaryButton, ErrorBanner } from "../ui";
import { trackEvent } from "../../_lib/analytics";

export default function LeadCaptureStep() {
  const { data, attribution, updateData, goTo } = useFunnel();
  const [form, setForm] = useState({
    firstName: data.firstName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/launch/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...attribution }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      updateData({ ...form, leadId: result.leadId });
      trackEvent("lead_form_completed", { leadId: result.leadId });
      goTo("qualification");
      trackEvent("qualification_started", { leadId: result.leadId });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        7-Day Website Launch
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
        Let&apos;s get your business ready.
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-white/60">
        Tell us where your business is today and we&apos;ll help you determine the fastest path to
        a professional website.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" onFocus={() => trackEvent("lead_form_started")}>
        <Field label="First Name" htmlFor="firstName" required>
          <input
            id="firstName"
            required
            value={form.firstName}
            onChange={(event) => setForm((f) => ({ ...f, firstName: event.target.value }))}
            placeholder="Enter your first name"
            className={fieldInputClass}
          />
        </Field>

        <Field label="Business Name" htmlFor="businessName">
          <input
            id="businessName"
            value={form.businessName}
            onChange={(event) => setForm((f) => ({ ...f, businessName: event.target.value }))}
            placeholder="Your company name"
            className={fieldInputClass}
          />
        </Field>

        <Field label="Business Email" htmlFor="email" required>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((f) => ({ ...f, email: event.target.value }))}
            placeholder="you@company.com"
            className={fieldInputClass}
          />
        </Field>

        <Field label="WhatsApp Number" htmlFor="phone" required>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(event) => setForm((f) => ({ ...f, phone: event.target.value }))}
            placeholder="+234 ..."
            className={fieldInputClass}
          />
        </Field>

        {error && <ErrorBanner message={error} />}

        <PrimaryButton type="submit" loading={submitting}>
          Continue →
        </PrimaryButton>

        <p className="text-center text-xs leading-relaxed text-white/40">
          Your information is used to contact you about your website request and project. We
          won&apos;t sell your information.
        </p>
      </form>
    </div>
  );
}
