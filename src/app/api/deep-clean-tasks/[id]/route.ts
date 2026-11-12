import { isValidObjectId } from "mongoose";
import { failure, handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { deepCleanTaskSchema } from "@/lib/validations/staff";
import { DeepCleanTask } from "@/models/DeepCleanTask";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  const parsed = await parseJson(request, deepCleanTaskSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const update = {
      taskName: parsed.data.taskName,
      detail: parsed.data.detail,
      assignedTo: parsed.data.assignedTo,
      dueDate: parsed.data.dueDate,
      status: parsed.data.status,
    };
    const task = await DeepCleanTask.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    return task ? success(serialise(task)) : failure("Không tìm thấy công việc.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể cập nhật công việc.");
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const { id } = await params;
  if (!isValidObjectId(id)) return failure("ID không hợp lệ.", 400);
  try {
    await connectToDatabase();
    const task = await DeepCleanTask.findByIdAndDelete(id);
    return task ? success({ id }) : failure("Không tìm thấy công việc.", 404);
  } catch (error) {
    return handleApiError(error, "Không thể xóa công việc.");
  }
}
