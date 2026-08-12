"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Attribution,
  OpportunityType,
  PaymentPreference,
  PaymentReadiness,
  PreferredNextStep,
  PriceAwareness,
  ProjectTimeline,
  WebsiteStatus,
} from "@/lib/launch/types";

export type FunnelStep =
  | null
  | "lead"
  | "qualification"
  | "package-select"
  | "booking"
  | "call-confirmed"
  | "checkout";

export interface FunnelData {
  leadId: string | null;
  firstName: string;
  businessName: string;
  email: string;
  phone: string;
  opportunityType?: OpportunityType;
  websiteStatus?: WebsiteStatus;
  projectTimeline?: ProjectTimeline;
  preferredNextStep?: PreferredNextStep;
  selectedPackageId?: string;
  priceAwareness?: PriceAwareness;
  paymentReadiness?: PaymentReadiness;
  paymentPreference?: PaymentPreference;
  callPreferredDate?: string;
  callPreferredTime?: string;
  callNotes?: string;
}

const initialData: FunnelData = {
  leadId: null,
  firstName: "",
  businessName: "",
  email: "",
  phone: "",
};

interface FunnelContextValue {
  step: FunnelStep;
  data: FunnelData;
  attribution: Attribution;
  openFullFunnel: () => void;
  openCheckout: (packageId: string) => void;
  closeFunnel: () => void;
  goTo: (step: FunnelStep) => void;
  updateData: (patch: Partial<FunnelData>) => void;
  reset: () => void;
}

const FunnelContext = createContext<FunnelContextValue | undefined>(undefined);

function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  return {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    referrer: document.referrer || undefined,
    landingPage: window.location.pathname,
  };
}

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<FunnelStep>(null);
  const [data, setData] = useState<FunnelData>(initialData);
  const [attribution] = useState<Attribution>(() => readAttribution());

  const value = useMemo<FunnelContextValue>(
    () => ({
      step,
      data,
      attribution,
      openFullFunnel: () => setStep(data.leadId ? "qualification" : "lead"),
      openCheckout: (packageId: string) => {
        setData((current) => ({ ...current, selectedPackageId: packageId }));
        setStep("checkout");
      },
      closeFunnel: () => setStep(null),
      goTo: (next: FunnelStep) => setStep(next),
      updateData: (patch: Partial<FunnelData>) =>
        setData((current) => ({ ...current, ...patch })),
      reset: () => {
        setData(initialData);
        setStep(null);
      },
    }),
    [step, data, attribution]
  );

  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
}

export function useFunnel() {
  const context = useContext(FunnelContext);
  if (!context) throw new Error("useFunnel must be used within FunnelProvider");
  return context;
}
