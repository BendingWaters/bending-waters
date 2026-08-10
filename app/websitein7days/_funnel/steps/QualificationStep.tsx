"use client";

import { useState } from "react";
import { useFunnel } from "../FunnelProvider";
import { OptionCard, StepProgress, GhostButton, ErrorBanner } from "../ui";
import { trackEvent } from "../../_lib/analytics";
import type {
  OpportunityType,
  PreferredNextStep,
  ProjectTimeline,
  WebsiteStatus,
} from "@/lib/launch/types";

const OPPORTUNITY_OPTIONS: { value: OpportunityType; label: string }[] = [
  { value: "grant", label: "Grant application" },
  { value: "investor", label: "Investor conversations" },
  { value: "partnership", label: "Corporate partnerships" },
  { value: "expansion", label: "Business expansion" },
  { value: "credibility", label: "General credibility" },
  { value: "other", label: "Other" },
];

const WEBSITE_STATUS_OPTIONS: { value: WebsiteStatus; label: string }[] = [
  { value: "none", label: "I don't have one" },
  { value: "needs_work", label: "I have one but it needs work" },
  { value: "wants_upgrade", label: "I have a website but want a complete upgrade" },
  { value: "not_sure", label: "I'm not sure" },
];

const TIMELINE_OPTIONS: { value: ProjectTimeline; label: string }[] = [
  { value: "within_7_days", label: "Within 7 days" },
  { value: "within_2_weeks", label: "Within 2 weeks" },
  { value: "within_30_days", label: "Within 30 days" },
  { value: "exploring", label: "I'm exploring options" },
];

const NEXT_STEP_OPTIONS: { value: PreferredNextStep; label: string; description: string }[] = [
  { value: "book_call", label: "Book a Strategy Call", description: "Talk it through with our team first." },
  { value: "pay_now", label: "Choose a Package & Pay", description: "I already know what I need." },
];

const QUESTIONS = [
  { key: "opportunityType" as const, title: "What are you preparing your business for?", options: OPPORTUNITY_OPTIONS },
  { key: "websiteStatus" as const, title: "What's your current website situation?", options: WEBSITE_STATUS_OPTIONS },
  { key: "projectTimeline" as const, title: "When do you need the website?", options: TIMELINE_OPTIONS },
  { key: "preferredNextStep" as const, title: "What would you like to do next?", options: NEXT_STEP_OPTIONS },
];

export default function QualificationStep() {
  const { data, updateData, goTo } = useFunnel();
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = QUESTIONS[index];
  const currentValue = data[question.key];

  async function persistAnswers(finalAnswers: typeof data) {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/launch/leads/${data.leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityType: finalAnswers.opportunityType,
          websiteStatus: finalAnswers.websiteStatus,
          projectTimeline: finalAnswers.projectTimeline,
          preferredNextStep: finalAnswers.preferredNextStep,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      trackEvent("qualification_completed", { leadId: data.leadId, priority: result.priority });

      if (finalAnswers.preferredNextStep === "book_call") {
        trackEvent("call_selected", { leadId: data.leadId });
        goTo("booking");
      } else {
        goTo("package-select");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function selectOption(value: string) {
    const updated = { ...data, [question.key]: value };
    updateData({ [question.key]: value } as Partial<typeof data>);

    if (index < QUESTIONS.length - 1) {
      setIndex((i) => i + 1);
    } else {
      persistAnswers(updated);
    }
  }

  return (
    <div>
      <StepProgress current={index + 1} total={QUESTIONS.length} />

      <h3 className="mt-6 text-2xl font-semibold text-white sm:text-3xl">{question.title}</h3>

      <div className="mt-6 space-y-3">
        {question.options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            description={"description" in option ? option.description : undefined}
            selected={currentValue === option.value}
            onClick={() => selectOption(option.value)}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <GhostButton
          type="button"
          disabled={index === 0 || submitting}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Back
        </GhostButton>
        <span className="text-xs text-white/40">
          Question {index + 1} of {QUESTIONS.length}
        </span>
      </div>
    </div>
  );
}
