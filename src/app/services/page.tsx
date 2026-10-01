import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/messages";

import { Container } from "@/components/layout/container";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { ServiceCard } from "@/components/sections/marketing-cards";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessTimeline, SectionShell } from "@/components/sections/public-design";
import { SectionHeader } from "@/components/sections/section-header";
import type { PublicContentLocale } from "@/core/public-content";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import { listPublicServices } from "@/services/public-content.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "Services" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: "services",
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
  setRequestLocale(locale);
  const [t, requestT] = await Promise.all([
    getTranslations("Services"),
    getTranslations("Request"),
  ]);
  const services = await listPublicServices();

  return (
    <main>
      <PageHero
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="section-rhythm">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard
              action={t("viewService")}
              description={service.description}
              icon={service.icon}
              key={service.slug}
              slug={service.slug}
              title={service.title}
              index={index}
            />
          ))}
          </div>
        </Container>
      </section>
      <SectionShell tone="muted" containerClassName="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <SectionHeader
            description={requestT("description")}
            eyebrow={requestT("eyebrow")}
            title={requestT("expectTitle")}
          />
          <ProcessTimeline
            items={(["discovery", "scope", "response"] as const).map((item) => ({
              description: requestT(`steps.${item}.description`),
              title: requestT(`steps.${item}.title`),
            }))}
          />
      </SectionShell>
      <ConversionCTA />
    </main>
  );
}
