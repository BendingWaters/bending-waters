import "server-only";
import { sanityAdminClient } from "@/sanity/lib/admin";
import type { Attribution } from "./types";

interface UpsertLeadInput extends Attribution {
  firstName: string;
  businessName?: string;
  email: string;
  phone: string;
}

export async function upsertLeadByEmail(input: UpsertLeadInput) {
  const existing = await sanityAdminClient.fetch<{ _id: string } | null>(
    `*[_type == "lead" && email == $email][0]{ _id }`,
    { email: input.email }
  );

  const now = new Date().toISOString();

  if (existing) {
    await sanityAdminClient
      .patch(existing._id)
      .set({
        firstName: input.firstName,
        businessName: input.businessName,
        phone: input.phone,
        updatedAt: now,
      })
      .commit();

    return { leadId: existing._id, isNew: false };
  }

  const created = await sanityAdminClient.create({
    _type: "lead",
    firstName: input.firstName,
    businessName: input.businessName,
    email: input.email,
    phone: input.phone,
    status: "NEW",
    leadScore: 0,
    priority: "NURTURE",
    source: input.source,
    medium: input.medium,
    campaign: input.campaign,
    referrer: input.referrer,
    landingPage: input.landingPage,
    createdAt: now,
    updatedAt: now,
  });

  return { leadId: created._id, isNew: true };
}
