import type { Prisma } from "@prisma/client";

import type {
  AdminContentRecord,
  AdminContentRepository,
  ContentEntityType,
  LocalizedContentValue,
  SaveAdminContentData,
} from "@/core/admin-content";
import { prisma } from "@/lib/prisma";

function translations(value: Prisma.JsonValue) {
  const data = value as {
    fa?: LocalizedContentValue & { excerpt?: string };
    en?: LocalizedContentValue & { excerpt?: string };
  };
  const empty = { title: "", description: "" };
  return {
    fa: {
      ...empty,
      ...data.fa,
      description: data.fa?.description ?? data.fa?.excerpt ?? "",
    },
    en: {
      ...empty,
      ...data.en,
      description: data.en?.description ?? data.en?.excerpt ?? "",
    },
  };
}

export class PrismaAdminContentRepository
  implements AdminContentRepository
{
  async list(entity: ContentEntityType) {
    if (entity === "service") {
      const rows = await prisma.service.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
      return rows.map((row) => this.serviceRecord(row));
    }
    if (entity === "portfolio") {
      const rows = await prisma.portfolio.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
      return rows.map((row) => this.portfolioRecord(row));
    }
    const rows = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => this.blogRecord(row));
  }

  async findById(entity: ContentEntityType, id: string) {
    if (entity === "service") {
      const row = await prisma.service.findUnique({ where: { id } });
      return row ? this.serviceRecord(row) : null;
    }
    if (entity === "portfolio") {
      const row = await prisma.portfolio.findUnique({ where: { id } });
      return row ? this.portfolioRecord(row) : null;
    }
    const row = await prisma.blogPost.findUnique({ where: { id } });
    return row ? this.blogRecord(row) : null;
  }

  async findBySlug(entity: ContentEntityType, slug: string) {
    if (entity === "service") {
      const row = await prisma.service.findUnique({ where: { slug } });
      return row ? this.serviceRecord(row) : null;
    }
    if (entity === "portfolio") {
      const row = await prisma.portfolio.findUnique({ where: { slug } });
      return row ? this.portfolioRecord(row) : null;
    }
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    return row ? this.blogRecord(row) : null;
  }

  async create(data: SaveAdminContentData) {
    if (data.entity === "service") {
      return prisma.service.create({
        data: {
          slug: data.slug,
          translations: data.translations,
          icon: data.icon || null,
          sortOrder: data.sortOrder,
          published: data.published,
          isActive: data.isActive,
        },
        select: { id: true },
      });
    }
    if (data.entity === "portfolio") {
      return prisma.portfolio.create({
        data: {
          slug: data.slug,
          translations: data.translations,
          technologies: data.technologies,
          sortOrder: data.sortOrder,
          published: data.published,
          isActive: data.isActive,
        },
        select: { id: true },
      });
    }
    return prisma.blogPost.create({
      data: {
        slug: data.slug,
        translations: data.translations,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
        isActive: data.isActive,
      },
      select: { id: true },
    });
  }

  async update(id: string, data: SaveAdminContentData) {
    if (data.entity === "service") {
      const result = await prisma.service.updateMany({
        where: { id },
        data: {
          slug: data.slug,
          translations: data.translations,
          icon: data.icon || null,
          sortOrder: data.sortOrder,
          published: data.published,
          isActive: data.isActive,
        },
      });
      return result.count === 1;
    }
    if (data.entity === "portfolio") {
      const result = await prisma.portfolio.updateMany({
        where: { id },
        data: {
          slug: data.slug,
          translations: data.translations,
          technologies: data.technologies,
          sortOrder: data.sortOrder,
          published: data.published,
          isActive: data.isActive,
        },
      });
      return result.count === 1;
    }
    const current = await prisma.blogPost.findUnique({
      where: { id },
      select: { publishedAt: true },
    });
    if (!current) return false;
    await prisma.blogPost.update({
      where: { id },
      data: {
        slug: data.slug,
        translations: data.translations,
        published: data.published,
        publishedAt: data.published
          ? current.publishedAt ?? new Date()
          : null,
        isActive: data.isActive,
      },
    });
    return true;
  }

  async delete(entity: ContentEntityType, id: string) {
    if (entity === "service") {
      return (await prisma.service.deleteMany({ where: { id } })).count === 1;
    }
    if (entity === "portfolio") {
      return (await prisma.portfolio.deleteMany({ where: { id } })).count === 1;
    }
    return (await prisma.blogPost.deleteMany({ where: { id } })).count === 1;
  }

  private serviceRecord(
    row: Prisma.ServiceGetPayload<Record<string, never>>,
  ): AdminContentRecord {
    return {
      id: row.id,
      entity: "service",
      slug: row.slug,
      translations: translations(row.translations),
      published: row.published,
      isActive: row.isActive,
      sortOrder: row.sortOrder,
      icon: row.icon ?? "",
      technologies: [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private portfolioRecord(
    row: Prisma.PortfolioGetPayload<Record<string, never>>,
  ): AdminContentRecord {
    return {
      id: row.id,
      entity: "portfolio",
      slug: row.slug,
      translations: translations(row.translations),
      published: row.published,
      isActive: row.isActive,
      sortOrder: row.sortOrder,
      icon: "",
      technologies: row.technologies,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private blogRecord(
    row: Prisma.BlogPostGetPayload<Record<string, never>>,
  ): AdminContentRecord {
    return {
      id: row.id,
      entity: "blog",
      slug: row.slug,
      translations: translations(row.translations),
      published: row.published,
      isActive: row.isActive,
      sortOrder: 0,
      icon: "",
      technologies: [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
