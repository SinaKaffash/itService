import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "@/lib/messages";
import { getMessages, getTranslations } from "@/lib/messages";

import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { pickClientMessages } from "@/messages/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "fa";
  const [admin, t, messages] = await Promise.all([
    getCurrentAdmin(),
    getTranslations("AdminNavigation"),
    getMessages(),
  ]);

  if (!admin) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <AdminShell
      admin={admin}
      labels={{
        brand: t("brand"),
        dashboard: t("dashboard"),
        menu: t("menu"),
        close: t("close"),
        requests: t("requests"),
        services: t("services"),
        portfolio: t("portfolio"),
        blog: t("blog"),
        users: t("users"),
        projects: "پروژه‌ها",
        itServices: "وضعیت IT",
        announcements: "اطلاعیه‌ها",
        tickets: "تیکت‌ها",
        signedInAs: t("signedInAs"),
        logout: t("logout"),
      }}
      locale={locale}
    >
      <NextIntlClientProvider
        messages={pickClientMessages(messages, [
          "AdminAuth",
          "AdminUsers",
          "AdminRequests",
          "AdminContent",
          "Common",
        ])}
      >
        {children}
      </NextIntlClientProvider>
    </AdminShell>
  );
}
