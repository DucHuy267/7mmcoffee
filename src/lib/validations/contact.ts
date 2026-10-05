import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên.").max(100),
  email: z.string().email("Email chưa hợp lệ."),
  phone: z.string().max(30),
  message: z.string().min(10, "Tin nhắn cần ít nhất 10 ký tự.").max(2000),
});
export const contactStatusSchema = z.object({
  status: z.enum(["new", "read", "replied"]),
});
export type ContactInput = z.infer<typeof contactSchema>;
