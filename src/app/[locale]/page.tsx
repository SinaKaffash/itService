import {
  Gauge,
  Globe2,
  ServerCog,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/layout/cta-button";
import { SectionHeader } from "@/components/sections/section-header";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createLocalizedMetadata,
  type SeoLocale,
} from "@/lib/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

const serviceIcons = [Globe2, Smartphone, ServerCog];

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "Home" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const seo = await getTranslations("Seo");
  const faqKeys = ["q1", "q2", "q3"] as const;

  const services = ["web", "mobile", "infrastructure"] as const;

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqKeys.map((key) => ({
            "@type": "Question",
            name: seo(`faq.${key}.question`),
            acceptedAnswer: {
              "@type": "Answer",
              text: seo(`faq.${key}.answer`),
            },
          })),
        }}
      />
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_50%_15%,hsl(var(--primary)/0.11),transparent_54%)]"
        />
        <Container className="flex min-h-[620px] flex-col items-center justify-center py-24 text-center">
          <Badge
            className="mb-6 border-primary/20 bg-primary/5 text-primary hover:bg-primary/5"
            variant="outline"
          >
            <span className="me-2 size-1.5 rounded-full bg-primary" />
            {t("eyebrow")}
          </Badge>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <CTAButton href="/request" showArrow>
              {t("primaryAction")}
            </CTAButton>
            <CTAButton href="/contact" variant="outline">
              {t("secondaryAction")}
            </CTAButton>
          </div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container>
          <SectionHeader
            align="center"
            description={t("servicesDescription")}
            eyebrow={t("servicesEyebrow")}
            title={t("servicesTitle")}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = serviceIcons[index];

              return (
                <Card
                  className="group border-black/[0.08] shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_-28px_hsl(var(--primary)/0.55)]"
                  key={service}
                >
                  <CardHeader>
                    <div className="mb-5 flex size-11 items-center justify-center rounded-lg border bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <CardTitle className="text-xl">
                      {t(`services.${service}.title`)}
                    </CardTitle>
                    <CardDescription className="leading-7">
                      {t(`services.${service}.description`)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y bg-muted/45 py-20">
        <Container>
          <Card className="overflow-hidden border-black/[0.08] shadow-none">
            <CardContent className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <Badge variant="secondary">{t("proof.badge")}</Badge>
                <h2 className="mt-5 text-3xl font-bold tracking-tight">
                  {t("proof.title")}
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                  {t("proof.description")}
                </p>
              </div>
              <div className="glass-panel rounded-xl p-5">
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-sm font-medium">{t("proof.status")}</span>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                    {t("proof.operational")}
                  </Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-white p-4">
                    <Gauge
                      aria-hidden="true"
                      className="mb-3 size-5 text-primary"
                    />
                    <p className="text-2xl font-bold" dir="ltr">
                      99.99%
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("proof.uptime")}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <ShieldCheck
                      aria-hidden="true"
                      className="mb-3 size-5 text-secondary"
                    />
                    <p className="text-2xl font-bold" dir="ltr">
                      &lt;25ms
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("proof.response")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            align="center"
            description={seo("faq.description")}
            title={seo("faq.title")}
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y rounded-xl border bg-white px-6">
            {faqKeys.map((key) => (
              <div className="py-6" key={key}>
                <h2 className="font-bold">{seo(`faq.${key}.question`)}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {seo(`faq.${key}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
