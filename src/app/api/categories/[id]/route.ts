import { isValidObjectId } from "mongoose";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { categorySchema } from "@/lib/validations/category";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { toSlug } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  const parsed = await parseJson(request, categorySchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const item = await Category.findByIdAndUpdate(
      id,
      { ...parsed.data, slug: parsed.data.slug || toSlug(parsed.data.nameEn) },
      { new: true, runValidators: true },
    );
    return item
      ? success(serialise(item))
      : failure("Không tìm thấy danh mục.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể cập nhật danh mục.");
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  try {
    await connectToDatabase();
    if (await Product.exists({ category: id }))
      return failure("Không thể xóa danh mục đang có sản phẩm.", 409);
    const item = await Category.findByIdAndDelete(id);
    return item ? success({ id }) : failure("Không tìm thấy danh mục.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể xóa danh mục.");
  }
}
