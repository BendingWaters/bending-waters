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
    fbq?: (...args: unknown[]) => void;
  }
}

// Events with a direct Meta standard event are sent as such so they can be used
// for ad optimization/reporting; everything else goes through trackCustom so it
// still shows up in Events Manager without polluting the standard event set.
const META_STANDARD_EVENTS: Partial<Record<LaunchAnalyticsEvent, string>> = {
  package_viewed: "ViewContent",
  lead_form_completed: "Lead",
  booking_completed: "Schedule",
  checkout_started: "InitiateCheckout",
  payment_successful: "Purchase",
  onboarding_completed: "CompleteRegistration",
};

// Pass eventId when the same conversion is also sent server-side via the Meta
// Conversions API (see lib/launch/metaConversionsApi.ts) — matching event_id
// values on both sides let Meta dedupe the pixel and CAPI copies of one event.
export function trackEvent(
  event: LaunchAnalyticsEvent,
  params: Record<string, unknown> = {},
  eventId?: string
) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  if (typeof window.fbq === "function") {
    const standardEvent = META_STANDARD_EVENTS[event];
    const options = eventId ? { eventID: eventId } : undefined;
    if (standardEvent) {
      window.fbq("track", standardEvent, params, options);
    } else {
      window.fbq("trackCustom", event, params, options);
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${event}`, params, eventId ? { eventId } : "");
  }
}

