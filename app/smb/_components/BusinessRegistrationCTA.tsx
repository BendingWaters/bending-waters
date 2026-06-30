"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type DirectorShareholder = {
  id: string;
  name: string;
  isDirector: boolean;
  isShareholder: boolean;
  dateOfBirth: string;
  gender: string;
  houseAddress: string;
  phone: string;
  email: string;
  occupation: string;
  nationality: string;
  meansOfIdNumber: string;
  shareholdingPercentage: string;
};

type FormState = {
  proposedNameOne: string;
  proposedNameTwo: string;
  natureOfBusiness: string;
  businessAddress: string;
  companyEmail: string;
  companyPhone: string;
  directorsShareholders: DirectorShareholder[];
  scannedSignatures: FileList | null;
  passportPhotographs: FileList | null;
  meansOfIdentification: FileList | null;
};

type ApiResponse =
  | {
      success: true;
      message: string;
      documentId?: string;
      emailSent?: boolean;
    }
  | {
      success: false;
      message: string;
      errors?: unknown;
      requestId?: string;
    };

const createDirectorShareholder = (): DirectorShareholder => ({
  id: crypto.randomUUID(),
  name: "",
  isDirector: true,
  isShareholder: false,
  dateOfBirth: "",
  gender: "",
  houseAddress: "",
  phone: "",
  email: "",
  occupation: "",
  nationality: "",
  meansOfIdNumber: "",
  shareholdingPercentage: "",
});

const getInitialFormState = (): FormState => ({
  proposedNameOne: "",
  proposedNameTwo: "",
  natureOfBusiness: "",
  businessAddress: "",
  companyEmail: "",
  companyPhone: "",
  directorsShareholders: [createDirectorShareholder()],
  scannedSignatures: null,
  passportPhotographs: null,
  meansOfIdentification: null,
});

const benefits = [
  "Business registration guidance",
  "SME onboarding support",
  "Compliance-ready business details",
  "Digital growth recommendations",
];

