import { cache } from "react";
import { unstable_cache } from "next/cache";

import type {
  PublicBlogPost,
  PublicContentLocale,
  PublicContentRepository,
  PublicContentRow,
  PublicPortfolio,
  PublicService,
  ServiceIcon,
} from "@/core/public-content";
import { PrismaPublicContentRepository } from "@/repositories/prisma/public-content.repository";

type Translation = {
  title?: string;
  description?: string;
  excerpt?: string;
  content?: string;
  category?: string;
};

function localized(row: PublicContentRow, locale: PublicContentLocale) {
  const translations = row.translations as Partial<
    Record<PublicContentLocale, Translation>
  >;
  const value = translations[locale] ?? translations.en ?? translations.fa ?? {};
  return {
    title: value.title?.trim() ?? "",
    description:
      value.description?.trim() ?? value.excerpt?.trim() ?? "",
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

  async listServices(locale: PublicContentLocale) {
    const rows = await this.repository.listServices();
    return rows.map((row): PublicService => {
      const value = localized(row, locale);
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

  async getService(locale: PublicContentLocale, slug: string) {
    const row = await this.repository.findServiceBySlug(slug);
    if (!row) return null;
    const value = localized(row, locale);
    return {
      id: row.id,
      slug: row.slug,
      title: value.title,
      description: value.description,
      content: value.content,
      icon: serviceIcon(row.icon),
    } satisfies PublicService;
  }

  async listPortfolio(locale: PublicContentLocale) {
    const rows = await this.repository.listPortfolio();
    return rows.map((row, index): PublicPortfolio => {
      const value = localized(row, locale);
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

  async getPortfolioItem(locale: PublicContentLocale, slug: string) {
    const row = await this.repository.findPortfolioBySlug(slug);
    if (!row) return null;
    const value = localized(row, locale);
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

  async listBlogPosts(locale: PublicContentLocale) {
    const rows = await this.repository.listBlogPosts();
    return rows.map((row) => this.blogPost(row, locale));
  }

  async getBlogPost(locale: PublicContentLocale, slug: string) {
    const row = await this.repository.findBlogPostBySlug(slug);
    return row ? this.blogPost(row, locale) : null;
  }

  private blogPost(
    row: PublicContentRow,
    locale: PublicContentLocale,
  ): PublicBlogPost {
    const value = localized(row, locale);
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
    (locale: PublicContentLocale) =>
      publicContentService.listServices(locale),
    ["public-services"],
    { revalidate: 3600, tags: ["public-content", "public-services"] },
  ),
);
export const getPublicService = cache(
  unstable_cache(
    (locale: PublicContentLocale, slug: string) =>
      publicContentService.getService(locale, slug),
    ["public-service"],
    { revalidate: 3600, tags: ["public-content", "public-services"] },
  ),
);
export const listPublicPortfolio = cache(
  unstable_cache(
    (locale: PublicContentLocale) =>
      publicContentService.listPortfolio(locale),
    ["public-portfolio"],
    { revalidate: 3600, tags: ["public-content", "public-portfolio"] },
  ),
);
export const getPublicPortfolioItem = cache(
  unstable_cache(
    (locale: PublicContentLocale, slug: string) =>
      publicContentService.getPortfolioItem(locale, slug),
    ["public-portfolio-item"],
    { revalidate: 3600, tags: ["public-content", "public-portfolio"] },
  ),
);
export const listPublicBlogPosts = cache(
  unstable_cache(
    (locale: PublicContentLocale) =>
      publicContentService.listBlogPosts(locale),
    ["public-blog-posts"],
    { revalidate: 3600, tags: ["public-content", "public-blog"] },
  ),
);
export const getPublicBlogPost = cache(
  unstable_cache(
    (locale: PublicContentLocale, slug: string) =>
      publicContentService.getBlogPost(locale, slug),
    ["public-blog-post"],
    { revalidate: 3600, tags: ["public-content", "public-blog"] },
  ),
);
