import { ArrowUpLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { RequestMutations } from "@/components/admin/request-mutations";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { adminRequestService } from "@/services/admin-request.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function serviceTranslationKey(serviceType: string) {
  const keys: Record<string, string> = {
    "web-platforms": "web",
    "mobile-applications": "mobile",
    "it-infrastructure": "infrastructure",
    "custom-dashboards": "dashboard",
  };
  return keys[serviceType] ?? "unknown";
}

function budgetTranslationKey(budget: string | null) {
  return ["starter", "growth", "scale", "custom"].includes(budget ?? "")
    ? budget!
    : "unknown";
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const [t, request] = await Promise.all([
    getTranslations("AdminRequests"),
    adminRequestService.getRequest(id),
  ]);

  if (!request) notFound();

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  });

  const details = [
    { label: t("detail.phone"), value: request.phone, ltr: true },
    {
      label: t("detail.email"),
      value: request.email ?? t("notProvided"),
      ltr: Boolean(request.email),
    },
    {
      label: t("detail.company"),
      value: request.company ?? t("notProvided"),
    },
    {
      label: t("detail.service"),
      value: t(
        `serviceTypes.${serviceTranslationKey(request.serviceType)}`,
      ),
    },
    {
      label: t("detail.budget"),
      value: t(`budgets.${budgetTranslationKey(request.budget)}`),
    },
    {
      label: t("detail.received"),
      value: formatter.format(request.createdAt),
    },
  ];

  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-[1200px]">
        <Button asChild size="sm" variant="ghost">
          <Link href="/admin/requests">
            <ArrowUpLeft
              aria-hidden="true"
              className="rtl:-scale-x-100"
            />
            {t("back")}
          </Link>
        </Button>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              {t("detail.eyebrow")}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{request.fullName}</h1>
          </div>
          <RequestStatusBadge
            label={t(`statuses.${request.status}`)}
            status={request.status}
          />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-xl border bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold">{t("detail.contactTitle")}</h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd
                    className="mt-2 text-sm font-medium"
                    dir={detail.ltr ? "ltr" : undefined}
                  >
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
            <Separator className="my-8" />
            <h2 className="text-lg font-bold">{t("detail.description")}</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-muted-foreground">
              {request.description}
            </p>
          </div>
          <aside>
            <RequestMutations
              requestId={request.id}
              status={request.status}
            />
          </aside>
        </div>
      </Container>
    </main>
  );
}
