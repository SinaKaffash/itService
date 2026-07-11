import { randomUUID } from "node:crypto";

import {
  AuthenticationError,
  AuthorizationError,
  InfrastructureError,
  RateLimitError,
  ValidationError,
  isAppError,
  toPublicError,
} from "@/lib/errors";
import { logger, type LogContext } from "@/lib/logger";

export type ActionFailure<TCode extends string> = {
  success: false;
  code: TCode;
  requestId: string;
};

export type ActionContext = Required<Pick<LogContext, "action" | "requestId">> &
  LogContext;

export function createActionContext(context: Omit<ActionContext, "requestId">) {
  return {
    ...context,
    requestId: randomUUID(),
  };
}

function fallbackCodeFor(error: unknown) {
  if (error instanceof ValidationError) return "VALIDATION_ERROR";
  if (error instanceof AuthenticationError) return "UNAUTHORIZED";
  if (error instanceof AuthorizationError) return "FORBIDDEN";
  if (error instanceof RateLimitError) return "RATE_LIMITED";
  if (error instanceof InfrastructureError) return "SERVER_ERROR";
  if (isAppError(error)) return error.clientCode ?? error.category.toUpperCase();
  return "SERVER_ERROR";
}

export function mapErrorToActionCode<TCode extends string>(
  error: unknown,
  allowedCodes: readonly TCode[],
  fallbackCode: TCode,
): TCode {
  const candidate = fallbackCodeFor(error);
  return allowedCodes.includes(candidate as TCode)
    ? (candidate as TCode)
    : fallbackCode;
}

export function actionFailure<TCode extends string>(
  code: TCode,
  context: Pick<ActionContext, "requestId">,
): ActionFailure<TCode> {
  return { success: false, code, requestId: context.requestId };
}

export function handleActionError<TCode extends string>(
  error: unknown,
  context: ActionContext,
  allowedCodes: readonly TCode[],
  fallbackCode: TCode,
): ActionFailure<TCode> {
  const code = mapErrorToActionCode(error, allowedCodes, fallbackCode);
  const publicError = toPublicError(error, context.requestId);
  const level = isAppError(error) && error.statusCode < 500 ? "warn" : "error";

  logger[level]("Server action failed", {
    ...context,
    error,
    metadata: {
      ...context.metadata,
      publicError,
    },
  });

  return actionFailure(code, context);
}
