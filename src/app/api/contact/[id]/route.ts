import { isValidObjectId } from "mongoose";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { contactStatusSchema } from "@/lib/validations/contact";
import { ContactMessage } from "@/models/ContactMessage";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const session = await requireAdmin(); if (isResponse(session)) return session; const { id } = await params; if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400); const parsed = await parseJson(request, contactStatusSchema); if ("error" in parsed) return parsed.error; try { await connectToDatabase(); const item = await ContactMessage.findByIdAndUpdate(id, parsed.data, { new: true }); return item ? success({ id: item._id.toString(), status: item.status }) : failure("Không tìm thấy tin nhắn.", 404); } catch (error) { return handleApiError(error, "Không thể cập nhật trạng thái."); } }
