import { Schema, model, models, type InferSchemaType } from "mongoose";

const philosophySchema = new Schema({ titleVi: String, titleEn: String, descriptionVi: String, descriptionEn: String }, { _id: false });
const ctaSchema = new Schema({ labelVi: String, labelEn: String, href: String }, { _id: false });

const aboutSchema = new Schema(
  {
    heroTitleVi: { type: String, required: true }, heroTitleEn: { type: String, required: true },
    heroSubtitleVi: { type: String, required: true }, heroSubtitleEn: { type: String, required: true },
    heroImage: { type: String, required: true },
    storyTitleVi: { type: String, required: true }, storyTitleEn: { type: String, required: true },
    storyContentVi: { type: String, required: true }, storyContentEn: { type: String, required: true },
    coffeeTitleVi: { type: String, default: "" }, coffeeTitleEn: { type: String, default: "" },
    coffeeContentVi: { type: String, default: "" }, coffeeContentEn: { type: String, default: "" },
    philosophy: { type: [philosophySchema], default: [] }, gallery: { type: [String], default: [] }, cta: { type: ctaSchema, required: true }
  },
  { timestamps: true }
);

export type AboutDocument = InferSchemaType<typeof aboutSchema>;
export const About = models.About || model("About", aboutSchema);
