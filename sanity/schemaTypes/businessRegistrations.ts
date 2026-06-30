import { defineField, defineType } from "sanity";

export const businessRegistration = defineType({
  name: "businessRegistration",
  title: "Business Registration",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Reviewing", value: "reviewing" },
          { title: "Completed", value: "completed" },
          { title: "Rejected", value: "rejected" },
        ],
      },
    }),

    defineField({
      name: "proposedNameOne",
      title: "Proposed Name 1",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "proposedNameTwo",
      title: "Proposed Name 2",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "natureOfBusiness",
      title: "Nature of Business",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "businessAddress",
      title: "Business Premises / Branch Address",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "companyEmail",
      title: "Company Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "companyPhone",
      title: "Company Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "directorsShareholders",
      title: "Directors / Shareholders",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "isDirector",
              title: "Is Director",
              type: "boolean",
            }),
            defineField({
              name: "isShareholder",
              title: "Is Shareholder",
              type: "boolean",
            }),
            defineField({
              name: "dateOfBirth",
              title: "Date of Birth",
              type: "date",
            }),
            defineField({
              name: "gender",
              title: "Gender",
              type: "string",
            }),
            defineField({
              name: "houseAddress",
              title: "House Address",
              type: "text",
            }),
            defineField({
              name: "phone",
              title: "Phone Number",
              type: "string",
            }),
            defineField({
              name: "email",
              title: "Email Address",
              type: "string",
            }),
            defineField({
              name: "occupation",
              title: "Occupation",
              type: "string",
            }),
            defineField({
              name: "nationality",
              title: "Nationality",
              type: "string",
            }),
            defineField({
              name: "meansOfIdNumber",
              title: "Means of ID Number",
              type: "string",
            }),
            defineField({
              name: "shareholdingPercentage",
              title: "Shareholding Percentage",
              type: "number",
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "documents",
      title: "Uploaded Documents",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "string",
            }),
            defineField({
              name: "filename",
              title: "Filename",
              type: "string",
            }),
            defineField({
              name: "mimeType",
              title: "MIME Type",
              type: "string",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "number",
            }),
            defineField({
              name: "fileUrl",
              title: "File URL",
              type: "url",
            }),
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
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    }),
  ],

  preview: {
    select: {
      title: "proposedNameOne",
      subtitle: "companyEmail",
    },
  },
});
