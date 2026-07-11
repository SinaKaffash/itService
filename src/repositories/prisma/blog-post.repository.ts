import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class PrismaBlogPostRepository {
  listPublished() {
    return prisma.blogPost.findMany({
      where: { published: true, isActive: true },
      orderBy: { publishedAt: "desc" },
    });
  }

  findPublishedBySlug(slug: string) {
    return prisma.blogPost.findFirst({
      where: { slug, published: true, isActive: true },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
  }

  listAll() {
    return prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
  }

  create(data: Prisma.BlogPostCreateInput) {
    return prisma.blogPost.create({ data });
  }

  update(id: string, data: Prisma.BlogPostUpdateInput) {
    return prisma.blogPost.update({ where: { id }, data });
  }
}
