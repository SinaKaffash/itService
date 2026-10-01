"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { announcementSchema, itServiceSchema, projectSchema } from "@/features/operations/operations.schema";
import { getCurrentAdmin } from "@/lib/auth/admin-session";
import { operationsService } from "@/services/operations.service";

async function authorized() { return Boolean(await getCurrentAdmin()); }
function refresh() { revalidateTag("operations"); ["/", "/projects", "/status", "/announcements", "/admin/projects", "/admin/it-services", "/admin/announcements"].forEach(path => revalidatePath(path)); }
export async function saveProjectAction(input: unknown) { const parsed = projectSchema.safeParse(input); if (!parsed.success || !(await authorized())) return { success: false }; await operationsService.saveProject(parsed.data); refresh(); return { success: true }; }
export async function deleteProjectAction(id: string) { if (!(await authorized())) return { success: false }; await operationsService.deleteProject(id); refresh(); return { success: true }; }
export async function saveItServiceAction(input: unknown) { const parsed = itServiceSchema.safeParse(input); if (!parsed.success || !(await authorized())) return { success: false }; await operationsService.saveItService(parsed.data); refresh(); return { success: true }; }
export async function deleteItServiceAction(id: string) { if (!(await authorized())) return { success: false }; await operationsService.deleteItService(id); refresh(); return { success: true }; }
export async function saveAnnouncementAction(input: unknown) { const parsed = announcementSchema.safeParse(input); if (!parsed.success || !(await authorized())) return { success: false }; await operationsService.saveAnnouncement(parsed.data); refresh(); return { success: true }; }
export async function deleteAnnouncementAction(id: string) { if (!(await authorized())) return { success: false }; await operationsService.deleteAnnouncement(id); refresh(); return { success: true }; }
