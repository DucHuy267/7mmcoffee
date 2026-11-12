import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { getStaffPortalData } from "@/lib/content";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { addDays, weekStartFor } from "@/lib/staff-dates";
import { deepCleanTaskSchema } from "@/lib/validations/staff";
import { DeepCleanTask } from "@/models/DeepCleanTask";

function taskWeek(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("weekStart") || weekStartFor();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export async function GET(request: NextRequest) {
  const weekStart = taskWeek(request);
  if (!weekStart) return failure("Tuần không hợp lệ.", 422);
  const admin = request.nextUrl.searchParams.get("admin") === "true";
  if (admin) {
    const session = await requireAdmin();
    if (isResponse(session)) return session;
  }
  try {
    const data = await getStaffPortalData(weekStart, request.nextUrl.searchParams.get("staffId") || undefined);
    return success(data.tasks);
  } catch (error) {
    return handleApiError(error, "Không thể tải lịch Deep Clean.");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const parsed = await parseJson(request, deepCleanTaskSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const { repeatWeeks, ...task } = parsed.data;
    const recurrenceGroup = repeatWeeks > 1 ? randomUUID() : "";
    const tasks = Array.from({ length: repeatWeeks }, (_, index) => ({
      ...task,
      dueDate: addDays(task.dueDate, index * 7),
      recurrenceGroup,
    }));
    const created = await DeepCleanTask.insertMany(tasks);
    return success(serialise(created), { status: 201 });
  } catch (error) {
    return handleApiError(error, "Không thể tạo công việc Deep Clean.");
  }
}
