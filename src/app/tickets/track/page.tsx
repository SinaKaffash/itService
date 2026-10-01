import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { TicketLookupForm } from "@/components/forms/ticket-lookup-form";
export const metadata: Metadata = { title: "پیگیری تیکت" };
export default function TrackTicketPage() { return <main className="py-14"><Container className="max-w-xl"><h1 className="text-4xl font-black">پیگیری تیکت</h1><p className="mt-4 text-muted-foreground">کد پیگیری و ایمیل ثبت‌شده را وارد کنید.</p><div className="mt-10 rounded-2xl border bg-card p-6"><TicketLookupForm /></div></Container></main>; }
