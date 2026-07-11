"use server";

import type { LeadRequestFormValues } from "@/features/requests/lead-request.schema";
import { leadRequestSchema } from "@/features/requests/lead-request.schema";
import {
  actionFailure,
  createActionContext,
  handleActionError,
} from "@/lib/action-errors";
import { submitLeadRequestService } from "@/services/submit-lead-request.service";

export type LeadRequestActionResult =
  | { success: true }
  | {
      success: false;
      code: "VALIDATION_ERROR" | "SUBMISSION_ERROR";
      requestId: string;
    };

const leadRequestErrorCodes = [
  "VALIDATION_ERROR",
  "SUBMISSION_ERROR",
] as const;

export async function submitLeadRequestAction(
  input: LeadRequestFormValues,
): Promise<LeadRequestActionResult> {
  const context = createActionContext({ action: "leadRequest.submit" });
  const parsed = leadRequestSchema.safeParse(input);

  if (!parsed.success) {
    return actionFailure("VALIDATION_ERROR", context);
  }

  try {
    await submitLeadRequestService.execute(parsed.data);
    return { success: true };
  } catch (error) {
    return handleActionError(
      error,
      context,
      leadRequestErrorCodes,
      "SUBMISSION_ERROR",
    );
  }
}
