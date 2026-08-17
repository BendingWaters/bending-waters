"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { useFunnel } from "../FunnelProvider";
import { Field, fieldInputClass, PrimaryButton, ErrorBanner } from "../ui";
import { trackEvent } from "../../_lib/analytics";
import { getLaunchPackage } from "@/lib/launch/packages";

export default function CheckoutStep() {
  const { data, updateData } = useFunnel();
  const pkg = data.selectedPackageId ? getLaunchPackage(data.selectedPackageId) : undefined;

  const [contact, setContact] = useState({
    firstName: data.firstName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("checkout_started", {
      packageId: data.selectedPackageId,
      leadId: data.leadId,
      value: pkg?.price,
      currency: "NGN",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pkg || !pkg.price) {
    return <ErrorBanner message="This package isn't available for direct checkout. Please talk to a strategist instead." />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      updateData(contact);

      const response = await fetch("/api/launch/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg!.id,
          leadId: data.leadId ?? undefined,
          ...(data.leadId ? {} : contact),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong starting checkout.");
      }

      window.location.href = result.authorizationUrl;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Checkout</p>
      <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
        You&apos;re one step away from getting started.
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-white/60">
        You&apos;ve chosen to move forward. Review your package below, complete payment securely,
        and we&apos;ll take you directly into onboarding.
      </p>

      <div className="mt-6 rounded-2xl border border-white/12 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">{pkg.name}</span>
          <span className="text-lg font-semibold text-primary">{pkg.priceLabel}</span>
        </div>
        <ul className="mt-4 space-y-2">
          {pkg.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-white/65">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {!data.leadId && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" htmlFor="checkoutFirstName" required>
                <input
                  id="checkoutFirstName"
                  required
                  value={contact.firstName}
                  onChange={(event) => setContact((c) => ({ ...c, firstName: event.target.value }))}
                  className={fieldInputClass}
                />
              </Field>
              <Field label="Business Name" htmlFor="checkoutBusinessName">
                <input
                  id="checkoutBusinessName"
                  value={contact.businessName}
                  onChange={(event) => setContact((c) => ({ ...c, businessName: event.target.value }))}
                  className={fieldInputClass}
                />
              </Field>
            </div>
            <Field label="Business Email" htmlFor="checkoutEmail" required>
              <input
                id="checkoutEmail"
                type="email"
                required
                value={contact.email}
                onChange={(event) => setContact((c) => ({ ...c, email: event.target.value }))}
                placeholder="you@company.com"
                className={fieldInputClass}
              />
            </Field>
            <Field label="WhatsApp Number" htmlFor="checkoutPhone" required>
              <input
                id="checkoutPhone"
                type="tel"
                required
                value={contact.phone}
                onChange={(event) => setContact((c) => ({ ...c, phone: event.target.value }))}
                placeholder="+234 ..."
                className={fieldInputClass}
              />
            </Field>
          </>
        )}

        <label className="flex items-start gap-3 text-sm text-white/60">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            I understand the seven-working-day delivery timeline begins once payment is confirmed
            and depends on completed onboarding, required content/assets, and timely feedback and
            approvals.
          </span>
        </label>

        {error && <ErrorBanner message={error} />}

        <PrimaryButton type="submit" loading={submitting} disabled={!agreed}>
          Proceed to Secure Payment →
        </PrimaryButton>

        <p className="text-center text-xs text-white/35">
          You&apos;ll be redirected to Paystack to complete your payment securely.
        </p>
      </form>
    </div>
  );
}
