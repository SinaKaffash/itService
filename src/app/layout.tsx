import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, getMessages, getTranslations } from "@/lib/messages";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StructuredData } from "@/components/seo/structured-data";
import { createLocalizedMetadata, getSiteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { pickClientMessages } from "@/messages/client";

import "@fontsource-variable/vazirmatn";
import "./globals.css";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [t, seo] = await Promise.all([
    getTranslations("Metadata"),
    getTranslations("Seo"),
  ]);
  const metadata = createLocalizedMetadata({
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const clientMessages = pickClientMessages(messages, [
    "ErrorPages",
  ]);
  const seo = await getTranslations("Seo");
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={cn("font-vazirmatn")}>
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
