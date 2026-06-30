import type { ReactNode } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketHero from "@/components/MarketHero";
import MarketServiceSection from "./MarketServiceSection";
import MarketFeaturePanel from "./MarketFeaturePanel";
import { marketPages, type MarketPageKey } from "@/constants/market-pages";

type MarketPageSlots = {
  afterHero?: ReactNode;
  beforeServices?: ReactNode;
  afterServices?: ReactNode;
  beforeFeaturePanel?: ReactNode;
  afterFeaturePanel?: ReactNode;
  beforeFooter?: ReactNode;
};

type MarketPageProps = {
  page: MarketPageKey;
  slots?: MarketPageSlots;
};

export default function MarketPage({ page, slots }: MarketPageProps) {
  const data = marketPages[page];

  return (
    <main>
      <Header />

      <MarketHero
        badgeText={data.badgeText}
        eyebrow={data.eyebrow}
        title={data.title}
        description={data.description}
        ctaText={data.ctaText}
      />

      {slots?.afterHero}

      {slots?.beforeServices}

      <MarketServiceSection
        title={data.servicesTitle}
        accent={data.servicesAccent}
        services={data.services}
        ctaText={data.ctaText}
        theme={data.theme}
      />

      {slots?.afterServices}

      {slots?.beforeFeaturePanel}

      <MarketFeaturePanel
        eyebrow={data.eyebrow}
        title={data.featureTitle}
        description={data.featureDescription}
        features={data.features}
        ctaText={data.ctaText}
        theme={data.theme}
      />

      {slots?.afterFeaturePanel}

      {slots?.beforeFooter}

      <Footer />
    </main>
  );
}
