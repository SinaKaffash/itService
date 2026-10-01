import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { TicketForm } from "@/components/forms/ticket-form";
export const metadata: Metadata = { title: "ثبت تیکت" };
export default function NewTicketPage() { return <main className="py-14"><Container className="max-w-2xl"><p className="text-sm font-semibold text-primary">پشتیبانی</p><h1 className="mt-2 text-4xl font-black">ثبت تیکت</h1><p className="mt-4 text-muted-foreground">درخواست خود را ثبت کنید تا تیم پشتیبانی آن را بررسی کند.</p><div className="mt-10 rounded-2xl border bg-card p-6 sm:p-8"><TicketForm /></div></Container></main>; }
