"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  labels: {
    english: string;
    label: string;
    persian: string;
    shortLabel: string;
  };
  locale: string;
  side?: "bottom" | "top";
};

function localizedPath(pathname: string, nextLocale: "fa" | "en") {
  const segments = pathname.split("/");
  if (segments[1] === "fa" || segments[1] === "en") {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
}

export function LocaleSwitcher({
  labels,
  locale,
  side = "bottom",
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" dir={locale === "fa" ? "rtl" : "ltr"}>
      <Button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={labels.label}
        className="gap-2 rounded-xl"
        onClick={() => setOpen((value) => !value)}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Languages aria-hidden="true" />
        <span className="hidden sm:inline">{labels.shortLabel}</span>
      </Button>
      {open ? (
        <>
          <button
            aria-label={labels.label}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            type="button"
          />
          <div
            className={cn(
              "absolute end-0 z-50 min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            )}
            role="menu"
          >
            <Link
              className="block cursor-default select-none rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
              href={localizedPath(pathname, "fa")}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              {labels.persian}
            </Link>
            <Link
              className="block cursor-default select-none rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
              href={localizedPath(pathname, "en")}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              {labels.english}
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
