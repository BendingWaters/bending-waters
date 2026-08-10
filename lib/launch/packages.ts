export interface LaunchPackage {
  id: string;
  tier: string;
  name: string;
  priceLabel: string;
  /** Fixed price in Naira. Every package here is a fixed-scope, fixed-price product. */
  price: number;
  deliveryLabel: string;
  badge?: string;
  description: string;
  includes: string[];
  footerNote: string;
  ctaLabel: string;
  /** "checkout" sends the visitor straight to Paystack. "talk" opens the lead-capture/qualification flow. */
  ctaAction: "checkout" | "talk";
}

export const LAUNCH_PACKAGES: LaunchPackage[] = [
  {
    id: "seven-day-launch",
    tier: "Starter",
    name: "Seven-Day Launch",
    priceLabel: "₦250,000",
    price: 250000,
    deliveryLabel: "7 Working Days",
    badge: "RECOMMENDED ANCHOR",
    description: "For founders who need a credible, checkable website quickly.",
    includes: [
      "5-page website design",
      "10 photographs sourced and optimised",
      "SSL certificate",
      "5 business email accounts set up",
      "Web control panel access",
      "Social media integration",
      "Mobile optimisation",
      "One revision round",
    ],
    footerNote: "Ideal when the deadline is already on the calendar.",
    ctaLabel: "Select This Package",
    ctaAction: "checkout",
  },
  {
    id: "depth-and-discovery",
    tier: "Standard",
    name: "Depth & Discovery",
    priceLabel: "₦300,000",
    price: 300000,
    deliveryLabel: "10 Working Days",
    description: "For businesses with more to show — services, team, proof and process.",
    includes: [
      "20-page website design",
      "50 photographs sourced and optimised",
      "SSL certificate",
      "10 business email accounts set up",
      "Unlimited email accounts supported",
      "Live chat integration",
      "Social media integration",
      "Mobile optimisation",
      "Basic search engine optimisation",
      "One revision round",
    ],
    footerNote: "Ideal when there is more to prove than one page.",
    ctaLabel: "Select This Package",
    ctaAction: "checkout",
  },
  {
    id: "institutional-ready",
    tier: "Business",
    name: "Institutional Ready",
    priceLabel: "₦500,000",
    price: 500000,
    deliveryLabel: "21 Working Days",
    description: "For companies being assessed — by funders, partners and procurement teams.",
    includes: [
      "Custom page structure, built to your narrative",
      "Custom photography and graphics",
      "Domain name registration",
      "SSL certificate",
      "Unlimited email accounts",
      "Content management system",
      "E-commerce shopping cart",
      "Web control panel access",
      "Live chat integration",
      "Social media integration",
      "Mobile optimisation",
      "Advanced search engine optimisation",
      "One year of support included",
      "Two revision rounds",
    ],
    footerNote: "Ideal when someone else's approval depends on it.",
    ctaLabel: "Select This Package",
    ctaAction: "checkout",
  },
  {
    id: "full-platform",
    tier: "Premium",
    name: "Full Platform",
    priceLabel: "₦1,000,000",
    price: 1000000,
    deliveryLabel: "30 Working Days",
    description: "For organisations whose website must carry the whole business.",
    includes: [
      "Unlimited pages",
      "Unlimited photographs and graphics",
      "Three design layouts — corporate, blog and news",
      "SSL certificate",
      "Unlimited email accounts",
      "Content management system",
      "E-commerce shopping cart",
      "Payment gateway integration",
      "Hit counter and auto-responder",
      "Web control panel access",
      "Live chat integration",
      "Social media integration",
      "Mobile optimisation",
      "Audio and video embedding",
      "Advanced search engine optimisation",
      "One year of support included",
      "Two revision rounds",
    ],
    footerNote: "Ideal when the website must carry the business.",
    ctaLabel: "Select This Package",
    ctaAction: "checkout",
  },
];

export function getLaunchPackage(id: string) {
  return LAUNCH_PACKAGES.find((pkg) => pkg.id === id);
}
