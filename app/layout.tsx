import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins, Jost, Sora, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import MetaPixel from "@/components/MetaPixel";
import Providers from "@/components/Providers";
import { SanityLive } from "@/sanity/lib/live";

const bierika = localFont({
  src: "./fonts/bierika.otf",
  variable: "--font-bierika-custom",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
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
        className={`${bierika.variable} ${poppins.variable} ${jost.variable} ${sora.variable} ${playfairDisplay.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
          <SmoothScroll />
        </Providers>
        <SanityLive />
        <MetaPixel />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_GOOGLE_ANALYTICS_ID!} />
    </html>
  );
}
