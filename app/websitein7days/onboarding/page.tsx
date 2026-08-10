import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Complete Your Onboarding — BendingWaters",
  robots: { index: false, follow: false },
};

const PAYMENT_BY_REFERENCE_QUERY = `*[_type == "payment" && reference == $reference][0]{
  _id,
  "leadId": lead._ref
}`;

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  let leadId: string | undefined;
  let paymentId: string | undefined;

  if (reference) {
    const payment = await client.fetch<{ _id: string; leadId?: string } | null>(
      PAYMENT_BY_REFERENCE_QUERY,
      { reference }
    );
    leadId = payment?.leadId;
    paymentId = payment?._id;
  }

  return <OnboardingForm leadId={leadId} paymentId={paymentId} />;
}
