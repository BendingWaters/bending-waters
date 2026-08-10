import "server-only";

/**
 * The DB (Sanity) is the source of truth. When GOOGLE_SHEETS_WEBHOOK_URL is set
 * (e.g. a Zapier/Make catch hook backed by a Google Sheet), every lead change is
 * forwarded there for sales tracking. Fire-and-forget: sheet sync must never
 * block or fail the lead-persistence request.
 */
export function syncLeadToSheet(row: {
  date: string;
  name: string;
  email: string;
  whatsapp: string;
  business: string;
  opportunity: string;
  websiteStatus: string;
  timeline: string;
  preferredNextStep: string;
  leadScore: number;
  status: string;
  source: string;
  campaign: string;
  paymentStatus?: string;
}) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  }).catch((error) => {
    console.error("[launch/googleSheets] Sync failed:", error);
  });
}
