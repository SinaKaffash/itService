import { z } from "zod";

import { adminRoles } from "@/core/admin-user";

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, { message: "username" })
  .max(32, { message: "username" })
  .regex(/^[a-z0-9._-]+$/, { message: "username" });

const passwordSchema = z
  .string()
  .min(12, { message: "password" })
  .max(200, { message: "password" });

export const adminUserSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().trim().toLowerCase().email({ message: "email" }),
    username: usernameSchema,
    name: z
      .string()
      .trim()
      .min(2, { message: "name" })
      .max(120, { message: "name" }),
    password: z.string().optional(),
    role: z.enum(adminRoles),
    isActive: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (!value.id && !value.password) {
      ctx.addIssue({
        code: "custom",
        message: "password",
        path: ["password"],
      });
      return;
    }

    if (value.password) {
      const parsed = passwordSchema.safeParse(value.password);
      if (!parsed.success) {
        ctx.addIssue({
          code: "custom",
          message: "password",
          path: ["password"],
        });
      }
    }
  });

export type AdminUserFormValues = z.input<typeof adminUserSchema>;
export type ValidatedAdminUser = z.output<typeof adminUserSchema>;
