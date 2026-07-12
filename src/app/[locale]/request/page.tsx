import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SmartRequestForm } from "@/components/forms/smart-request-form";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/sections/page-hero";
import { FormSidePanel } from "@/components/sections/public-design";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import { pickClientMessages } from "@/messages/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "Request" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: "request",
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

export default async function RequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, messages] = await Promise.all([
    getTranslations("Request"),
    import(`../../../messages/${locale}.json`).then((mod) => mod.default),
  ]);
  const formMessages = pickClientMessages(messages, ["LeadForm", "Common"]);

  return (
    <main>
      <PageHero
        compact
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="section-rhythm">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <FormSidePanel
            assurance={t("assurance")}
            description={t("description")}
            items={(["discovery", "scope", "response"] as const).map((item) => ({
              description: t(`steps.${item}.description`),
              title: t(`steps.${item}.title`),
            }))}
            title={t("expectTitle")}
          />
          <div className="surface-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-black">{t("formTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t("formDescription")}
            </p>
            <div className="mt-8">
              <NextIntlClientProvider messages={formMessages}>
                <SmartRequestForm />
              </NextIntlClientProvider>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
