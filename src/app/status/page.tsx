import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { AnnouncementCards, ServiceStatusList } from "@/components/operations/public-operations";
import { listPublicAnnouncements, listPublicItServices } from "@/services/operations.service";
export const metadata: Metadata = { title: "وضعیت خدمات IT", description: "وضعیت لحظه‌ای سرویس‌های فناوری اطلاعات" };
export default async function StatusPage() { const [services, announcements] = await Promise.all([listPublicItServices(), listPublicAnnouncements()]); return <main className="py-14"><Container className="grid max-w-5xl gap-14 lg:grid-cols-2"><section><p className="text-sm font-semibold text-primary">پایش سرویس</p><h1 className="mt-2 text-4xl font-black">وضعیت خدمات IT</h1><div className="mt-8"><ServiceStatusList services={services} /></div></section><section><p className="text-sm font-semibold text-primary">آخرین خبرها</p><h2 className="mt-2 text-3xl font-black">اطلاعیه‌ها</h2><div className="mt-8"><AnnouncementCards announcements={announcements} /></div></section></Container></main>; }
