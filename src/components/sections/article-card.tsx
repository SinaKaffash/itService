import { ArrowUpLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ArticleCard({
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
    <Card className="h-full border-black/[0.08] shadow-none transition-colors hover:border-primary/30">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">{category}</Badge>
          <span className="text-xs text-muted-foreground">{meta}</span>
        </div>
        <h2 className="mt-8 text-xl font-bold leading-8">{title}</h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
          {excerpt}
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          href={`/blog/${slug}`}
        >
          {action}
          <ArrowUpLeft
            aria-hidden="true"
            className="size-4 rtl:-scale-x-100"
          />
        </Link>
      </CardContent>
    </Card>
  );
}
