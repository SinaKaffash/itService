import {
  BarChart3,
  CloudCog,
  Globe2,
  Smartphone,
} from "lucide-react";

import type {
  PublicPortfolio,
  ServiceIcon,
} from "@/core/public-content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const icons = {
  globe: Globe2,
  mobile: Smartphone,
  server: CloudCog,
  dashboard: BarChart3,
} satisfies Record<ServiceIcon, typeof Globe2>;

export function ServiceCard({
  slug,
  icon,
  title,
  description,
  action,
}: {
  slug: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  action: string;
}) {
  const Icon = icons[icon];

  return (
    <Card className="group h-full border-black/[0.08] shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_-28px_hsl(var(--primary)/0.55)]">
      <CardHeader>
        <div className="mb-5 flex size-11 items-center justify-center rounded-lg border bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="leading-7">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          href={`/services/${slug}`}
        >
          {action}
        </Link>
      </CardContent>
    </Card>
  );
}

const portfolioThemes: Record<PublicPortfolio["theme"], string> = {
  cyan: "from-cyan-400/30 via-slate-950 to-slate-950",
  violet: "from-violet-500/35 via-slate-950 to-slate-950",
  emerald: "from-emerald-400/30 via-slate-950 to-slate-950",
};

export function PortfolioCard({
  item,
  title,
  category,
  description,
  action,
}: {
  item: PublicPortfolio;
  title: string;
  category: string;
  description: string;
  action: string;
}) {
  return (
    <Link className="group block" href={`/portfolio/${item.slug}`}>
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-xl border bg-gradient-to-br p-5",
          portfolioThemes[item.theme],
        )}
      >
        <div className="absolute inset-5 rounded-lg border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-2">
          <div className="flex gap-1.5 border-b border-white/10 p-3">
            <span className="size-1.5 rounded-full bg-white/30" />
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/10" />
          </div>
          <div className="grid h-[calc(100%-37px)] grid-cols-3 gap-3 p-4">
            <div className="rounded bg-white/10" />
            <div className="col-span-2 grid gap-3">
              <div className="rounded bg-primary/30" />
              <div className="rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {category}
        </p>
        <h2 className="mt-2 text-xl font-bold">{title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <p className="mt-4 text-sm font-semibold text-primary">{action}</p>
      </div>
    </Link>
  );
}
