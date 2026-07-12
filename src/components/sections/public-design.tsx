import {
  ArrowUpLeft,
  BarChart3,
  CheckCircle2,
  CloudCog,
  Globe2,
  LineChart,
  MessageSquareText,
  MoveUpLeft,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import type {
  PublicPortfolio,
  ServiceIcon,
} from "@/core/public-content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  tone?: "plain" | "muted" | "ink";
};

export function SectionShell({
  children,
  className,
  containerClassName,
  tone = "plain",
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-16 sm:py-20 lg:py-28",
        tone === "muted" && "border-y bg-surface/60",
        tone === "ink" && "bg-foreground text-background",
        className,
      )}
    >
      {tone !== "plain" ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-grid-soft opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
        />
      ) : null}
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function FeaturePanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "human-panel relative overflow-hidden rounded-2xl p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TrustMetric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border bg-card/75 p-5 shadow-[0_1px_0_hsl(var(--foreground)/0.04)]">
      <Icon aria-hidden="true" className="mb-5 size-5 text-primary" />
      <p className="text-2xl font-black tracking-tight" dir="ltr">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      {detail ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}

export function ProcessTimeline({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="relative grid gap-4 md:grid-cols-3">
      <div
        aria-hidden="true"
        className="absolute start-6 top-8 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-transparent via-border to-transparent md:block"
      />
      {items.map((item, index) => (
        <div
          className="relative rounded-2xl border bg-card/80 p-5 shadow-[0_1px_0_hsl(var(--foreground)/0.04)] transition-colors hover:border-primary/35"
          key={item.title}
        >
          <div className="mb-7 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full border bg-background text-sm font-black text-primary shadow-sm">
              {index + 1}
            </span>
            <span className="h-px flex-1 bg-border md:hidden" />
          </div>
          <h3 className="text-lg font-black tracking-tight">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

const serviceIcons = {
  globe: Globe2,
  mobile: Smartphone,
  server: CloudCog,
  dashboard: BarChart3,
} satisfies Record<ServiceIcon, typeof Globe2>;

export function ServicePreviewCard({
  slug,
  icon,
  title,
  description,
  action,
  index,
}: {
  slug: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  action: string;
  index: number;
}) {
  const Icon = serviceIcons[icon];
  const signals = ["Discovery", "Build", "Scale"];

  return (
    <Link
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={`/services/${slug}`}
    >
      <article className="human-panel flex h-full flex-col overflow-hidden rounded-2xl">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div className="flex size-12 items-center justify-center rounded-2xl border bg-accent/70 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon aria-hidden="true" className="size-5" />
            </div>
            <span className="font-mono text-xs text-muted-foreground" dir="ltr">
              0{index + 1}
            </span>
          </div>
          <h2 className="mt-8 text-2xl font-black tracking-tight">{title}</h2>
          <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="mt-auto border-t bg-surface/50 p-5">
          <div className="mb-5 flex flex-wrap gap-2">
            {signals.map((signal) => (
              <span
                className="rounded-full border bg-background/70 px-2.5 py-1 text-[0.68rem] font-semibold text-muted-foreground"
                key={signal}
              >
                {signal}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            {action}
            <MoveUpLeft
              aria-hidden="true"
              className="size-4 transition-transform group-hover:-translate-y-0.5 rtl-flip"
            />
          </span>
        </div>
      </article>
    </Link>
  );
}

const portfolioThemes: Record<PublicPortfolio["theme"], string> = {
  cyan: "from-cyan-400/28 via-slate-950 to-zinc-950",
  violet: "from-violet-500/32 via-slate-950 to-zinc-950",
  emerald: "from-emerald-400/28 via-slate-950 to-zinc-950",
};

export function CaseStudyCard({
  item,
  title,
  category,
  description,
  action,
  featured = false,
}: {
  item: PublicPortfolio;
  title: string;
  category: string;
  description: string;
  action: string;
  featured?: boolean;
}) {
  return (
    <Link
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={`/portfolio/${item.slug}`}
    >
      <article
        className={cn(
          "grid h-full overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/35",
          featured && "lg:grid-cols-[1.1fr_0.9fr]",
        )}
      >
        <div
          className={cn(
            "relative min-h-64 overflow-hidden bg-gradient-to-br p-5",
            portfolioThemes[item.theme],
          )}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-18" />
          <div className="relative h-full rounded-xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex gap-1.5">
                <span className="size-1.5 rounded-full bg-white/40" />
                <span className="size-1.5 rounded-full bg-white/25" />
                <span className="size-1.5 rounded-full bg-white/15" />
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 font-mono text-[0.62rem] text-white/70">
                LIVE
              </span>
            </div>
            <div className="grid h-[calc(100%-2.25rem)] gap-3 pt-4">
              <div className="grid grid-cols-[0.75fr_1.25fr] gap-3">
                <div className="rounded-lg bg-white/10" />
                <div className="rounded-lg bg-primary/30" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-white/10" />
                <div className="rounded-lg bg-white/10" />
                <div className="rounded-lg bg-white/10" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {category}
          </p>
          <h2 className="mt-4 text-balance text-2xl font-black tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-pretty text-sm leading-7 text-muted-foreground">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.technologies.slice(0, featured ? 5 : 3).map((technology) => (
              <Badge key={technology} variant="outline">
                {technology}
              </Badge>
            ))}
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
            {action}
            <ArrowUpLeft aria-hidden="true" className="size-4 rtl-flip" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export function InsightCard({
  slug,
  category,
  title,
  excerpt,
  meta,
  action,
}: {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  meta: string;
  action: string;
}) {
  return (
    <Link
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={`/blog/${slug}`}
    >
      <article className="human-panel flex h-full flex-col rounded-2xl p-6 sm:p-7">
        <div className="mb-8 flex items-start justify-between gap-4">
          <Badge variant="outline">{category}</Badge>
          <span className="max-w-32 text-end text-xs leading-5 text-muted-foreground">
            {meta}
          </span>
        </div>
        <LineChart aria-hidden="true" className="mb-5 size-5 text-primary" />
        <h2 className="text-balance text-xl font-black leading-8">{title}</h2>
        <p className="mt-3 flex-1 text-pretty text-sm leading-7 text-muted-foreground">
          {excerpt}
        </p>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
          {action}
          <ArrowUpLeft
            aria-hidden="true"
            className="size-4 transition-transform group-hover:-translate-y-0.5 rtl-flip"
          />
        </span>
      </article>
    </Link>
  );
}

export function FormSidePanel({
  eyebrow,
  title,
  description,
  items,
  assurance,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  items: Array<{ title: string; description: string }>;
  assurance?: string;
}) {
  return (
    <div className="lg:sticky lg:top-28">
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 text-balance text-3xl font-black tracking-tight">
        {title}
      </h2>
      <p className="mt-4 text-pretty leading-8 text-muted-foreground">
        {description}
      </p>
      <div className="mt-8 space-y-4">
        {items.map((item, index) => (
          <div className="flex gap-4" key={item.title}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-card text-sm font-black text-primary">
              {index + 1}
            </span>
            <div>
              <h3 className="font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {assurance ? (
        <div className="mt-8 rounded-2xl border bg-card/75 p-5">
          <CheckCircle2 aria-hidden="true" className="size-5 text-success" />
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {assurance}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function ConversationCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <FeaturePanel>
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <MessageSquareText aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </FeaturePanel>
  );
}
