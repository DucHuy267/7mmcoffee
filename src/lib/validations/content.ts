import { z } from "zod";
import { urlSchema } from "./common";

const philosophySchema = z.object({ titleVi: z.string().min(2), titleEn: z.string().min(2), descriptionVi: z.string().min(2), descriptionEn: z.string().min(2) });
export const aboutSchema = z.object({
  heroTitleVi: z.string().min(2), heroTitleEn: z.string().min(2), heroSubtitleVi: z.string().min(2), heroSubtitleEn: z.string().min(2), heroImage: urlSchema.refine(Boolean),
  storyTitleVi: z.string().min(2), storyTitleEn: z.string().min(2), storyContentVi: z.string().min(10), storyContentEn: z.string().min(10),
  coffeeTitleVi: z.string().default(""), coffeeTitleEn: z.string().default(""), coffeeContentVi: z.string().default(""), coffeeContentEn: z.string().default(""),
  philosophy: z.array(philosophySchema).max(6).default([]), gallery: z.array(z.string().url()).default([]),
  cta: z.object({ labelVi: z.string().min(2), labelEn: z.string().min(2), href: z.string().startsWith("/") })
});

export const settingsSchema = z.object({
  siteName: z.string().min(2).max(80), logo: urlSchema.default(""), favicon: urlSchema.default(""), heroVideo: urlSchema.default(""), heroImage: urlSchema.refine(Boolean),
  heroSloganVi: z.string().min(2).max(180), heroSloganEn: z.string().min(2).max(180), addressVi: z.string().min(2).max(300), addressEn: z.string().min(2).max(300),
  phone: z.string().min(5).max(30), email: z.string().email(), openingHoursVi: z.string().min(2).max(300), openingHoursEn: z.string().min(2).max(300),
  googleMapsUrl: urlSchema.default(""), facebookUrl: urlSchema.default(""), instagramUrl: urlSchema.default(""), tiktokUrl: urlSchema.default("")
});
export type AboutInput = z.infer<typeof aboutSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
