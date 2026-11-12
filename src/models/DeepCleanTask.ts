import { Schema, model, models, type InferSchemaType } from "mongoose";

const deepCleanTaskSchema = new Schema(
  {
    taskName: { type: String, required: true, trim: true, maxlength: 180 },
    detail: { type: String, default: "", trim: true, maxlength: 1000 },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
      index: true,
    },
    dueDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      index: true,
    },
    recurrenceGroup: { type: String, default: "", index: true },
  },
  { timestamps: true },
);
deepCleanTaskSchema.index({ dueDate: 1, status: 1 });

export type DeepCleanTaskDocument = InferSchemaType<typeof deepCleanTaskSchema>;
export const DeepCleanTask =
  models.DeepCleanTask || model("DeepCleanTask", deepCleanTaskSchema);
