"use client";
import { useState } from "react";
import { lookupTicketAction } from "@/actions/ticket.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const statuses = { NEW: "ثبت شده", IN_PROGRESS: "در حال بررسی", RESOLVED: "حل شده", CLOSED: "بسته شده" } as const;
export function TicketLookupForm() { const [result, setResult] = useState<Awaited<ReturnType<typeof lookupTicketAction>> | null>(null); const ticket = result && "ticket" in result ? result.ticket : null; return <form className="grid gap-5" action={async form => setResult(await lookupTicketAction(Object.fromEntries(form.entries())))}><label className="grid gap-2"><Label>کد پیگیری</Label><Input dir="ltr" name="trackingCode" placeholder="TKT-XXXXXXXXXXXX" required /></label><label className="grid gap-2"><Label>ایمیل ثبت‌شده</Label><Input dir="ltr" name="email" type="email" required /></label><Button type="submit">پیگیری تیکت</Button>{result && (ticket ? <div className="rounded-xl border bg-muted/40 p-5"><p className="font-bold">{ticket.title}</p><p className="mt-2 text-sm">وضعیت: {statuses[ticket.status]}</p><p className="mt-1 text-sm text-muted-foreground">آخرین به‌روزرسانی: {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ticket.updatedAt))}</p></div> : <p className="text-sm text-destructive">تیکتی با این مشخصات پیدا نشد یا درخواست‌های شما بیش از حد مجاز است.</p>)}</form>; }
