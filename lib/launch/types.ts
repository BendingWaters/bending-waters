export type OpportunityType =
  | "grant"
  | "investor"
  | "partnership"
  | "expansion"
  | "credibility"
  | "other";

export type WebsiteStatus = "none" | "needs_work" | "wants_upgrade" | "not_sure";

export type ProjectTimeline =
  | "within_7_days"
  | "within_2_weeks"
  | "within_30_days"
  | "exploring";

export type PreferredNextStep = "book_call" | "pay_now";

export type LeadStatus =
  | "NEW"
  | "QUALIFIED"
  | "CALL_REQUESTED"
  | "CALL_BOOKED"
  | "CHECKOUT_STARTED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "ONBOARDING"
  | "PROJECT_ACTIVE"
  | "COMPLETED"
  | "LOST"
  | "CHECKOUT_ABANDONED";

export type PaymentStatus =
  | "CHECKOUT_STARTED"
  | "PAYMENT_PENDING"
  | "PAYMENT_SUCCESSFUL"
  | "PAYMENT_FAILED"
  | "CHECKOUT_ABANDONED";

export type LeadPriority = "HIGH" | "MEDIUM" | "NURTURE";

export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  landingPage?: string;
}

export interface LeadCaptureInput extends Attribution {
  firstName: string;
  businessName?: string;
  email: string;
  phone: string;
}

export interface QualificationInput {
  opportunityType?: OpportunityType;
  websiteStatus?: WebsiteStatus;
  projectTimeline?: ProjectTimeline;
  preferredNextStep?: PreferredNextStep;
  selectedPackageId?: string;
}

export interface LeadRecord extends LeadCaptureInput, QualificationInput {
  _id: string;
  status: LeadStatus;
  leadScore: number;
  priority: LeadPriority;
}
