import { NextRequest } from "next/server";
import { handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { storySchema } from "@/lib/validations/story";
import { Story } from "@/models/Story";
import { toSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const admin = request.nextUrl.searchParams.get("admin") === "true";
    if (admin) {
      const session = await requireAdmin();
      if (isResponse(session)) return session;
    }
    const rows = await Story.find(admin ? {} : { status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    return success(serialise(rows));
  } catch (error) {
    return handleApiError(error, "Không thể tải bài viết.");
  }
}
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const parsed = await parseJson(request, storySchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const input = {
      ...parsed.data,
      slug: parsed.data.slug || toSlug(parsed.data.titleEn),
      publishedAt:
        parsed.data.status === "published"
          ? (parsed.data.publishedAt ?? new Date())
          : parsed.data.publishedAt,
    };
    const item = await Story.create(input);
    return success(serialise(item), { status: 201 });
  } catch (error) {
    return handleApiError(
      error,
      "Không thể tạo bài viết. Slug có thể đã tồn tại.",
    );
  }
}
