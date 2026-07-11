import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { CTAButton } from "./cta-button";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  const [locale, t, localeT] = await Promise.all([
    getLocale(),
    getTranslations("Navigation"),
    getTranslations("LocaleSwitcher"),
  ]);
  const items = [
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/portfolio", label: t("portfolio") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          aria-label={t("homeLabel")}
          className="shrink-0 text-lg font-bold tracking-tight"
          href="/"
        >
          <span>{t("brand")}</span>
          <span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {items.map((item) => (
            <Link
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden lg:block">
            <LocaleSwitcher
              labels={{
                english: localeT("english"),
                label: localeT("label"),
                persian: localeT("persian"),
                shortLabel: localeT("shortLabel"),
              }}
              locale={locale}
            />
          </div>
          <div className="hidden md:block">
            <CTAButton href="/request" size="sm">
              {t("start")}
            </CTAButton>
          </div>
          <MobileNav
            brandLabel={t("brand")}
            closeLabel={t("close")}
            ctaHref="/request"
            ctaLabel={t("start")}
            description={t("menuDescription")}
            items={items}
            locale={locale}
            localeSwitcherLabels={{
              english: localeT("english"),
              label: localeT("label"),
              persian: localeT("persian"),
              shortLabel: localeT("shortLabel"),
            }}
            menuLabel={t("menu")}
            title={t("menuTitle")}
          />
        </div>
      </Container>
    </header>
  );
}
