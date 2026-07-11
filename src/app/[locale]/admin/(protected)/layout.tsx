import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [admin, t, messages] = await Promise.all([
    getCurrentAdmin(),
    getTranslations("AdminNavigation"),
    import(`../../../../messages/${locale}.json`).then((mod) => mod.default),
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
