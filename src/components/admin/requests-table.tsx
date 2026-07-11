import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminLeadRequest } from "@/core/admin-request";
import { Link } from "@/i18n/navigation";

import { RequestStatusBadge } from "./request-status-badge";

function serviceTranslationKey(serviceType: string) {
  const keys: Record<string, string> = {
    "web-platforms": "web",
    "mobile-applications": "mobile",
    "it-infrastructure": "infrastructure",
    "custom-dashboards": "dashboard",
  };
  return keys[serviceType] ?? "unknown";
}

export async function RequestsTable({
  locale,
  page,
  pageSize,
  requests,
  total,
  totalPages,
}: {
  locale: string;
  page?: number;
  pageSize?: number;
  requests: readonly AdminLeadRequest[];
  total?: number;
  totalPages?: number;
}) {
  const t = await getTranslations("AdminRequests");
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center">
        <p className="font-medium">{t("emptyTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  const hasPagination =
    typeof page === "number" &&
    typeof pageSize === "number" &&
    typeof total === "number" &&
    typeof totalPages === "number";

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="px-4">{t("columns.contact")}</TableHead>
            <TableHead className="hidden px-4 md:table-cell">
              {t("columns.service")}
            </TableHead>
            <TableHead className="px-4">{t("columns.status")}</TableHead>
            <TableHead className="hidden px-4 lg:table-cell">
              {t("columns.received")}
            </TableHead>
            <TableHead className="px-4 text-end">
              {t("columns.action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="px-4 py-4">
                <p className="font-medium">{request.fullName}</p>
                <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                  {request.phone}
                </p>
              </TableCell>
              <TableCell className="hidden px-4 md:table-cell">
                {t(
                  `serviceTypes.${serviceTranslationKey(request.serviceType)}`,
                )}
              </TableCell>
              <TableCell className="px-4">
                <RequestStatusBadge
                  label={t(`statuses.${request.status}`)}
                  status={request.status}
                />
              </TableCell>
              <TableCell className="hidden px-4 text-muted-foreground lg:table-cell">
                {formatter.format(request.createdAt)}
              </TableCell>
              <TableCell className="px-4 text-end">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/admin/requests/${request.id}`}>
                    {t("view")}
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {hasPagination && totalPages > 1 ? (
        <div className="flex flex-col gap-3 border-t px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t("pagination.summary", {
              end: Math.min(page * pageSize, total),
              start: (page - 1) * pageSize + 1,
              total,
            })}
          </p>
          <div className="flex items-center gap-2">
            {page <= 1 ? (
              <Button disabled size="sm" variant="outline">
                {t("pagination.previous")}
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/requests?page=${page - 1}`}>
                  {t("pagination.previous")}
                </Link>
              </Button>
            )}
            {page >= totalPages ? (
              <Button disabled size="sm" variant="outline">
                {t("pagination.next")}
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/requests?page=${page + 1}`}>
                  {t("pagination.next")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
