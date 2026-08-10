import type { LeadPriority, QualificationInput } from "./types";

interface ScoreResult {
  score: number;
  priority: LeadPriority;
}

/**
 * Scores against the signals from the spec that can actually be observed from
 * the qualification answers we collect. Signals the funnel doesn't ask about
 * (e.g. "founder/decision-maker", "looking only for cheapest option") are left
 * for sales to apply manually via the Priority field in Sanity Studio.
 */
export function scoreLead(answers: QualificationInput): ScoreResult {
  let score = 0;

  const urgentOpportunity =
    answers.opportunityType === "investor" || answers.opportunityType === "grant";
  const nearTermTimeline =
    answers.projectTimeline === "within_7_days" ||
    answers.projectTimeline === "within_2_weeks" ||
    answers.projectTimeline === "within_30_days";

  if (urgentOpportunity && nearTermTimeline) score += 3;
  if (answers.preferredNextStep === "pay_now") score += 3;
  if (answers.websiteStatus === "needs_work" || answers.websiteStatus === "wants_upgrade") score += 2;
  if (answers.websiteStatus === "none" || answers.websiteStatus === "needs_work") score += 2;
  if (answers.projectTimeline === "exploring") score -= 2;

  const priority: LeadPriority = score >= 8 ? "HIGH" : score >= 5 ? "MEDIUM" : "NURTURE";

  return { score, priority };
}
