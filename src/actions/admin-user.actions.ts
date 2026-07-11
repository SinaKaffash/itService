"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminUserFormValues } from "@/features/admin/users.schema";
import { adminUserSchema } from "@/features/admin/users.schema";
import {
  actionFailure,
  createActionContext,
  handleActionError,
} from "@/lib/action-errors";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { ConflictError } from "@/lib/errors";
import { adminUserService } from "@/services/admin-user.service";

export type AdminUserActionResult =
  | { success: true; id?: string }
  | {
      success: false;
      code:
        | "DUPLICATE"
        | "FORBIDDEN"
        | "LAST_SUPER_ADMIN"
        | "NOT_FOUND"
        | "SERVER_ERROR"
        | "UNAUTHORIZED"
        | "VALIDATION_ERROR";
      requestId: string;
    };

const adminUserErrorCodes = [
  "DUPLICATE",
  "FORBIDDEN",
  "LAST_SUPER_ADMIN",
  "NOT_FOUND",
  "SERVER_ERROR",
  "UNAUTHORIZED",
  "VALIDATION_ERROR",
] as const;

const idSchema = z.object({
  id: z.string().min(1),
  locale: z.enum(["fa", "en"]),
});

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function revalidateAdminUsers(locale: "fa" | "en") {
  revalidatePath(`/${locale}/admin/users`);
}

function normalizeAdminUserError(error: unknown) {
  if (isUniqueConstraintError(error)) {
    return new ConflictError("Admin user email or username already exists.", {
      clientCode: "DUPLICATE",
    });
  }

  return error;
}

export async function saveAdminUserAction(
  input: AdminUserFormValues & { locale: "fa" | "en" },
): Promise<AdminUserActionResult> {
  const context = createActionContext({
    action: "adminUser.save",
    entityId: input.id,
    entityType: "AdminUser",
  });
  const parsed = adminUserSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return actionFailure("UNAUTHORIZED", context);
  }
  context.actorId = admin.id;
  if (admin.role !== "SUPER_ADMIN") {
    return actionFailure("FORBIDDEN", context);
  }

  try {
    if (parsed.data.id) {
      const updated = await adminUserService.update({
        ...parsed.data,
        id: parsed.data.id,
      });
      revalidateAdminUsers(input.locale);
      return { success: true, id: updated.id };
    }

    const created = await adminUserService.create({
      ...parsed.data,
      password: parsed.data.password ?? "",
    });
    revalidateAdminUsers(input.locale);
    return { success: true, id: created.id };
  } catch (error) {
    return handleActionError(
      normalizeAdminUserError(error),
      context,
      adminUserErrorCodes,
      "SERVER_ERROR",
    );
  }
}

export async function deactivateAdminUserAction(input: {
  id: string;
  locale: "fa" | "en";
}): Promise<AdminUserActionResult> {
  const context = createActionContext({
    action: "adminUser.deactivate",
    entityId: input.id,
    entityType: "AdminUser",
  });
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return actionFailure("UNAUTHORIZED", context);
  }
  context.actorId = admin.id;
  if (admin.role !== "SUPER_ADMIN") {
    return actionFailure("FORBIDDEN", context);
  }

  try {
    const users = await adminUserService.list();
    const target = users.find((user) => user.id === parsed.data.id);
    if (!target) {
      return actionFailure("NOT_FOUND", context);
    }

    await adminUserService.update({
      id: target.id,
      email: target.email,
      username: target.username,
      name: target.name,
      role: target.role,
      isActive: false,
    });
    revalidateAdminUsers(parsed.data.locale);
    return { success: true };
  } catch (error) {
    return handleActionError(
      normalizeAdminUserError(error),
      context,
      adminUserErrorCodes,
      "SERVER_ERROR",
    );
  }
}
