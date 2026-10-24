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
  completedTasksCount: number;
  linesOfCode: number;
  runsCount: number;
  createdAt: string;
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    id: "cmvi7jwgy0000egwoq8v5rv10",
    username: "wercis",
    avatar: "🚀",
    role: "student",
    xp: 245,
    streak: 1,
    completedDays: 2,
    completedTasksCount: 7,
    linesOfCode: 142,
    runsCount: 10,
    createdAt: "2026-10-21T14:28:59.554Z",
  },
  {
    rank: 2,
    id: "cmvkkl34d0000jv086y8tjidg",
    username: "Nazar",
    avatar: "⚡️",
    role: "student",
    xp: 145,
    streak: 1,
    completedDays: 1,
    completedTasksCount: 3,
    linesOfCode: 68,
    runsCount: 3,
    createdAt: "2026-10-23T07:29:43.000Z",
  },
  {
    rank: 3,
    id: "cmvjf8aco0000jq0743nk68wk",
    username: "Skittler",
    avatar: "👾",
    role: "student",
    xp: 20,
    streak: 1,
    completedDays: 0,
    completedTasksCount: 1,
    linesOfCode: 14,
    runsCount: 1,
    createdAt: "2026-10-22T10:51:40.776Z",
  },
];

function calculateLinesOfCode(codeObj: unknown): number {
  if (!codeObj || typeof codeObj !== "object") return 0;
  let count = 0;
  for (const snippet of Object.values(codeObj as Record<string, unknown>)) {
    if (typeof snippet === "string") {
      const lines = snippet.split("\n").filter((l) => l.trim().length > 0);
      count += lines.length;
    }
  }
  return count;
}

function calculateTasksCount(tasksObj: unknown, daysLen: number): number {
  if (!tasksObj || typeof tasksObj !== "object") return daysLen * 3;
  let count = 0;
  for (const tasks of Object.values(tasksObj as Record<string, unknown>)) {
    if (Array.isArray(tasks)) {
      count += tasks.length;
    }
  }
  return Math.max(count, daysLen * 3);
}

export async function GET() {
  try {
    if (!isDbConfigured || !prisma) {
      return NextResponse.json({
        leaderboard: FALLBACK_LEADERBOARD,
        source: "demo",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          in: ["wercis", "Nazar", "Skittler", "nazar", "skittler", "Wercis"],
          mode: "insensitive",
        },
      },
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
            completedTasks: true,
            code: true,
            runsCount: true,
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

    const leaderboard: LeaderboardEntry[] = users.map((u, index) => {
      const completedDaysCount = u.progress?.completedDays.length ?? 0;
      const tasksCount = calculateTasksCount(u.progress?.completedTasks, completedDaysCount);
      const loc = calculateLinesOfCode(u.progress?.code);

      return {
        rank: index + 1,
        id: u.id,
        username: u.username,
        avatar: u.avatar,
        role: u.role,
        xp: u.xp,
        streak: u.streakCurrent,
        completedDays: completedDaysCount,
        completedTasksCount: tasksCount,
        linesOfCode: loc > 0 ? loc : (tasksCount * 12),
        runsCount: u.progress?.runsCount ?? 0,
        createdAt: u.createdAt.toISOString(),
      };
    });

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
