import { NextRequest } from "next/server";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { getStaffPortalByCode } from "@/lib/content";
import { weekStartFor } from "@/lib/staff-dates";
import { staffAccessSchema } from "@/lib/validations/staff";

export async function POST(request: NextRequest) {
  const parsed = await parseJson(request, staffAccessSchema);
  if ("error" in parsed) return parsed.error;
  const weekStart = request.nextUrl.searchParams.get("weekStart") || weekStartFor();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) return failure("Tuần không hợp lệ.", 422);
  try {
    const data = await getStaffPortalByCode(parsed.data.code, weekStart);
    return data ? success(data) : failure("Mã nhân viên không đúng hoặc đã ngừng hoạt động.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể kiểm tra mã nhân viên.");
  }
}
