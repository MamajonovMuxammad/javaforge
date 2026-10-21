import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  role: string;
  xp: number;
  streak: number;
  completedDays: number;
  createdAt: string;
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, id: "seed_1", username: "alex_senior", avatar: "🚀", role: "student", xp: 1850, streak: 14, completedDays: 18, createdAt: "2026-09-15T10:00:00Z" },
  { rank: 2, id: "seed_2", username: "code_ninja", avatar: "🥷", role: "student", xp: 1420, streak: 9, completedDays: 14, createdAt: "2026-09-20T12:00:00Z" },
  { rank: 3, id: "seed_3", username: "maria_backend", avatar: "💻", role: "student", xp: 1100, streak: 7, completedDays: 11, createdAt: "2026-10-01T08:30:00Z" },
  { rank: 4, id: "seed_4", username: "temirlan_java", avatar: "⚡️", role: "student", xp: 850, streak: 5, completedDays: 8, createdAt: "2026-10-05T14:20:00Z" },
];

export async function GET() {
  try {
    if (!isDbConfigured || !prisma) {
      return NextResponse.json({
        leaderboard: FALLBACK_LEADERBOARD,
        source: "demo",
      });
    }

    const users = await prisma.user.findMany({
      take: 50,
      orderBy: [
        { xp: "desc" },
        { streakCurrent: "desc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        username: true,
        avatar: true,
        role: true,
        xp: true,
        streakCurrent: true,
        createdAt: true,
        progress: {
          select: {
            completedDays: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return NextResponse.json({
        leaderboard: FALLBACK_LEADERBOARD,
        source: "demo",
      });
    }

    const leaderboard: LeaderboardEntry[] = users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      role: u.role,
      xp: u.xp,
      streak: u.streakCurrent,
      completedDays: u.progress?.completedDays.length ?? 0,
      createdAt: u.createdAt.toISOString(),
    }));

    return NextResponse.json({
      leaderboard,
      source: "database",
    });
  } catch (err: unknown) {
    console.error("GET /api/leaderboard error:", err);
    return NextResponse.json({
      leaderboard: FALLBACK_LEADERBOARD,
      source: "fallback_on_error",
    });
  }
}
