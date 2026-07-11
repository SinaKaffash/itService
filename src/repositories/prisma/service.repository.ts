import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class PrismaServiceRepository {
  listPublished() {
    return prisma.service.findMany({
      where: { published: true, isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  findPublishedBySlug(slug: string) {
    return prisma.service.findFirst({
      where: { slug, published: true, isActive: true },
    });
  }

  listAll() {
    return prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  create(data: Prisma.ServiceCreateInput) {
    return prisma.service.create({ data });
  }

  update(id: string, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({ where: { id }, data });
  }
}
