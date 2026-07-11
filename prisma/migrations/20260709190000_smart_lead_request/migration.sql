-- Align the lead record with the public smart-request contract.
ALTER TABLE "LeadRequest" RENAME COLUMN "name" TO "fullName";
ALTER TABLE "LeadRequest" RENAME COLUMN "message" TO "description";

ALTER TABLE "LeadRequest"
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "phone" SET NOT NULL,
  ADD COLUMN "serviceType" TEXT NOT NULL DEFAULT 'web-platforms';

ALTER TABLE "LeadRequest"
  ALTER COLUMN "serviceType" DROP DEFAULT;
