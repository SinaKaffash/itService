import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { getServerEnv } from "@/lib/env.server";

import { ADMIN_SESSION_AUDIENCE, ADMIN_SESSION_ISSUER } from "./constants";

const JWT_ALGORITHM = "HS256";
const JWT_TYPE = "JWT";
const ADMIN_SESSION_TYPE = "admin-session";

type JwtHeader = {
  alg: typeof JWT_ALGORITHM;
  typ: typeof JWT_TYPE;
};

export type AdminJwtPayload = {
  aud: typeof ADMIN_SESSION_AUDIENCE;
  email: string;
  exp: number;
  iat: number;
  iss: typeof ADMIN_SESSION_ISSUER;
  jti: string;
  name: string;
  nbf: number;
  sub: string;
  typ: typeof ADMIN_SESSION_TYPE;
};

type AdminJwtInput = {
  email: string;
  expiresInSeconds: number;
  name: string;
  userId: string;
};

function getAdminJwtSecret() {
  return getServerEnv().ADMIN_JWT_SECRET;
}

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signJwtPart(value: string) {
  return createHmac("sha256", getAdminJwtSecret())
    .update(value)
    .digest("base64url");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAdminPayload(value: unknown): AdminJwtPayload | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    aud,
    email,
    exp,
    iat,
    iss,
    jti,
    name,
    nbf,
    sub,
    typ,
  } = value;

  if (
    aud !== ADMIN_SESSION_AUDIENCE ||
    iss !== ADMIN_SESSION_ISSUER ||
    typ !== ADMIN_SESSION_TYPE ||
    typeof email !== "string" ||
    typeof exp !== "number" ||
    typeof iat !== "number" ||
    typeof jti !== "string" ||
    typeof name !== "string" ||
    typeof nbf !== "number" ||
    typeof sub !== "string"
  ) {
    return null;
  }

  return { aud, email, exp, iat, iss, jti, name, nbf, sub, typ };
}

export function createAdminJwt({
  email,
  expiresInSeconds,
  name,
  userId,
}: AdminJwtInput) {
  const now = Math.floor(Date.now() / 1000);
  const header: JwtHeader = { alg: JWT_ALGORITHM, typ: JWT_TYPE };
  const payload: AdminJwtPayload = {
    aud: ADMIN_SESSION_AUDIENCE,
    email,
    exp: now + expiresInSeconds,
    iat: now,
    iss: ADMIN_SESSION_ISSUER,
    jti: randomBytes(32).toString("base64url"),
    name,
    nbf: now,
    sub: userId,
    typ: ADMIN_SESSION_TYPE,
  };
  const body = [
    base64UrlEncode(JSON.stringify(header)),
    base64UrlEncode(JSON.stringify(payload)),
  ].join(".");
  const signature = signJwtPart(body);

  return {
    expiresAt: new Date(payload.exp * 1000),
    jti: payload.jti,
    token: `${body}.${signature}`,
  };
}

export function decodeAdminJwt(token: string): AdminJwtPayload | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return parseAdminPayload(JSON.parse(base64UrlDecode(payload)));
  } catch {
    return null;
  }
}

export function verifyAdminJwt(token: string): AdminJwtPayload | null {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  let header: unknown;
  let payload: AdminJwtPayload | null;

  try {
    header = JSON.parse(base64UrlDecode(encodedHeader));
    payload = parseAdminPayload(JSON.parse(base64UrlDecode(encodedPayload)));
  } catch {
    return null;
  }

  if (
    !isRecord(header) ||
    header.alg !== JWT_ALGORITHM ||
    header.typ !== JWT_TYPE ||
    !payload
  ) {
    return null;
  }

  const expectedSignature = signJwtPart(`${encodedHeader}.${encodedPayload}`);
  const signatureBuffer = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);

  if (payload.nbf > now || payload.exp <= now || payload.iat > now + 60) {
    return null;
  }

  return payload;
}
