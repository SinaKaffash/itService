import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { ticketInputSchema, ticketUpdateSchema } from "@/features/operations/operations.schema";

type TicketInput = z.output<typeof ticketInputSchema>;
export type AttachmentInput = { originalName: string; storageName: string; mimeType: string; size: number };
function code() { return `TKT-${randomBytes(9).toString("hex").toUpperCase().slice(0, 12)}`; }
export class TicketService {
  async create(input: TicketInput, attachments: AttachmentInput[]) { for (let attempt = 0; attempt < 3; attempt += 1) { try { return await prisma.supportTicket.create({ data: { trackingCode: code(), requesterName: input.requesterName, email: input.email.toLowerCase(), phone: input.phone || null, category: input.category, title: input.title, description: input.description, priority: input.priority, attachments: { create: attachments } }, select: { trackingCode: true } }); } catch (error: unknown) { if (attempt === 2) throw error; } } throw new Error("Ticket creation failed"); }
  lookup(trackingCode: string, email: string) { return prisma.supportTicket.findFirst({ where: { trackingCode, email: email.toLowerCase() }, select: { trackingCode: true, category: true, title: true, priority: true, status: true, createdAt: true, updatedAt: true, resolvedAt: true } }); }
  list() { return prisma.supportTicket.findMany({ include: { attachments: true }, orderBy: { createdAt: "desc" } }); }
  get(id: string) { return prisma.supportTicket.findUnique({ where: { id }, include: { attachments: true } }); }
  update(input: z.output<typeof ticketUpdateSchema>) { return prisma.supportTicket.update({ where: { id: input.id }, data: { status: input.status, internalNotes: input.internalNotes, resolvedAt: input.status === "RESOLVED" ? new Date() : null } }); }
  attachment(id: string) { return prisma.ticketAttachment.findUnique({ where: { id }, include: { ticket: { select: { id: true } } } }); }
}
export const ticketService = new TicketService();
