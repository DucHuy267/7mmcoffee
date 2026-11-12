import { isValidObjectId } from "mongoose";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { workScheduleSchema } from "@/lib/validations/staff";
import { WorkSchedule } from "@/models/WorkSchedule";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  const parsed = await parseJson(request, workScheduleSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const schedule = await WorkSchedule.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    return schedule ? success(serialise(schedule)) : failure("Không tìm thấy ca làm.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể cập nhật ca làm.");
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  try {
    await connectToDatabase();
    const schedule = await WorkSchedule.findByIdAndDelete(id);
    return schedule ? success({ id }) : failure("Không tìm thấy ca làm.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể xóa ca làm.");
  }
}
