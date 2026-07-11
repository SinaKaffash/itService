import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LeadForm } from "@/components/forms/lead-form";
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
    getTranslations({ locale, namespace: "Contact" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    path: "contact",
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

const contactIcons = [Mail, Phone, MapPin, Clock3];

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, messages] = await Promise.all([
    getTranslations("Contact"),
    import(`../../../messages/${locale}.json`).then((mod) => mod.default),
  ]);
  const formMessages = pickClientMessages(messages, ["LeadForm", "Common"]);
  const items = ["email", "phone", "location", "hours"] as const;

  return (
    <main>
      <PageHero
        compact
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 className="text-2xl font-bold">{t("detailsTitle")}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              {t("detailsDescription")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {items.map((item, index) => {
                const Icon = contactIcons[index];
                return (
                  <div className="flex gap-4 rounded-xl border p-5" key={item}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">
                        {t(`details.${item}.label`)}
                      </h3>
                      <p
                        className="mt-1 text-sm text-muted-foreground"
                        dir={item === "email" || item === "phone" ? "ltr" : undefined}
                      >
                        {t(`details.${item}.value`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold">{t("formTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t("formDescription")}
            </p>
            <div className="mt-8">
              <NextIntlClientProvider messages={formMessages}>
                <LeadForm mode="contact" />
              </NextIntlClientProvider>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
