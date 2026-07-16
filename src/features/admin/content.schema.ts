import { z } from "zod";

import { contentEntityTypes } from "@/core/admin-content";

const text = z.string().trim().min(2, { message: "required" }).max(5000);
const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      !value ||
      value.startsWith("/images/") ||
      value.startsWith("https://"),
    { message: "imageUrl" },
  );
const imageUrlList = z
  .string()
  .trim()
  .max(3000)
  .refine(
    (value) =>
      !value ||
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .every(
          (item) =>
            item.startsWith("/images/") || item.startsWith("https://"),
        ),
    { message: "imageUrl" },
  );

export const adminContentSchema = z
  .object({
    entity: z.enum(contentEntityTypes),
    id: z.string().optional(),
    slug: z
      .string()
      .trim()
      .max(120)
      .regex(/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u, {
        message: "slug",
      })
      .or(z.literal("")),
    titleFa: z.string().trim().min(2, { message: "required" }).max(200),
    titleEn: z.string().trim().min(2, { message: "required" }).max(200),
    descriptionFa: text,
    descriptionEn: text,
    categoryFa: z.string().trim().max(120),
    categoryEn: z.string().trim().max(120),
    contentFa: z.string().trim().max(20000),
    contentEn: z.string().trim().max(20000),
    icon: z.string().trim().max(80),
    coverImage: imageUrl,
    gallery: imageUrlList,
    technologies: z.string().trim().max(1000),
    sortOrder: z.coerce.number().int().min(0).max(10000),
    published: z.boolean(),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (
      value.entity === "portfolio" &&
      (!value.categoryFa || !value.categoryEn)
    ) {
      context.addIssue({
        code: "custom",
        message: "required",
        path: ["categoryFa"],
      });
    }

    if (
      value.entity === "blog" &&
      (value.contentFa.length < 20 || value.contentEn.length < 20)
    ) {
      context.addIssue({
        code: "custom",
        message: "content",
        path: ["contentFa"],
      });
    }
  });

export type AdminContentFormValues = z.input<typeof adminContentSchema>;
export type ValidatedAdminContent = z.output<typeof adminContentSchema>;
