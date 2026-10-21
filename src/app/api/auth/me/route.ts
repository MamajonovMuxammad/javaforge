import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

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
        return NextResponse.json({
          user: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            xp: user.xp,
            streak: user.streakCurrent,
            createdAt: user.createdAt.toISOString(),
          },
        });
      }
    }

    // Fallback if session exists but user not in DB or DB unconfigured
    return NextResponse.json({
      user: {
        id: session.userId,
        username: session.username,
        avatar: "☕️",
        role: session.role || "student",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error("Auth me API error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
