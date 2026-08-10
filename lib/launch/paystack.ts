import "server-only";
import crypto from "crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;

  if (!key || key.includes("REPLACE_ME")) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured. Add a real key to .env.local."
    );
  }

  return key;
}

interface InitializeTransactionInput {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(input: InitializeTransactionInput) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amountNaira * 100),
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const result = (await response.json()) as PaystackInitializeResponse;

  if (!response.ok || !result.status || !result.data) {
    throw new Error(result.message || "Failed to initialize Paystack transaction");
  }

  return result.data;
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    gateway_response: string;
    customer: { email: string };
    metadata?: Record<string, unknown>;
  };
}

export async function verifyTransaction(reference: string) {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
      cache: "no-store",
    }
  );

  const result = (await response.json()) as PaystackVerifyResponse;

  if (!response.ok || !result.status || !result.data) {
    throw new Error(result.message || "Failed to verify Paystack transaction");
  }

  return result.data;
}

export function isValidPaystackSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;

  const hash = crypto
    .createHmac("sha512", getSecretKey())
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}
