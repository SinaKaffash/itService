import type { Metadata } from "next";

import { getPublicEnv } from "@/lib/env.server";

export type SeoLocale = "fa" | "en";

export function getSiteUrl() {
  return getPublicEnv().NEXT_PUBLIC_APP_URL;
}

export function localizedUrl(locale: SeoLocale, path = "") {
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${getSiteUrl()}/${locale}${normalizedPath}`;
}

export function createLocalizedMetadata({
  locale,
  path = "",
  title,
  description,
  siteName,
  type = "website",
  publishedTime,
}: {
  locale: SeoLocale;
  path?: string;
  title: string;
  description: string;
  siteName: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const canonical = localizedUrl(locale, path);
  const alternatePath = path ? `/${path.replace(/^\/+/, "")}` : "";

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: `${getSiteUrl()}/fa${alternatePath}`,
        en: `${getSiteUrl()}/en${alternatePath}`,
        "x-default": `${getSiteUrl()}/fa${alternatePath}`,
      },
    },
    openGraph: {
      type,
      title,
      description,
      siteName,
      url: canonical,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
