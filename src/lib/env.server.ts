import {
  parsePublicEnv,
  parseServerEnv,
  type PublicEnv,
  type ServerEnv,
} from "@/lib/env.schema";

let cachedPublicEnv: PublicEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;

export function getPublicEnv() {
  cachedPublicEnv ??= parsePublicEnv({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
  return cachedPublicEnv;
}

export function getServerEnv() {
  cachedServerEnv ??= parseServerEnv(process.env);
  return cachedServerEnv;
}

export function validateServerStartupEnv() {
  getServerEnv();
  getPublicEnv();
}
