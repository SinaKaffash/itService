import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { AnnouncementCards } from "@/components/operations/public-operations";
import { listPublicAnnouncements } from "@/services/operations.service";
export const metadata: Metadata = { title: "اطلاعیه‌ها" };
export default async function AnnouncementsPage() { return <main className="py-14"><Container className="max-w-3xl"><h1 className="text-4xl font-black">اطلاعیه‌ها و خبرها</h1><div className="mt-10"><AnnouncementCards announcements={await listPublicAnnouncements()} /></div></Container></main>; }
