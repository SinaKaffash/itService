import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { CTAButton } from "./cta-button";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { ThemeSwitcher } from "./theme-switcher";

export async function Header() {
  const [locale, t, localeT, themeT] = await Promise.all([
    getLocale(),
    getTranslations("Navigation"),
    getTranslations("LocaleSwitcher"),
    getTranslations("ThemeSwitcher"),
  ]);
  const items = [
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/portfolio", label: t("portfolio") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
        <Link
          aria-label={t("homeLabel")}
          className="group flex shrink-0 items-center gap-2 text-base font-black tracking-tight sm:text-lg"
          href="/"
        >
          <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-lg border border-border/80 bg-foreground text-sm font-black text-background shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <span aria-hidden="true" className="absolute inset-x-1 top-1 h-px bg-background/40" />
            N
          </span>
          <span>{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-xl border border-border/70 bg-card/70 p-1 shadow-sm lg:flex">
          {items.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent/70 hover:text-accent-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden lg:block">
            <ThemeSwitcher
              labels={{
                dark: themeT("dark"),
                label: themeT("label"),
                light: themeT("light"),
                system: themeT("system"),
              }}
            />
          </div>
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
            themeLabels={{
              dark: themeT("dark"),
              label: themeT("label"),
              light: themeT("light"),
              system: themeT("system"),
            }}
            title={t("menuTitle")}
          />
        </div>
      </Container>
    </header>
  );
}
