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
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [services, portfolio, posts] = await Promise.all([
    listPublicServices("en"),
    listPublicPortfolio("en"),
    listPublicBlogPosts("en"),
  ]);
  const dynamicPaths = [
    ...services.map((item) => `/services/${item.slug}`),
    ...portfolio.map((item) => `/portfolio/${item.slug}`),
    ...posts.map((item) => `/blog/${item.slug}`),
  ];

  return [...staticPaths, ...dynamicPaths].flatMap((path) => {
    const faUrl = `${siteUrl}/fa${path}`;
    const enUrl = `${siteUrl}/en${path}`;
    const priority = path === "" ? 1 : path.split("/").length === 2 ? 0.8 : 0.7;

    return [
      {
        url: faUrl,
        changeFrequency: "weekly" as const,
        priority,
        alternates: {
          languages: {
            fa: faUrl,
            en: enUrl,
          },
        },
      },
      {
        url: enUrl,
        changeFrequency: "weekly" as const,
        priority,
        alternates: {
          languages: {
            fa: faUrl,
            en: enUrl,
          },
        },
      },
    ];
  });
}
