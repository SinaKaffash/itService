import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/layout/cta-button";
import { ConversionCTA } from "@/components/sections/conversion-cta";
import { PageHero } from "@/components/sections/page-hero";
import { StructuredData } from "@/components/seo/structured-data";
import type { PublicContentLocale } from "@/core/public-content";
import {
  getPublicService,
  listPublicServices,
} from "@/services/public-content.service";
import {
  createLocalizedMetadata,
  getSiteUrl,
  localizedUrl,
  type SeoLocale,
} from "@/lib/seo";

export async function generateStaticParams() {
  const services = await listPublicServices("en");
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getPublicService(
    locale as PublicContentLocale,
    slug,
  );
  if (!service) notFound();
  const seo = await getTranslations({ locale, namespace: "Seo" });
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: `services/${slug}`,
    title: service.title,
    description: service.description,
    siteName: seo("siteName"),
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getPublicService(
    locale as PublicContentLocale,
    slug,
  );
  if (!service) notFound();

  const t = await getTranslations("Services.detail");

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.description,
          url: localizedUrl(
            locale as SeoLocale,
            `services/${service.slug}`,
          ),
          provider: {
            "@type": "Organization",
            "@id": `${getSiteUrl()}/#organization`,
          },
        }}
      />
      <PageHero
        compact
        description={service.description}
        eyebrow={t("eyebrow")}
        title={service.title}
      >
        <CTAButton href="/request" showArrow>
          {t("primaryAction")}
        </CTAButton>
        <CTAButton href="/contact" variant="outline">
          {t("secondaryAction")}
        </CTAButton>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t("outcomesEyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            {t("outcomesTitle")}
          </h2>
          <p className="mt-6 whitespace-pre-wrap text-lg leading-9 text-muted-foreground">
            {service.content || service.description}
          </p>
        </Container>
      </section>
      <ConversionCTA />
    </main>
  );
}
