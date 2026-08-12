import "server-only";
import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEmail(input: { to: string; subject: string; html: string }) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resend || !from) {
    console.warn("[launch/email] Resend not configured, skipping email:", input.subject);
    return;
  }

  try {
    const result = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (result.error) {
      console.error("[launch/email] Resend error:", result.error);
    }
  } catch (error) {
    console.error("[launch/email] Failed to send email:", error);
  }
}

export async function sendLeadThankYouEmail(input: { to: string; firstName: string }) {
  await sendEmail({
    to: input.to,
    subject: "Thank you for requesting your 7-Day Website Launch Plan",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <p>Hi ${escapeHtml(input.firstName)},</p>
        <p>Thank you for requesting your 7-Day Website Launch Plan.</p>
        <p>We've received your details and our team will be in touch shortly to help you determine the fastest path to a professional, opportunity-ready website.</p>
        <p>— BendingWaters</p>
      </div>
    `,
  });
}

export async function notifySalesOfNewLead(input: {
  firstName: string;
  businessName?: string;
  email: string;
  phone: string;
  priority: string;
  leadScore: number;
  opportunityType?: string;
  websiteStatus?: string;
  projectTimeline?: string;
  preferredNextStep?: string;
  selectedPackageName?: string;
  priceAwareness?: string;
  paymentReadiness?: string;
  paymentPreference?: string;
  sanityId: string;
}) {
  const to = process.env.BUSINESS_ADMIN_EMAIL;
  if (!to) return;

  await sendEmail({
    to,
    subject: `[${input.priority}] New 7-Day Launch lead: ${input.firstName}${
      input.businessName ? ` (${input.businessName})` : ""
    }`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>New 7-Day Website Launch Lead</h2>
        <p><strong>Priority:</strong> ${escapeHtml(input.priority)} (score: ${input.leadScore})</p>
        <p><strong>Name:</strong> ${escapeHtml(input.firstName)}</p>
        <p><strong>Business:</strong> ${escapeHtml(input.businessName || "—")}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(input.phone)}</p>
        <p><strong>Opportunity:</strong> ${escapeHtml(input.opportunityType || "—")}</p>
        <p><strong>Website status:</strong> ${escapeHtml(input.websiteStatus || "—")}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(input.projectTimeline || "—")}</p>
        <p><strong>Next step:</strong> ${escapeHtml(input.preferredNextStep || "—")}</p>
        <p><strong>Selected package:</strong> ${escapeHtml(input.selectedPackageName || "—")}</p>
        <p><strong>Aware of cost:</strong> ${escapeHtml(input.priceAwareness || "—")}</p>
        <p><strong>Payment readiness:</strong> ${escapeHtml(input.paymentReadiness || "—")}</p>
        <p><strong>Payment preference:</strong> ${escapeHtml(input.paymentPreference || "—")}</p>
        <p><strong>Sanity ID:</strong> ${escapeHtml(input.sanityId)}</p>
      </div>
    `,
  });
}

export async function sendCallBookedEmail(input: {
  to: string;
  firstName: string;
  preferredDate?: string;
  preferredTime?: string;
}) {
  await sendEmail({
    to: input.to,
    subject: "You're booked — Website Readiness Call",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <p>Hi ${escapeHtml(input.firstName)},</p>
        <p>You're booked. We've received your information and your strategy call is confirmed${
          input.preferredDate
            ? ` for ${escapeHtml(input.preferredDate)}${input.preferredTime ? ` at ${escapeHtml(input.preferredTime)}` : ""}`
            : ""
        }.</p>
        <p>Check your email and WhatsApp for the details. We'll discuss your business, your upcoming opportunity and what your website needs to accomplish.</p>
        <p>— BendingWaters</p>
      </div>
    `,
  });
}

export async function notifySalesOfOnboarding(input: {
  companyName: string;
  contactEmail?: string;
  sanityId: string;
}) {
  const to = process.env.BUSINESS_ADMIN_EMAIL;
  if (!to) return;

  await sendEmail({
    to,
    subject: `Onboarding submitted: ${input.companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>New Onboarding Submission</h2>
        <p><strong>Company:</strong> ${escapeHtml(input.companyName)}</p>
        <p><strong>Contact email:</strong> ${escapeHtml(input.contactEmail || "—")}</p>
        <p><strong>Sanity ID:</strong> ${escapeHtml(input.sanityId)}</p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmationEmail(input: {
  to: string;
  firstName: string;
  packageName: string;
  amount: number;
  reference: string;
}) {
  await sendEmail({
    to: input.to,
    subject: "Payment confirmed — your website project is live to start",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <p>Hi ${escapeHtml(input.firstName)},</p>
        <p>You're officially on the list! Your payment for <strong>${escapeHtml(
          input.packageName
        )}</strong> (₦${input.amount.toLocaleString()}) has been confirmed.</p>
        <p><strong>Reference:</strong> ${escapeHtml(input.reference)}</p>
        <p>Next: complete your onboarding so we can begin your seven-day sprint.</p>
        <p>— BendingWaters</p>
      </div>
    `,
  });
}
