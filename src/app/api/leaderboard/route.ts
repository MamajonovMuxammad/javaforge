import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { validateAndSanitizeProgress } from "@/lib/security/progress-validator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    id: "cmvkkl34d0000jv086y8tjidg",
    username: "Nazar",
    avatar: "⚡️",
    role: "student",
    xp: 605,
    streak: 3,
    completedDays: 5,
    completedTasksCount: 14,
    linesOfCode: 175,
    runsCount: 14,
    createdAt: "2026-10-23T07:29:43.000Z",
  },
  {
    rank: 2,
    id: "cmvi7jwgy0000egwoq8v5rv10",
    username: "wercis",
    avatar: "🚀",
    role: "student",
    xp: 385,
    streak: 2,
    completedDays: 4,
    completedTasksCount: 9,
    linesOfCode: 112,
    runsCount: 12,
    createdAt: "2026-10-21T14:28:59.554Z",
  },
  {
    rank: 3,
    id: "cmvjf8aco0000jq0743nk68wk",
    username: "Skittler",
    avatar: "👾",
    role: "student",
    xp: 300,
    streak: 2,
    completedDays: 3,
    completedTasksCount: 6,
    linesOfCode: 96,
    runsCount: 8,
    createdAt: "2026-10-22T10:51:40.776Z",
  },
];

function calculateLinesOfCode(
  codeObj: unknown,
  completedDays: number[],
  completedTasks: Record<string, string[]>
): number {
  if (!codeObj || typeof codeObj !== "object") return 0;
  const entries = Object.entries(codeObj as Record<string, unknown>);
  const taskKeysPresentForDay = new Set<string>();

  for (const [key] of entries) {
    const match = key.match(/^(\d+)_/);
    if (match) {
      taskKeysPresentForDay.add(match[1]);
    }
  }

  const maxUnlockedDay = Math.max(1, ...completedDays.filter((d) => d >= 1)) + 1;
  let count = 0;

  for (const [key, snippet] of entries) {
    if (typeof snippet !== "string") continue;
    // Skip legacy bare day key (e.g. "1") if per-task keys ("1_d1_t1") exist for that day
    if (/^\d+$/.test(key) && taskKeysPresentForDay.has(key)) continue;

    const dayPrefixMatch = key.match(/^(\d+)/);
    if (dayPrefixMatch) {
      const dayNum = Number(dayPrefixMatch[1]);
      // Ignore ghost code from locked future days
      if (dayNum > maxUnlockedDay && !completedTasks[String(dayNum)]) continue;
    }

    const lines = snippet.split("\n").filter((l) => l.trim().length > 0);
    count += lines.length;
  }
  return count;
}

function calculateTasksCount(
  completedTasks: Record<string, string[]>,
  completedDays: number[]
): number {
  let count = 0;
  const countedDays = new Set<number>();

  for (const [dayStr, tasks] of Object.entries(completedTasks)) {
    const dayNum = Number(dayStr);
    // Day 0 is Module 0 (environment setup) and has 0 coding tasks
    if (dayNum <= 0) continue;
    countedDays.add(dayNum);
    if (Array.isArray(tasks)) {
      count += completedDays.includes(dayNum) ? Math.max(tasks.length, 3) : tasks.length;
    }
  }

  // Only coding days (d >= 1) in completedDays have 3 tasks each
  for (const d of completedDays) {
    if (d >= 1 && !countedDays.has(d)) {
      count += 3;
    }
  }

  return count;
}

export async function GET() {
  try {
    if (!isDbConfigured || !prisma) {
      return NextResponse.json(
        {
          leaderboard: FALLBACK_LEADERBOARD,
          source: "demo",
        },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          in: ["wercis", "Nazar", "Skittler", "nazar", "skittler", "Wercis"],
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        role: true,
        xp: true,
        streakCurrent: true,
        streakBest: true,
        lastActiveDate: true,
        createdAt: true,
        progress: {
          select: {
            completedDays: true,
            completedTasks: true,
            completedAt: true,
            code: true,
            achievements: true,
            runsCount: true,
            compileErrorsCount: true,
            checksCount: true,
            scannerDays: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        {
          leaderboard: FALLBACK_LEADERBOARD,
          source: "demo",
        },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
      );
    }

    const unsorted: LeaderboardEntry[] = users.map((u) => {
      const { sanitized, calculatedXp } = validateAndSanitizeProgress({
        version: 1,
        xp: u.xp,
        completedDays: u.progress?.completedDays ?? [],
        completedTasks: (u.progress?.completedTasks as Record<string, string[]>) ?? {},
        completedAt: (u.progress?.completedAt as Record<string, string>) ?? {},
        code: (u.progress?.code as Record<string, string>) ?? {},
        achievements: (u.progress?.achievements as Record<string, string>) ?? {},
        streak: {
          current: u.streakCurrent,
          best: u.streakBest,
          lastActiveDate: u.lastActiveDate,
        },
        stats: {
          runs: u.progress?.runsCount ?? 0,
          compileErrors: u.progress?.compileErrorsCount ?? 0,
          checks: u.progress?.checksCount ?? 0,
          scannerDays: u.progress?.scannerDays ?? [],
        },
      });

      const completedDaysCount = sanitized.completedDays.length;
      const tasksCount = calculateTasksCount(sanitized.completedTasks, sanitized.completedDays);
      const loc = calculateLinesOfCode(sanitized.code, sanitized.completedDays, sanitized.completedTasks);
      const effectiveXp = Math.max(u.xp, calculatedXp);

      return {
        rank: 0,
        id: u.id,
        username: u.username,
        avatar: u.avatar,
        role: u.role,
        xp: effectiveXp,
        streak: Math.max(u.streakCurrent, 1),
        completedDays: completedDaysCount,
        completedTasksCount: tasksCount,
        linesOfCode: loc > 0 ? loc : tasksCount * 12,
        runsCount: Math.max(u.progress?.runsCount ?? 0, tasksCount),
        createdAt: u.createdAt.toISOString(),
      };
    });

    unsorted.sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (b.completedTasksCount !== a.completedTasksCount) return b.completedTasksCount - a.completedTasksCount;
      return b.streak - a.streak;
    });

    const leaderboard = unsorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));

    return NextResponse.json(
      {
        leaderboard,
        source: "database",
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (err: unknown) {
    console.error("GET /api/leaderboard error:", err);
    return NextResponse.json(
      {
        leaderboard: FALLBACK_LEADERBOARD,
        source: "fallback_on_error",
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  }
}
