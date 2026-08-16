"use client";

import React, { useTransition, useState } from "react";
import { Send, ArrowUpRight } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

const services = [
  "Performance Marketing",
  "Content & Brand Strategy",
  "Data & AI Analytics",
  "Technology Buildout",
  "Consulting & Strategy",
  "Other",
];

interface FormField {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

const fields: FormField[] = [
  {
    id: "fullName",
    name: "fullName",
    label: "Full name",
    type: "text",
    required: true,
  },
  {
    id: "email",
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
  },
  {
    id: "businessName",
    name: "businessName",
    label: "Business name",
    type: "text",
    required: false,
  },
  {
    id: "website",
    name: "website",
    label: "Website (optional)",
    type: "url",
    required: false,
  },
];

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (selectedService) formData.set("service", selectedService);

    startTransition(async () => {
      const result = await submitContactForm(formData);
      setStatus(result);
      if (result.success) {
        (event.target as HTMLFormElement).reset();
        setSelectedService(null);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {fields.slice(0, 2).map((field) => (
          <InputField key={field.id} field={field} />
        ))}
      </div>

      {/* Business + Website row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {fields.slice(2).map((field) => (
          <InputField key={field.id} field={field} />
        ))}
      </div>

      {/* Service selector */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-gray-700 uppercase tracking-widest">
          What can we help with?
        </p>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() =>
                setSelectedService(service === selectedService ? null : service)
              }
              className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedService === service
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-600 bg-white hover:border-primary hover:text-primary"
              }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2 group">
        <label
          htmlFor="message"
          className="text-xs font-medium text-gray-700 uppercase tracking-widest block transition-colors duration-200 group-focus-within:text-primary"
        >
          Tell us more
        </label>
        <div className="border-b border-gray-200 focus-within:border-primary transition-colors duration-300">
          <textarea
            id="message"
            name="message"
            required
            rows={3}
            placeholder="Briefly describe your project or goals…"
            className="w-full bg-transparent py-3 outline-none text-base text-[#0F0F0F] placeholder-gray-500 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Submit row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-700 max-w-50 leading-relaxed">
          We respond within 1–2 business days.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex items-center gap-2.5 bg-[#0F0F0F] hover:bg-primary text-white text-sm font-semibold px-7 py-3.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </span>
          ) : (
            <>
              Send message
              <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Status message */}
      {status && (
        <p
          className={`text-sm font-medium ${
            status.success ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}

/* ── Reusable underline input field ─────────────────────────────── */
function InputField({ field }: { field: FormField }) {
  return (
    <div className="space-y-2 group">
      <label
        htmlFor={field.id}
        className="text-xs font-medium text-gray-700 uppercase tracking-widest block transition-colors duration-200 group-focus-within:text-primary"
      >
        {field.label}
      </label>
      <div className="border-b border-gray-200 focus-within:border-primary transition-colors duration-300">
        <input
          type={field.type ?? "text"}
          id={field.id}
          name={field.name}
          required={field.required}
          className="w-full bg-transparent py-3 outline-none text-base text-[#0F0F0F] placeholder-gray-300"
        />
      </div>
    </div>
  );
}
