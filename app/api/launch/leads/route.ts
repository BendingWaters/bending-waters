import { NextResponse } from "next/server";
import { z } from "zod";
import { leadCaptureSchema } from "@/lib/launch/validation";
import { upsertLeadByEmail } from "@/lib/launch/leadRepo";
import { syncLeadToSheet } from "@/lib/launch/googleSheets";
import { notifySalesOfNewLead, sendLeadThankYouEmail } from "@/lib/launch/email";
import { getLaunchPackage } from "@/lib/launch/packages";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = leadCaptureSchema.parse(body);
    const selectedPackage = getLaunchPackage(payload.selectedPackageId);

    const { leadId, isNew } = await upsertLeadByEmail(payload);
    const now = new Date().toISOString();

    if (isNew) {
      await sendLeadThankYouEmail({ to: payload.email, firstName: payload.firstName });
      await notifySalesOfNewLead({
        firstName: payload.firstName,
        businessName: payload.businessName,
        email: payload.email,
        phone: payload.phone,
        priority: "NURTURE",
        leadScore: 0,
        selectedPackageName: selectedPackage?.name,
        priceAwareness: payload.priceAwareness,
        paymentReadiness: payload.paymentReadiness,
        paymentPreference: payload.paymentPreference,
        sanityId: leadId,
      });
    }

    syncLeadToSheet({
      date: now,
      name: payload.firstName,
      email: payload.email,
      whatsapp: payload.phone,
      business: payload.businessName || "",
      opportunity: "",
      websiteStatus: "",
      timeline: "",
      preferredNextStep: "",
      selectedPackage: selectedPackage?.name || payload.selectedPackageId,
      priceAwareness: payload.priceAwareness,
      paymentReadiness: payload.paymentReadiness,
      paymentPreference: payload.paymentPreference || "",
      leadScore: 0,
      status: "NEW",
      source: payload.source || "",
      campaign: payload.campaign || "",
    });

    return NextResponse.json({ success: true, leadId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Please check the form fields and try again.", errors: error.flatten() },
        { status: 400 }
      );
    }

    console.error("[api/launch/leads] Failed:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
