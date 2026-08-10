import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { LAUNCH_PORTFOLIO_QUERY } from "@/sanity/lib/queries";
import LaunchExperience from "./_components/LaunchExperience";
import type { PortfolioProject } from "./_lib/types";

export const revalidate = 60;

const TITLE = "BendingWaters — Get Your Business Website Ready in 7 Days";
const DESCRIPTION =
  "Launch a professional, institutional-ready business website in seven days with BendingWaters. Built for founders preparing for investors, grants, partnerships and growth.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "business website design",
    "professional business website",
    "investor-ready website",
    "grant-ready website",
    "website for startups",
    "website for Nigerian businesses",
    "website development for SMEs",
    "corporate website design",
    "business website development",
  ],
  alternates: { canonical: "/websitein7days" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/websitein7days",
    siteName: "BendingWaters",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function SevenDayLaunchPage() {
  const projects = await client.fetch<PortfolioProject[]>(LAUNCH_PORTFOLIO_QUERY);

  return <LaunchExperience projects={projects} />;
}
