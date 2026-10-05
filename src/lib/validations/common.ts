import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "ID không hợp lệ.");
export const urlSchema = z.string().url("URL không hợp lệ.").or(z.literal(""));
export const optionalPrice = z.coerce.number().nonnegative().optional();
