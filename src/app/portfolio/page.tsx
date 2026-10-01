import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/messages";

import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/layout/cta-button";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import { CaseStudyCard } from "@/components/sections/public-design";
import { Badge } from "@/components/ui/badge";
import type { PublicContentLocale } from "@/core/public-content";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import { listPublicPortfolio } from "@/services/public-content.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
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
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const items = await listPublicPortfolio();
  const [featured, ...rest] = items;

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
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <CaseStudyCard
                action={t("viewProject")}
                category={featured.category || t("fallbackCategory")}
                description={featured.description}
                featured
                item={featured}
                title={featured.title}
              />
              <div className="rounded-2xl border bg-card/80 p-6 shadow-[var(--shadow-soft)] sm:p-8">
                <Badge variant="secondary">{featured.category || t("fallbackCategory")}</Badge>
                <h2 className="mt-5 text-balance text-3xl font-black tracking-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 text-pretty leading-8 text-muted-foreground">
                  {featured.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {featured.technologies.slice(0, 5).map((technology) => (
                    <Badge key={technology} variant="outline">
                      {technology}
                    </Badge>
                  ))}
                </div>
                <div className="mt-8">
                  <CTAButton href={`/portfolio/${featured.slug}`} showArrow>
                    {t("viewProject")}
                  </CTAButton>
                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2">
            {rest.map((item, index) => (
              <div className={index % 2 === 1 ? "md:mt-10" : ""} key={item.slug}>
                <CaseStudyCard
                  action={t("viewProject")}
                  category={item.category || t("fallbackCategory")}
                  description={item.description}
                  item={item}
                  title={item.title}
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
