"use server";

import { revalidatePath } from "next/cache";

import type { LeadStatus } from "@/core/admin-request";
import {
  archiveRequestSchema,
  updateRequestStatusSchema,
} from "@/features/requests/admin-request.schema";
import {
  actionFailure,
  createActionContext,
  handleActionError,
} from "@/lib/action-errors";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { adminRequestService } from "@/services/admin-request.service";

export type AdminRequestMutationResult =
  | { success: true }
  | {
      success: false;
      code: "UNAUTHORIZED" | "VALIDATION_ERROR" | "NOT_FOUND" | "SERVER_ERROR";
      requestId: string;
    };

const adminRequestErrorCodes = [
  "UNAUTHORIZED",
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "SERVER_ERROR",
] as const;

function revalidateAdminRequestPages(locale: "fa" | "en", id: string) {
  revalidatePath(`/${locale}/admin/dashboard`);
  revalidatePath(`/${locale}/admin/requests`);
  revalidatePath(`/${locale}/admin/requests/${id}`);
}

export async function updateRequestStatusAction(input: {
  id: string;
  locale: "fa" | "en";
  status: LeadStatus;
}): Promise<AdminRequestMutationResult> {
  const context = createActionContext({
    action: "adminRequest.updateStatus",
    entityId: input.id,
    entityType: "LeadRequest",
  });
  const parsed = updateRequestStatusSchema.safeParse(input);

  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return actionFailure("UNAUTHORIZED", context);
  }
  context.actorId = admin.id;

  try {
    await adminRequestService.updateStatus(
      parsed.data.id,
      parsed.data.status,
    );
    revalidateAdminRequestPages(parsed.data.locale, parsed.data.id);
    return { success: true };
  } catch (error) {
    return handleActionError(
      error,
      context,
      adminRequestErrorCodes,
      "SERVER_ERROR",
    );
  }
}

export async function archiveRequestAction(input: {
  id: string;
  locale: "fa" | "en";
}): Promise<AdminRequestMutationResult> {
  const context = createActionContext({
    action: "adminRequest.archive",
    entityId: input.id,
    entityType: "LeadRequest",
  });
  const parsed = archiveRequestSchema.safeParse(input);

  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return actionFailure("UNAUTHORIZED", context);
  }
  context.actorId = admin.id;

  try {
    await adminRequestService.archiveRequest(parsed.data.id);
    revalidateAdminRequestPages(parsed.data.locale, parsed.data.id);
    return { success: true };
  } catch (error) {
    return handleActionError(
      error,
      context,
      adminRequestErrorCodes,
      "SERVER_ERROR",
    );
  }
}
