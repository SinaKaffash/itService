import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProjectCards } from "@/components/operations/public-operations";
import { getTranslations } from "@/lib/messages";
import { listPublicProjects } from "@/services/operations.service";
export const metadata: Metadata = { title: "پروژه‌های در حال اجرا", description: "پیگیری عمومی پیشرفت پروژه‌های در حال اجرای تیم" };
export default async function ProjectsPage() { const [projects, t] = await Promise.all([listPublicProjects(), getTranslations("Projects")]); return <main className="py-14"><Container className="max-w-5xl"><p className="text-sm font-semibold text-primary">{t("eyebrow")}</p><h1 className="mt-2 text-4xl font-black">{t("title")}</h1><p className="mt-4 text-muted-foreground">{t("description")}</p><div className="mt-10"><ProjectCards labels={{ empty: t("empty"), expectedEnd: t("expectedEnd"), progress: t("progress"), statuses: { PLANNED: t("statuses.planned"), IN_PROGRESS: t("statuses.inProgress"), ON_HOLD: t("statuses.onHold"), COMPLETED: t("statuses.completed"), CANCELLED: t("statuses.cancelled") } }} projects={projects} /></div></Container></main>; }
