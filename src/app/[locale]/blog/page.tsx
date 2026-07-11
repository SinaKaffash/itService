import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { ArticleCard } from "@/components/sections/article-card";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import type { PublicContentLocale } from "@/core/public-content";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import { listPublicBlogPosts } from "@/services/public-content.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "Blog" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: "blog",
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");
  const posts = await listPublicBlogPosts(locale as PublicContentLocale);
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <main>
      <PageHero
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard
              action={t("readArticle")}
              category={post.category || t("fallbackCategory")}
              excerpt={post.description}
              key={post.slug}
              meta={t("meta", {
                date: formatter.format(new Date(post.publishedAt)),
                minutes: post.readTime,
              })}
              slug={post.slug}
              title={post.title}
            />
          ))}
        </Container>
      </section>
      <ConversionCTA />
    </main>
  );
}
