import { defineField, defineType } from "sanity";

export const onboarding = defineType({
  name: "onboarding",
  title: "7-Day Launch Onboarding",
  type: "document",
  fields: [
    defineField({
      name: "lead",
      title: "Lead",
      type: "reference",
      to: [{ type: "lead" }],
    }),
    defineField({
      name: "payment",
      title: "Payment",
      type: "reference",
      to: [{ type: "payment" }],
    }),
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "companyDescription", title: "Company Description", type: "text" }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({ name: "services", title: "Services", type: "text" }),
    defineField({ name: "products", title: "Products", type: "text" }),
    defineField({ name: "targetAudience", title: "Target Audience", type: "text" }),
    defineField({ name: "companyStory", title: "Company Story", type: "text" }),
    defineField({ name: "mission", title: "Mission", type: "text" }),
    defineField({ name: "vision", title: "Vision", type: "text" }),
    defineField({ name: "values", title: "Values", type: "text" }),
    defineField({ name: "team", title: "Team", type: "text" }),
    defineField({ name: "leadership", title: "Leadership", type: "text" }),
    defineField({ name: "traction", title: "Traction", type: "text" }),
    defineField({ name: "milestones", title: "Milestones", type: "text" }),
    defineField({ name: "testimonials", title: "Testimonials", type: "text" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "contactPhone", title: "Contact Phone", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({ name: "existingWebsite", title: "Existing Website", type: "url" }),
    defineField({ name: "websiteInspiration", title: "Website Inspiration", type: "text" }),
    defineField({ name: "competitors", title: "Competitors", type: "text" }),
    defineField({ name: "requiredPages", title: "Required Pages", type: "text" }),
    defineField({ name: "specialRequirements", title: "Special Requirements", type: "text" }),
    defineField({
      name: "files",
      title: "Uploaded Files",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "category", title: "Category", type: "string" }),
            defineField({ name: "filename", title: "Filename", type: "string" }),
            defineField({ name: "fileUrl", title: "File URL", type: "url" }),
            defineField({
              name: "file",
              title: "File",
              type: "file",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "SUBMITTED",
      options: {
        list: [
          { title: "Submitted", value: "SUBMITTED" },
          { title: "In Review", value: "IN_REVIEW" },
          { title: "Kickoff Scheduled", value: "KICKOFF_SCHEDULED" },
        ],
      },
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
  preview: {
    select: {
      title: "companyName",
      subtitle: "status",
    },
  },
});
