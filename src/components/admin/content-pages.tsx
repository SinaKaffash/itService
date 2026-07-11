import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import type { ContentEntityType } from "@/core/admin-content";
import { Link } from "@/i18n/navigation";
import { adminContentService } from "@/services/admin-content.service";

import { ContentEditorForm } from "./content-editor-form";
import { ContentList } from "./content-list";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const routeNames: Record<ContentEntityType, string> = {
  service: "services",
  portfolio: "portfolio",
  blog: "blog",
};

export async function AdminContentListPage({
  entity,
}: {
  entity: ContentEntityType;
}) {
  const [t, records] = await Promise.all([
    getTranslations("AdminContent"),
    adminContentService.list(entity),
  ]);

  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-[1400px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {t(`entities.${entity}.title`)}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {t(`entities.${entity}.description`)}
            </p>
          </div>
          <Button asChild>
            <Link href={`/admin/${routeNames[entity]}/new`}>
              {t("add")}
            </Link>
          </Button>
        </div>
        <div className="mt-8">
          <ContentList entity={entity} records={records} />
        </div>
      </Container>
    </main>
  );
}

export async function AdminContentEditorPage({
  entity,
  id,
}: {
  entity: ContentEntityType;
  id?: string;
}) {
  const [t, record] = await Promise.all([
    getTranslations("AdminContent"),
    id ? adminContentService.get(entity, id) : null,
  ]);

  if (id && !record) notFound();

  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-5xl">
        <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-bold">
          {record ? t("editTitle") : t("createTitle")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t(`entities.${entity}.formDescription`)}
        </p>
        <div className="mt-8">
          <ContentEditorForm entity={entity} record={record ?? undefined} />
        </div>
      </Container>
    </main>
  );
}
