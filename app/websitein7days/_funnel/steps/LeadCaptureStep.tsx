"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useFunnel } from "../FunnelProvider";
import { Field, fieldInputClass, fieldLabelClass, OptionCard, PrimaryButton, ErrorBanner } from "../ui";
import { trackEvent } from "../../_lib/analytics";
import { getLaunchPackage, INSTALLMENT_ELIGIBLE_PACKAGE_ID, LAUNCH_PACKAGES } from "@/lib/launch/packages";
import type { PaymentPreference, PaymentReadiness, PriceAwareness } from "@/lib/launch/types";

const PRICE_AWARENESS_OPTIONS: { value: PriceAwareness; label: string }[] = [
  { value: "aware", label: "Yes, I am aware of the cost" },
  { value: "needs_info", label: "No, I would like more information" },
];

const PAYMENT_READINESS_OPTIONS: { value: PaymentReadiness; label: string }[] = [
  { value: "ready_now", label: "Yes, I can pay immediately" },
  { value: "ready_soon", label: "Yes, but I need some time" },
  { value: "considering", label: "I'm still considering my options" },
];

function OptionGroupField({
  legend,
  required,
  children,
}: {
  legend: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend className={fieldLabelClass}>
        {legend}
        {required && <span className="text-primary ml-1">*</span>}
      </legend>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  );
}

export default function LeadCaptureStep() {
  const { data, attribution, updateData, goTo } = useFunnel();
  const [form, setForm] = useState({
    firstName: data.firstName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    selectedPackageId: data.selectedPackageId ?? "",
    priceAwareness: data.priceAwareness ?? ("" as PriceAwareness | ""),
    paymentReadiness: data.paymentReadiness ?? ("" as PaymentReadiness | ""),
    paymentPreference: data.paymentPreference ?? ("" as PaymentPreference | ""),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiresPaymentPreference = form.selectedPackageId === INSTALLMENT_ELIGIBLE_PACKAGE_ID;
  const installmentPackage = getLaunchPackage(INSTALLMENT_ELIGIBLE_PACKAGE_ID);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.selectedPackageId) {
      setError("Please select which package you're interested in.");
      return;
    }
    if (!form.priceAwareness) {
      setError("Please let us know if you're aware of the package cost.");
      return;
    }
    if (!form.paymentReadiness) {
      setError("Please let us know if you're ready to make payment.");
      return;
    }
    if (requiresPaymentPreference && !form.paymentPreference) {
      setError("Please select how you'd prefer to pay.");
      return;
    }

    const payload = {
      ...form,
      priceAwareness: form.priceAwareness as PriceAwareness,
      paymentReadiness: form.paymentReadiness as PaymentReadiness,
      paymentPreference:
        requiresPaymentPreference && form.paymentPreference ? form.paymentPreference : undefined,
    };

    setSubmitting(true);

    try {
      const response = await fetch("/api/launch/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, ...attribution }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      updateData({ ...payload, leadId: result.leadId });
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

        <Field label="Which package are you interested in?" htmlFor="selectedPackageId" required>
          <select
            id="selectedPackageId"
            required
            value={form.selectedPackageId}
            onChange={(event) => {
              const selectedPackageId = event.target.value;
              setForm((f) => ({
                ...f,
                selectedPackageId,
                paymentPreference:
                  selectedPackageId === INSTALLMENT_ELIGIBLE_PACKAGE_ID ? f.paymentPreference : "",
              }));
            }}
            className={fieldInputClass}
          >
            <option value="" disabled>
              Select a package
            </option>
            {LAUNCH_PACKAGES.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — {pkg.priceLabel}
              </option>
            ))}
          </select>
        </Field>

        <OptionGroupField legend="Are you aware of the cost of the package you selected?" required>
          {PRICE_AWARENESS_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={form.priceAwareness === option.value}
              onClick={() => setForm((f) => ({ ...f, priceAwareness: option.value }))}
            />
          ))}
        </OptionGroupField>

        <OptionGroupField
          legend="Are you ready and able to make payment for your selected package?"
          required
        >
          {PAYMENT_READINESS_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={form.paymentReadiness === option.value}
              onClick={() => setForm((f) => ({ ...f, paymentReadiness: option.value }))}
            />
          ))}
        </OptionGroupField>

        {requiresPaymentPreference && (
          <OptionGroupField legend="How would you prefer to pay?" required>
            <OptionCard
              label={`Pay ${installmentPackage?.priceLabel ?? ""} at once`}
              selected={form.paymentPreference === "full"}
              onClick={() => setForm((f) => ({ ...f, paymentPreference: "full" }))}
            />
            <OptionCard
              label="Pay in installments"
              selected={form.paymentPreference === "installments"}
              onClick={() => setForm((f) => ({ ...f, paymentPreference: "installments" }))}
            />
          </OptionGroupField>
        )}

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
