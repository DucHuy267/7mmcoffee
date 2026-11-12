import { randomBytes } from "crypto";
import { NextRequest } from "next/server";
import { handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { getPublicStaff } from "@/lib/content";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { staffSchema } from "@/lib/validations/staff";
import { Staff } from "@/models/Staff";

function makeAccessCode() {
  return `7MM-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get("admin") === "true";
  if (!admin) {
    try {
      return success(await getPublicStaff());
    } catch (error) {
      return handleApiError(error, "Không thể tải danh sách nhân viên.");
    }
  }
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  try {
    await connectToDatabase();
    const staff = await Staff.find().select("+accessCode").sort({ active: -1, name: 1 }).lean();
    return success(serialise(staff));
  } catch (error) {
    return handleApiError(error, "Không thể tải danh sách nhân viên.");
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  const parsed = await parseJson(request, staffSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const staff = await Staff.create({
      ...parsed.data,
      accessCode: parsed.data.accessCode || makeAccessCode(),
    });
    return success(serialise(staff), { status: 201 });
  } catch (error) {
    return handleApiError(error, "Không thể tạo nhân viên. Mã nhân viên có thể đã tồn tại.");
  }
}
