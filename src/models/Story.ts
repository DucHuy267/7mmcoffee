import { Schema, model, models, type InferSchemaType } from "mongoose";

const storySchema = new Schema(
  {
    titleVi: { type: String, required: true, trim: true },
    titleEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    excerptVi: { type: String, default: "" },
    excerptEn: { type: String, default: "" },
    contentVi: { type: String, required: true },
    contentEn: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    publishedAt: { type: Date },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    featured: { type: Boolean, default: false, index: true },
    seoTitleVi: { type: String, default: "" },
    seoTitleEn: { type: String, default: "" },
    seoDescriptionVi: { type: String, default: "" },
    seoDescriptionEn: { type: String, default: "" }
  },
  { timestamps: true }
);
storySchema.index({ status: 1, featured: 1, publishedAt: -1 });

export type StoryDocument = InferSchemaType<typeof storySchema>;
export const Story = models.Story || model("Story", storySchema);
