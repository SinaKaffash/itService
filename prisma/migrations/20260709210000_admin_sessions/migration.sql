CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminSession_tokenHash_key"
ON "AdminSession"("tokenHash");

CREATE INDEX "AdminSession_userId_idx"
ON "AdminSession"("userId");

CREATE INDEX "AdminSession_expiresAt_idx"
ON "AdminSession"("expiresAt");

ALTER TABLE "AdminSession"
ADD CONSTRAINT "AdminSession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "AdminUser"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
