import { z } from "zod";
import { objectIdSchema } from "./common";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải theo định dạng YYYY-MM-DD.");

export const staffSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(30),
  role: z.string().min(2).max(80),
  accessCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{4,20}$/)
    .optional()
    .or(z.literal("")),
  active: z.boolean().default(true),
});

const workSegmentSchema = z.object({
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Giờ bắt đầu không hợp lệ."),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Giờ kết thúc không hợp lệ."),
});

export const workScheduleSchema = z
  .object({
    staff: objectIdSchema,
    workDate: isoDate,

    shiftType: z.enum(["full_time", "part_time"]).default("part_time"),

    segments: z.array(workSegmentSchema).max(8).default([]),

    // Giữ lại để tương thích với dữ liệu lịch cũ.
    shiftName: z.string().min(2).max(80),

    status: z.enum(["assigned", "swapped", "off"]).default("assigned"),
    note: z.string().max(500).default(""),
  })
  .superRefine((data, ctx) => {
    if (data.status === "off") {
      if (data.segments.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["segments"],
          message: "Ngày nghỉ không được có khung giờ làm việc.",
        });
      }
      return;
    }

    if (data.segments.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["segments"],
        message: "Vui lòng thêm ít nhất một khung giờ làm việc.",
      });
      return;
    }

    const toMinutes = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    };

    const sorted = [...data.segments].sort(
      (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
    );

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const start = toMinutes(current.startTime);
      const end = toMinutes(current.endTime);

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["segments", i, "endTime"],
          message: "Giờ kết thúc phải sau giờ bắt đầu.",
        });
        continue;
      }

      if (i > 0) {
        const previousEnd = toMinutes(sorted[i - 1].endTime);

        if (
          toMinutes(sorted[i - 1].startTime) < previousEnd &&
          start < previousEnd
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["segments", i],
            message: "Các khung giờ làm việc không được trùng nhau.",
          });
        }
      }
    }
  });

export const deepCleanTaskSchema = z.object({
  taskName: z.string().min(3).max(180),
  detail: z.string().max(1000).default(""),
  assignedTo: objectIdSchema,
  dueDate: isoDate,
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  repeatWeeks: z.coerce.number().int().min(1).max(12).default(1),
});

export const staffAccessSchema = z.object({
  code: z.string().trim().toUpperCase().min(4).max(20),
});

export type StaffInput = z.infer<typeof staffSchema>;
export type WorkScheduleInput = z.infer<typeof workScheduleSchema>;
export type DeepCleanTaskInput = z.infer<typeof deepCleanTaskSchema>;
