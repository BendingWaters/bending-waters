import { NextResponse } from "next/server";
import { z } from "zod";
import { sanityAdminClient } from "@/sanity/lib/admin";
import { checkoutSchema } from "@/lib/launch/validation";
import { upsertLeadByEmail } from "@/lib/launch/leadRepo";
import { getLaunchPackage } from "@/lib/launch/packages";
import { initializeTransaction } from "@/lib/launch/paystack";

export const runtime = "nodejs";

type LeadDoc = { _id: string; firstName: string; businessName?: string; email: string; phone: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = checkoutSchema.parse(body);

    const pkg = getLaunchPackage(payload.packageId);

    if (!pkg || pkg.ctaAction !== "checkout" || !pkg.price) {
      return NextResponse.json(
        { success: false, message: "This package requires a custom quote. Please talk to a strategist." },
        { status: 400 }
      );
    }

    let lead: LeadDoc;

    if (payload.leadId) {
      const existing = await sanityAdminClient.getDocument<LeadDoc>(payload.leadId);
      if (!existing) {
        return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
      }
      lead = existing;
    } else {
      if (!payload.firstName || !payload.email || !payload.phone) {
        return NextResponse.json(
          { success: false, message: "Name, email and WhatsApp number are required." },
          { status: 400 }
        );
      }

      const { leadId } = await upsertLeadByEmail({
        firstName: payload.firstName,
        businessName: payload.businessName,
        email: payload.email,
        phone: payload.phone,
      });

      lead = {
        _id: leadId,
        firstName: payload.firstName,
        businessName: payload.businessName,
        email: payload.email,
        phone: payload.phone,
      };
    }

    const now = new Date().toISOString();
    const reference = `bw7dl_${lead._id.replace(/[^a-zA-Z0-9]/g, "").slice(-8)}_${Date.now()}`;

    const payment = await sanityAdminClient.create({
      _type: "payment",
      lead: { _type: "reference", _ref: lead._id },
      packageId: pkg.id,
      packageName: pkg.name,
      reference,
      amount: pkg.price,
      currency: "NGN",
      status: "CHECKOUT_STARTED",
      provider: "paystack",
      customerEmail: lead.email,
      customerName: lead.firstName,
      createdAt: now,
      updatedAt: now,
    });

    const origin = new URL(request.url).origin;

    const transaction = await initializeTransaction({
      email: lead.email,
      amountNaira: pkg.price,
      reference,
      callbackUrl: `${origin}/websitein7days/success?reference=${reference}`,
      metadata: { leadId: lead._id, paymentId: payment._id, packageId: pkg.id },
    });

    await sanityAdminClient
      .patch(payment._id)
      .set({ status: "PAYMENT_PENDING", updatedAt: new Date().toISOString() })
      .commit();

    await sanityAdminClient
      .patch(lead._id)
      .set({ status: "CHECKOUT_STARTED", selectedPackageId: pkg.id, updatedAt: new Date().toISOString() })
      .commit();

    return NextResponse.json({
      success: true,
      authorizationUrl: transaction.authorization_url,
      reference,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Please check the form fields and try again.", errors: error.flatten() },
        { status: 400 }
      );
    }

    console.error("[api/launch/checkout] Failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error && error.message.includes("PAYSTACK_SECRET_KEY")
            ? "Payments are not fully configured yet. Please contact us on WhatsApp to proceed."
            : "Something went wrong starting checkout. Please try again.",
      },
      { status: 500 }
    );
  }
}
