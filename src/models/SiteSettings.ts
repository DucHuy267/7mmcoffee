import { Schema, model, models, type InferSchemaType } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    siteName: { type: String, required: true, default: "7mmcoffee" }, logo: { type: String, default: "" }, favicon: { type: String, default: "" },
    heroVideo: { type: String, default: "" }, heroImage: { type: String, required: true },
    heroSloganVi: { type: String, required: true }, heroSloganEn: { type: String, required: true },
    addressVi: { type: String, required: true }, addressEn: { type: String, required: true }, phone: { type: String, required: true }, email: { type: String, required: true },
    openingHoursVi: { type: String, required: true }, openingHoursEn: { type: String, required: true },
    googleMapsUrl: { type: String, default: "" }, facebookUrl: { type: String, default: "" }, instagramUrl: { type: String, default: "" }, tiktokUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>;
export const SiteSettings = models.SiteSettings || model("SiteSettings", siteSettingsSchema);
