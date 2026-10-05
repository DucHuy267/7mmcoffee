import { z } from "zod";
import { urlSchema } from "./common";

export const categorySchema = z.object({
  nameVi: z.string().min(2).max(100),
  nameEn: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .or(z.literal("")),
  descriptionVi: z.string().max(500).default(""),
  descriptionEn: z.string().max(500).default(""),
  image: urlSchema.default(""),
  active: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;
