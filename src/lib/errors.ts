export type AppErrorCategory =
  | "validation"
  | "authentication"
  | "authorization"
  | "not_found"
  | "conflict"
  | "rate_limit"
  | "infrastructure";

export type AppErrorOptions = {
  cause?: unknown;
  clientCode?: string;
  context?: Record<string, unknown>;
  publicMessageKey?: string;
};

const defaultMessageKeys: Record<AppErrorCategory, string> = {
  authentication: "errors.authentication",
  authorization: "errors.authorization",
  conflict: "errors.conflict",
  infrastructure: "errors.infrastructure",
  not_found: "errors.notFound",
  rate_limit: "errors.rateLimit",
  validation: "errors.validation",
};

const defaultStatuses: Record<AppErrorCategory, number> = {
  authentication: 401,
  authorization: 403,
  conflict: 409,
  infrastructure: 500,
  not_found: 404,
  rate_limit: 429,
  validation: 400,
};

const defaultPublicCodes: Record<AppErrorCategory, string> = {
  authentication: "AUTHENTICATION_ERROR",
  authorization: "AUTHORIZATION_ERROR",
  conflict: "CONFLICT_ERROR",
  infrastructure: "INFRASTRUCTURE_ERROR",
  not_found: "NOT_FOUND",
  rate_limit: "RATE_LIMIT_ERROR",
  validation: "VALIDATION_ERROR",
};

export class AppError extends Error {
  readonly category: AppErrorCategory;
  readonly clientCode?: string;
  readonly context?: Record<string, unknown>;
  readonly publicMessageKey: string;
  readonly statusCode: number;

  constructor(
    category: AppErrorCategory,
    message: string,
    options: AppErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = new.target.name;
    this.category = category;
    this.clientCode = options.clientCode;
    this.context = options.context;
    this.publicMessageKey =
      options.publicMessageKey ?? defaultMessageKeys[category];
    this.statusCode = defaultStatuses[category];
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed.", options?: AppErrorOptions) {
    super("validation", message, options);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed.", options?: AppErrorOptions) {
    super("authentication", message, options);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Authorization failed.", options?: AppErrorOptions) {
    super("authorization", message, options);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource was not found.", options?: AppErrorOptions) {
    super("not_found", message, options);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict.", options?: AppErrorOptions) {
    super("conflict", message, options);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded.", options?: AppErrorOptions) {
    super("rate_limit", message, options);
  }
}

export class InfrastructureError extends AppError {
  constructor(message = "Infrastructure failure.", options?: AppErrorOptions) {
    super("infrastructure", message, options);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export type PublicError = {
  category: AppErrorCategory;
  code: string;
  messageKey: string;
  requestId: string;
  statusCode: number;
};

export function toPublicError(error: unknown, requestId: string): PublicError {
  if (isAppError(error)) {
    return {
      category: error.category,
      code: error.clientCode ?? defaultPublicCodes[error.category],
      messageKey: error.publicMessageKey,
      requestId,
      statusCode: error.statusCode,
    };
  }

  return {
    category: "infrastructure",
    code: "INFRASTRUCTURE_ERROR",
    messageKey: defaultMessageKeys.infrastructure,
    requestId,
    statusCode: defaultStatuses.infrastructure,
  };
}
