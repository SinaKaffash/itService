ALTER TABLE "Service"
  ADD COLUMN "title" TEXT,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "content" TEXT NOT NULL DEFAULT '';

UPDATE "Service"
SET "title" = COALESCE("translations"->'fa'->>'title', ''),
    "description" = COALESCE("translations"->'fa'->>'description', "translations"->'fa'->>'excerpt', '');

ALTER TABLE "Service"
  ALTER COLUMN "title" SET NOT NULL,
  ALTER COLUMN "description" SET NOT NULL,
  DROP COLUMN "translations";

ALTER TABLE "Portfolio"
  ADD COLUMN "title" TEXT,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "category" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "content" TEXT NOT NULL DEFAULT '';

UPDATE "Portfolio"
SET "title" = COALESCE("translations"->'fa'->>'title', ''),
    "description" = COALESCE("translations"->'fa'->>'description', "translations"->'fa'->>'excerpt', ''),
    "category" = COALESCE("translations"->'fa'->>'category', ''),
    "content" = COALESCE("translations"->'fa'->>'content', '');

ALTER TABLE "Portfolio"
  ALTER COLUMN "title" SET NOT NULL,
  ALTER COLUMN "description" SET NOT NULL,
  DROP COLUMN "translations";

ALTER TABLE "BlogPost"
  ADD COLUMN "title" TEXT,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "category" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "content" TEXT NOT NULL DEFAULT '';

UPDATE "BlogPost"
SET "title" = COALESCE("translations"->'fa'->>'title', ''),
    "description" = COALESCE("translations"->'fa'->>'description', "translations"->'fa'->>'excerpt', ''),
    "category" = COALESCE("translations"->'fa'->>'category', ''),
    "content" = COALESCE("translations"->'fa'->>'content', '');

ALTER TABLE "BlogPost"
  ALTER COLUMN "title" SET NOT NULL,
  ALTER COLUMN "description" SET NOT NULL,
  DROP COLUMN "translations";

ALTER TABLE "LeadRequest" DROP COLUMN "locale";
