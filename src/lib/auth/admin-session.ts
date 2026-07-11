import "server-only";

import { cookies } from "next/headers";

import type { AdminIdentity } from "@/core/admin-auth";
import { logger } from "@/lib/logger";
import { adminAuthService } from "@/services/admin-auth.service";

import { ADMIN_SESSION_COOKIE } from "./constants";

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await adminAuthService.getSession(token);
  } catch (error) {
    logger.warn("Admin session validation failed", {
      action: "adminAuth.validateSession",
      error,
    });
    return null;
  }
}
