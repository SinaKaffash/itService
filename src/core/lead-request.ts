export type CreateLeadRequestData = {
  locale?: "fa" | "en";
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  serviceType: string;
  budget: string;
  description: string;
  source: string;
};

export interface LeadRequestWriter {
  createLeadRequest(data: CreateLeadRequestData): Promise<{ id: string }>;
}
