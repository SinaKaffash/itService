import { prisma } from "@/lib/prisma";
import type { AnnouncementInput, ItServiceInput, ProjectInput } from "@/features/operations/operations.schema";

export class PrismaOperationsRepository {
  listProjects(admin = false) {
    return prisma.project.findMany({
      where: admin
        ? {}
        : {
            published: true,
            isActive: true,
            status: { notIn: ["COMPLETED", "CANCELLED"] },
          },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }
  project(id: string) { return prisma.project.findUnique({ where: { id } }); }
  saveProject(input: ProjectInput) { const { id, ...data } = input; return id ? prisma.project.update({ where: { id }, data }) : prisma.project.create({ data }); }
  deleteProject(id: string) { return prisma.project.delete({ where: { id } }); }
  listItServices(admin = false) { return prisma.itServiceStatus.findMany({ where: admin ? {} : { published: true, isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }); }
  itService(id: string) { return prisma.itServiceStatus.findUnique({ where: { id } }); }
  saveItService(input: ItServiceInput) { const { id, ...data } = input; const withDate = { ...data, lastUpdatedAt: new Date() }; return id ? prisma.itServiceStatus.update({ where: { id }, data: withDate }) : prisma.itServiceStatus.create({ data: withDate }); }
  deleteItService(id: string) { return prisma.itServiceStatus.delete({ where: { id } }); }
  listAnnouncements(admin = false) { const now = new Date(); return prisma.announcement.findMany({ where: admin ? {} : { published: true, isActive: true, publishAt: { lte: now }, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }, orderBy: [{ pinned: "desc" }, { publishAt: "desc" }] }); }
  announcement(id: string) { return prisma.announcement.findUnique({ where: { id } }); }
  saveAnnouncement(input: AnnouncementInput) { const { id, ...data } = input; return id ? prisma.announcement.update({ where: { id }, data: { ...data, publishAt: data.publishAt! } }) : prisma.announcement.create({ data: { ...data, publishAt: data.publishAt! } }); }
  deleteAnnouncement(id: string) { return prisma.announcement.delete({ where: { id } }); }
}
