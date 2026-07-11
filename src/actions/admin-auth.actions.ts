"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AdminLoginValues } from "@/features/auth/admin-login.schema";
import { adminLoginSchema } from "@/features/auth/admin-login.schema";
import {
  actionFailure,
  createActionContext,
  handleActionError,
} from "@/lib/action-errors";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";
import { getServerEnv } from "@/lib/env.server";
import { logger } from "@/lib/logger";
import { adminAuthService } from "@/services/admin-auth.service";

export type AdminLoginResult =
  | { success: true }
  | {
      success: false;
      code: "INVALID_CREDENTIALS" | "SERVER_ERROR" | "VALIDATION_ERROR";
      requestId: string;
    };

const adminLoginErrorCodes = [
  "INVALID_CREDENTIALS",
  "SERVER_ERROR",
  "VALIDATION_ERROR",
] as const;

export async function loginAdminAction(
  input: AdminLoginValues,
): Promise<AdminLoginResult> {
  const context = createActionContext({ action: "adminAuth.login" });
  const parsed = adminLoginSchema.safeParse(input);

  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }

  try {
    const session = await adminAuthService.login(
      parsed.data.identifier,
      parsed.data.password,
    );

    if (!session) {
      return actionFailure("INVALID_CREDENTIALS", context);
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: getServerEnv().NODE_ENV === "production",
      path: "/",
      priority: "high",
      expires: session.expiresAt,
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    return { success: true };
  } catch (error) {
    return handleActionError(
      error,
      context,
      adminLoginErrorCodes,
      "SERVER_ERROR",
    );
  }
}

export async function logoutAdminAction(locale: string): Promise<never> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    try {
      await adminAuthService.logout(token);
    } catch (error) {
      logger.error("Admin logout failed", {
        action: "adminAuth.logout",
        error,
      });
    }
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect(`/${locale === "en" ? "en" : "fa"}/admin/login`);
}
