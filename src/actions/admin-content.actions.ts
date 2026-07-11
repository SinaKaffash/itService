"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import type { ContentEntityType } from "@/core/admin-content";
import { contentEntityTypes } from "@/core/admin-content";
import {
  adminContentSchema,
  type AdminContentFormValues,
} from "@/features/admin/content.schema";
import {
  actionFailure,
  createActionContext,
  handleActionError,
} from "@/lib/action-errors";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { adminContentService } from "@/services/admin-content.service";

export type AdminContentActionResult =
  | { success: true; id?: string }
  | {
      success: false;
      code:
        | "UNAUTHORIZED"
        | "VALIDATION_ERROR"
        | "SLUG_EXISTS"
        | "NOT_FOUND"
        | "SERVER_ERROR";
      requestId: string;
    };

const adminContentErrorCodes = [
  "UNAUTHORIZED",
  "VALIDATION_ERROR",
  "SLUG_EXISTS",
  "NOT_FOUND",
  "SERVER_ERROR",
] as const;

const deleteSchema = z.object({
  entity: z.enum(contentEntityTypes),
  id: z.string().min(1),
  locale: z.enum(["fa", "en"]),
});

const paths: Record<ContentEntityType, string> = {
  service: "services",
  portfolio: "portfolio",
  blog: "blog",
};

const cacheTags: Record<ContentEntityType, string> = {
  service: "public-services",
  portfolio: "public-portfolio",
  blog: "public-blog",
};

function revalidateContent(
  locale: "fa" | "en",
  entity: ContentEntityType,
  slug?: string,
) {
  revalidateTag("public-content");
  revalidateTag(cacheTags[entity]);
  revalidatePath(`/${locale}/admin/${paths[entity]}`);
  revalidatePath(`/${locale}/${paths[entity]}`);
  if (slug) {
    revalidatePath(`/${locale}/${paths[entity]}/${slug}`);
  }
}

export async function saveAdminContentAction(
  input: AdminContentFormValues & { locale: "fa" | "en" },
): Promise<AdminContentActionResult> {
  const context = createActionContext({
    action: "adminContent.save",
    entityId: input.id,
    entityType: input.entity,
  });
  const parsed = adminContentSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }
  const admin = await getCurrentAdmin();
  if (!admin) {
    return actionFailure("UNAUTHORIZED", context);
  }
  context.actorId = admin.id;

  try {
    if (parsed.data.id) {
      await adminContentService.update(parsed.data);
      revalidateContent(input.locale, parsed.data.entity, parsed.data.slug);
      return { success: true, id: parsed.data.id };
    }
    const created = await adminContentService.create(parsed.data);
    revalidateContent(input.locale, parsed.data.entity, parsed.data.slug);
    return { success: true, id: created.id };
  } catch (error) {
    return handleActionError(
      error,
      context,
      adminContentErrorCodes,
      "SERVER_ERROR",
    );
  }
}

export async function deleteAdminContentAction(input: {
  entity: ContentEntityType;
  id: string;
  locale: "fa" | "en";
}): Promise<AdminContentActionResult> {
  const context = createActionContext({
    action: "adminContent.delete",
    entityId: input.id,
    entityType: input.entity,
  });
  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }
  const admin = await getCurrentAdmin();
  if (!admin) {
    return actionFailure("UNAUTHORIZED", context);
  }
  context.actorId = admin.id;

  try {
    const existing = await adminContentService.get(
      parsed.data.entity,
      parsed.data.id,
    );
    await adminContentService.delete(parsed.data.entity, parsed.data.id);
    revalidateContent(
      parsed.data.locale,
      parsed.data.entity,
      existing?.slug,
    );
    return { success: true };
  } catch (error) {
    return handleActionError(
      error,
      context,
      adminContentErrorCodes,
      "SERVER_ERROR",
    );
  }
}
