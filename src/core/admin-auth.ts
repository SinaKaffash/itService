export type AdminRole = "SUPER_ADMIN" | "EDITOR";

export type AdminIdentity = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  username: string;
};

export type AdminCredential = AdminIdentity & {
  passwordHash: string;
};

export type AdminSessionRecord = {
  id: string;
  expiresAt: Date;
  user: AdminIdentity & { isActive: boolean };
};

export interface AdminAuthRepository {
  findActiveAdminByIdentifier(
    identifier: string,
  ): Promise<AdminCredential | null>;
  createSession(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void>;
  findSessionByTokenHash(
    tokenHash: string,
  ): Promise<AdminSessionRecord | null>;
  deleteSessionByTokenHash(tokenHash: string): Promise<void>;
  deleteExpiredSessions(now: Date): Promise<void>;
}
