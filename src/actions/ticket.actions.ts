"use server";
import { headers } from "next/headers";
import { ticketInputSchema, ticketLookupSchema, ticketUpdateSchema } from "@/features/operations/operations.schema";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { allowRateLimit } from "@/lib/rate-limit";
import { removeUploads, storeUpload } from "@/lib/uploads";
import { ticketService } from "@/services/ticket.service";

function clientKey(scope: string) { return headers().then(h => `${scope}:${h.get("x-forwarded-for")?.split(",")[0] ?? "unknown"}`); }
export async function submitTicketAction(form: FormData) { if (!allowRateLimit(await clientKey("ticket"), 5, 60_000)) return { success: false, code: "RATE_LIMIT" as const }; const parsed = ticketInputSchema.safeParse(Object.fromEntries(form.entries())); if (!parsed.success || parsed.data.honeypot) return { success: false, code: "VALIDATION" as const }; const files = form.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0); if (files.length > 3) return { success: false, code: "ATTACHMENT" as const }; const saved: Awaited<ReturnType<typeof storeUpload>>[] = []; try { for (const file of files) saved.push(await storeUpload(file)); const ticket = await ticketService.create(parsed.data, saved); return { success: true, trackingCode: ticket.trackingCode }; } catch { await removeUploads(saved.map(file => file.storageName)); return { success: false, code: "ATTACHMENT" as const }; } }
export async function lookupTicketAction(input: unknown) { if (!allowRateLimit(await clientKey("ticket-lookup"), 8, 60_000)) return { success: false, code: "RATE_LIMIT" as const }; const parsed = ticketLookupSchema.safeParse(input); if (!parsed.success) return { success: false, code: "VALIDATION" as const }; const ticket = await ticketService.lookup(parsed.data.trackingCode, parsed.data.email); return ticket ? { success: true, ticket } : { success: false, code: "NOT_FOUND" as const }; }
export async function updateTicketAction(input: unknown) { if (!(await getCurrentAdmin())) return { success: false }; const parsed = ticketUpdateSchema.safeParse(input); if (!parsed.success) return { success: false }; await ticketService.update(parsed.data); return { success: true }; }
