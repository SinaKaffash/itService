import type { PublicPortfolio, ServiceIcon } from "@/core/public-content";

import {
  CaseStudyCard,
  ServicePreviewCard,
} from "@/components/sections/public-design";

export function ServiceCard({
  slug,
  icon,
  title,
  description,
  action,
  index = 0,
}: {
  slug: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  action: string;
  index?: number;
}) {
  return (
    <ServicePreviewCard
      action={action}
      description={description}
      icon={icon}
      index={index}
      slug={slug}
      title={title}
    />
  );
}

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
    <CaseStudyCard
      action={action}
      category={category}
      description={description}
      item={item}
      title={title}
    />
  );
}
