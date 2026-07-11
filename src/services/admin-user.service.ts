import { hash } from "bcryptjs";

import type {
  AdminUserRecord,
  AdminUserRepository,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "@/core/admin-user";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { PrismaAdminUserRepository } from "@/repositories/prisma/admin-user.repository";

function normalizeUser(input: CreateAdminUserInput | UpdateAdminUserInput) {
  return {
    email: input.email.trim().toLowerCase(),
    username: input.username.trim().toLowerCase(),
    name: input.name.trim(),
    role: input.role,
    isActive: input.isActive,
  };
}

export class AdminUserService {
  constructor(private readonly repository: AdminUserRepository) {}

  list(): Promise<AdminUserRecord[]> {
    return this.repository.list();
  }

  async create(input: CreateAdminUserInput): Promise<AdminUserRecord> {
    const passwordHash = await hash(input.password, 12);

    return this.repository.create({
      ...normalizeUser(input),
      passwordHash,
    });
  }

  async update(input: UpdateAdminUserInput): Promise<AdminUserRecord> {
    const existing = await this.repository.findById(input.id);

    if (!existing) {
      throw new NotFoundError("Admin user was not found.", {
        clientCode: "NOT_FOUND",
        context: { id: input.id },
      });
    }

    const wouldLoseSuperAdmin =
      existing.role === "SUPER_ADMIN" &&
      existing.isActive &&
      (input.role !== "SUPER_ADMIN" || !input.isActive);

    if (wouldLoseSuperAdmin) {
      const otherSuperAdmins =
        await this.repository.countActiveSuperAdminsExcept(input.id);

      if (otherSuperAdmins === 0) {
        throw new ConflictError("Cannot remove the final active super admin.", {
          clientCode: "LAST_SUPER_ADMIN",
          context: { id: input.id },
        });
      }
    }

    const data: Parameters<AdminUserRepository["update"]>[1] = {
      ...normalizeUser(input),
    };

    if (input.password) {
      data.passwordHash = await hash(input.password, 12);
    }

    const updated = await this.repository.update(input.id, data);

    if (!updated.isActive) {
      await this.repository.deleteSessionsByUserId(updated.id);
    }

    return updated;
  }
}

export const adminUserService = new AdminUserService(
  new PrismaAdminUserRepository(),
);
