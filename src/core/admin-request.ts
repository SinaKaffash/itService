export const leadRequestStatuses = [
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "QUALIFIED",
  "WON",
  "LOST",
  "ARCHIVED",
] as const;

export type LeadStatus = (typeof leadRequestStatuses)[number];

export type AdminLeadRequest = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  company: string | null;
  serviceType: string;
  budget: string | null;
  description: string;
  locale: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type RequestDashboardSummary = {
  total: number;
  new: number;
  inReview: number;
  qualified: number;
};

export type RequestListPage = {
  requests: readonly AdminLeadRequest[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export interface AdminRequestRepository {
  getSummary(): Promise<RequestDashboardSummary>;
  listPage(input: { page: number; pageSize: number }): Promise<RequestListPage>;
  listRecent(limit: number): Promise<readonly AdminLeadRequest[]>;
  findById(id: string): Promise<AdminLeadRequest | null>;
  updateStatus(id: string, status: LeadStatus): Promise<boolean>;
  archive(id: string): Promise<boolean>;
}
