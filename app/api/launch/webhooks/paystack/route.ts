import { NextResponse } from "next/server";
import { isValidPaystackSignature, verifyTransaction } from "@/lib/launch/paystack";
import { fulfillPayment } from "@/lib/launch/fulfillPayment";

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
      await fulfillPayment(verified);
    } catch (error) {
      console.error("[api/launch/webhooks/paystack] Fulfillment failed:", error);
      // Non-2xx so Paystack retries delivery instead of losing the event.
      return NextResponse.json({ received: true, processed: false }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
