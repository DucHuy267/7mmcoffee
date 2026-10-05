import { isValidObjectId } from "mongoose";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { storySchema } from "@/lib/validations/story";
import { Story } from "@/models/Story";
import { toSlug } from "@/lib/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const session = await requireAdmin(); if (isResponse(session)) return session; const { id } = await params; if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400); const parsed = await parseJson(request, storySchema); if ("error" in parsed) return parsed.error; try { await connectToDatabase(); const input = { ...parsed.data, slug: parsed.data.slug || toSlug(parsed.data.titleEn), publishedAt: parsed.data.status === "published" ? (parsed.data.publishedAt ?? new Date()) : parsed.data.publishedAt }; const item = await Story.findByIdAndUpdate(id, input, { new: true, runValidators: true }); return item ? success(serialise(item)) : failure("Không tìm thấy bài viết.", 404); } catch (error) { return handleApiError(error, "Không thể cập nhật bài viết."); } }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const session = await requireAdmin(); if (isResponse(session)) return session; const { id } = await params; if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400); try { await connectToDatabase(); const item = await Story.findByIdAndDelete(id); return item ? success({ id }) : failure("Không tìm thấy bài viết.", 404); } catch (error) { return handleApiError(error, "Không thể xóa bài viết."); } }
