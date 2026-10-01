import { cache } from "react";
import { unstable_cache } from "next/cache";

import type {
  PublicBlogPost,
  PublicContentRepository,
  PublicContentRow,
  PublicContentLocale,
  PublicPortfolio,
  PublicService,
  ServiceIcon,
} from "@/core/public-content";
import { PrismaPublicContentRepository } from "@/repositories/prisma/public-content.repository";

function localized(row: PublicContentRow) {
  const value = row;
  return {
    title: value.title?.trim() ?? "",
    description:
      value.description?.trim() ?? "",
    content: value.content?.trim() ?? "",
    category: value.category?.trim() ?? "",
  };
}

function serviceIcon(icon?: string | null): ServiceIcon {
  return ["globe", "mobile", "server", "dashboard"].includes(icon ?? "")
    ? (icon as ServiceIcon)
    : "dashboard";
}

function portfolioTheme(index: number): PublicPortfolio["theme"] {
  return (["cyan", "violet", "emerald"] as const)[index % 3];
}

function imageUrl(value?: string | null) {
  return value?.trim() ?? "";
}

function galleryUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export class PublicContentService {
  constructor(private readonly repository: PublicContentRepository) {}

  async listServices() {
    const rows = await this.repository.listServices();
    return rows.map((row): PublicService => {
      const value = localized(row);
      return {
        id: row.id,
        slug: row.slug,
        title: value.title,
        description: value.description,
        content: value.content,
        icon: serviceIcon(row.icon),
      };
    });
  }

  async getService(slug: string, legacySlug?: string) {
    slug = legacySlug ?? slug;
    const row = await this.repository.findServiceBySlug(slug);
    if (!row) return null;
    const value = localized(row);
    return {
      id: row.id,
      slug: row.slug,
      title: value.title,
      description: value.description,
      content: value.content,
      icon: serviceIcon(row.icon),
    } satisfies PublicService;
  }

  async listPortfolio() {
    const rows = await this.repository.listPortfolio();
    return rows.map((row, index): PublicPortfolio => {
      const value = localized(row);
      return {
        id: row.id,
        slug: row.slug,
        title: value.title,
        description: value.description,
        content: value.content,
        category: value.category,
        coverImage: imageUrl(row.coverImage),
        gallery: galleryUrls(row.gallery),
        technologies: row.technologies ?? [],
        theme: portfolioTheme(index),
      };
    });
  }

  async getPortfolioItem(slug: string, legacySlug?: string) {
    slug = legacySlug ?? slug;
    const row = await this.repository.findPortfolioBySlug(slug);
    if (!row) return null;
    const value = localized(row);
    return {
      id: row.id,
      slug: row.slug,
      title: value.title,
      description: value.description,
      content: value.content,
      category: value.category,
      coverImage: imageUrl(row.coverImage),
      gallery: galleryUrls(row.gallery),
      technologies: row.technologies ?? [],
      theme: portfolioTheme(0),
    } satisfies PublicPortfolio;
  }

  async listBlogPosts() {
    const rows = await this.repository.listBlogPosts();
    return rows.map((row) => this.blogPost(row));
  }

  async getBlogPost(slug: string, legacySlug?: string) {
    slug = legacySlug ?? slug;
    const row = await this.repository.findBlogPostBySlug(slug);
    return row ? this.blogPost(row) : null;
  }

  private blogPost(
    row: PublicContentRow,
  ): PublicBlogPost {
    const value = localized(row);
    const content = value.content || value.description;
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    return {
      id: row.id,
      slug: row.slug,
      title: value.title,
      description: value.description,
      content,
      category: value.category,
      coverImage: imageUrl(row.coverImage),
      publishedAt: (row.publishedAt ?? new Date(0)).toISOString(),
      readTime: Math.max(1, Math.ceil(wordCount / 200)),
    };
  }
}

export const publicContentService = new PublicContentService(
  new PrismaPublicContentRepository(),
);

export const listPublicServices = cache(
  unstable_cache(
    (_locale?: PublicContentLocale) => publicContentService.listServices(),
    ["public-services"],
    { revalidate: 3600, tags: ["public-content", "public-services"] },
  ),
);
export const getPublicService = cache(
  unstable_cache(
    (localeOrSlug: string, slug?: string) => publicContentService.getService(slug ?? localeOrSlug),
    ["public-service"],
    { revalidate: 3600, tags: ["public-content", "public-services"] },
  ),
);
export const listPublicPortfolio = cache(
  unstable_cache(
    (_locale?: PublicContentLocale) => publicContentService.listPortfolio(),
    ["public-portfolio"],
    { revalidate: 3600, tags: ["public-content", "public-portfolio"] },
  ),
);
export const getPublicPortfolioItem = cache(
  unstable_cache(
    (localeOrSlug: string, slug?: string) => publicContentService.getPortfolioItem(slug ?? localeOrSlug),
    ["public-portfolio-item"],
    { revalidate: 3600, tags: ["public-content", "public-portfolio"] },
  ),
);
export const listPublicBlogPosts = cache(
  unstable_cache(
    (_locale?: PublicContentLocale) => publicContentService.listBlogPosts(),
    ["public-blog-posts"],
    { revalidate: 3600, tags: ["public-content", "public-blog"] },
  ),
);
export const getPublicBlogPost = cache(
  unstable_cache(
    (localeOrSlug: string, slug?: string) => publicContentService.getBlogPost(slug ?? localeOrSlug),
    ["public-blog-post"],
    { revalidate: 3600, tags: ["public-content", "public-blog"] },
  ),
);
