import { NextResponse } from "next/server";
import { z } from "zod";
import { sanityAdminClient } from "@/sanity/lib/admin";
import { qualificationSchema } from "@/lib/launch/validation";
import { scoreLead } from "@/lib/launch/leadScoring";
import { syncLeadToSheet } from "@/lib/launch/googleSheets";
import { notifySalesOfNewLead, sendCallBookedEmail } from "@/lib/launch/email";
import type {
  LeadStatus,
  OpportunityType,
  PreferredNextStep,
  ProjectTimeline,
  WebsiteStatus,
} from "@/lib/launch/types";

export const runtime = "nodejs";

type LeadDoc = {
  _id: string;
  firstName: string;
  businessName?: string;
  email: string;
  phone: string;
  opportunityType?: OpportunityType;
  websiteStatus?: WebsiteStatus;
  projectTimeline?: ProjectTimeline;
  preferredNextStep?: PreferredNextStep;
  selectedPackageId?: string;
  source?: string;
  campaign?: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const payload = qualificationSchema.omit({ leadId: true }).parse(body);

    const current = await sanityAdminClient.getDocument<LeadDoc>(id);

    if (!current) {
      return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
    }

    const merged = {
      opportunityType: payload.opportunityType ?? current.opportunityType,
      websiteStatus: payload.websiteStatus ?? current.websiteStatus,
      projectTimeline: payload.projectTimeline ?? current.projectTimeline,
      preferredNextStep: payload.preferredNextStep ?? current.preferredNextStep,
    } as const;

    const { score, priority } = scoreLead(merged);

    const isCallBooking = Boolean(payload.callPreferredDate || payload.callPreferredTime);

    let status: LeadStatus = "QUALIFIED";
    if (isCallBooking) status = "CALL_BOOKED";
    else if (payload.preferredNextStep === "book_call") status = "CALL_REQUESTED";
    else if (payload.preferredNextStep === "pay_now") status = "QUALIFIED";

    const now = new Date().toISOString();

    await sanityAdminClient
      .patch(id)
      .set({
        ...payload,
        leadScore: score,
        priority,
        status,
        updatedAt: now,
      })
      .commit();

    if (isCallBooking) {
      await sendCallBookedEmail({
        to: current.email,
        firstName: current.firstName,
        preferredDate: payload.callPreferredDate,
        preferredTime: payload.callPreferredTime,
      });
    }

    if (priority === "HIGH") {
      await notifySalesOfNewLead({
        firstName: current.firstName,
        businessName: current.businessName,
        email: current.email,
        phone: current.phone,
        priority,
        leadScore: score,
        opportunityType: merged.opportunityType,
        websiteStatus: merged.websiteStatus,
        projectTimeline: merged.projectTimeline,
        preferredNextStep: merged.preferredNextStep,
        sanityId: id,
      });
    }

    syncLeadToSheet({
      date: now,
      name: current.firstName,
      email: current.email,
      whatsapp: current.phone,
      business: current.businessName || "",
      opportunity: merged.opportunityType || "",
      websiteStatus: merged.websiteStatus || "",
      timeline: merged.projectTimeline || "",
      preferredNextStep: merged.preferredNextStep || "",
      leadScore: score,
      status,
      source: current.source || "",
      campaign: current.campaign || "",
    });

    return NextResponse.json({ success: true, leadId: id, status, leadScore: score, priority });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Please check the form fields and try again.", errors: error.flatten() },
        { status: 400 }
      );
    }

    console.error("[api/launch/leads/:id] Failed:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
