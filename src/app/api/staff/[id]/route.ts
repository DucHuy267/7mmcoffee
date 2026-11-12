import { isValidObjectId } from "mongoose";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { staffSchema } from "@/lib/validations/staff";
import { DeepCleanTask } from "@/models/DeepCleanTask";
import { Staff } from "@/models/Staff";
import { WorkSchedule } from "@/models/WorkSchedule";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  const parsed = await parseJson(request, staffSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const update: Record<string, unknown> = { ...parsed.data };
    if (!update.accessCode) delete update.accessCode;
    const staff = await Staff.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select("+accessCode");
    return staff ? success(serialise(staff)) : failure("Không tìm thấy nhân viên.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể cập nhật nhân viên.");
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  try {
    await connectToDatabase();
    const [hasSchedules, hasTasks] = await Promise.all([
      WorkSchedule.exists({ staff: id }),
      DeepCleanTask.exists({ assignedTo: id }),
    ]);
    if (hasSchedules || hasTasks) {
      return failure("Nhân viên đã có lịch sử. Hãy chuyển trạng thái sang ngừng hoạt động để giữ dữ liệu.", 409);
    }
    const staff = await Staff.findByIdAndDelete(id);
    return staff ? success({ id }) : failure("Không tìm thấy nhân viên.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể xóa nhân viên.");
  }
}
