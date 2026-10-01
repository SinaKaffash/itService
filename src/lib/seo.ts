import type { Metadata } from "next";

import { getPublicEnv } from "@/lib/env.server";

export type SeoLocale = "fa";

export function getSiteUrl() {
  return getPublicEnv().NEXT_PUBLIC_APP_URL;
}

export function localizedUrl(path = "") {
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${getSiteUrl()}${normalizedPath}`;
}

export function createLocalizedMetadata({
  path = "",
  title,
  description,
  siteName,
  type = "website",
  publishedTime,
  image,
}: {
  locale?: SeoLocale;
  path?: string;
  title: string;
  description: string;
  siteName: string;
  type?: "website" | "article";
  publishedTime?: string;
  image?: string;
}): Metadata {
  const canonical = localizedUrl(path);
  const imageUrl = image
    ? image.startsWith("https://")
      ? image
      : `${getSiteUrl()}${image}`
    : undefined;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      title,
      description,
      siteName,
      url: canonical,
      locale: "fa_IR",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
