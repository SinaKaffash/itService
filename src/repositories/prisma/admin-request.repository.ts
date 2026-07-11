import type { Prisma } from "@prisma/client";

import type {
  AdminLeadRequest,
  AdminRequestRepository,
  LeadStatus,
  RequestListPage,
} from "@/core/admin-request";
import { prisma } from "@/lib/prisma";

const requestSelect = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  company: true,
  serviceType: true,
  budget: true,
  description: true,
  locale: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

type SelectedRequest = Prisma.LeadRequestGetPayload<{
  select: typeof requestSelect;
}>;

function toDomainRequest(
  request: SelectedRequest | null,
): AdminLeadRequest | null {
  if (!request) return null;

  return {
    id: request.id,
    fullName: request.fullName,
    phone: request.phone,
    email: request.email,
    company: request.company,
    serviceType: request.serviceType,
    budget: request.budget,
    description: request.description,
    locale: request.locale,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

export class PrismaAdminRequestRepository
  implements AdminRequestRepository
{
  async getSummary() {
    const [total, newCount, inReview, qualified] = await prisma.$transaction([
      prisma.leadRequest.count({
        where: { status: { not: "ARCHIVED" } },
      }),
      prisma.leadRequest.count({ where: { status: "NEW" } }),
      prisma.leadRequest.count({ where: { status: "IN_REVIEW" } }),
      prisma.leadRequest.count({ where: { status: "QUALIFIED" } }),
    ]);

    return { total, new: newCount, inReview, qualified };
  }

  async listPage({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<RequestListPage> {
    const safePage = Math.max(1, page);
    const safePageSize = Math.min(Math.max(1, pageSize), 100);
    const [total, requests] = await prisma.$transaction([
      prisma.leadRequest.count(),
      prisma.leadRequest.findMany({
        select: requestSelect,
        orderBy: { createdAt: "desc" },
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),
    ]);

    return {
      requests,
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    };
  }

  listRecent(limit: number) {
    return prisma.leadRequest.findMany({
      where: { status: { not: "ARCHIVED" } },
      select: requestSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async findById(id: string) {
    const request = await prisma.leadRequest.findUnique({
      where: { id },
      select: requestSelect,
    });

    return toDomainRequest(request);
  }

  async updateStatus(id: string, status: LeadStatus) {
    const result = await prisma.leadRequest.updateMany({
      where: { id },
      data: { status },
    });
    return result.count === 1;
  }

  async archive(id: string) {
    return this.updateStatus(id, "ARCHIVED");
  }
}
