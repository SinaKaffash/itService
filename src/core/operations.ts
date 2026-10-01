import type { AnnouncementSeverity, ProjectStatus, ServiceHealth, TicketCategory, TicketPriority, TicketStatus } from "@prisma/client";

export type PublicProject = { id: string; title: string; description: string; progress: number; status: ProjectStatus; startDate: Date | null; expectedEndDate: Date | null; completedAt: Date | null };
export type PublicItService = { id: string; name: string; description: string; health: ServiceHealth; lastUpdatedAt: Date };
export type PublicAnnouncement = { id: string; title: string; body: string; severity: AnnouncementSeverity; publishAt: Date; expiresAt: Date | null; pinned: boolean };
export type TicketPublic = { trackingCode: string; category: TicketCategory; title: string; priority: TicketPriority; status: TicketStatus; createdAt: Date; updatedAt: Date; resolvedAt: Date | null };
export const ticketCategories = ["SOFTWARE", "HARDWARE", "ACCESS", "SOFTWARE_REQUEST", "NETWORK", "ACCOUNT", "OTHER"] as const;
export const ticketPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const ticketStatuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
export const projectStatuses = ["PLANNED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"] as const;
export const serviceHealths = ["OPERATIONAL", "DEGRADED", "OUTAGE", "MAINTENANCE"] as const;
export const announcementSeverities = ["INFO", "MAINTENANCE", "INCIDENT"] as const;
