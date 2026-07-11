import assert from "node:assert/strict";

import {
  EnvConfigError,
  parsePublicEnv,
  parseSeedEnv,
  parseServerEnv,
} from "../src/lib/env.schema";

const baseEnv = {
  ADMIN_EMAIL: "Admin@Example.com",
  ADMIN_JWT_SECRET: "x".repeat(48),
  ADMIN_NAME: "Site Administrator",
  ADMIN_PASSWORD: "a-strong-admin-password",
  ADMIN_USERNAME: "nexus-admin",
  DATABASE_URL:
    "postgresql://it_services_app:password@localhost:5432/it_services?schema=public",
  NEXT_PUBLIC_APP_URL: "https://example.com/",
  NODE_ENV: "production",
} satisfies NodeJS.ProcessEnv;

function assertConfigError(callback: () => unknown, expectedIssue: string) {
  assert.throws(
    callback,
    (error) =>
      error instanceof EnvConfigError &&
      error.issues.some((issue) => issue.includes(expectedIssue)),
  );
}

const serverEnv = parseServerEnv(baseEnv);
assert.equal(serverEnv.ADMIN_JWT_SECRET, baseEnv.ADMIN_JWT_SECRET);
assert.equal(serverEnv.DATABASE_URL, baseEnv.DATABASE_URL);
assert.equal(serverEnv.NODE_ENV, "production");

const publicEnv = parsePublicEnv(baseEnv);
assert.deepEqual(publicEnv, { NEXT_PUBLIC_APP_URL: "https://example.com" });
assert.equal("DATABASE_URL" in publicEnv, false);
assert.equal("ADMIN_JWT_SECRET" in publicEnv, false);

const legacyPublicEnv = parsePublicEnv({
  NEXT_PUBLIC_SITE_URL: "https://legacy.example.com/",
});
assert.equal(legacyPublicEnv.NEXT_PUBLIC_APP_URL, "https://legacy.example.com");

const seedEnv = parseSeedEnv(baseEnv);
assert.equal(seedEnv.ADMIN_EMAIL, "admin@example.com");
assert.equal(seedEnv.ADMIN_USERNAME, "nexus-admin");

assertConfigError(
  () => parseServerEnv({ ...baseEnv, ADMIN_JWT_SECRET: "short" }),
  "ADMIN_JWT_SECRET",
);
assertConfigError(
  () => parseServerEnv({ ...baseEnv, DATABASE_URL: "mysql://localhost/db" }),
  "DATABASE_URL",
);
assertConfigError(
  () => parsePublicEnv({ NEXT_PUBLIC_APP_URL: "not-a-url" }),
  "NEXT_PUBLIC_APP_URL",
);
assertConfigError(
  () => parsePublicEnv({}),
  "NEXT_PUBLIC_APP_URL",
);
assertConfigError(
  () => parseSeedEnv({ ...baseEnv, ADMIN_PASSWORD: "too-short" }),
  "ADMIN_PASSWORD",
);

console.log("Environment validation tests passed.");
