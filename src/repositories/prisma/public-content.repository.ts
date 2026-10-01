import type {
  PublicContentRepository,
  PublicContentRow,
} from "@/core/public-content";
import { prisma } from "@/lib/prisma";

export class PrismaPublicContentRepository
  implements PublicContentRepository
{
  listServices(): Promise<readonly PublicContentRow[]> {
    return prisma.service.findMany({
      where: { published: true, isActive: true },
      select: {
        id: true,
        slug: true,
        title: true, description: true, content: true,
        icon: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  findServiceBySlug(slug: string): Promise<PublicContentRow | null> {
    return prisma.service.findFirst({
      where: { slug, published: true, isActive: true },
      select: {
        id: true,
        slug: true,
        title: true, description: true, content: true,
        icon: true,
      },
    });
  }

  listPortfolio(): Promise<readonly PublicContentRow[]> {
    return prisma.portfolio.findMany({
      where: { published: true, isActive: true },
      select: {
        id: true,
        slug: true,
        title: true, description: true, content: true, category: true,
        coverImage: true,
        gallery: true,
        technologies: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  findPortfolioBySlug(slug: string): Promise<PublicContentRow | null> {
    return prisma.portfolio.findFirst({
      where: { slug, published: true, isActive: true },
      select: {
        id: true,
        slug: true,
        title: true, description: true, content: true, category: true,
        coverImage: true,
        gallery: true,
        technologies: true,
      },
    });
  }

  listBlogPosts(): Promise<readonly PublicContentRow[]> {
    return prisma.blogPost.findMany({
      where: { published: true, isActive: true },
      select: {
        id: true,
        slug: true,
        title: true, description: true, content: true, category: true,
        coverImage: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });
  }

  findBlogPostBySlug(slug: string): Promise<PublicContentRow | null> {
    return prisma.blogPost.findFirst({
      where: { slug, published: true, isActive: true },
      select: {
        id: true,
        slug: true,
        title: true, description: true, content: true, category: true,
        coverImage: true,
        publishedAt: true,
      },
    });
  }
}
