import { NextRequest } from "next/server";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { getStaffPortalData } from "@/lib/content";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { weekStartFor } from "@/lib/staff-dates";
import { workScheduleSchema } from "@/lib/validations/staff";
import { WorkSchedule } from "@/models/WorkSchedule";

function scheduleWeek(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("weekStart") || weekStartFor();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export async function GET(request: NextRequest) {
  const weekStart = scheduleWeek(request);
  if (!weekStart) return failure("Tuần không hợp lệ.", 422);
  const admin = request.nextUrl.searchParams.get("admin") === "true";
  if (!admin) {
    try {
      const data = await getStaffPortalData(weekStart, request.nextUrl.searchParams.get("staffId") || undefined);
      return success(data.schedules);
    } catch (error) {
      return handleApiError(error, "Không thể tải lịch làm việc.");
    }
  }
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  try {
    const data = await getStaffPortalData(weekStart);
    return success(data.schedules);
  } catch (error) {
    return handleApiError(error, "Không thể tải lịch làm việc.");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const parsed = await parseJson(request, workScheduleSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const schedule = await WorkSchedule.create(parsed.data);
    return success(serialise(schedule), { status: 201 });
  } catch (error) {
    return handleApiError(error, "Không thể phân ca. Mỗi nhân viên chỉ có một ca trong ngày.");
  }
}
