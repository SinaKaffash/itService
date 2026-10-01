import { ClipboardList, Clock3, Sparkles, UserCheck } from "lucide-react";
import { getTranslations, setRequestLocale } from "@/lib/messages";

import { RequestsTable } from "@/components/admin/requests-table";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminRequestService } from "@/services/admin-request.service";
import { operationsService } from "@/services/operations.service";
import { ticketService } from "@/services/ticket.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const summaryIcons = [ClipboardList, Sparkles, Clock3, UserCheck];

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await (params ?? Promise.resolve({ locale: "fa" }));
  setRequestLocale(locale);
  const [t, summary, recentRequests, tickets, projects, itServices, announcements] = await Promise.all([
    getTranslations("AdminDashboard"),
    adminRequestService.getDashboardSummary(),
    adminRequestService.listRecentRequests(),
    ticketService.list(),
    operationsService.projects(true),
    operationsService.itServices(true),
    operationsService.announcements(true),
  ]);

  const summaryItems = [
    { key: "total", value: summary.total },
    { key: "new", value: summary.new },
    { key: "inReview", value: summary.inReview },
    { key: "qualified", value: summary.qualified },
  ] as const;

  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-[1400px]">
        <div>
          <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-bold">{t("title")}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item, index) => {
            const Icon = summaryIcons[index];
            return (
              <Card className="shadow-none" key={item.key}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(`summary.${item.key}`)}
                  </CardTitle>
                  <Icon aria-hidden="true" className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["تیکت‌های باز", tickets.filter((item) => item.status === "NEW" || item.status === "IN_PROGRESS").length],
            ["پروژه‌های فعال", projects.filter((item) => item.isActive && item.status === "IN_PROGRESS").length],
            ["اختلال سرویس", itServices.filter((item) => item.health === "DEGRADED" || item.health === "OUTAGE").length],
            ["اطلاعیه فعال", announcements.filter((item) => item.published && item.isActive).length],
          ].map(([label, value]) => <Card className="shadow-none" key={String(label)}><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{value}</p></CardContent></Card>)}
        </div>
        <div className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold">{t("recentTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("recentDescription")}
            </p>
          </div>
          <RequestsTable locale={locale} requests={recentRequests} />
        </div>
      </Container>
    </main>
  );
}
