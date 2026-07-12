import type { Metadata } from "next";
import {
  ArrowUpLeft,
  CheckCircle2,
  CircuitBoard,
  Gauge,
  Globe2,
  Layers3,
  MessageSquareText,
  type LucideIcon,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UsersRound,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/layout/cta-button";
import {
  CaseStudyCard,
  InsightCard,
  ProcessTimeline,
  SectionShell,
  ServicePreviewCard,
  TrustMetric,
} from "@/components/sections/public-design";
import { SectionHeader } from "@/components/sections/section-header";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import type { PublicContentLocale } from "@/core/public-content";
import { Link } from "@/i18n/navigation";
import {
  createLocalizedMetadata,
  type SeoLocale,
} from "@/lib/seo";
import {
  listPublicBlogPosts,
  listPublicPortfolio,
} from "@/services/public-content.service";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

const proofIcons = [UsersRound, TerminalSquare, ShieldCheck];

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, seo] = await Promise.all([
    getTranslations({ locale, namespace: "Home" }),
    getTranslations({ locale, namespace: "Seo" }),
  ]);
  return createLocalizedMetadata({
    locale: locale as SeoLocale,
    title: t("title"),
    description: t("description"),
    siteName: seo("siteName"),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, seo, portfolioT, blogT, requestT, portfolioItems, posts] =
    await Promise.all([
      getTranslations("Home"),
      getTranslations("Seo"),
      getTranslations("Portfolio"),
      getTranslations("Blog"),
      getTranslations("Request"),
      listPublicPortfolio(locale as PublicContentLocale),
      listPublicBlogPosts(locale as PublicContentLocale),
    ]);
  const faqKeys = ["q1", "q2", "q3"] as const;
  const services = ["web", "mobile", "infrastructure"] as const;
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <main className="overflow-hidden">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqKeys.map((key) => ({
            "@type": "Question",
            name: seo(`faq.${key}.question`),
            acceptedAnswer: {
              "@type": "Answer",
              text: seo(`faq.${key}.answer`),
            },
          })),
        }}
      />
      <section className="relative isolate overflow-hidden border-b bg-surface/45">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-grid opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_6%,hsl(var(--primary)/0.18),transparent_31rem),radial-gradient(circle_at_86%_12%,hsl(var(--foreground)/0.08),transparent_26rem)]"
        />
        <Container className="grid min-h-[calc(100vh-4rem)] gap-12 py-14 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-24">
          <div className="max-w-3xl">
            <Badge
              className="mb-6 border-primary/25 bg-primary/10 text-primary hover:bg-primary/10"
              variant="outline"
            >
              <span className="me-2 size-1.5 rounded-full bg-primary" />
              {t("eyebrow")}
            </Badge>
            <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
              {t("description")}
            </p>
            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <CTAButton href="/request" showArrow>
                {t("primaryAction")}
              </CTAButton>
              <CTAButton href="/portfolio" variant="outline">
                {portfolioT("viewProject")}
              </CTAButton>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[t("visual.proofOne"), t("visual.proofTwo"), t("visual.proofThree")].map(
                (item, index) => {
                  const Icon = proofIcons[index];
                  return (
                    <div className="rounded-2xl border bg-card/80 p-4 shadow-[0_1px_0_hsl(var(--foreground)/0.04)]" key={item}>
                      <Icon aria-hidden="true" className="mb-3 size-5 text-primary" />
                      <p className="text-sm font-bold leading-6">{item}</p>
                    </div>
                  );
                },
              )}
            </div>
          </div>
          <HeroStudioVisual
            buildLabel={t("visual.build")}
            discoveryLabel={t("visual.discovery")}
            launchLabel={t("visual.launch")}
            liveLabel={t("visual.live")}
            mapLabel={t("visual.map")}
            noteLabel={t("visual.note")}
            panelTitle={t("visual.panelTitle")}
          />
        </Container>
      </section>

      <SectionShell>
          <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
            <SectionHeader
              className="lg:sticky lg:top-28"
              description={t("servicesDescription")}
              eyebrow={t("servicesEyebrow")}
              title={t("servicesTitle")}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service, index) => (
                <div className={index === 0 ? "md:col-span-2" : ""} key={service}>
                  <ServicePreviewCard
                    action={t("secondaryAction")}
                    description={t(`services.${service}.description`)}
                    icon={index === 0 ? "globe" : index === 1 ? "mobile" : "server"}
                    index={index}
                    slug={
                      service === "web"
                        ? "web-platforms"
                        : service === "mobile"
                          ? "mobile-applications"
                          : "it-infrastructure"
                    }
                    title={t(`services.${service}.title`)}
                  />
                </div>
              ))}
            </div>
          </div>
      </SectionShell>

      <SectionShell tone="muted">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionHeader
              description={requestT("description")}
              eyebrow={requestT("eyebrow")}
              title={requestT("expectTitle")}
            />
            <ProcessTimeline
              items={(["discovery", "scope", "response"] as const).map((item) => ({
                description: requestT(`steps.${item}.description`),
                title: requestT(`steps.${item}.title`),
              }))}
            />
          </div>
      </SectionShell>

      {portfolioItems.length > 0 ? (
        <SectionShell>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeader
                description={portfolioT("description")}
                eyebrow={portfolioT("eyebrow")}
                title={portfolioT("title")}
              />
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                href="/portfolio"
              >
                {portfolioT("viewProject")}
                <ArrowUpLeft aria-hidden="true" className="size-4 rtl-flip" />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-12 lg:grid-cols-3">
              {portfolioItems.slice(0, 3).map((item, index) => (
                <div className={index === 1 ? "lg:mt-10" : ""} key={item.slug}>
                  <CaseStudyCard
                    action={portfolioT("viewProject")}
                    category={item.category || portfolioT("fallbackCategory")}
                    description={item.description}
                    item={item}
                    title={item.title}
                  />
                </div>
              ))}
            </div>
        </SectionShell>
      ) : null}

      <SectionShell tone="muted" containerClassName="grid gap-10 lg:grid-cols-2 lg:items-center">
          <ReliabilityVisual
            operational={t("proof.operational")}
            response={t("proof.response")}
            status={t("proof.status")}
            uptime={t("proof.uptime")}
          />
          <div>
            <Badge variant="secondary">{t("proof.badge")}</Badge>
            <h2 className="mt-5 text-balance text-3xl font-black tracking-tight sm:text-4xl">
              {t("proof.title")}
            </h2>
            <p className="mt-5 max-w-xl text-pretty leading-8 text-muted-foreground">
              {t("proof.description")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <TrustMetric icon={Gauge} label={t("proof.uptime")} value="99.99%" />
              <TrustMetric icon={ShieldCheck} label={t("proof.response")} value="<25ms" />
            </div>
          </div>
      </SectionShell>

      {posts.length > 0 ? (
        <SectionShell>
            <SectionHeader
              description={blogT("description")}
              eyebrow={blogT("eyebrow")}
              title={blogT("title")}
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <InsightCard
                  action={blogT("readArticle")}
                  category={post.category || blogT("fallbackCategory")}
                  excerpt={post.description}
                  key={post.slug}
                  meta={blogT("meta", {
                    date: formatter.format(new Date(post.publishedAt)),
                    minutes: post.readTime,
                  })}
                  slug={post.slug}
                  title={post.title}
                />
              ))}
            </div>
        </SectionShell>
      ) : null}

      <SectionShell>
          <SectionHeader
            align="center"
            description={seo("faq.description")}
            title={seo("faq.title")}
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-2xl border bg-card/80 px-6 shadow-[var(--shadow-soft)]">
            {faqKeys.map((key) => (
              <div className="py-6" key={key}>
                <h2 className="font-black">{seo(`faq.${key}.question`)}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {seo(`faq.${key}.answer`)}
                </p>
              </div>
            ))}
          </div>
      </SectionShell>
    </main>
  );
}

