import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class PrismaPortfolioRepository {
  listPublished() {
    return prisma.portfolio.findMany({
      where: { published: true, isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  findPublishedBySlug(slug: string) {
    return prisma.portfolio.findFirst({
      where: { slug, published: true, isActive: true },
    });
  }

  listAll() {
    return prisma.portfolio.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  create(data: Prisma.PortfolioCreateInput) {
    return prisma.portfolio.create({ data });
  }

  update(id: string, data: Prisma.PortfolioUpdateInput) {
    return prisma.portfolio.update({ where: { id }, data });
  }
}
