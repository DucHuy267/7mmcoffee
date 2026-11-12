import { Schema, model, models, type InferSchemaType } from "mongoose";

const staffSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true, default: "Barista" },
    accessCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
      select: false,
    },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type StaffDocument = InferSchemaType<typeof staffSchema>;
export const Staff = models.Staff || model("Staff", staffSchema);
