import { defineField, defineType } from "sanity";

export const lead = defineType({
  name: "lead",
  title: "7-Day Launch Lead",
  type: "document",
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Business Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "WhatsApp Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "opportunityType",
      title: "What are you preparing your business for?",
      type: "string",
      options: {
        list: [
          { title: "Grant application", value: "grant" },
          { title: "Investor conversations", value: "investor" },
          { title: "Corporate partnerships", value: "partnership" },
          { title: "Business expansion", value: "expansion" },
          { title: "General credibility", value: "credibility" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "websiteStatus",
      title: "Current website situation",
      type: "string",
      options: {
        list: [
          { title: "I don't have one", value: "none" },
          { title: "I have one but it needs work", value: "needs_work" },
          { title: "I have a website but want a complete upgrade", value: "wants_upgrade" },
          { title: "I'm not sure", value: "not_sure" },
        ],
      },
    }),
    defineField({
      name: "projectTimeline",
      title: "When do you need the website?",
      type: "string",
      options: {
        list: [
          { title: "Within 7 days", value: "within_7_days" },
          { title: "Within 2 weeks", value: "within_2_weeks" },
          { title: "Within 30 days", value: "within_30_days" },
          { title: "I'm exploring options", value: "exploring" },
        ],
      },
    }),
    defineField({
      name: "preferredNextStep",
      title: "Preferred Next Step",
      type: "string",
      options: {
        list: [
          { title: "Book a Strategy Call", value: "book_call" },
          { title: "Choose a Package & Pay", value: "pay_now" },
        ],
      },
    }),
    defineField({
      name: "selectedPackageId",
      title: "Selected Package",
      type: "string",
    }),
    defineField({
      name: "callPreferredDate",
      title: "Preferred Call Date",
      type: "date",
    }),
    defineField({
      name: "callPreferredTime",
      title: "Preferred Call Time",
      type: "string",
    }),
    defineField({
      name: "callNotes",
      title: "Call Notes",
      type: "text",
    }),
    defineField({
      name: "leadScore",
      title: "Lead Score",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: [
          { title: "High Priority", value: "HIGH" },
          { title: "Medium Priority", value: "MEDIUM" },
          { title: "Nurture", value: "NURTURE" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "NEW",
      options: {
        list: [
          "NEW",
          "QUALIFIED",
          "CALL_REQUESTED",
          "CALL_BOOKED",
          "CHECKOUT_STARTED",
          "PAYMENT_PENDING",
          "PAID",
          "ONBOARDING",
          "PROJECT_ACTIVE",
          "COMPLETED",
          "LOST",
          "CHECKOUT_ABANDONED",
        ].map((value) => ({ title: value, value })),
      },
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
    }),
    defineField({
      name: "campaign",
      title: "Campaign",
      type: "string",
    }),
    defineField({
      name: "referrer",
      title: "Referrer",
      type: "string",
    }),
    defineField({
      name: "landingPage",
      title: "Landing Page",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "firstName",
      subtitle: "email",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || "Unnamed lead",
        subtitle: `${subtitle ?? ""} · ${status ?? "NEW"}`,
      };
    },
  },
});
