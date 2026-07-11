import type { AdminUserRepository } from "@/core/admin-user";
import { prisma } from "@/lib/prisma";

export class PrismaAdminUserRepository implements AdminUserRepository {
  countActiveSuperAdminsExcept(id: string) {
    return prisma.adminUser.count({
      where: {
        id: { not: id },
        isActive: true,
        role: "SUPER_ADMIN",
      },
    });
  }

  deleteSessionsByUserId(userId: string) {
    return prisma.adminSession
      .deleteMany({ where: { userId } })
      .then(() => undefined);
  }

  findById(id: string) {
    return prisma.adminUser.findUnique({ where: { id } });
  }

  list() {
    return prisma.adminUser.findMany({
      orderBy: [{ role: "desc" }, { createdAt: "asc" }],
    });
  }

  findByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  }

  create(data: Parameters<AdminUserRepository["create"]>[0]) {
    return prisma.adminUser.create({ data });
  }

  update(id: string, data: Parameters<AdminUserRepository["update"]>[1]) {
    return prisma.adminUser.update({ where: { id }, data });
  }
}
