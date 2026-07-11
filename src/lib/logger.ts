import { isAppError } from "@/lib/errors";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = {
  action?: string;
  actorId?: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, unknown>;
  requestId?: string;
};

export interface Logger {
  debug(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext & { error?: unknown }): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext & { error?: unknown }): void;
}

const sensitiveKeyPattern =
  /password|token|secret|session|authorization|cookie|private.*url|file.*url|description|content|message|phone|email|fullName|company/i;

function sanitizeValue(value: unknown): unknown {
  if (value instanceof Error) {
    return sanitizeError(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sensitiveKeyPattern.test(key) ? "[REDACTED]" : sanitizeValue(nestedValue),
      ]),
    );
  }

  return value;
}

function sanitizeError(error: Error) {
  return {
    category: isAppError(error) ? error.category : undefined,
    clientCode: isAppError(error) ? error.clientCode : undefined,
    message: error.message,
    name: error.name,
    stack: error.stack,
  };
}

function sanitizeContext(context: (LogContext & { error?: unknown }) | undefined) {
  if (!context) return undefined;

  return sanitizeValue(context);
}

class ConsoleLogger implements Logger {
  debug(message: string, context?: LogContext) {
    this.write("debug", message, context);
  }

  info(message: string, context?: LogContext) {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext & { error?: unknown }) {
    this.write("warn", message, context);
  }

  error(message: string, context?: LogContext & { error?: unknown }) {
    this.write("error", message, context);
  }

  private write(
    level: LogLevel,
    message: string,
    context?: LogContext & { error?: unknown },
  ) {
    const entry = {
      context: sanitizeContext(context),
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    const output = JSON.stringify(entry);

    if (level === "error") {
      console.error(output);
      return;
    }

    if (level === "warn") {
      console.warn(output);
      return;
    }

    if (level === "debug") {
      console.debug(output);
      return;
    }

    console.info(output);
  }
}

export const logger: Logger = new ConsoleLogger();
export const redactionForTests = { sanitizeValue };
