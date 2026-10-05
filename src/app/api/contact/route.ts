import { NextRequest } from "next/server";
import { handleApiError, parseJson, success } from "@/lib/api";
import { isResponse, requireAdmin } from "@/lib/authorization";
import { connectToDatabase } from "@/lib/db";
import { serialise } from "@/lib/serialise";
import { contactSchema } from "@/lib/validations/contact";
import { ContactMessage } from "@/models/ContactMessage";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (isResponse(session)) return session;
  try {
    await connectToDatabase();
    const status = request.nextUrl.searchParams.get("status");
    const query =
      status && ["new", "read", "replied"].includes(status) ? { status } : {};
    const rows = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return success(serialise(rows));
  } catch (error) {
    return handleApiError(error, "Không thể tải tin nhắn.");
  }
}
export async function POST(request: Request) {
  const parsed = await parseJson(request, contactSchema);
  if ("error" in parsed) return parsed.error;
  try {
    await connectToDatabase();
    const item = await ContactMessage.create(parsed.data);
    return success({ id: item._id.toString() }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Không thể gửi tin nhắn. Vui lòng thử lại.");
  }
}
