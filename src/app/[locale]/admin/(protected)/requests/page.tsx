import { getTranslations, setRequestLocale } from "next-intl/server";

import { RequestsTable } from "@/components/admin/requests-table";
import { Container } from "@/components/layout/container";
import { adminRequestService } from "@/services/admin-request.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number.parseInt(pageParam ?? "1", 10);
  setRequestLocale(locale);
  const [t, requestPage] = await Promise.all([
    getTranslations("AdminRequests"),
    adminRequestService.listRequests(Number.isFinite(page) ? page : 1),
  ]);

  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-[1400px]">
        <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-bold">{t("title")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-8">
          <RequestsTable
            locale={locale}
            page={requestPage.page}
            pageSize={requestPage.pageSize}
            requests={requestPage.requests}
            total={requestPage.total}
            totalPages={requestPage.totalPages}
          />
        </div>
      </Container>
    </main>
  );
}
