import { ADMIN_SESSION_AUDIENCE, ADMIN_SESSION_ISSUER } from "./constants";
import { adminJwtSecretSchema } from "@/lib/env.schema";

const JWT_ALGORITHM = "HS256";
const JWT_TYPE = "JWT";
const ADMIN_SESSION_TYPE = "admin-session";

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function constantTimeEquals(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
}

async function createSignature(data: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

function signatureToBytes(signature: string) {
  return Uint8Array.from(decodeBase64Url(signature), (char) => char.charCodeAt(0));
}

export async function isValidAdminJwtForMiddleware(token: string) {
  const secret = adminJwtSecretSchema.safeParse(process.env.ADMIN_JWT_SECRET);

  if (!secret.success) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const header = JSON.parse(decodeBase64Url(encodedHeader));
    const payload = JSON.parse(decodeBase64Url(encodedPayload));

    if (
      !isRecord(header) ||
      !isRecord(payload) ||
      header.alg !== JWT_ALGORITHM ||
      header.typ !== JWT_TYPE ||
      payload.aud !== ADMIN_SESSION_AUDIENCE ||
      payload.iss !== ADMIN_SESSION_ISSUER ||
      payload.typ !== ADMIN_SESSION_TYPE ||
      typeof payload.exp !== "number" ||
      typeof payload.iat !== "number" ||
      typeof payload.nbf !== "number" ||
      typeof payload.jti !== "string" ||
      typeof payload.sub !== "string"
    ) {
      return false;
    }

    const expectedSignature = await createSignature(
      `${encodedHeader}.${encodedPayload}`,
      secret.data,
    );
    const suppliedSignature = signatureToBytes(signature);

    if (!constantTimeEquals(suppliedSignature, expectedSignature)) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.nbf <= now && payload.exp > now && payload.iat <= now + 60;
  } catch {
    return false;
  }
}
