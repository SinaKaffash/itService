import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";

export async function Footer() {
  const [locale, t, localeT] = await Promise.all([
    getLocale(),
    getTranslations("Footer"),
    getTranslations("LocaleSwitcher"),
  ]);

  const columns = [
    {
      title: t("servicesTitle"),
      links: [
        { href: "/services", label: t("web") },
        { href: "/services", label: t("mobile") },
        { href: "/services", label: t("infrastructure") },
      ],
    },
    {
      title: t("companyTitle"),
      links: [
        { href: "/portfolio", label: t("portfolio") },
        { href: "/blog", label: t("blog") },
        { href: "/contact", label: t("contact") },
      ],
    },
  ];

  return (
    <footer className="border-t bg-muted/50">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link className="text-xl font-bold tracking-tight" href="/">
            {t("brand")}<span className="text-primary">.</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            {t("description")}
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold">{column.title}</h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-4 border-t py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{t("copyright")}</p>
        <LocaleSwitcher
          labels={{
            english: localeT("english"),
            label: localeT("label"),
            persian: localeT("persian"),
            shortLabel: localeT("shortLabel"),
          }}
          locale={locale}
        />
      </Container>
    </footer>
  );
}
