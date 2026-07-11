import { CheckCircle2 } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SmartRequestForm } from "@/components/forms/smart-request-form";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/sections/page-hero";
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
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="text-2xl font-bold">{t("expectTitle")}</h2>
            <div className="mt-7 space-y-6">
              {(["discovery", "scope", "response"] as const).map(
                (item, index) => (
                  <div className="flex gap-4" key={item}>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {t(`steps.${item}.title`)}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {t(`steps.${item}.description`)}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="mt-10 rounded-xl border bg-muted/40 p-6">
              <CheckCircle2
                aria-hidden="true"
                className="size-6 text-secondary"
              />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {t("assurance")}
              </p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold">{t("formTitle")}</h2>
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
import type { Metadata } from "next";
