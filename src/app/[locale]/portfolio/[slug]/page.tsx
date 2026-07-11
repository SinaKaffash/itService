import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import type { PublicContentLocale } from "@/core/public-content";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import {
  getPublicPortfolioItem,
  listPublicPortfolio,
} from "@/services/public-content.service";

export async function generateStaticParams() {
  const items = await listPublicPortfolio("en");
  return items.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getPublicPortfolioItem(
    locale as PublicContentLocale,
    slug,
  );
  if (!item) notFound();
  const seo = await getTranslations({ locale, namespace: "Seo" });
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: `portfolio/${slug}`,
    title: item.title,
    description: item.description,
    siteName: seo("siteName"),
  });
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getPublicPortfolioItem(
    locale as PublicContentLocale,
    slug,
  );
  if (!item) notFound();

  const t = await getTranslations("Portfolio");
  const detail = await getTranslations("Portfolio.detail");

  return (
    <main>
      <PageHero
        compact
        description={item.description}
        eyebrow={item.category || t("fallbackCategory")}
        title={item.title}
      />
      <section className="py-20 sm:py-28">
        <Container>
          <div className="rounded-2xl border bg-slate-950 p-6 sm:p-10">
            <div className="aspect-[16/7] rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--primary)/0.35),transparent_45%),linear-gradient(to_bottom_right,#111827,#020617)] p-6">
              <div className="h-full rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur" />
            </div>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_0.45fr]">
            <article>
              <h2 className="text-3xl font-bold">{detail("overview")}</h2>
              <p className="mt-5 whitespace-pre-wrap leading-8 text-muted-foreground">
                {item.content || item.description}
              </p>
            </article>
            <aside className="h-fit rounded-xl border bg-muted/35 p-6">
              <h2 className="font-bold">{detail("technology")}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.technologies.map((technology) => (
                  <Badge key={technology} variant="outline">
                    {technology}
                  </Badge>
                ))}
              </div>
            </aside>
          </div>
        </Container>
      </section>
      <ConversionCTA />
    </main>
  );
}
