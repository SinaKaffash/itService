import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/layout/cta-button";
import { ContentImage } from "@/components/sections/content-image";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import { InsightCard } from "@/components/sections/public-design";
import { Badge } from "@/components/ui/badge";
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
  const [featured, ...rest] = posts;
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
      <section className="section-rhythm">
        <Container>
          {featured ? (
            <div className="human-panel grid overflow-hidden rounded-2xl lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
              <div className="relative min-h-72 bg-surface">
                <ContentImage
                  alt={featured.title}
                  fallback="/images/marketing/workspace-dashboard.svg"
                  image={featured.coverImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
              </div>
              <div className="flex flex-col justify-end p-6 sm:p-8">
                <div>
                  <Badge variant="outline">
                    {featured.category || t("fallbackCategory")}
                  </Badge>
                  <h2 className="mt-6 max-w-3xl text-balance text-3xl font-black tracking-tight sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-pretty leading-8 text-muted-foreground">
                    {featured.description}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("meta", {
                    date: formatter.format(new Date(featured.publishedAt)),
                    minutes: featured.readTime,
                  })}
                </p>
                <div className="mt-5">
                  <CTAButton href={`/blog/${featured.slug}`} showArrow>
                    {t("readArticle")}
                  </CTAButton>
                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <div className={index === 1 ? "lg:mt-8" : ""} key={post.slug}>
                <InsightCard
                  action={t("readArticle")}
                  category={post.category || t("fallbackCategory")}
                  coverImage={post.coverImage}
                  excerpt={post.description}
                  meta={t("meta", {
                    date: formatter.format(new Date(post.publishedAt)),
                    minutes: post.readTime,
                  })}
                  slug={post.slug}
                  title={post.title}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <ConversionCTA />
    </main>
  );
}
