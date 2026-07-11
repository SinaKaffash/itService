export type CreateLeadRequestData = {
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  serviceType: string;
  budget: string;
  description: string;
  locale: "fa" | "en";
  source: string;
};

export interface LeadRequestWriter {
  createLeadRequest(data: CreateLeadRequestData): Promise<{ id: string }>;
}
