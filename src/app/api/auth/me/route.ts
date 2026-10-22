import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { getSessionFromRequest, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Generate fresh token for dual-channel (cookie + Bearer) resilience
    const token = await signSessionToken({
      userId: session.userId,
      username: session.username,
      role: session.role,
    });

    let userData = {
      id: session.userId,
      username: session.username,
      avatar: "☕️",
      role: (session.role || "student") as "student" | "admin",
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    if (isDbConfigured && prisma) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          username: true,
          avatar: true,
          role: true,
          xp: true,
          streakCurrent: true,
          streakBest: true,
          createdAt: true,
        },
      });

      if (user) {
        userData = {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          role: user.role as "student" | "admin",
          xp: user.xp,
          streak: user.streakCurrent,
          createdAt: user.createdAt.toISOString(),
        };
      }
    }

    const response = NextResponse.json({
      user: userData,
      token,
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
    console.error("Auth me API error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
