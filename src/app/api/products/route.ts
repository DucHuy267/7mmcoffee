import { NextRequest } from "next/server";
import { handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { productSchema } from "@/lib/validations/product";
import { Product } from "@/models/Product";
import { toSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const admin = request.nextUrl.searchParams.get("admin") === "true";
    if (admin) {
      const session = await requireAdmin();
      if (isResponse(session)) return session;
    }
    const rows = await Product.find(admin ? {} : { active: true })
      .populate("category")
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    return success(serialise(rows));
  } catch (error) {
    return handleApiError(error, "Không thể tải sản phẩm.");
  }
}
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const parsed = await parseJson(request, productSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const item = await Product.create({
      ...parsed.data,
      slug: parsed.data.slug || toSlug(parsed.data.nameEn),
    });
    return success(serialise(item), { status: 201 });
  } catch (error) {
    return handleApiError(
      error,
      "Không thể tạo sản phẩm. Slug có thể đã tồn tại.",
    );
  }
}
