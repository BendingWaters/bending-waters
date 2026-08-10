"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useFunnel } from "../FunnelProvider";
import { Field, fieldInputClass, PrimaryButton, ErrorBanner } from "../ui";
import { trackEvent } from "../../_lib/analytics";

export default function BookingStep() {
  const { data, updateData, goTo } = useFunnel();
  const [date, setDate] = useState(data.callPreferredDate ?? "");
  const [time, setTime] = useState(data.callPreferredTime ?? "");
  const [notes, setNotes] = useState(data.callNotes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("booking_started", { leadId: data.leadId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/launch/leads/${data.leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredNextStep: "book_call",
          callPreferredDate: date,
          callPreferredTime: time,
          callNotes: notes,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      updateData({ callPreferredDate: date, callPreferredTime: time, callNotes: notes });
      trackEvent("booking_completed", { leadId: data.leadId });
      goTo("call-confirmed");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Website Readiness Call
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
        Let&apos;s talk about your business.
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-white/60">
        Book a 20-minute Website Readiness Call. We&apos;ll discuss your business, your upcoming
        opportunity and what your website needs to accomplish.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Preferred Date" htmlFor="callDate" required>
            <input
              id="callDate"
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={fieldInputClass}
            />
          </Field>

          <Field label="Preferred Time" htmlFor="callTime" required>
            <input
              id="callTime"
              type="time"
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={fieldInputClass}
            />
          </Field>
        </div>

        <Field label="Anything we should know? (optional)" htmlFor="callNotes">
          <textarea
            id="callNotes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Tell us about the opportunity you're preparing for"
            className={`${fieldInputClass} resize-none`}
          />
        </Field>

        {error && <ErrorBanner message={error} />}

        <PrimaryButton type="submit" loading={submitting}>
          Choose a Time →
        </PrimaryButton>
      </form>
    </div>
  );
}
