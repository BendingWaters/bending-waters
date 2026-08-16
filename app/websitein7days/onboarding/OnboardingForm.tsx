"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Upload, ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "../_components/ui";
import { trackEvent } from "../_lib/analytics";

const inputClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-primary focus:bg-white/[0.06] focus:ring-2 focus:ring-primary/25";

const textareaClass = `${inputClass} resize-none`;

interface TextFieldsState {
  companyName: string;
  companyDescription: string;
  industry: string;
  services: string;
  products: string;
  targetAudience: string;
  companyStory: string;
  mission: string;
  vision: string;
  values: string;
  team: string;
  leadership: string;
  traction: string;
  milestones: string;
  testimonials: string;
  contactEmail: string;
  contactPhone: string;
  existingWebsite: string;
  websiteInspiration: string;
  competitors: string;
  requiredPages: string;
  specialRequirements: string;
}

const initialFields: TextFieldsState = {
  companyName: "",
  companyDescription: "",
  industry: "",
  services: "",
  products: "",
  targetAudience: "",
  companyStory: "",
  mission: "",
  vision: "",
  values: "",
  team: "",
  leadership: "",
  traction: "",
  milestones: "",
  testimonials: "",
  contactEmail: "",
  contactPhone: "",
  existingWebsite: "",
  websiteInspiration: "",
  competitors: "",
  requiredPages: "",
  specialRequirements: "",
};

export default function OnboardingForm({ leadId, paymentId }: { leadId?: string; paymentId?: string }) {
  const [fields, setFields] = useState<TextFieldsState>(initialFields);
  const [logo, setLogo] = useState<FileList | null>(null);
  const [brandAssets, setBrandAssets] = useState<FileList | null>(null);
  const [companyImages, setCompanyImages] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("onboarding_started", { leadId });
  }, [leadId]);

  function update<K extends keyof TextFieldsState>(key: K, value: TextFieldsState[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      if (leadId) formData.append("leadId", leadId);
      if (paymentId) formData.append("paymentId", paymentId);

      Object.entries(fields).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      Array.from(logo ?? []).forEach((file) => formData.append("logo", file));
      Array.from(brandAssets ?? []).forEach((file) => formData.append("brandAssets", file));
      Array.from(companyImages ?? []).forEach((file) => formData.append("companyImages", file));

      const response = await fetch("/api/launch/onboarding", { method: "POST", body: formData });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      trackEvent("onboarding_completed", { leadId, onboardingId: result.onboardingId });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 className="size-9" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white">Onboarding received.</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/60">
            Thank you — we have everything we need to begin. We&apos;ll confirm your project
            schedule and kick off your seven-day sprint shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <Container className="max-w-3xl pt-16">
        <Eyebrow>Client Onboarding</Eyebrow>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Tell us everything about your business.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
          The more we know upfront, the faster and more accurately we can build your website.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <Fieldset title="Company Basics">
            <TextField label="Company Name" required value={fields.companyName} onChange={(v) => update("companyName", v)} />
            <TextField label="Industry" value={fields.industry} onChange={(v) => update("industry", v)} />
            <TextareaField label="Company Description" value={fields.companyDescription} onChange={(v) => update("companyDescription", v)} />
            <TextareaField label="Services" value={fields.services} onChange={(v) => update("services", v)} />
            <TextareaField label="Products" value={fields.products} onChange={(v) => update("products", v)} />
            <TextareaField label="Target Audience" value={fields.targetAudience} onChange={(v) => update("targetAudience", v)} />
          </Fieldset>

          <Fieldset title="Story & Positioning">
            <TextareaField label="Company Story" value={fields.companyStory} onChange={(v) => update("companyStory", v)} />
            <TextareaField label="Mission" value={fields.mission} onChange={(v) => update("mission", v)} />
            <TextareaField label="Vision" value={fields.vision} onChange={(v) => update("vision", v)} />
            <TextareaField label="Values" value={fields.values} onChange={(v) => update("values", v)} />
          </Fieldset>

          <Fieldset title="Team & Traction">
            <TextareaField label="Team" value={fields.team} onChange={(v) => update("team", v)} />
            <TextareaField label="Leadership" value={fields.leadership} onChange={(v) => update("leadership", v)} />
            <TextareaField label="Traction" value={fields.traction} onChange={(v) => update("traction", v)} />
            <TextareaField label="Milestones" value={fields.milestones} onChange={(v) => update("milestones", v)} />
            <TextareaField label="Testimonials" value={fields.testimonials} onChange={(v) => update("testimonials", v)} />
          </Fieldset>

          <Fieldset title="Contact">
            <TextField label="Contact Email" type="email" value={fields.contactEmail} onChange={(v) => update("contactEmail", v)} />
            <TextField label="Contact Phone" type="tel" value={fields.contactPhone} onChange={(v) => update("contactPhone", v)} />
          </Fieldset>

          <Fieldset title="Brand Assets">
            <FileField label="Logo" onChange={setLogo} />
            <FileField label="Brand Assets" onChange={setBrandAssets} multiple />
            <FileField label="Company Images" onChange={setCompanyImages} multiple />
          </Fieldset>

          <Fieldset title="Website Direction">
            <TextField label="Existing Website" value={fields.existingWebsite} onChange={(v) => update("existingWebsite", v)} />
            <TextareaField label="Website Inspiration" value={fields.websiteInspiration} onChange={(v) => update("websiteInspiration", v)} />
            <TextareaField label="Competitors" value={fields.competitors} onChange={(v) => update("competitors", v)} />
            <TextareaField label="Required Pages" value={fields.requiredPages} onChange={(v) => update("requiredPages", v)} />
            <TextareaField label="Special Requirements" value={fields.specialRequirements} onChange={(v) => update("specialRequirements", v)} />
          </Fieldset>

          {error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Onboarding"} <ArrowRight className="size-4" />
          </button>
        </form>
      </Container>
    </div>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111113] p-6">
      <h2 className="text-[15px] font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={textareaClass} />
    </div>
  );
}

function FileField({
  label,
  onChange,
  multiple,
}: {
  label: string;
  onChange: (files: FileList | null) => void;
  multiple?: boolean;
}) {
  const id = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-center transition hover:border-primary hover:bg-primary/5"
      >
        <Upload className="size-5 text-primary" />
        <span className="mt-2 text-sm text-white/60">Click to upload</span>
        <span className="mt-1 text-xs text-white/30">PDF, JPG, PNG, WEBP or SVG</span>
        <input
          id={id}
          type="file"
          multiple={multiple}
          accept=".pdf,.jpg,.jpeg,.png,.webp,.svg"
          onChange={(event) => onChange(event.target.files)}
          className="sr-only"
        />
      </label>
    </div>
  );
}
