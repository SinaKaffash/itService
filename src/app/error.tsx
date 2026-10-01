"use client";

import { AlertTriangle } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/messages";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

export default function LocaleErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("ErrorPages.global");
  const reference = error.digest;

  return (
    <main className="py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <AlertTriangle
          aria-hidden="true"
          className="mx-auto size-10 text-destructive"
        />
        <p className="mt-5 text-sm font-medium text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          {t("description")}
        </p>
        {reference ? (
          <p className="mt-4 text-xs text-muted-foreground" dir="ltr">
            {t("reference")}: {reference}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} type="button">
            {t("retry")}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href={`/${locale}`}>{t("home")}</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
