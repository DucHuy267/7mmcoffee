import { NextRequest } from "next/server";
import { handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { categorySchema } from "@/lib/validations/category";
import { Category } from "@/models/Category";
import { toSlug } from "@/lib/utils";

export async function GET(request: NextRequest) { try { await connectToDatabase(); const admin = request.nextUrl.searchParams.get("admin") === "true"; if (admin) { const session = await requireAdmin(); if (isResponse(session)) return session; } const rows = await Category.find(admin ? {} : { active: true }).sort({ displayOrder: 1, nameEn: 1 }).lean(); return success(serialise(rows)); } catch (error) { return handleApiError(error, "Không thể tải danh mục."); } }
export async function POST(request: Request) { const session = await requireAdmin(); if (isResponse(session)) return session; const parsed = await parseJson(request, categorySchema); if ("error" in parsed) return parsed.error; try { await connectToDatabase(); const item = await Category.create({ ...parsed.data, slug: parsed.data.slug || toSlug(parsed.data.nameEn) }); return success(serialise(item), { status: 201 }); } catch (error) { return handleApiError(error, "Không thể tạo danh mục. Slug có thể đã tồn tại."); } }
