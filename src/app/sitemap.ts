import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";
import {
  listPublicBlogPosts,
  listPublicPortfolio,
  listPublicServices,
} from "@/services/public-content.service";

const staticPaths = [
  "",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/contact",
  "/request",
  "/projects",
  "/status",
  "/announcements",
  "/tickets/new",
  "/tickets/track",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [services, portfolio, posts] = await Promise.all([
    listPublicServices("fa"),
    listPublicPortfolio("fa"),
    listPublicBlogPosts("fa"),
  ]);
  const dynamicPaths = [
    ...services.map((item) => `/services/${item.slug}`),
    ...portfolio.map((item) => `/portfolio/${item.slug}`),
    ...posts.map((item) => `/blog/${item.slug}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => {
    const url = `${siteUrl}${path}`;
    const priority = path === "" ? 1 : path.split("/").length === 2 ? 0.8 : 0.7;

    return { url, changeFrequency: "weekly" as const, priority };
  });
}
