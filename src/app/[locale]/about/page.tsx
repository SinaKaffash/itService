import { CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeader } from "@/components/sections/section-header";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "About" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: "about",
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <main>
      <PageHero
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              description={t("storyDescription")}
              eyebrow={t("storyEyebrow")}
              title={t("storyTitle")}
            />
            <p className="mt-5 leading-8 text-muted-foreground">
              {t("storyBody")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(["projects", "uptime", "disciplines", "support"] as const).map(
              (stat) => (
                <div className="rounded-xl border bg-muted/35 p-6" key={stat}>
                  <p className="text-3xl font-bold text-primary">
                    {t(`stats.${stat}.value`)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`stats.${stat}.label`)}
                  </p>
                </div>
              ),
            )}
          </div>
        </Container>
      </section>
      <section className="border-y bg-muted/45 py-20">
        <Container>
          <SectionHeader
            align="center"
            description={t("valuesDescription")}
            title={t("valuesTitle")}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {(["clarity", "craft", "ownership"] as const).map((value) => (
              <div className="rounded-xl border bg-white p-6" key={value}>
                <CheckCircle2
                  aria-hidden="true"
                  className="size-6 text-primary"
                />
                <h3 className="mt-5 text-lg font-bold">
                  {t(`values.${value}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(`values.${value}.description`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <ConversionCTA />
    </main>
  );
}
import type { Metadata } from "next";
