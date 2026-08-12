import { z } from "zod";
import { INSTALLMENT_ELIGIBLE_PACKAGE_ID } from "./packages";

export const leadCaptureSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    businessName: z.string().trim().optional(),
    email: z.string().trim().email("A valid business email is required"),
    phone: z.string().trim().min(6, "A valid WhatsApp number is required"),
    selectedPackageId: z.string().trim().min(1, "Please select a package"),
    priceAwareness: z.enum(["aware", "needs_info"], {
      error: "Please let us know if you're aware of the package cost",
    }),
    paymentReadiness: z.enum(["ready_now", "ready_soon", "considering"], {
      error: "Please let us know if you're ready to make payment",
    }),
    paymentPreference: z.enum(["full", "installments"]).optional(),
    source: z.string().trim().optional(),
    medium: z.string().trim().optional(),
    campaign: z.string().trim().optional(),
    referrer: z.string().trim().optional(),
    landingPage: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.selectedPackageId === INSTALLMENT_ELIGIBLE_PACKAGE_ID && !data.paymentPreference) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a payment preference",
        path: ["paymentPreference"],
      });
    }
  });

export const qualificationSchema = z.object({
  leadId: z.string().min(1),
  opportunityType: z
    .enum(["grant", "investor", "partnership", "expansion", "credibility", "other"])
    .optional(),
  websiteStatus: z.enum(["none", "needs_work", "wants_upgrade", "not_sure"]).optional(),
  projectTimeline: z
    .enum(["within_7_days", "within_2_weeks", "within_30_days", "exploring"])
    .optional(),
  preferredNextStep: z.enum(["book_call", "pay_now"]).optional(),
  selectedPackageId: z.string().optional(),
  callPreferredDate: z.string().optional(),
  callPreferredTime: z.string().optional(),
  callNotes: z.string().optional(),
});

export const checkoutSchema = z.object({
  packageId: z.string().min(1),
  leadId: z.string().optional(),
  firstName: z.string().trim().min(1).optional(),
  businessName: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(6).optional(),
});

export const onboardingSchema = z.object({
  leadId: z.string().optional(),
  paymentId: z.string().optional(),
  companyName: z.string().trim().min(1, "Company name is required"),
  companyDescription: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  services: z.string().trim().optional(),
  products: z.string().trim().optional(),
  targetAudience: z.string().trim().optional(),
  companyStory: z.string().trim().optional(),
  mission: z.string().trim().optional(),
  vision: z.string().trim().optional(),
  values: z.string().trim().optional(),
  team: z.string().trim().optional(),
  leadership: z.string().trim().optional(),
  traction: z.string().trim().optional(),
  milestones: z.string().trim().optional(),
  testimonials: z.string().trim().optional(),
  contactEmail: z.string().trim().email().optional(),
  contactPhone: z.string().trim().optional(),
  existingWebsite: z.string().trim().optional(),
  websiteInspiration: z.string().trim().optional(),
  competitors: z.string().trim().optional(),
  requiredPages: z.string().trim().optional(),
  specialRequirements: z.string().trim().optional(),
});
