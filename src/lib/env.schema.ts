import { z } from "zod";

export const adminJwtSecretSchema = z
  .string()
  .trim()
  .min(32, "ADMIN_JWT_SECRET must be at least 32 characters.");

const databaseUrl = z
  .string()
  .trim()
  .url("DATABASE_URL must be a valid PostgreSQL connection URL.")
  .refine(
    (value) =>
      value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "DATABASE_URL must use the postgresql:// or postgres:// scheme.",
  );

const publicUrl = z
  .string()
  .trim()
  .url("NEXT_PUBLIC_APP_URL must be a valid absolute URL.")
  .transform((value) => value.replace(/\/$/, ""));

export const serverEnvSchema = z.object({
  ADMIN_JWT_SECRET: adminJwtSecretSchema,
  DATABASE_URL: databaseUrl,
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_APP_URL: publicUrl.optional(),
    NEXT_PUBLIC_SITE_URL: publicUrl.optional(),
  })
  .transform((env, context) => {
    const appUrl = env.NEXT_PUBLIC_APP_URL ?? env.NEXT_PUBLIC_SITE_URL;

    if (!appUrl) {
      context.addIssue({
        code: "custom",
        message:
          "NEXT_PUBLIC_APP_URL is required. NEXT_PUBLIC_SITE_URL is accepted only as a legacy alias.",
        path: ["NEXT_PUBLIC_APP_URL"],
      });
      return z.NEVER;
    }

    return {
      NEXT_PUBLIC_APP_URL: appUrl,
    };
  });

export const seedEnvSchema = z.object({
  ADMIN_EMAIL: z
    .string()
    .trim()
    .toLowerCase()
    .email("ADMIN_EMAIL must be a valid email address."),
  ADMIN_NAME: z
    .string()
    .trim()
    .min(2, "ADMIN_NAME must be at least 2 characters."),
  ADMIN_PASSWORD: z
    .string()
    .min(12, "ADMIN_PASSWORD must contain at least 12 characters."),
  ADMIN_USERNAME: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9._-]{3,32}$/,
      "ADMIN_USERNAME must be 3-32 lowercase letters, numbers, dots, underscores, or hyphens.",
    ),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type SeedEnv = z.infer<typeof seedEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export class EnvConfigError extends Error {
  constructor(message: string, readonly issues: string[]) {
    super(message);
    this.name = "EnvConfigError";
  }
}

function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => {
    const field = issue.path.join(".") || "environment";
    return `${field}: ${issue.message}`;
  });
}

export function createEnvConfigError(scope: string, error: z.ZodError) {
  const issues = formatIssues(error);
  return new EnvConfigError(
    `${scope} environment configuration is invalid:\n${issues
      .map((issue) => `- ${issue}`)
      .join("\n")}`,
    issues,
  );
}

type EnvInput = Record<string, unknown>;

export function parsePublicEnv(input: EnvInput): PublicEnv {
  const parsed = publicEnvSchema.safeParse(input);

  if (!parsed.success) {
    throw createEnvConfigError("Public", parsed.error);
  }

  return parsed.data;
}

export function parseSeedEnv(input: EnvInput): SeedEnv {
  const parsed = seedEnvSchema.safeParse(input);

  if (!parsed.success) {
    throw createEnvConfigError("Seed", parsed.error);
  }

  return parsed.data;
}

export function parseServerEnv(input: EnvInput): ServerEnv {
  const parsed = serverEnvSchema.safeParse(input);

  if (!parsed.success) {
    throw createEnvConfigError("Server", parsed.error);
  }

  return parsed.data;
}
