import { z } from "zod";

export const serviceTypes = [
  "web-platforms",
  "mobile-applications",
  "it-infrastructure",
  "custom-dashboards",
] as const;

export const budgetRanges = ["starter", "growth", "scale", "custom"] as const;

const phonePattern = /^[+0-9\u06F0-\u06F9\u0660-\u0669\s()-]{7,24}$/;

export const leadRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "fullName" })
    .max(100, { message: "fullName" }),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, { message: "phone" }),
  email: z
    .string()
    .trim()
    .max(254, { message: "email" })
    .refine(
      (value) => value.length === 0 || z.email().safeParse(value).success,
      { message: "email" },
    ),
  company: z.string().trim().max(120, { message: "company" }),
  serviceType: z.enum(serviceTypes, { error: "serviceType" }),
  budget: z.enum(budgetRanges, { error: "budget" }),
  description: z
    .string()
    .trim()
    .min(20, { message: "description" })
    .max(2000, { message: "description" }),
  locale: z.enum(["fa", "en"], { error: "locale" }),
  honeypot: z.string().max(200),
});

export type LeadRequestFormValues = z.input<typeof leadRequestSchema>;
export type ValidatedLeadRequest = z.output<typeof leadRequestSchema>;
