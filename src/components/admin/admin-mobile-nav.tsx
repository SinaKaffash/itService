"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type AdminMobileNavProps = {
  adminEmail: string;
  brand: string;
  isSuperAdmin: boolean;
  labels: {
    blog: string;
    close: string;
    dashboard: string;
    menu: string;
    portfolio: string;
    requests: string;
    services: string;
    users: string;
  };
  locale: string;
  signedInAs: string;
};

const mobileOnlyClassName = "lg:hidden";

function normalizedPath(pathname: string) {
  const segments = pathname.split("/");
  if (segments[1] === "fa" || segments[1] === "en") {
    return `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/";
  }

  return pathname.replace(/\/$/, "") || "/";
}

export function AdminMobileNav({
  adminEmail,
  brand,
  isSuperAdmin,
  labels,
  locale,
  signedInAs,
}: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = normalizedPath(pathname);
  const isRtl = locale === "fa";
  const items = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: labels.dashboard,
    },
    {
      href: "/admin/requests",
      icon: MessagesSquare,
      label: labels.requests,
    },
    {
      href: "/admin/services",
      icon: Wrench,
      label: labels.services,
    },
    {
      href: "/admin/portfolio",
      icon: BriefcaseBusiness,
      label: labels.portfolio,
    },
    {
      href: "/admin/blog",
      icon: BookOpenText,
      label: labels.blog,
    },
    ...(isSuperAdmin
      ? [
          {
            href: "/admin/users",
            icon: Users,
            label: labels.users,
          },
        ]
      : []),
  ];

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
        aria-label={labels.menu}
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
            aria-label={labels.close}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside
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
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {brand}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {signedInAs}: {adminEmail}
                  </p>
                </div>
                <Button
                  aria-label={labels.close}
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

            <nav className="flex flex-col gap-2 px-5 py-6 sm:px-6">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentPath === item.href ||
                  currentPath.startsWith(`${item.href}/`);

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group flex min-h-12 items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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
          </aside>
        </div>
      ) : null}
    </>
  );
}
