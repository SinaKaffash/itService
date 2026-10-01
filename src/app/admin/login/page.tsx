import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "@/lib/messages";
import { getMessages, getTranslations, setRequestLocale } from "@/lib/messages";

import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { Container } from "@/components/layout/container";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { pickClientMessages } from "@/messages/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  setRequestLocale("fa");
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  const [t, messages] = await Promise.all([
    getTranslations("AdminAuth"),
    getMessages(),
  ]);
  const formMessages = pickClientMessages(messages, ["AdminAuth", "Common"]);

  return (
    <main className="bg-muted/35 py-20 sm:py-28">
      <Container className="max-w-md">
        <div className="rounded-2xl border bg-white p-6 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.35)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t("description")}
          </p>
          <div className="mt-8">
            <NextIntlClientProvider messages={formMessages}>
              <AdminLoginForm />
            </NextIntlClientProvider>
          </div>
        </div>
      </Container>
    </main>
  );
}
