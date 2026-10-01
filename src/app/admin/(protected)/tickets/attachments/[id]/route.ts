import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { uploadDirectory } from "@/lib/uploads";
import { ticketService } from "@/services/ticket.service";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { if (!(await getCurrentAdmin())) return new NextResponse("Unauthorized", { status: 401 }); const attachment = await ticketService.attachment((await params).id); if (!attachment) return new NextResponse("Not found", { status: 404 }); try { const data = await readFile(path.join(uploadDirectory(), attachment.storageName)); return new NextResponse(data, { headers: { "Content-Type": attachment.mimeType, "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(attachment.originalName)}`, "Cache-Control": "private, no-store" } }); } catch { return new NextResponse("Not found", { status: 404 }); } }
