export type ServiceIcon = "globe" | "mobile" | "server" | "dashboard";

export type PublicContentLocale = "fa" | "en";

export type PublicContentRow = {
  id: string;
  slug: string;
  translations: unknown;
  coverImage?: string | null;
  gallery?: unknown;
  publishedAt?: Date | null;
  icon?: string | null;
  technologies?: string[];
};

export type PublicService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  icon: ServiceIcon;
};

export type PublicPortfolio = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  theme: "cyan" | "violet" | "emerald";
};

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readTime: number;
};

export interface PublicContentRepository {
  listServices(): Promise<readonly PublicContentRow[]>;
  findServiceBySlug(slug: string): Promise<PublicContentRow | null>;
  listPortfolio(): Promise<readonly PublicContentRow[]>;
  findPortfolioBySlug(slug: string): Promise<PublicContentRow | null>;
  listBlogPosts(): Promise<readonly PublicContentRow[]>;
  findBlogPostBySlug(slug: string): Promise<PublicContentRow | null>;
}
