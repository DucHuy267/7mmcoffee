import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession, sessionCookie } from "@/lib/auth";
import { failure, handleApiError, parseJson } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";

export async function POST(request: Request) { const parsed = await parseJson(request, loginSchema); if ("error" in parsed) return parsed.error; try { await connectToDatabase(); const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash"); if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return failure("Email hoặc mật khẩu không đúng.", 401); const token = await createSession({ userId: user._id.toString(), email: user.email, role: "admin" }); const response = NextResponse.json({ success: true, data: { name: user.name, email: user.email } }); response.cookies.set(sessionCookie.name, token, sessionCookie.options); return response; } catch (error) { return handleApiError(error, "Không thể đăng nhập lúc này."); } }
