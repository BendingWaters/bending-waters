import "server-only";
import { createHash } from "crypto";

const PIXEL_ID = "1405734561651026";
const API_VERSION = "v21.0";

function hash(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function hashPhone(value: string) {
  return hash(value.replace(/[^\d]/g, ""));
}

export type MetaClientContext = {
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
};

export function getMetaClientContext(request: Request): MetaClientContext {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );

  return {
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: request.headers.get("user-agent") ?? undefined,
    fbp: cookies["_fbp"],
    fbc: cookies["_fbc"],
  };
}

export async function sendMetaConversionEvent(input: {
  eventName: "Lead" | "Purchase";
  eventId: string;
  eventSourceUrl: string;
  email?: string;
  phone?: string;
  client?: MetaClientContext;
  customData?: Record<string, unknown>;
}) {
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;

  if (!accessToken) {
    console.debug(`[meta-capi] Skipped ${input.eventName} (${input.eventId}): no access token configured`);
    return;
  }

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: {
          em: input.email ? [hash(input.email)] : undefined,
          ph: input.phone ? [hashPhone(input.phone)] : undefined,
          client_ip_address: input.client?.ip,
          client_user_agent: input.client?.userAgent,
          fbp: input.client?.fbp,
          fbc: input.client?.fbc,
        },
        custom_data: input.customData,
      },
    ],
    // Set META_CONVERSIONS_API_TEST_EVENT_CODE (Events Manager -> Test Events tab) to route
    // events there for verification. They won't count toward ad reporting while it's set,
    // so remove it once you've confirmed events are landing correctly.
    ...(process.env.META_CONVERSIONS_API_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CONVERSIONS_API_TEST_EVENT_CODE }
      : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.error(`[meta-capi] ${input.eventName} request failed:`, await response.text());
    }
  } catch (error) {
    console.error(`[meta-capi] ${input.eventName} request error:`, error);
  }
}
