import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth/server";
import { migrate } from "@/lib/progress/storage";
import { type ProgressState } from "@/lib/progress/types";
import { Prisma } from "@prisma/client";
import { validateAndSanitizeProgress } from "@/lib/security/progress-validator";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
    }

    if (!isDbConfigured || !prisma) {
      return NextResponse.json({ error: "База данных не настроена", fallback: true }, { status: 503 });
    }

    const record = await prisma.userProgress.findUnique({
      where: { userId: session.userId },
      include: {
        user: {
          select: { xp: true, streakCurrent: true, streakBest: true, lastActiveDate: true },
        },
      },
    });

    if (!record) {
      return NextResponse.json({ progress: null });
    }

    const state: ProgressState = {
      version: 1,
      xp: record.user?.xp ?? 0,
      completedDays: record.completedDays,
      completedAt: (record.completedAt as Record<string, string>) || {},
      completedTasks: (record.completedTasks as Record<string, string[]>) || {},
      code: (record.code as Record<string, string>) || {},
      achievements: (record.achievements as Record<string, string>) || {},
      streak: {
        current: record.user?.streakCurrent ?? 0,
        best: record.user?.streakBest ?? 0,
        lastActiveDate: record.user?.lastActiveDate ?? null,
      },
      stats: {
        runs: record.runsCount,
        compileErrors: record.compileErrorsCount,
        checks: record.checksCount,
        scannerDays: record.scannerDays,
      },
    };

    return NextResponse.json({ progress: state });
  } catch (err: unknown) {
    console.error("GET /api/progress error:", err);
    return NextResponse.json({ error: "Ошибка загрузки прогресса" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
    }

    // Rate limit: max 60 sync operations per minute per user
    const syncLimit = checkRateLimit(`progress-sync:${session.userId}`, { intervalSeconds: 60, maxRequests: 60 });
    if (!syncLimit.allowed) {
      return rateLimitResponse(syncLimit.resetInSeconds, "Слишком частая синхронизация прогресса.");
    }

    if (!isDbConfigured || !prisma) {
      return NextResponse.json({ error: "База данных не настроена", fallback: true }, { status: 503 });
    }

    const body = await request.json();
    const clientState = migrate(body);

    // SECURITY: Validate and recalculate XP on the server.
    // Client cannot forge arbitrary XP, days or unearned achievements!
    const { sanitized, calculatedXp } = validateAndSanitizeProgress(clientState);

    // Save in transactional update
    await prisma.$transaction([
      prisma.userProgress.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          completedDays: sanitized.completedDays,
          completedTasks: sanitized.completedTasks as unknown as Prisma.InputJsonValue,
          completedAt: sanitized.completedAt as unknown as Prisma.InputJsonValue,
          code: sanitized.code as unknown as Prisma.InputJsonValue,
          achievements: sanitized.achievements as unknown as Prisma.InputJsonValue,
          runsCount: sanitized.stats.runs,
          compileErrorsCount: sanitized.stats.compileErrors,
          checksCount: sanitized.stats.checks,
          scannerDays: sanitized.stats.scannerDays,
        },
        update: {
          completedDays: sanitized.completedDays,
          completedTasks: sanitized.completedTasks as unknown as Prisma.InputJsonValue,
          completedAt: sanitized.completedAt as unknown as Prisma.InputJsonValue,
          code: sanitized.code as unknown as Prisma.InputJsonValue,
          achievements: sanitized.achievements as unknown as Prisma.InputJsonValue,
          runsCount: sanitized.stats.runs,
          compileErrorsCount: sanitized.stats.compileErrors,
          checksCount: sanitized.stats.checks,
          scannerDays: sanitized.stats.scannerDays,
        },
      }),
      prisma.user.update({
        where: { id: session.userId },
        data: {
          xp: calculatedXp,
          streakCurrent: sanitized.streak.current,
          streakBest: sanitized.streak.best,
          lastActiveDate: sanitized.streak.lastActiveDate,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      xp: calculatedXp,
      savedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("POST /api/progress error:", err);
    return NextResponse.json({ error: "Ошибка сохранения прогресса" }, { status: 500 });
  }
}
