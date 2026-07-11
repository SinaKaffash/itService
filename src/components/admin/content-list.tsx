import { Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type {
  AdminContentRecord,
  ContentEntityType,
} from "@/core/admin-content";
import { Link } from "@/i18n/navigation";

import { ContentDeleteButton } from "./content-delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const routeNames: Record<ContentEntityType, string> = {
  service: "services",
  portfolio: "portfolio",
  blog: "blog",
};

export async function ContentList({
  entity,
  records,
}: {
  entity: ContentEntityType;
  records: readonly AdminContentRecord[];
}) {
  const t = await getTranslations("AdminContent");

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-white py-16 text-center">
        <p className="font-medium">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="px-4">{t("columns.title")}</TableHead>
            <TableHead className="hidden px-4 md:table-cell">
              {t("columns.slug")}
            </TableHead>
            <TableHead className="px-4">{t("columns.state")}</TableHead>
            <TableHead className="px-4 text-end">
              {t("columns.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="px-4 py-4">
                <p className="font-medium">{record.translations.fa.title}</p>
                <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                  {record.translations.en.title}
                </p>
              </TableCell>
              <TableCell
                className="hidden px-4 font-mono text-xs md:table-cell"
                dir="ltr"
              >
                {record.slug}
              </TableCell>
              <TableCell className="px-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={
                      record.published
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }
                    variant="outline"
                  >
                    {record.published ? t("published") : t("draft")}
                  </Badge>
                  {!record.isActive ? (
                    <Badge variant="outline">{t("inactive")}</Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="px-4">
                <div className="flex justify-end gap-1">
                  <Button asChild size="icon" variant="ghost">
                    <Link
                      aria-label={t("edit")}
                      href={`/admin/${routeNames[entity]}/${record.id}/edit`}
                    >
                      <Pencil aria-hidden="true" />
                    </Link>
                  </Button>
                  <ContentDeleteButton entity={entity} id={record.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
