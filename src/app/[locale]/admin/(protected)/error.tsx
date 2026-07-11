"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPages.admin");

  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-[900px]">
        <div className="rounded-xl border bg-white p-8 text-center">
          <AlertTriangle
            aria-hidden="true"
            className="mx-auto size-9 text-destructive"
          />
          <p className="mt-5 text-sm font-medium text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-2xl font-bold">{t("title")}</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            {t("description")}
          </p>
          {error.digest ? (
            <p className="mt-4 text-xs text-muted-foreground" dir="ltr">
              {t("reference")}: {error.digest}
            </p>
          ) : null}
          <Button className="mt-6" onClick={reset} type="button">
            {t("retry")}
          </Button>
        </div>
      </Container>
    </main>
  );
}
