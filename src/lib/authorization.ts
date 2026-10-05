import { getSession } from "@/lib/auth";
import { failure } from "@/lib/api";

export async function requireAdmin() {
  const session = await getSession();
  return session ?? failure("Bạn cần đăng nhập quản trị viên.", 401);
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
