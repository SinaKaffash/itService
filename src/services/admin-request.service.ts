import type {
  AdminRequestRepository,
  LeadStatus,
} from "@/core/admin-request";
import { NotFoundError } from "@/lib/errors";
import { PrismaAdminRequestRepository } from "@/repositories/prisma/admin-request.repository";

export class AdminRequestService {
  constructor(private readonly repository: AdminRequestRepository) {}

  getDashboardSummary() {
    return this.repository.getSummary();
  }

  listRequests(page = 1, pageSize = 25) {
    return this.repository.listPage({ page, pageSize });
  }

  listRecentRequests(limit = 5) {
    return this.repository.listRecent(limit);
  }

  getRequest(id: string) {
    return this.repository.findById(id);
  }

  async updateStatus(id: string, status: LeadStatus) {
    const updated = await this.repository.updateStatus(id, status);
    if (!updated) {
      throw new NotFoundError("Lead request was not found.", {
        clientCode: "NOT_FOUND",
        context: { id, status },
      });
    }
  }

  async archiveRequest(id: string) {
    const archived = await this.repository.archive(id);
    if (!archived) {
      throw new NotFoundError("Lead request was not found.", {
        clientCode: "NOT_FOUND",
        context: { id },
      });
    }
  }
}

export const adminRequestService = new AdminRequestService(
  new PrismaAdminRequestRepository(),
);
