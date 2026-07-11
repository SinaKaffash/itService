import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PortfolioCard } from "@/components/sections/marketing-cards";
import { PageHero } from "@/components/sections/page-hero";
import type { PublicContentLocale } from "@/core/public-content";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import { listPublicPortfolio } from "@/services/public-content.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "Portfolio" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: "portfolio",
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const items = await listPublicPortfolio(locale as PublicContentLocale);

  return (
    <main>
      <PageHero
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {items.map((item) => (
            <PortfolioCard
              action={t("viewProject")}
              category={item.category || t("fallbackCategory")}
              description={item.description}
              item={item}
              key={item.slug}
              title={item.title}
            />
          ))}
        </Container>
      </section>
      <ConversionCTA />
    </main>
  );
}
