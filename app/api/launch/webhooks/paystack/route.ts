import { NextResponse } from "next/server";
import { isValidPaystackSignature, verifyTransaction } from "@/lib/launch/paystack";
import { fulfillPayment } from "@/lib/launch/fulfillPayment";
import { sendMetaConversionEvent } from "@/lib/launch/metaConversionsApi";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isValidPaystackSignature(rawBody, signature)) {
    console.warn("[api/launch/webhooks/paystack] Invalid signature");
    return NextResponse.json({ received: false }, { status: 401 });
  }

  let event: { event: string; data?: { reference?: string } };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  // Never trust the webhook payload alone — re-verify the transaction directly
  // against Paystack's API before updating anything.
  if (event.event === "charge.success" && event.data?.reference) {
    try {
      const verified = await verifyTransaction(event.data.reference);
      const payment = await fulfillPayment(verified);

      // No browser context is available here (Paystack calls this server-to-server), so this
      // is a lower-match-quality safety net for customers who never load the success page.
      // Same event_id as the verify-route fire below lets Meta dedupe the two.
      if (payment.status === "PAYMENT_SUCCESSFUL") {
        sendMetaConversionEvent({
          eventName: "Purchase",
          eventId: `purchase-${payment.reference}`,
          eventSourceUrl: "https://www.bendingwaters.africa/websitein7days/success",
          email: payment.customerEmail,
          customData: { value: payment.amount, currency: "NGN", content_name: payment.packageName },
        });
      }
    } catch (error) {
      console.error("[api/launch/webhooks/paystack] Fulfillment failed:", error);
      // Non-2xx so Paystack retries delivery instead of losing the event.
      return NextResponse.json({ received: true, processed: false }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
