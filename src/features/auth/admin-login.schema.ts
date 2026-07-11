import { z } from "zod";

export const adminLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, { message: "identifier" })
    .max(254, { message: "identifier" })
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[a-z0-9._-]{3,32}$/.test(value),
      { message: "identifier" },
    ),
  password: z
    .string()
    .min(8, { message: "password" })
    .max(200, { message: "password" }),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
