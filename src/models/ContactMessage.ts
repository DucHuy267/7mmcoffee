import { Schema, model, models, type InferSchemaType } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true }, message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "read", "replied"], default: "new", index: true }
  },
  { timestamps: true }
);

export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema>;
export const ContactMessage = models.ContactMessage || model("ContactMessage", contactMessageSchema);
