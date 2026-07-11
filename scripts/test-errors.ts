import assert from "node:assert/strict";

import {
  ConflictError,
  InfrastructureError,
  ValidationError,
  toPublicError,
} from "../src/lib/errors";
import { redactionForTests } from "../src/lib/logger";
import { mapErrorToActionCode } from "../src/lib/action-errors";

const requestId = "req_test_123";
const secretMessage =
  "database password leaked with session token and private file URL";
const publicError = toPublicError(
  new InfrastructureError(secretMessage, {
    context: {
      password: "super-secret-password",
      sessionToken: "session-token",
    },
  }),
  requestId,
);

assert.equal(publicError.requestId, requestId);
assert.equal(publicError.code, "INFRASTRUCTURE_ERROR");
assert.equal(publicError.messageKey, "errors.infrastructure");
assert.equal(JSON.stringify(publicError).includes(secretMessage), false);
assert.equal(JSON.stringify(publicError).includes("super-secret-password"), false);
assert.equal(JSON.stringify(publicError).includes("session-token"), false);

assert.equal(
  mapErrorToActionCode(
    new ValidationError("Zod details should stay server-side."),
    ["VALIDATION_ERROR", "SERVER_ERROR"] as const,
    "SERVER_ERROR",
  ),
  "VALIDATION_ERROR",
);

assert.equal(
  mapErrorToActionCode(
    new ConflictError("Slug already exists.", { clientCode: "SLUG_EXISTS" }),
    ["SLUG_EXISTS", "SERVER_ERROR"] as const,
    "SERVER_ERROR",
  ),
  "SLUG_EXISTS",
);

const sanitized = redactionForTests.sanitizeValue({
  action: "submitLead",
  actorId: "admin_123",
  metadata: {
    description: "confidential project details",
    email: "client@example.com",
    password: "plain-text-password",
    safeCount: 2,
    sessionToken: "token",
  },
});

const serialized = JSON.stringify(sanitized);
assert.equal(serialized.includes("confidential project details"), false);
assert.equal(serialized.includes("client@example.com"), false);
assert.equal(serialized.includes("plain-text-password"), false);
assert.equal(serialized.includes("token"), false);
assert.equal(serialized.includes("\"safeCount\":2"), true);

console.log("Error mapping and redaction tests passed.");
