import type { LeadRequestWriter } from "@/core/lead-request";
import type { ValidatedLeadRequest } from "@/features/requests/lead-request.schema";
import { PrismaLeadRequestRepository } from "@/repositories/prisma/lead-request.repository";

export class SubmitLeadRequestService {
  constructor(private readonly repository: LeadRequestWriter) {}

  async execute(input: ValidatedLeadRequest): Promise<void> {
    if (input.honeypot.length > 0) {
      return;
    }

    await this.repository.createLeadRequest({
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || undefined,
      company: input.company || undefined,
      serviceType: input.serviceType,
      budget: input.budget,
      description: input.description,
      locale: input.locale,
      source: "website-consultation",
    });
  }
}

export const submitLeadRequestService = new SubmitLeadRequestService(
  new PrismaLeadRequestRepository(),
);
