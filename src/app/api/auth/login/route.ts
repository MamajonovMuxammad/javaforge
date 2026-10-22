import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/server";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const DUMMY_HASH = "$2a$10$7EqJtq98hPqEX7fNZaFWoO.8D/R0P6aJp6gHj5Y7uG1f6UqN4f2Wy";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // IP rate limit: max 10 attempts per minute
    const ipLimit = checkRateLimit(`login-ip:${ip}`, { intervalSeconds: 60, maxRequests: 10 });
    if (!ipLimit.allowed) {
      return rateLimitResponse(ipLimit.resetInSeconds, `Слишком много попыток входа с вашего IP. Подождите ${ipLimit.resetInSeconds} сек.`);
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Введите логин и пароль" }, { status: 400 });
    }

    const cleanUsername = String(username).trim();

    // Per-username rate limit: max 5 failed attempts per minute to mitigate credential stuffing
    const userLimit = checkRateLimit(`login-user:${cleanUsername.toLowerCase()}`, { intervalSeconds: 60, maxRequests: 5 });
    if (!userLimit.allowed) {
      return rateLimitResponse(userLimit.resetInSeconds, `Слишком много попыток входа для этого аккаунта. Подождите ${userLimit.resetInSeconds} сек.`);
    }

    if (!isDbConfigured || !prisma) {
      return NextResponse.json({
        error: "База данных еще не подключена к серверу. Используйте локальный вход.",
        fallbackToLocal: true,
      }, { status: 503 });
    }

    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (!user) {
      // Prevent timing attacks by executing a real bcrypt compare against a dummy hash
      await verifyPassword(String(password), DUMMY_HASH);
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const isValid = await verifyPassword(String(password), user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const token = await signSessionToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role as "student" | "admin",
        createdAt: user.createdAt.toISOString(),
      },
      token,
      mode: "database",
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Ошибка сервера при входе" }, { status: 500 });
  }
}
