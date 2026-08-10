import { NextResponse } from "next/server";
import { z } from "zod";
import { sanityAdminClient } from "@/sanity/lib/admin";
import { onboardingSchema } from "@/lib/launch/validation";
import { notifySalesOfOnboarding } from "@/lib/launch/email";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

class BadRequestError extends Error {
  status = 400;
}

function getFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

async function uploadFiles(files: File[], category: string) {
  const uploaded = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestError(`${file.name} is larger than 10MB.`);
    }

    if (!allowedMimeTypes.has(file.type)) {
      throw new BadRequestError(`${file.name} has an unsupported file type.`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await sanityAdminClient.assets.upload("file", buffer, {
      filename: file.name,
      contentType: file.type || "application/octet-stream",
    });

    uploaded.push({
      _type: "object",
      _key: crypto.randomUUID(),
      category,
      filename: file.name,
      fileUrl: asset.url,
      file: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
    });
  }

  return uploaded;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const raw = Object.fromEntries(
      Array.from(formData.entries()).filter(([, value]) => typeof value === "string")
    ) as Record<string, string>;

    const payload = onboardingSchema.parse(raw);

    const logoFiles = getFiles(formData, "logo");
    const brandAssetFiles = getFiles(formData, "brandAssets");
    const companyImageFiles = getFiles(formData, "companyImages");

    const files = [
      ...(await uploadFiles(logoFiles, "Logo")),
      ...(await uploadFiles(brandAssetFiles, "Brand Assets")),
      ...(await uploadFiles(companyImageFiles, "Company Images")),
    ];

    const now = new Date().toISOString();

    const created = await sanityAdminClient.create({
      _type: "onboarding",
      lead: payload.leadId ? { _type: "reference", _ref: payload.leadId } : undefined,
      payment: payload.paymentId ? { _type: "reference", _ref: payload.paymentId } : undefined,
      companyName: payload.companyName,
      companyDescription: payload.companyDescription,
      industry: payload.industry,
      services: payload.services,
      products: payload.products,
      targetAudience: payload.targetAudience,
      companyStory: payload.companyStory,
      mission: payload.mission,
      vision: payload.vision,
      values: payload.values,
      team: payload.team,
      leadership: payload.leadership,
      traction: payload.traction,
      milestones: payload.milestones,
      testimonials: payload.testimonials,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      existingWebsite: payload.existingWebsite,
      websiteInspiration: payload.websiteInspiration,
      competitors: payload.competitors,
      requiredPages: payload.requiredPages,
      specialRequirements: payload.specialRequirements,
      files,
      status: "SUBMITTED",
      submittedAt: now,
    });

    if (payload.leadId) {
      await sanityAdminClient
        .patch(payload.leadId)
        .set({ status: "ONBOARDING", updatedAt: now })
        .commit();
    }

    await notifySalesOfOnboarding({
      companyName: payload.companyName,
      contactEmail: payload.contactEmail,
      sanityId: created._id,
    });

    return NextResponse.json({ success: true, onboardingId: created._id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Please check the form fields and try again.", errors: error.flatten() },
        { status: 400 }
      );
    }

    if (error instanceof BadRequestError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }

    console.error("[api/launch/onboarding] Failed:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong submitting onboarding. Please try again." },
      { status: 500 }
    );
  }
}
