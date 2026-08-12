import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Script from "next/script";

import SmoothScroll from "@/components/SmoothScroll";
import Providers from "@/components/Providers";
import { SanityLive } from "@/sanity/lib/live";

const bierika = localFont({
  src: "./fonts/bierika.otf",
  variable: "--font-bierika-custom",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bendingwaters.africa"),
  title:
    "BendingWaters - We build strategic growth infrastructure for real business outcomes",
  description: "",
  openGraph: {
    title:
      "BendingWaters - We build strategic growth infrastructure for real business outcomes",
    description: "",
    url: "https://www.bendingwaters.africa",
    siteName: "BendingWaters",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BendingWaters",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bierika.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
          <SmoothScroll />
        </Providers>
        <SanityLive />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_GOOGLE_ANALYTICS_ID!} />
    </html>
  );
}
