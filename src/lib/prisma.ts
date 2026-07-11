import { PrismaClient } from "@prisma/client";

import { getServerEnv } from "@/lib/env.server";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

getServerEnv();

const serverEnv = getServerEnv();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: serverEnv.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (serverEnv.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