export default function BusinessRegistrationCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => getInitialFormState());
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateDirectorShareholder<K extends keyof DirectorShareholder>(
    id: string,
    key: K,
    value: DirectorShareholder[K]
  ) {
    setForm((current) => ({
      ...current,
      directorsShareholders: current.directorsShareholders.map((person) =>
        person.id === id
          ? {
              ...person,
              [key]: value,
            }
          : person
      ),
    }));
  }

  function addDirectorShareholder() {
    setForm((current) => ({
      ...current,
      directorsShareholders: [
        ...current.directorsShareholders,
        createDirectorShareholder(),
      ],
    }));
  }

  function removeDirectorShareholder(id: string) {
    setForm((current) => {
      if (current.directorsShareholders.length === 1) {
        return current;
      }

      return {
        ...current,
        directorsShareholders: current.directorsShareholders.filter(
          (person) => person.id !== id
        ),
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);

    const requestId = crypto.randomUUID();

    console.group(`[BusinessRegistrationCTA] Submit started: ${requestId}`);

    try {
      const formData = new FormData();

      formData.append("proposedNameOne", form.proposedNameOne);
      formData.append("proposedNameTwo", form.proposedNameTwo);
      formData.append("natureOfBusiness", form.natureOfBusiness);
      formData.append("businessAddress", form.businessAddress);
      formData.append("companyEmail", form.companyEmail);
      formData.append("companyPhone", form.companyPhone);

      formData.append(
        "directorsShareholders",
        JSON.stringify(form.directorsShareholders)
      );

      Array.from(form.scannedSignatures ?? []).forEach((file) => {
        formData.append("scannedSignatures", file);
      });

      Array.from(form.passportPhotographs ?? []).forEach((file) => {
        formData.append("passportPhotographs", file);
      });

      Array.from(form.meansOfIdentification ?? []).forEach((file) => {
        formData.append("meansOfIdentification", file);
      });

      console.info("[BusinessRegistrationCTA] Payload summary:", {
        requestId,
        proposedNameOne: form.proposedNameOne,
        proposedNameTwo: form.proposedNameTwo,
        companyEmail: form.companyEmail,
        companyPhone: form.companyPhone,
        directorsShareholdersCount: form.directorsShareholders.length,
        scannedSignaturesCount: form.scannedSignatures?.length ?? 0,
        passportPhotographsCount: form.passportPhotographs?.length ?? 0,
        meansOfIdentificationCount: form.meansOfIdentification?.length ?? 0,
      });

      const response = await fetch("/api/business-registration", {
        method: "POST",
        body: formData,
        headers: {
          "x-request-id": requestId,
        },
      });

      const result = await parseApiResponse(response);

      console.info("[BusinessRegistrationCTA] API response:", {
        requestId,
        status: response.status,
        statusText: response.statusText,
        result,
      });

      if (!response.ok) {
        console.error("[BusinessRegistrationCTA] API failed:", {
          requestId,
          status: response.status,
          statusText: response.statusText,
          result,
        });

        throw new Error(
          getApiErrorMessage(result) ||
            `Submission failed with status ${response.status}.`
        );
      }

      console.info("[BusinessRegistrationCTA] Submit successful:", {
        requestId,
        result,
      });

      setSubmitted(true);
      setForm(getInitialFormState());
    } catch (error) {
      console.error("[BusinessRegistrationCTA] Submit error:", {
        requestId,
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      console.groupEnd();
    }
  }

  function openModal() {
    setIsOpen(true);
    setSubmitted(false);
    setSubmitError(null);
  }

  function closeModal() {
    setIsOpen(false);
    setSubmitted(false);
    setSubmitError(null);
  }

  return (
    <>
      <section className="bg-neutral-950 px-4 py-24 text-white md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-12 shadow-2xl shadow-black/30 md:px-12 md:py-16">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300">
                  <Building2 className="size-4" />
                  SME Business Registration
                </div>

                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                  Register your business and start building with structure.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">
                  Submit your proposed business names, company details,
                  director/shareholder information, and required scanned
                  documents.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={openModal}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
                  >
                    Start registration
                    <ArrowRight className="size-4" />
                  </button>

                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Learn what is required
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                  What you get
                </p>

                <div className="mt-6 space-y-4">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-400" />
                      <p className="text-sm leading-6 text-neutral-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="business-registration-title"
          onClick={closeModal}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 text-neutral-950 shadow-2xl [scrollbar-width:none] md:p-8 [&::-webkit-scrollbar]:hidden"
            onClick={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close business registration form"
              className="absolute right-5 top-5 z-10 inline-flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200 hover:text-neutral-950"
            >
              <X className="size-5" />
            </button>

            {!submitted ? (
              <>
                <div className="pr-12">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">
                    Business Registration
                  </p>

                  <h3
                    id="business-registration-title"
                    className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl"
                  >
                    Complete your business registration request
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                    Provide the required company, director, shareholder, and
                    document details for processing.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 md:p-6">
                    <h4 className="text-lg font-semibold text-neutral-950">
                      Proposed Names
                    </h4>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <FormField
                        label="Proposed Name 1"
                        htmlFor="proposedNameOne"
                        required
                      >
                        <input
                          id="proposedNameOne"
                          type="text"
                          required
                          value={form.proposedNameOne}
                          onChange={(event) =>
                            updateField("proposedNameOne", event.target.value)
                          }
                          className={inputClassName}
                          placeholder="Enter first proposed name"
                        />
                      </FormField>

                      <FormField
                        label="Proposed Name 2"
                        htmlFor="proposedNameTwo"
                        required
                      >
                        <input
                          id="proposedNameTwo"
                          type="text"
                          required
                          value={form.proposedNameTwo}
                          onChange={(event) =>
                            updateField("proposedNameTwo", event.target.value)
                          }
                          className={inputClassName}
                          placeholder="Enter second proposed name"
                        />
                      </FormField>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 md:p-6">
                    <h4 className="text-lg font-semibold text-neutral-950">
                      Business Information
                    </h4>

                    <div className="mt-5 space-y-5">
                      <FormField
                        label="Nature of Business"
                        htmlFor="natureOfBusiness"
                        required
                      >
                        <textarea
                          id="natureOfBusiness"
                          rows={4}
                          required
                          value={form.natureOfBusiness}
                          onChange={(event) =>
                            updateField("natureOfBusiness", event.target.value)
                          }
                          className={textareaClassName}
                          placeholder="Describe the business activities"
                        />
                      </FormField>

                      <FormField
                        label="Full Address of Business Premises and Branches, if any"
                        htmlFor="businessAddress"
                        required
                      >
                        <textarea
                          id="businessAddress"
                          rows={4}
                          required
                          value={form.businessAddress}
                          onChange={(event) =>
                            updateField("businessAddress", event.target.value)
                          }
                          className={textareaClassName}
                          placeholder="Enter head office and branch addresses"
                        />
                      </FormField>

                      <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                          label="Company E-mail"
                          htmlFor="companyEmail"
                          required
                        >
                          <input
                            id="companyEmail"
                            type="email"
                            required
                            value={form.companyEmail}
                            onChange={(event) =>
                              updateField("companyEmail", event.target.value)
                            }
                            className={inputClassName}
                            placeholder="company@example.com"
                          />
                        </FormField>

                        <FormField
                          label="Company Phone Number"
                          htmlFor="companyPhone"
                          required
                        >
                          <input
                            id="companyPhone"
                            type="tel"
                            required
                            value={form.companyPhone}
                            onChange={(event) =>
                              updateField("companyPhone", event.target.value)
                            }
                            className={inputClassName}
                            placeholder="+234..."
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-950">
                          Directors / Shareholders Details
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                          Indicate if the person is a director, shareholder, or
                          both.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addDirectorShareholder}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                      >
                        <Plus className="size-4" />
                        Add person
                      </button>
                    </div>

                    <div className="mt-6 space-y-6">
                      {form.directorsShareholders.map((person, index) => (
                        <div
                          key={person.id}
                          className="rounded-3xl border border-neutral-200 bg-white p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                                Person {index + 1}
                              </p>

                              <h5 className="mt-1 text-lg font-semibold text-neutral-950">
                                Director / Shareholder Information
                              </h5>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeDirectorShareholder(person.id)
                              }
                              disabled={form.directorsShareholders.length === 1}
                              className="inline-flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Remove director or shareholder"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          <div className="mt-5 space-y-5">
                            <FormField
                              label="Director / Shareholder's Name"
                              htmlFor={`name-${person.id}`}
                              required
                            >
                              <input
                                id={`name-${person.id}`}
                                type="text"
                                required
                                value={person.name}
                                onChange={(event) =>
                                  updateDirectorShareholder(
                                    person.id,
                                    "name",
                                    event.target.value
                                  )
                                }
                                className={inputClassName}
                                placeholder="Full name"
                              />
                            </FormField>

                            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center">
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                                <input
                                  type="checkbox"
                                  checked={person.isDirector}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "isDirector",
                                      event.target.checked
                                    )
                                  }
                                  className="size-4 rounded border-neutral-300 accent-orange-500"
                                />
                                Director
                              </label>

                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                                <input
                                  type="checkbox"
                                  checked={person.isShareholder}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "isShareholder",
                                      event.target.checked
                                    )
                                  }
                                  className="size-4 rounded border-neutral-300 accent-orange-500"
                                />
                                Shareholder
                              </label>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                              <FormField
                                label="Date of Birth"
                                htmlFor={`dateOfBirth-${person.id}`}
                                required
                              >
                                <input
                                  id={`dateOfBirth-${person.id}`}
                                  type="date"
                                  required
                                  value={person.dateOfBirth}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "dateOfBirth",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                />
                              </FormField>

                              <FormField
                                label="Gender"
                                htmlFor={`gender-${person.id}`}
                                required
                              >
                                <select
                                  id={`gender-${person.id}`}
                                  required
                                  value={person.gender}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "gender",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                >
                                  <option value="">Select gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </FormField>
                            </div>

                            <FormField
                              label="House Address"
                              htmlFor={`houseAddress-${person.id}`}
                              required
                            >
                              <textarea
                                id={`houseAddress-${person.id}`}
                                rows={3}
                                required
                                value={person.houseAddress}
                                onChange={(event) =>
                                  updateDirectorShareholder(
                                    person.id,
                                    "houseAddress",
                                    event.target.value
                                  )
                                }
                                className={textareaClassName}
                                placeholder="Residential address"
                              />
                            </FormField>

                            <div className="grid gap-5 md:grid-cols-2">
                              <FormField
                                label="Phone Number"
                                htmlFor={`phone-${person.id}`}
                                required
                              >
                                <input
                                  id={`phone-${person.id}`}
                                  type="tel"
                                  required
                                  value={person.phone}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "phone",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                  placeholder="+234..."
                                />
                              </FormField>

                              <FormField
                                label="E-mail Address"
                                htmlFor={`email-${person.id}`}
                                required
                              >
                                <input
                                  id={`email-${person.id}`}
                                  type="email"
                                  required
                                  value={person.email}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "email",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                  placeholder="person@example.com"
                                />
                              </FormField>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                              <FormField
                                label="Occupation"
                                htmlFor={`occupation-${person.id}`}
                                required
                              >
                                <input
                                  id={`occupation-${person.id}`}
                                  type="text"
                                  required
                                  value={person.occupation}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "occupation",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                  placeholder="Occupation"
                                />
                              </FormField>

                              <FormField
                                label="Nationality"
                                htmlFor={`nationality-${person.id}`}
                                required
                              >
                                <input
                                  id={`nationality-${person.id}`}
                                  type="text"
                                  required
                                  value={person.nationality}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "nationality",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                  placeholder="Nationality"
                                />
                              </FormField>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                              <FormField
                                label="Means of ID Number"
                                htmlFor={`meansOfIdNumber-${person.id}`}
                                required
                              >
                                <input
                                  id={`meansOfIdNumber-${person.id}`}
                                  type="text"
                                  required
                                  value={person.meansOfIdNumber}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "meansOfIdNumber",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                  placeholder="NIN, Passport, Driver's Licence..."
                                />
                              </FormField>

                              <FormField
                                label="Shareholding Percentage"
                                htmlFor={`shareholdingPercentage-${person.id}`}
                              >
                                <input
                                  id={`shareholdingPercentage-${person.id}`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={person.shareholdingPercentage}
                                  onChange={(event) =>
                                    updateDirectorShareholder(
                                      person.id,
                                      "shareholdingPercentage",
                                      event.target.value
                                    )
                                  }
                                  className={inputClassName}
                                  placeholder="e.g. 50"
                                />
                              </FormField>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 md:p-6">
                    <h4 className="text-lg font-semibold text-neutral-950">
                      Attach and Send Documents
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Upload scanned signature, passport photograph, and means
                      of identification for each director/shareholder.
                    </p>

                    <div className="mt-5 grid gap-5">
                      <FileUploadField
                        label="Scanned Signature"
                        htmlFor="scannedSignatures"
                        onChange={(files) =>
                          updateField("scannedSignatures", files)
                        }
                      />

                      <FileUploadField
                        label="Scanned Passport Photograph"
                        htmlFor="passportPhotographs"
                        onChange={(files) =>
                          updateField("passportPhotographs", files)
                        }
                      />

                      <FileUploadField
                        label="Scanned Copy of Means of Identification"
                        htmlFor="meansOfIdentification"
                        onChange={(files) =>
                          updateField("meansOfIdentification", files)
                        }
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit registration request"}
                    <ArrowRight className="size-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <CheckCircle2 className="size-8" />
                </div>

                <h3 className="mt-6 text-3xl font-semibold tracking-tight">
                  Request received
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600">
                  Your business registration request has been submitted. The
                  team will review it and follow up with the next steps.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-8 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

async function parseApiResponse(response: Response): Promise<ApiResponse | string> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function getApiErrorMessage(result: ApiResponse | string) {
  if (typeof result === "string") {
    return result || null;
  }

  return result.message || null;
}

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormField({ label, htmlFor, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-800">
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
      </label>

      <div className="mt-2">{children}</div>
    </div>
  );
}

type FileUploadFieldProps = {
  label: string;
  htmlFor: string;
  onChange: (files: FileList | null) => void;
};

function FileUploadField({ label, htmlFor, onChange }: FileUploadFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-800">
        {label}
      </label>

      <label
        htmlFor={htmlFor}
        className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-6 text-center transition hover:border-orange-500 hover:bg-orange-50"
      >
        <Upload className="size-6 text-orange-500" />

        <span className="mt-2 text-sm font-medium text-neutral-800">
          Click to upload files
        </span>

        <span className="mt-1 text-xs text-neutral-500">
          PDF, JPG, PNG, or WEBP files
        </span>

        <input
          id={htmlFor}
          name={htmlFor}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(event) => onChange(event.target.files)}
          className="sr-only"
        />
      </label>
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white";

const textareaClassName =
  "w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white";