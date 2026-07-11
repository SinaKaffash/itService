import type {
  LeadRequestStatus,
  Prisma,
} from "@prisma/client";

import type {
  CreateLeadRequestData,
  LeadRequestWriter,
} from "@/core/lead-request";
import { prisma } from "@/lib/prisma";

export class PrismaLeadRequestRepository implements LeadRequestWriter {
  async createLeadRequest(data: CreateLeadRequestData) {
    const service = await prisma.service.findFirst({
      where: {
        slug: data.serviceType,
        isActive: true,
      },
      select: { id: true },
    });

    return prisma.leadRequest.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        company: data.company,
        serviceType: data.serviceType,
        budget: data.budget,
        description: data.description,
        locale: data.locale,
        source: data.source,
        serviceId: service?.id,
      },
      select: { id: true },
    });
  }

  create(data: Prisma.LeadRequestCreateInput) {
    return prisma.leadRequest.create({ data });
  }

  findById(id: string) {
    return prisma.leadRequest.findUnique({
      where: { id },
      include: { service: true },
    });
  }

  list(status?: LeadRequestStatus) {
    return prisma.leadRequest.findMany({
      where: status ? { status } : undefined,
      include: { service: true },
      orderBy: { createdAt: "desc" },
    });
  }

  updateStatus(id: string, status: LeadRequestStatus) {
    return prisma.leadRequest.update({
      where: { id },
      data: { status },
    });
  }

  update(id: string, data: Prisma.LeadRequestUpdateInput) {
    return prisma.leadRequest.update({ where: { id }, data });
  }
}
