import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface PortfolioProject {
  _id: string;
  title: string;
  category: string;
  slug: { current: string };
  mainImage: SanityImageSource | null;
  description: string | null;
}
