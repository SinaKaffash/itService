import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import { StructuredData } from "@/components/seo/structured-data";
import type { PublicContentLocale } from "@/core/public-content";
import {
  getPublicBlogPost,
  listPublicBlogPosts,
} from "@/services/public-content.service";
import {
  createLocalizedMetadata,
  getSiteUrl,
  localizedUrl,
  type SeoLocale,
} from "@/lib/seo";

export async function generateStaticParams() {
  const posts = await listPublicBlogPosts("en");
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublicBlogPost(
    locale as PublicContentLocale,
    slug,
  );
  if (!post) notFound();
  const seo = await getTranslations({ locale, namespace: "Seo" });
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: `blog/${slug}`,
    title: post.title,
    description: post.description,
    siteName: seo("siteName"),
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPublicBlogPost(
    locale as PublicContentLocale,
    slug,
  );
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const common = await getTranslations("Blog.detail");
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          inLanguage: locale,
          mainEntityOfPage: localizedUrl(
            locale as SeoLocale,
            `blog/${post.slug}`,
          ),
          author: {
            "@type": "Organization",
            "@id": `${getSiteUrl()}/#organization`,
          },
          publisher: {
            "@type": "Organization",
            "@id": `${getSiteUrl()}/#organization`,
          },
        }}
      />
      <PageHero
        compact
        description={post.description}
        eyebrow={post.category || t("fallbackCategory")}
        title={post.title}
      >
        <p className="text-sm text-muted-foreground">
          {common("meta", {
            date: formatter.format(new Date(post.publishedAt)),
            minutes: post.readTime,
          })}
        </p>
      </PageHero>
      <article className="py-20 sm:py-28">
        <Container className="max-w-3xl">
          <div className="space-y-7">
            {(paragraphs.length > 0
              ? paragraphs
              : [post.description]
            ).map((paragraph, index) => (
              <p
                className={
                  index === 0
                    ? "text-xl font-medium leading-9"
                    : "leading-8 text-muted-foreground"
                }
                key={`${post.id}-${index}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </article>
      <ConversionCTA />
    </main>
  );
}
