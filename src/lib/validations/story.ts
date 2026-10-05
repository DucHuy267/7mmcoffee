import { z } from "zod";
import { urlSchema } from "./common";

export const storySchema = z.object({
  titleVi: z.string().min(3).max(200), titleEn: z.string().min(3).max(200), slug: z.string().min(2).max(220).regex(/^[a-z0-9-]+$/).optional().or(z.literal("")),
  excerptVi: z.string().max(500).default(""), excerptEn: z.string().max(500).default(""), contentVi: z.string().min(20), contentEn: z.string().min(20),
  coverImage: urlSchema.refine(Boolean, "Ảnh bìa là bắt buộc."), category: z.string().min(2).max(80), author: z.string().min(2).max(100),
  publishedAt: z.coerce.date().optional(), status: z.enum(["draft", "published"]), featured: z.boolean().default(false),
  seoTitleVi: z.string().max(70).default(""), seoTitleEn: z.string().max(70).default(""), seoDescriptionVi: z.string().max(160).default(""), seoDescriptionEn: z.string().max(160).default("")
});
export type StoryInput = z.infer<typeof storySchema>;
