"use client";

export type LaunchAnalyticsEvent =
  | "page_view"
  | "hero_cta_clicked"
  | "package_viewed"
  | "lead_form_started"
  | "lead_form_completed"
  | "qualification_started"
  | "qualification_completed"
  | "call_selected"
  | "booking_started"
  | "booking_completed"
  | "checkout_started"
  | "payment_successful"
  | "payment_failed"
  | "onboarding_started"
  | "onboarding_completed";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: LaunchAnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${event}`, params);
  }
}

