import { unstable_cache } from "next/cache";
import { PrismaOperationsRepository } from "@/repositories/prisma/operations.repository";
import type { AnnouncementInput, ItServiceInput, ProjectInput } from "@/features/operations/operations.schema";

export class OperationsService {
  constructor(private readonly repository = new PrismaOperationsRepository()) {}
  projects(admin = false) { return this.repository.listProjects(admin); }
  project(id: string) { return this.repository.project(id); }
  saveProject(input: ProjectInput) { return this.repository.saveProject(input); }
  deleteProject(id: string) { return this.repository.deleteProject(id); }
  itServices(admin = false) { return this.repository.listItServices(admin); }
  itService(id: string) { return this.repository.itService(id); }
  saveItService(input: ItServiceInput) { return this.repository.saveItService(input); }
  deleteItService(id: string) { return this.repository.deleteItService(id); }
  announcements(admin = false) { return this.repository.listAnnouncements(admin); }
  announcement(id: string) { return this.repository.announcement(id); }
  saveAnnouncement(input: AnnouncementInput) { return this.repository.saveAnnouncement(input); }
  deleteAnnouncement(id: string) { return this.repository.deleteAnnouncement(id); }
}
export const operationsService = new OperationsService();
export const listPublicProjects = unstable_cache(() => operationsService.projects(), ["public-projects"], { revalidate: 300, tags: ["operations", "public-projects"] });
export const listPublicItServices = unstable_cache(() => operationsService.itServices(), ["public-it-services"], { revalidate: 60, tags: ["operations", "public-it-services"] });
export const listPublicAnnouncements = unstable_cache(() => operationsService.announcements(), ["public-announcements"], { revalidate: 60, tags: ["operations", "public-announcements"] });
