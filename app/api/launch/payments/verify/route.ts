import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/launch/paystack";
import { fulfillPayment } from "@/lib/launch/fulfillPayment";
import { getMetaClientContext, sendMetaConversionEvent } from "@/lib/launch/metaConversionsApi";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ success: false, message: "Missing reference." }, { status: 400 });
  }

  try {
    const verified = await verifyTransaction(reference);
    const payment = await fulfillPayment(verified);

    if (payment.status === "PAYMENT_SUCCESSFUL") {
      sendMetaConversionEvent({
        eventName: "Purchase",
        eventId: `purchase-${payment.reference}`,
        eventSourceUrl: request.url,
        email: payment.customerEmail,
        client: getMetaClientContext(request),
        customData: { value: payment.amount, currency: "NGN", content_name: payment.packageName },
      });
    }

    return NextResponse.json({
      success: true,
      status: payment.status,
      packageName: payment.packageName,
      amount: payment.amount,
      reference: payment.reference,
    });
  } catch (error) {
    console.error("[api/launch/payments/verify] Failed:", error);

    return NextResponse.json(
      { success: false, message: "We could not verify this payment. Please contact us on WhatsApp." },
      { status: 500 }
    );
  }
}
