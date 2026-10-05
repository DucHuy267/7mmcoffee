import { z } from "zod";
import { objectIdSchema, optionalPrice, urlSchema } from "./common";

export const productSchema = z.object({
  nameVi: z.string().min(2).max(160), nameEn: z.string().min(2).max(160), slug: z.string().min(2).max(180).regex(/^[a-z0-9-]+$/).optional().or(z.literal("")),
  descriptionVi: z.string().max(1200).default(""), descriptionEn: z.string().max(1200).default(""), price: z.coerce.number().nonnegative(), originalPrice: optionalPrice,
  category: objectIdSchema, image: urlSchema.refine(Boolean, "Ảnh đại diện là bắt buộc."), gallery: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false), active: z.boolean().default(true), displayOrder: z.coerce.number().int().min(0).default(0)
});
export type ProductInput = z.infer<typeof productSchema>;
