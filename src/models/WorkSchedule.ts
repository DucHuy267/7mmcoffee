import { Schema, model, models, type InferSchemaType } from "mongoose";

const workSegmentSchema = new Schema(
  {
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
  },
  { _id: false },
);

const workScheduleSchema = new Schema(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
      index: true,
    },

    workDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },

    shiftType: {
      type: String,
      enum: ["full_time", "part_time"],
      default: "part_time",
    },

    segments: {
      type: [workSegmentSchema],
      default: [],
    },

    // Giữ trường cũ để không làm mất dữ liệu lịch đã lưu.
    shiftName: {
      type: String,
      required: true,
      trim: true,
      default: "Ca làm",
    },

    status: {
      type: String,
      enum: ["assigned", "swapped", "off"],
      default: "assigned",
      index: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

workScheduleSchema.index({ staff: 1, workDate: 1 }, { unique: true });
workScheduleSchema.index({ workDate: 1, status: 1 });

export type WorkScheduleDocument = InferSchemaType<typeof workScheduleSchema>;

export const WorkSchedule =
  models.WorkSchedule || model("WorkSchedule", workScheduleSchema);
