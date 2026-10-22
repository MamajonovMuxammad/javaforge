import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { getSessionFromRequest, verifyPassword, hashPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/server";
import { validatePassword } from "@/lib/auth/types";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
    }

    const ip = getClientIp(request);
    const limit = checkRateLimit(`change-pwd:${session.userId}`, { intervalSeconds: 60, maxRequests: 5 });
    if (!limit.allowed) {
      return rateLimitResponse(limit.resetInSeconds, "Слишком много попыток смены пароля. Подождите минуту.");
    }

    if (!isDbConfigured || !prisma) {
      return NextResponse.json({ error: "База данных не подключена" }, { status: 503 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Укажите текущий и новый пароль" }, { status: 400 });
    }

    const passValidation = validatePassword(newPassword);
    if (!passValidation.valid) {
      return NextResponse.json({ error: passValidation.error }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    const token = await signSessionToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Пароль успешно обновлен",
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
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Ошибка при смене пароля" }, { status: 500 });
  }
}
