import { z } from "zod";

import { leadRequestStatuses } from "@/core/admin-request";

export const updateRequestStatusSchema = z.object({
  id: z.string().min(1),
  locale: z.enum(["fa", "en"]),
  status: z.enum(leadRequestStatuses),
});

export const archiveRequestSchema = z.object({
  id: z.string().min(1),
  locale: z.enum(["fa", "en"]),
});
