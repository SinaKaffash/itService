ALTER TABLE "AdminUser" ADD COLUMN "username" TEXT;

UPDATE "AdminUser"
SET "username" = LOWER(
  REGEXP_REPLACE(
    SPLIT_PART("email", '@', 1),
    '[^a-z0-9._-]',
    '-',
    'g'
  )
) || '-' || SUBSTRING("id", 1, 6)
WHERE "username" IS NULL;

ALTER TABLE "AdminUser" ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
