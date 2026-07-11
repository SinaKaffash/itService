import { createHash } from "node:crypto";
import { compare } from "bcryptjs";

import type {
  AdminAuthRepository,
  AdminIdentity,
} from "@/core/admin-auth";
import { ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import {
  createAdminJwt,
  decodeAdminJwt,
  verifyAdminJwt,
} from "@/lib/auth/jwt";
import { PrismaAdminAuthRepository } from "@/repositories/prisma/admin-auth.repository";

const dummyPasswordHash =
  "$2b$12$gT68PmqBlS3HYpJZfZMcNuM5yvJuUqK4EfpQo/xtT8PaqiJTHf8xa";

function hashSessionId(sessionId: string) {
  return createHash("sha256").update(sessionId).digest("hex");
}

export type CreatedAdminSession = {
  token: string;
  expiresAt: Date;
};

export class AdminAuthService {
  constructor(private readonly repository: AdminAuthRepository) {}

  async login(
    identifier: string,
    password: string,
  ): Promise<CreatedAdminSession | null> {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const admin =
      await this.repository.findActiveAdminByIdentifier(normalizedIdentifier);
    const passwordMatches = await compare(
      password,
      admin?.passwordHash ?? dummyPasswordHash,
    );

    if (!admin || !passwordMatches) {
      return null;
    }

    const session = createAdminJwt({
      email: admin.email,
      expiresInSeconds: ADMIN_SESSION_MAX_AGE_SECONDS,
      name: admin.name,
      userId: admin.id,
    });

    await this.repository.deleteExpiredSessions(new Date());
    await this.repository.createSession(
      admin.id,
      hashSessionId(session.jti),
      session.expiresAt,
    );

    return { token: session.token, expiresAt: session.expiresAt };
  }

  async getSession(token: string): Promise<AdminIdentity | null> {
    const payload = verifyAdminJwt(token);

    if (!payload) {
      return null;
    }

    const tokenHash = hashSessionId(payload.jti);
    const session =
      await this.repository.findSessionByTokenHash(tokenHash);

    if (
      !session ||
      !session.user.isActive ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      if (session) {
        await this.repository.deleteSessionByTokenHash(tokenHash);
      }
      return null;
    }

    if (session.user.id !== payload.sub) {
      await this.repository.deleteSessionByTokenHash(tokenHash);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      username: session.user.username,
    };
  }

  async logout(token: string): Promise<void> {
    const payload = decodeAdminJwt(token);

    if (payload) {
      await this.repository.deleteSessionByTokenHash(hashSessionId(payload.jti));
    }
  }
}

export const adminAuthService = new AdminAuthService(
  new PrismaAdminAuthRepository(),
);
