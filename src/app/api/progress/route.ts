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

    return NextResponse.json(
      { progress: state, source: "database" },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
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

    // SECURITY: Validate incoming state
    const { sanitized } = validateAndSanitizeProgress(clientState);

    // Fetch existing progress from DB to merge and prevent accidental loss
    const existing = await prisma.userProgress.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { streakCurrent: true, streakBest: true } } },
    });

    const existingDays = existing?.completedDays || [];
    const mergedCompletedDays = Array.from(
      new Set([...existingDays, ...sanitized.completedDays])
    ).sort((a, b) => a - b);

    const existingTasks = (existing?.completedTasks as Record<string, string[]>) || {};
    const mergedCompletedTasks: Record<string, string[]> = { ...existingTasks };
    for (const [day, tasks] of Object.entries(sanitized.completedTasks || {})) {
      const prev = existingTasks[day] || [];
      mergedCompletedTasks[day] = Array.from(new Set([...prev, ...tasks]));
    }

    const existingCode = (existing?.code as Record<string, string>) || {};
    const mergedCode = { ...existingCode, ...sanitized.code };

    const existingAch = (existing?.achievements as Record<string, string>) || {};
    const mergedAchievements = { ...existingAch, ...sanitized.achievements };

    const existingCompletedAt = (existing?.completedAt as Record<string, string>) || {};
    const mergedCompletedAt = { ...existingCompletedAt, ...sanitized.completedAt };

    const runsCount = Math.max(existing?.runsCount || 0, sanitized.stats.runs);
    const checksCount = Math.max(existing?.checksCount || 0, sanitized.stats.checks);
    const compileErrorsCount = Math.max(existing?.compileErrorsCount || 0, sanitized.stats.compileErrors);
    const scannerDays = Array.from(
      new Set([...(existing?.scannerDays || []), ...sanitized.stats.scannerDays])
    ).sort((a, b) => a - b);

    const streakCurrent = Math.max(existing?.user?.streakCurrent || 0, sanitized.streak.current);
    const streakBest = Math.max(existing?.user?.streakBest || 0, sanitized.streak.best, streakCurrent);

    // Authoritative calculation of XP on merged state
    const { sanitized: finalSanitized, calculatedXp: finalXp } = validateAndSanitizeProgress({
      version: 1,
      xp: 0,
      completedDays: mergedCompletedDays,
      completedTasks: mergedCompletedTasks,
      completedAt: mergedCompletedAt,
      code: mergedCode,
      achievements: mergedAchievements,
      streak: { current: streakCurrent, best: streakBest, lastActiveDate: sanitized.streak.lastActiveDate },
      stats: { runs: runsCount, checks: checksCount, compileErrors: compileErrorsCount, scannerDays },
    });

    // Save merged state in transactional update
    await prisma.$transaction([
      prisma.userProgress.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          completedDays: finalSanitized.completedDays,
          completedTasks: finalSanitized.completedTasks as unknown as Prisma.InputJsonValue,
          completedAt: finalSanitized.completedAt as unknown as Prisma.InputJsonValue,
          code: finalSanitized.code as unknown as Prisma.InputJsonValue,
          achievements: finalSanitized.achievements as unknown as Prisma.InputJsonValue,
          runsCount: finalSanitized.stats.runs,
          compileErrorsCount: finalSanitized.stats.compileErrors,
          checksCount: finalSanitized.stats.checks,
          scannerDays: finalSanitized.stats.scannerDays,
        },
        update: {
          completedDays: finalSanitized.completedDays,
          completedTasks: finalSanitized.completedTasks as unknown as Prisma.InputJsonValue,
          completedAt: finalSanitized.completedAt as unknown as Prisma.InputJsonValue,
          code: finalSanitized.code as unknown as Prisma.InputJsonValue,
          achievements: finalSanitized.achievements as unknown as Prisma.InputJsonValue,
          runsCount: finalSanitized.stats.runs,
          compileErrorsCount: finalSanitized.stats.compileErrors,
          checksCount: finalSanitized.stats.checks,
          scannerDays: finalSanitized.stats.scannerDays,
        },
      }),
      prisma.user.update({
        where: { id: session.userId },
        data: {
          xp: finalXp,
          streakCurrent: finalSanitized.streak.current,
          streakBest: finalSanitized.streak.best,
          lastActiveDate: finalSanitized.streak.lastActiveDate,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      xp: finalXp,
      progress: finalSanitized,
      savedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("POST /api/progress error:", err);
    return NextResponse.json({ error: "Ошибка сохранения прогресса" }, { status: 500 });
  }
}
