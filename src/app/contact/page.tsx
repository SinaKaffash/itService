import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { NextIntlClientProvider } from "@/lib/messages";
import { getMessages, getTranslations, setRequestLocale } from "@/lib/messages";

import { LeadForm } from "@/components/forms/lead-form";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/sections/page-hero";
import { ConversationCard } from "@/components/sections/public-design";
import { createLocalizedMetadata, type SeoLocale } from "@/lib/seo";
import { pickClientMessages } from "@/messages/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
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
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
  setRequestLocale(locale);
  const [t, messages] = await Promise.all([
    getTranslations("Contact"),
    getMessages(),
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
      <section className="section-rhythm">
        <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <ConversationCard
              description={t("detailsDescription")}
              title={t("detailsTitle")}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {items.map((item, index) => {
                const Icon = contactIcons[index];
                return (
                  <div className="human-panel flex gap-4 rounded-2xl p-5" key={item}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
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
          <div className="surface-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-black">{t("formTitle")}</h2>
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
