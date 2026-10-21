import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Введите логин и пароль" }, { status: 400 });
    }

    if (!isDbConfigured || !prisma) {
      return NextResponse.json({
        error: "База данных еще не подключена к серверу. Используйте локальный вход.",
        fallbackToLocal: true,
      }, { status: 503 });
    }

    const cleanUsername = String(username).trim();
    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь с таким логином не найден" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
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
