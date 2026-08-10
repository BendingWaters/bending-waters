import "server-only";
import { sanityAdminClient } from "@/sanity/lib/admin";
import { sendPaymentConfirmationEmail } from "./email";
import { syncLeadToSheet } from "./googleSheets";
import type { PaymentStatus } from "./types";

type PaymentDoc = {
  _id: string;
  status: PaymentStatus;
  packageName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  reference: string;
  lead?: { _ref: string };
};

interface VerifiedTransaction {
  status: "success" | "failed" | "abandoned";
  reference: string;
  paid_at: string | null;
  gateway_response: string;
}

export async function fulfillPayment(data: VerifiedTransaction) {
  const payment = await sanityAdminClient.fetch<PaymentDoc | null>(
    `*[_type == "payment" && reference == $reference][0]{
      _id, status, packageName, amount, customerEmail, customerName, reference, lead
    }`,
    { reference: data.reference }
  );

  if (!payment) {
    throw new Error(`No payment found for reference ${data.reference}`);
  }

  const now = new Date().toISOString();

  if (data.status === "success") {
    if (payment.status !== "PAYMENT_SUCCESSFUL") {
      await sanityAdminClient
        .patch(payment._id)
        .set({
          status: "PAYMENT_SUCCESSFUL",
          paidAt: data.paid_at ?? now,
          gatewayResponse: data.gateway_response,
          updatedAt: now,
        })
        .commit();

      if (payment.lead?._ref) {
        await sanityAdminClient
          .patch(payment.lead._ref)
          .set({ status: "PAID", updatedAt: now })
          .commit();
      }

      await sendPaymentConfirmationEmail({
        to: payment.customerEmail,
        firstName: payment.customerName,
        packageName: payment.packageName,
        amount: payment.amount,
        reference: payment.reference,
      });

      syncLeadToSheet({
        date: now,
        name: payment.customerName,
        email: payment.customerEmail,
        whatsapp: "",
        business: "",
        opportunity: "",
        websiteStatus: "",
        timeline: "",
        preferredNextStep: "pay_now",
        leadScore: 0,
        status: "PAID",
        source: "",
        campaign: "",
        paymentStatus: "PAYMENT_SUCCESSFUL",
      });
    }
  } else if (data.status === "failed") {
    await sanityAdminClient
      .patch(payment._id)
      .set({ status: "PAYMENT_FAILED", gatewayResponse: data.gateway_response, updatedAt: now })
      .commit();
  } else {
    await sanityAdminClient
      .patch(payment._id)
      .set({ status: "CHECKOUT_ABANDONED", updatedAt: now })
      .commit();
  }

  const refreshed = await sanityAdminClient.getDocument<PaymentDoc>(payment._id);

  return refreshed!;
}
