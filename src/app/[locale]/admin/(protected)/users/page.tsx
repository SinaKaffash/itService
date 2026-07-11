import { redirect } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import { AdminUsersPanel } from "@/components/admin/admin-users-panel";
import { Container } from "@/components/layout/container";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { adminUserService } from "@/services/admin-user.service";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(`/${locale}/admin/login`);
  }
  if (admin.role !== "SUPER_ADMIN") {
    redirect(`/${locale}/admin/dashboard`);
  }

  const [users, t, format] = await Promise.all([
    adminUserService.list(),
    getTranslations("AdminUsers"),
    getFormatter(),
  ]);

  return (
    <Container className="py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">{t("eyebrow")}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("description")}</p>
      </div>
      <AdminUsersPanel
        currentAdminId={admin.id}
        users={users.map((user) => ({
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: format.dateTime(user.createdAt, {
            dateStyle: "medium",
          }),
        }))}
      />
    </Container>
  );
}
