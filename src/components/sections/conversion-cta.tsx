import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/layout/cta-button";

export async function ConversionCTA() {
  const t = await getTranslations("Common.cta");

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl bg-foreground px-6 py-14 text-center text-background sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.32),transparent_50%)]"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-background/65">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CTAButton href="/request" showArrow>
              {t("primary")}
            </CTAButton>
            <CTAButton
              className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
              href="/contact"
              variant="outline"
            >
              {t("secondary")}
            </CTAButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
