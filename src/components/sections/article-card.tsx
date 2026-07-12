import { InsightCard } from "@/components/sections/public-design";

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
    <InsightCard
      action={action}
      category={category}
      excerpt={excerpt}
      meta={meta}
      slug={slug}
      title={title}
    />
  );
}
