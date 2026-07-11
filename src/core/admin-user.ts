import type { AdminRole } from "./admin-auth";

export const adminRoles = ["SUPER_ADMIN", "EDITOR"] as const;

export type AdminUserRecord = {
  id: string;
  email: string;
  username: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminUserInput = {
  email: string;
  username: string;
  name: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
};

export type UpdateAdminUserInput = {
  id: string;
  email: string;
  username: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  password?: string;
};

export interface AdminUserRepository {
  countActiveSuperAdminsExcept(id: string): Promise<number>;
  create(data: {
    email: string;
    username: string;
    name: string;
    passwordHash: string;
    role: AdminRole;
    isActive: boolean;
  }): Promise<AdminUserRecord>;
  deleteSessionsByUserId(userId: string): Promise<void>;
  findById(id: string): Promise<AdminUserRecord | null>;
  list(): Promise<AdminUserRecord[]>;
  update(
    id: string,
    data: Partial<{
      email: string;
      username: string;
      name: string;
      passwordHash: string;
      role: AdminRole;
      isActive: boolean;
    }>,
  ): Promise<AdminUserRecord>;
}
