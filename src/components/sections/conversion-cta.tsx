import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/layout/cta-button";
import { ContentImage } from "@/components/sections/content-image";

export async function ConversionCTA() {
  const t = await getTranslations("Common.cta");

  return (
    <section className="section-rhythm">
      <Container>
        <div className="ink-panel relative isolate overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute inset-0 -z-10 opacity-20">
            <ContentImage
              alt=""
              fallback="/images/marketing/cloud-operations.svg"
              image="/images/marketing/cloud-operations.svg"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-foreground/85" />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-grid opacity-10"
          />
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-7 text-background/70">
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
