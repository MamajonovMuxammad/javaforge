import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { hashPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/server";
import { validateUsername, validatePassword } from "@/lib/auth/types";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const AVATARS = ["☕️", "🚀", "⚡️", "💻", "🔥", "🛡️", "👾", "🦊", "🎯", "👑"];

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const regLimit = checkRateLimit(`register-ip:${ip}`, { intervalSeconds: 600, maxRequests: 5 });
    if (!regLimit.allowed) {
      return rateLimitResponse(regLimit.resetInSeconds, `Слишком много регистраций с вашего IP. Подождите ${Math.ceil(regLimit.resetInSeconds / 60)} мин.`);
    }

    const body = await request.json();
    const { username, password, avatar: reqAvatar } = body;

    const passValidation = validatePassword(password);
    if (!passValidation.valid) {
      return NextResponse.json({ error: passValidation.error }, { status: 400 });
    }

    if (!isDbConfigured || !prisma) {
      // Local fallback mode when database URL is not provided yet
      const userValidation = validateUsername(username, []);
      if (!userValidation.valid) {
        return NextResponse.json({ error: userValidation.error }, { status: 400 });
      }

      const avatar = reqAvatar || AVATARS[Math.floor(Math.random() * AVATARS.length)];
      const fallbackUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        username: username.trim(),
        avatar,
        role: "student" as const,
        createdAt: new Date().toISOString(),
      };
      const token = await signSessionToken({ userId: fallbackUser.id, username: fallbackUser.username });

      const response = NextResponse.json({
        user: fallbackUser,
        token,
        mode: "local",
        message: "Режим Local-Storage (укажите DATABASE_URL для облачной PostgreSQL)",
      });

      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return response;
    }

    // Database mode
    const cleanUsername = String(username).trim();
    const existing = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    const userValidation = validateUsername(cleanUsername, existing ? [existing.username] : []);
    if (!userValidation.valid) {
      return NextResponse.json({ error: userValidation.error }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const avatar = reqAvatar && AVATARS.includes(reqAvatar) ? reqAvatar : AVATARS[Math.floor(Math.random() * AVATARS.length)];

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        passwordHash: hashedPassword,
        avatar,
        role: "student",
        progress: {
          create: {
            completedDays: [],
            completedTasks: {},
            completedAt: {},
            code: {},
            achievements: {},
            scannerDays: [],
          },
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    const token = await signSessionToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    const response = NextResponse.json({
      user: {
        id: newUser.id,
        username: newUser.username,
        avatar: newUser.avatar,
        role: newUser.role as "student" | "admin",
        createdAt: newUser.createdAt.toISOString(),
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
    console.error("Register API error:", err);
    return NextResponse.json({ error: "Ошибка сервера при регистрации" }, { status: 500 });
  }
}
