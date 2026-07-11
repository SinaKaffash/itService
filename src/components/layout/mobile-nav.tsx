"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  Home,
  Mail,
  Menu,
  Rocket,
  Settings2,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "@/components/ui/button";

type MobileNavProps = {
  brandLabel: string;
  closeLabel: string;
  ctaHref?: string;
  ctaLabel?: string;
  description: string;
  items: Array<{ href: string; label: string }>;
  locale: string;
  localeSwitcherLabels: {
    english: string;
    label: string;
    persian: string;
    shortLabel: string;
  };
  menuLabel: string;
  title: string;
};

const navIcons: Record<string, LucideIcon> = {
  "/about": Home,
  "/services": Settings2,
  "/portfolio": BriefcaseBusiness,
  "/blog": FileText,
  "/contact": Mail,
};

const mobileOnlyClassName = "lg:hidden";

function normalizedPath(pathname: string) {
  const segments = pathname.split("/");
  if (segments[1] === "fa" || segments[1] === "en") {
    return `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/";
  }

  return pathname.replace(/\/$/, "") || "/";
}

export function MobileNav({
  brandLabel,
  closeLabel,
  ctaHref,
  ctaLabel,
  description,
  items,
  locale,
  localeSwitcherLabels,
  menuLabel,
  title,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = normalizedPath(pathname);
  const isRtl = locale === "fa";

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        aria-expanded={open}
        aria-label={menuLabel}
        className={mobileOnlyClassName}
        onClick={() => setOpen(true)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Menu aria-hidden="true" />
      </Button>
      {open ? (
        <div className={cn("fixed inset-0 z-50", mobileOnlyClassName)}>
          <button
            aria-label={closeLabel}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div
            aria-modal="true"
            className={cn(
              "fixed top-0 z-50 flex h-dvh w-[min(23.5rem,calc(100vw-1rem))] flex-col overflow-y-auto bg-background shadow-2xl ring-1 ring-black/10",
              isRtl
                ? "right-0 rounded-l-2xl"
                : "left-0 rounded-r-2xl",
            )}
            dir={isRtl ? "rtl" : "ltr"}
            role="dialog"
          >
            <div className="border-b bg-muted/45 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <Link
                  className="min-w-0 text-base font-bold tracking-tight"
                  href="/"
                  onClick={() => setOpen(false)}
                >
                  <span className="truncate">{brandLabel}</span>
                  <span className="text-primary">.</span>
                </Link>
                <Button
                  aria-label={closeLabel}
                  className="shrink-0 rounded-full bg-background shadow-sm"
                  onClick={() => setOpen(false)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="px-5 pb-5 pt-6 sm:px-6">
              <div className="min-w-0 space-y-2">
                <h2 className="text-start text-lg font-semibold text-foreground">
                  {title}
                </h2>
                <p className="text-start text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                {items.map((item) => {
                  const Icon = navIcons[item.href] ?? ArrowRight;
                  const isActive =
                    currentPath === item.href ||
                    currentPath.startsWith(`${item.href}/`);

                  return (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group flex min-h-12 items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-semibold leading-6 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                      href={item.href}
                      key={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-primary transition-colors",
                          isActive && "border-primary/20 bg-primary text-primary-foreground",
                        )}
                      >
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1 break-words">
                        {item.label}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform",
                          isRtl
                            ? "rotate-180 group-hover:-translate-x-0.5"
                            : "group-hover:translate-x-0.5",
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto space-y-4 border-t bg-white px-5 py-5 sm:px-6">
              {ctaHref && ctaLabel ? (
                <Button asChild className="w-full">
                  <Link href={ctaHref} onClick={() => setOpen(false)}>
                    <Rocket aria-hidden="true" />
                    {ctaLabel}
                  </Link>
                </Button>
              ) : null}
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {localeSwitcherLabels.label}
                </span>
                <LocaleSwitcher
                  labels={localeSwitcherLabels}
                  locale={locale}
                  side="top"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
