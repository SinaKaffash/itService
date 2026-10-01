import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "@/lib/messages";

import { ContentImage } from "@/components/sections/content-image";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import { FeaturePanel, SectionShell } from "@/components/sections/public-design";
import { SectionHeader } from "@/components/sections/section-header";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
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
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <main>
      <PageHero
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <SectionShell containerClassName="grid gap-12 lg:grid-cols-2 lg:items-center">
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
          <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
            <div className="aspect-[16/11]">
              <ContentImage
                alt=""
                fallback="/images/marketing/team-studio.svg"
                image="/images/marketing/team-studio.svg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {(["projects", "uptime", "disciplines", "support"] as const).map(
              (stat) => (
                <div className="rounded-2xl border bg-card/80 p-6 shadow-[0_1px_0_hsl(var(--foreground)/0.04)]" key={stat}>
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
      </SectionShell>
      <SectionShell tone="muted">
          <SectionHeader
            align="center"
            description={t("valuesDescription")}
            title={t("valuesTitle")}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {(["clarity", "craft", "ownership"] as const).map((value) => (
              <FeaturePanel key={value}>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-7"
                  />
                </div>
                <h3 className="mt-5 text-lg font-bold">
                  {t(`values.${value}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(`values.${value}.description`)}
                </p>
              </FeaturePanel>
            ))}
          </div>
      </SectionShell>
      <ConversionCTA />
    </main>
  );
}
