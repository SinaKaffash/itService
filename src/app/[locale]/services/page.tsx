import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { ServiceCard } from "@/components/sections/marketing-cards";
import { PageHero } from "@/components/sections/page-hero";
import type { PublicContentLocale } from "@/core/public-content";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import { listPublicServices } from "@/services/public-content.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
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
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Services");
  const services = await listPublicServices(locale as PublicContentLocale);

  return (
    <main>
      <PageHero
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard
              action={t("viewService")}
              description={service.description}
              icon={service.icon}
              key={service.slug}
              slug={service.slug}
              title={service.title}
            />
          ))}
        </Container>
      </section>
      <ConversionCTA />
    </main>
  );
}
