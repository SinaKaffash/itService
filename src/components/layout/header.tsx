import { getLocale, getTranslations } from "next-intl/server";
import {
  BriefcaseBusiness,
  FileText,
  Home,
  Mail,
  Settings2,
  type LucideIcon,
} from "lucide-react";

import { Link } from "@/i18n/navigation";

import { CTAButton } from "./cta-button";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

const navIcons: Record<string, LucideIcon> = {
  "/about": Home,
  "/services": Settings2,
  "/portfolio": BriefcaseBusiness,
  "/blog": FileText,
  "/contact": Mail,
};

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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-[4.5rem] items-center justify-between gap-3 py-3 lg:h-20">
        <Link
          aria-label={t("homeLabel")}
          className="group flex shrink-0 items-center gap-3 text-base font-black tracking-tight sm:text-lg"
          href="/"
        >
          <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-foreground text-base font-black text-background shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <span aria-hidden="true" className="absolute inset-x-1 top-1 h-px bg-background/40" />
            N
          </span>
          <span>{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-xl border border-border/70 bg-card/70 p-1.5 shadow-sm lg:flex">
          {items.map((item) => {
            const Icon = navIcons[item.href];
            return (
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent/70 hover:text-accent-foreground"
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden="true" className="size-5" />
              {item.label}
            </Link>
          );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
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
