import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

export function success<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function failure(message: string, status = 400, errors?: Record<string, string[]>) {
  return NextResponse.json({ success: false, message, errors }, { status });
}

export async function parseJson<T>(request: Request, schema: ZodType<T>) {
  try {
    const body: unknown = await request.json();
    return { data: schema.parse(body) } as const;
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = Object.fromEntries(
        Object.entries(error.flatten().fieldErrors).map(([key, value]) => [key, (value ?? []) as string[]])
      ) as Record<string, string[]>;
      return { error: failure("Dữ liệu chưa hợp lệ.", 422, errors) } as const;
    }
    return { error: failure("Nội dung gửi lên không hợp lệ.", 400) } as const;
  }
}

export function handleApiError(error: unknown, fallback = "Có lỗi xảy ra.\nVui lòng thử lại.") {
  console.error(error);
  return failure(fallback, 500);
}
