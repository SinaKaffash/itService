import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StructuredData } from "@/components/seo/structured-data";
import { getLocaleDirection, routing } from "@/i18n/routing";
import {
  createLocalizedMetadata,
  getSiteUrl,
  type SeoLocale,
} from "@/lib/seo";
import { cn } from "@/lib/utils";
import { pickClientMessages } from "@/messages/client";

import "@fontsource-variable/inter";
import "@fontsource-variable/vazirmatn";
import "../globals.css";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  const metadata = createLocalizedMetadata({
    locale: locale as SeoLocale,
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
  return {
    ...metadata,
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const clientMessages = pickClientMessages(messages, [
    "ErrorPages",
  ]);
  const seo = await getTranslations("Seo");
  const direction = getLocaleDirection(locale);
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;

  return (
    <html lang={locale} dir={direction}>
      <body className={cn(locale === "fa" ? "font-vazirmatn" : "font-inter")}>
        <NextIntlClientProvider messages={clientMessages}>
          <StructuredData
            data={[
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": organizationId,
                name: seo("organization.name"),
                url: siteUrl,
                email: seo("organization.email"),
                telephone: seo("organization.phone"),
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "@id": `${siteUrl}/#localbusiness`,
                name: seo("organization.name"),
                url: siteUrl,
                email: seo("organization.email"),
                telephone: seo("organization.phone"),
                parentOrganization: { "@id": organizationId },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: seo("organization.city"),
                  addressCountry: seo("organization.countryCode"),
                },
                areaServed: seo("organization.areaServed"),
              },
            ]}
          />
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
