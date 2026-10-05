import { handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { aboutSchema } from "@/lib/validations/content";
import { About } from "@/models/About";

export async function GET() {
  try {
    await connectToDatabase();
    return success(serialise(await About.findOne().lean()));
  } catch (error) {
    return handleApiError(error, "Không thể tải nội dung giới thiệu.");
  }
}
export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const parsed = await parseJson(request, aboutSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const item = await About.findOneAndUpdate({}, parsed.data, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    return success(serialise(item));
  } catch (error) {
    return handleApiError(error, "Không thể cập nhật giới thiệu.");
  }
}
