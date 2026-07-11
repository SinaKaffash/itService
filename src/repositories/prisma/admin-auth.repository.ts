import type { AdminAuthRepository } from "@/core/admin-auth";
import { prisma } from "@/lib/prisma";

export class PrismaAdminAuthRepository implements AdminAuthRepository {
  findActiveAdminByIdentifier(identifier: string) {
    return prisma.adminUser.findFirst({
      where: {
        isActive: true,
        OR: [{ email: identifier }, { username: identifier }],
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        username: true,
        passwordHash: true,
      },
    });
  }

  async createSession(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    await prisma.adminSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  findSessionByTokenHash(tokenHash: string) {
    return prisma.adminSession.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        expiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            username: true,
            isActive: true,
          },
        },
      },
    });
  }

  async deleteSessionByTokenHash(tokenHash: string) {
    await prisma.adminSession.deleteMany({ where: { tokenHash } });
  }

  async deleteExpiredSessions(now: Date) {
    await prisma.adminSession.deleteMany({
      where: { expiresAt: { lte: now } },
    });
  }
}
