import { defineField, defineType } from "sanity";

export const payment = defineType({
  name: "payment",
  title: "7-Day Launch Payment",
  type: "document",
  fields: [
    defineField({
      name: "lead",
      title: "Lead",
      type: "reference",
      to: [{ type: "lead" }],
    }),
    defineField({
      name: "packageId",
      title: "Package ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "packageName",
      title: "Package Name",
      type: "string",
    }),
    defineField({
      name: "reference",
      title: "Transaction Reference",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Amount (NGN)",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "NGN",
    }),
    defineField({
      name: "status",
      title: "Payment Status",
      type: "string",
      initialValue: "CHECKOUT_STARTED",
      options: {
        list: [
          "CHECKOUT_STARTED",
          "PAYMENT_PENDING",
          "PAYMENT_SUCCESSFUL",
          "PAYMENT_FAILED",
          "CHECKOUT_ABANDONED",
        ].map((value) => ({ title: value, value })),
      },
    }),
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      initialValue: "paystack",
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "gatewayResponse",
      title: "Gateway Response",
      type: "string",
    }),
    defineField({
      name: "paidAt",
      title: "Paid At",
      type: "datetime",
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
      title: "reference",
      subtitle: "status",
    },
  },
});
