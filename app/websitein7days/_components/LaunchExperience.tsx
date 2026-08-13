"use client";

import { FunnelProvider } from "../_funnel/FunnelProvider";
import FunnelModal from "../_funnel/FunnelModal";
import AnnouncementBar from "./AnnouncementBar";
import LaunchNav from "./LaunchNav";
import Hero from "./Hero";
import Problem from "./Problem";
import ApplicationStory from "./ApplicationStory";
import Transformation from "./Transformation";
import Features from "./Features";
import Process from "./Process";
import InformationArchitecture from "./InformationArchitecture";
import Portfolio from "./Portfolio";
import SocialProof from "./SocialProof";
import Packages from "./Packages";
import WhyNow from "./WhyNow";
import Faq from "./Faq";
import FinalCta from "./FinalCta";
import LaunchFooter from "./LaunchFooter";
import StickyMobileCta from "./StickyMobileCta";
import type { PortfolioProject } from "../_lib/types";

export default function LaunchExperience({ projects }: { projects: PortfolioProject[] }) {
  return (
    <FunnelProvider>
      <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0">
        <AnnouncementBar />
        <LaunchNav />

        <main>
          <Hero />
          <Problem />
          <ApplicationStory />
          <Transformation />
          <Features />
          <Process />
          <InformationArchitecture />
          <Portfolio projects={projects} />
          {/* <SocialProof /> */}
          <Packages />
          <WhyNow />
          <Faq />
          <FinalCta />
        </main>

        <LaunchFooter />
        <StickyMobileCta />
      </div>

      <FunnelModal />
    </FunnelProvider>
  );
}