function HeroStudioVisual({
  buildLabel,
  discoveryLabel,
  launchLabel,
  liveLabel,
  mapLabel,
  noteLabel,
  panelTitle,
}: {
  buildLabel: string;
  discoveryLabel: string;
  launchLabel: string;
  liveLabel: string;
  mapLabel: string;
  noteLabel: string;
  panelTitle: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div aria-hidden="true" className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
      <div className="surface-panel relative overflow-hidden rounded-xl p-3 sm:p-4">
        <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="relative rounded-lg border bg-background/90 p-4 shadow-2xl sm:p-5">
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              <span className="truncate text-xs font-bold text-muted-foreground">
                {panelTitle}
              </span>
            </div>
            <span className="rounded-full bg-success/10 px-2.5 py-1 font-mono text-[0.68rem] font-semibold text-success" dir="ltr">
              {liveLabel}
            </span>
          </div>
          <div className="grid gap-4 pt-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-3">
              {[
                [discoveryLabel, "84%"],
                [buildLabel, "62%"],
                [launchLabel, "41%"],
              ].map(([label, width]) => (
                <div className="rounded-lg border bg-surface/65 p-3" key={label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold">{label}</span>
                    <span className="font-mono text-muted-foreground" dir="ltr">
                      {width}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width }} />
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
                <div className="flex items-start gap-3">
                  <MessageSquareText aria-hidden="true" className="mt-0.5 size-4 text-primary" />
                  <p className="text-xs font-semibold leading-5 text-primary">
                    {noteLabel}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-foreground p-4 text-background">
              <div className="mb-4 flex items-center gap-2">
                <CircuitBoard aria-hidden="true" className="size-5 text-primary" />
                <span className="text-sm font-black">{mapLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[Layers3, Globe2, ServerCog, CheckCircle2].map((Icon, index) => (
                  <div className="rounded-lg border border-background/10 bg-background/10 p-3" key={index}>
                    <Icon aria-hidden="true" className="mb-4 size-5 text-primary" />
                    <div className="h-1.5 w-16 rounded-full bg-background/25" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="quiet-panel absolute -bottom-5 hidden max-w-[16rem] rounded-xl p-4 shadow-[var(--shadow-soft)] md:block ltr:-left-6 rtl:-right-6">
        <Sparkles aria-hidden="true" className="mb-3 size-5 text-primary" />
        <p className="text-sm font-bold leading-6">{noteLabel}</p>
      </div>
    </div>
  );
}

function ReliabilityVisual({
  operational,
  response,
  status,
  uptime,
}: {
  operational: string;
  response: string;
  status: string;
  uptime: string;
}) {
  return (
    <div className="surface-panel relative overflow-hidden rounded-xl p-6">
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-25" />
      <div className="relative flex items-center justify-between border-b pb-5">
        <span className="text-sm font-black">{status}</span>
        <Badge className="border-success/25 bg-success/10 text-success hover:bg-success/10" variant="outline">
          {operational}
        </Badge>
      </div>
      <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
        <Metric icon={Gauge} label={uptime} value="99.99%" />
        <Metric icon={ShieldCheck} label={response} value="<25ms" />
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background/70 p-4">
      <Icon aria-hidden="true" className="mb-3 size-5 text-primary" />
      <p className="text-2xl font-black" dir="ltr">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
