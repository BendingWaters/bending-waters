import "server-only";

import { createClient } from "@sanity/client";

export const sanityAdminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01",
  token: process.env.NEXT_SANITY_API_TOKEN!,
  useCdn: false,
});
