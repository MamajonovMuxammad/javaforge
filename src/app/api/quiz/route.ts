import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma, isDbConfigured } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { validateAndSanitizeProgress } from "@/lib/security/progress-validator";
import { type ProgressState } from "@/lib/progress/types";
import {
  createEmptyQuizServerStats,
  getQuizQuestionById,
  QUIZ_XP_PER_MASTERED_QUESTION,
  type QuizAttemptRecord,
  type QuizCategory,
  type QuizCategoryFilter,
  type QuizDifficultyFilter,
  type QuizMode,
  type QuizServerStats,
  type QuizStudyLink,
} from "@/data/quiz";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const QUIZ_STATS_KEY = "__quiz_server_stats_v1__";

const memoryQuizStats = new Map<string, QuizServerStats>();

const VALID_MODES = new Set<QuizMode>(["study", "timed", "mistakes"]);
const VALID_DIFFICULTIES = new Set<QuizDifficultyFilter>(["all", "Лёгкий", "Средний", "Сложный"]);
const VALID_CATEGORIES = new Set<QuizCategoryFilter>(["all", "core", "oop", "collections", "sql", "spring"]);
const TOPIC_KEYS: QuizCategory[] = ["core", "oop", "collections", "sql", "spring"];

function normalizeQuizStats(raw: unknown, persistedQuizIds: string[] = []): QuizServerStats {
  const base = createEmptyQuizServerStats();
  if (!raw || typeof raw !== "object") {
    const uniqueMastered = Array.from(new Set(persistedQuizIds.filter((id) => Boolean(getQuizQuestionById(id)))));
    base.masteredQuestionIds = uniqueMastered;
    base.earnedQuizXp = uniqueMastered.length * QUIZ_XP_PER_MASTERED_QUESTION;
    return base;
  }

  const obj = raw as Partial<QuizServerStats>;
  const rawMastered = Array.isArray(obj.masteredQuestionIds) ? obj.masteredQuestionIds : [];
  const masteredSet = new Set<string>(
    [...rawMastered, ...persistedQuizIds].map(String).filter((id) => Boolean(getQuizQuestionById(id)))
  );
  const rawWrong = Array.isArray(obj.wrongQuestionIds) ? obj.wrongQuestionIds : [];
  const wrongSet = new Set<string>(
    rawWrong.map(String).filter((id) => Boolean(getQuizQuestionById(id)))
  );

  const topicStats = { ...base.topicStats };
  if (obj.topicStats && typeof obj.topicStats === "object") {
    for (const k of TOPIC_KEYS) {
      const t = obj.topicStats[k];
      if (t && typeof t === "object") {
        topicStats[k] = {
          answered: Math.max(0, Number(t.answered) || 0),
          correct: Math.max(0, Number(t.correct) || 0),
        };
      }
    }
  }

  const history: QuizAttemptRecord[] = Array.isArray(obj.history)
    ? obj.history.slice(0, 30).map((h) => ({
        id: String(h.id || `qa_${Date.now()}`),
        mode: VALID_MODES.has(h.mode) ? h.mode : "study",
        difficulty: VALID_DIFFICULTIES.has(h.difficulty) ? h.difficulty : "all",
        category: VALID_CATEGORIES.has(h.category) ? h.category : "all",
        score: Math.max(0, Number(h.score) || 0),
        total: Math.max(1, Number(h.total) || 1),
        accuracy: Math.max(0, Math.min(100, Number(h.accuracy) || 0)),
        durationSec: Math.max(0, Number(h.durationSec) || 0),
        xpEarned: Math.max(0, Number(h.xpEarned) || 0),
        createdAt: typeof h.createdAt === "string" ? h.createdAt : new Date().toISOString(),
      }))
    : [];

  const masteredQuestionIds = Array.from(masteredSet);

  return {
    totalQuizzes: Math.max(0, Number(obj.totalQuizzes) || 0),
    studyQuizzes: Math.max(0, Number(obj.studyQuizzes) || 0),
    timedQuizzes: Math.max(0, Number(obj.timedQuizzes) || 0),
    totalQuestionsAnswered: Math.max(0, Number(obj.totalQuestionsAnswered) || 0),
    totalCorrectAnswers: Math.max(0, Number(obj.totalCorrectAnswers) || 0),
    bestTimedAccuracy: Math.max(0, Math.min(100, Number(obj.bestTimedAccuracy) || 0)),
    totalTimeSpentSec: Math.max(0, Number(obj.totalTimeSpentSec) || 0),
    earnedQuizXp: masteredQuestionIds.length * QUIZ_XP_PER_MASTERED_QUESTION,
    masteredQuestionIds,
    wrongQuestionIds: Array.from(wrongSet),
    topicStats,
    history,
  };
}

function yesterdayIsoDate(d = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return y.toISOString().slice(0, 10);
}

export interface GradedQuizReviewItem {
  questionId: string;
  question: string;
  codeSnippet?: string;
  category: QuizCategory;
  difficulty: string;
  options: [string, string, string, string];
  selectedIndex: number | null;
  correctIndex: 0 | 1 | 2 | 3;
  isCorrect: boolean;
  timedOut: boolean;
  explanation: string;
  relatedLinks: QuizStudyLink[];
  newlyMastered: boolean;
}

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { authenticated: false, stats: null },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate, private" },
        }
      );
    }

    if (!isDbConfigured || !prisma) {
      const memStats = memoryQuizStats.get(session.userId) ?? createEmptyQuizServerStats();
      return NextResponse.json(
        { authenticated: true, stats: memStats, source: "memory" },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, private" } }
      );
    }

    const record = await prisma.userProgress.findUnique({
      where: { userId: session.userId },
      select: { completedAt: true, completedTasks: true },
    });

    const completedAtObj = (record?.completedAt as Record<string, unknown>) || {};
    const completedTasksObj = (record?.completedTasks as Record<string, string[]>) || {};
    const quizTaskIds = Array.isArray(completedTasksObj["quiz"]) ? completedTasksObj["quiz"] : [];
    const stats = normalizeQuizStats(completedAtObj[QUIZ_STATS_KEY], quizTaskIds);

    return NextResponse.json(
      { authenticated: true, stats, source: "database" },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, private" } }
    );
  } catch (err: unknown) {
    console.error("GET /api/quiz error:", err);
    return NextResponse.json(
      { error: "Ошибка загрузки серверной статистики квизов" },
      { status: 500 }
    );
  }
}

interface QuizAnswerInput {
  questionId: string;
  selectedIndex: number | null;
  timeSpentSec?: number;
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: "Войдите в аккаунт, чтобы сохранять статистику квизов на сервере" },
        { status: 401 }
      );
    }

    const limit = checkRateLimit(`quiz-submit:${session.userId}`, {
      intervalSeconds: 60,
      maxRequests: 20,
    });
    if (!limit.allowed) {
      return rateLimitResponse(
        limit.resetInSeconds,
        "Слишком частая отправка результатов квиза. Подождите немного."
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
    }

    const rawMode = String(body.mode || "study") as QuizMode;
    const mode: QuizMode = VALID_MODES.has(rawMode) ? rawMode : "study";

    const rawDiff = String(body.difficulty || "all") as QuizDifficultyFilter;
    const difficulty: QuizDifficultyFilter = VALID_DIFFICULTIES.has(rawDiff) ? rawDiff : "all";

    const rawCat = String(body.category || "all") as QuizCategoryFilter;
    const category: QuizCategoryFilter = VALID_CATEGORIES.has(rawCat) ? rawCat : "all";

    const rawAnswers = Array.isArray(body.answers) ? (body.answers as QuizAnswerInput[]) : [];
    if (rawAnswers.length === 0 || rawAnswers.length > 30) {
      return NextResponse.json(
        { error: "Количество ответов в квизе должно быть от 1 до 30" },
        { status: 400 }
      );
    }

    // Load current state from DB or in-memory store
    let existingRecord: Awaited<ReturnType<NonNullable<typeof prisma>["userProgress"]["findUnique"]>> & {
      user?: {
        xp: number;
        streakCurrent: number;
        streakBest: number;
        lastActiveDate: string | null;
      } | null;
    } | null = null;

    if (isDbConfigured && prisma) {
      existingRecord = await prisma.userProgress.findUnique({
        where: { userId: session.userId },
        include: {
          user: {
            select: {
              xp: true,
              streakCurrent: true,
              streakBest: true,
              lastActiveDate: true,
            },
          },
        },
      });
    }

    const existingCompletedAtObj =
      (existingRecord?.completedAt as Record<string, unknown>) || {};
    const existingCompletedTasksObj =
      (existingRecord?.completedTasks as Record<string, string[]>) || {};
    const existingQuizTaskIds = Array.isArray(existingCompletedTasksObj["quiz"])
      ? existingCompletedTasksObj["quiz"]
      : [];

    const prevStats =
      isDbConfigured && prisma
        ? normalizeQuizStats(existingCompletedAtObj[QUIZ_STATS_KEY], existingQuizTaskIds)
        : memoryQuizStats.get(session.userId) ?? createEmptyQuizServerStats();

    const masteredSet = new Set<string>(prevStats.masteredQuestionIds);
    const wrongSet = new Set<string>(prevStats.wrongQuestionIds);
    const nextTopicStats = {
      core: { ...prevStats.topicStats.core },
      oop: { ...prevStats.topicStats.oop },
      collections: { ...prevStats.topicStats.collections },
      sql: { ...prevStats.topicStats.sql },
      spring: { ...prevStats.topicStats.spring },
    };

    const review: GradedQuizReviewItem[] = [];
    let score = 0;
    let totalDurationSec = 0;
    let newlyMasteredCount = 0;
    const seenIdsInAttempt = new Set<string>();

    for (const ans of rawAnswers) {
      const qId = String(ans?.questionId || "").trim();
      if (!qId || seenIdsInAttempt.has(qId)) continue;

      const question = getQuizQuestionById(qId);
      if (!question) continue;
      seenIdsInAttempt.add(qId);

      const selectedIndex =
        typeof ans.selectedIndex === "number" &&
        Number.isInteger(ans.selectedIndex) &&
        ans.selectedIndex >= 0 &&
        ans.selectedIndex <= 3
          ? ans.selectedIndex
          : null;

      const timedOut = selectedIndex === null;
      const isCorrect = selectedIndex !== null && selectedIndex === question.correctIndex;
      const itemDuration = Math.max(0, Math.min(300, Math.round(Number(ans.timeSpentSec) || 0)));
      totalDurationSec += itemDuration;

      nextTopicStats[question.category].answered += 1;
      if (isCorrect) {
        score += 1;
        nextTopicStats[question.category].correct += 1;
        wrongSet.delete(question.id);
      } else {
        wrongSet.add(question.id);
      }

      let newlyMastered = false;
      if (isCorrect && !masteredSet.has(question.id)) {
        masteredSet.add(question.id);
        newlyMastered = true;
        newlyMasteredCount += 1;
      }

      review.push({
        questionId: question.id,
        question: question.question,
        codeSnippet: question.codeSnippet,
        category: question.category,
        difficulty: question.difficulty,
        options: question.options,
        selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect,
        timedOut,
        explanation: question.explanation,
        relatedLinks: question.relatedLinks,
        newlyMastered,
      });
    }

    if (review.length === 0) {
      return NextResponse.json(
        { error: "Не найдено ни одного валидного вопроса для проверки" },
        { status: 400 }
      );
    }

    const total = review.length;
    const accuracy = Math.round((score / total) * 100);
    const xpEarned = newlyMasteredCount * QUIZ_XP_PER_MASTERED_QUESTION;
    const masteredQuestionIds = Array.from(masteredSet);
    const wrongQuestionIds = Array.from(wrongSet);

    const attemptRecord: QuizAttemptRecord = {
      id: `qa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      mode,
      difficulty,
      category,
      score,
      total,
      accuracy,
      durationSec: Math.max(totalDurationSec, Number(body.totalDurationSec) ? Math.min(3600, Math.max(0, Math.round(Number(body.totalDurationSec)))) : 0),
      xpEarned,
      createdAt: new Date().toISOString(),
    };

    const updatedStats: QuizServerStats = {
      totalQuizzes: prevStats.totalQuizzes + 1,
      studyQuizzes: prevStats.studyQuizzes + (mode === "study" ? 1 : 0),
      timedQuizzes: prevStats.timedQuizzes + (mode === "timed" ? 1 : 0),
      totalQuestionsAnswered: prevStats.totalQuestionsAnswered + total,
      totalCorrectAnswers: prevStats.totalCorrectAnswers + score,
      bestTimedAccuracy:
        mode === "timed"
          ? Math.max(prevStats.bestTimedAccuracy, accuracy)
          : prevStats.bestTimedAccuracy,
      totalTimeSpentSec: prevStats.totalTimeSpentSec + attemptRecord.durationSec,
      earnedQuizXp: masteredQuestionIds.length * QUIZ_XP_PER_MASTERED_QUESTION,
      masteredQuestionIds,
      wrongQuestionIds,
      topicStats: nextTopicStats,
      history: [attemptRecord, ...prevStats.history].slice(0, 30),
    };

    if (!isDbConfigured || !prisma) {
      memoryQuizStats.set(session.userId, updatedStats);
      return NextResponse.json(
        {
          success: true,
          stats: updatedStats,
          attempt: attemptRecord,
          xpEarned,
          totalUserXp: updatedStats.earnedQuizXp,
          review,
        },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, private" } }
      );
    }

    // Update streak accurately on server
    const today = new Date().toISOString().slice(0, 10);
    const prevUserStreakCurrent = existingRecord?.user?.streakCurrent ?? 0;
    const prevUserStreakBest = existingRecord?.user?.streakBest ?? 0;
    const prevLastActive = existingRecord?.user?.lastActiveDate ?? null;

    let nextStreakCurrent = prevUserStreakCurrent;
    if (prevLastActive !== today) {
      nextStreakCurrent = prevLastActive === yesterdayIsoDate() ? prevUserStreakCurrent + 1 : 1;
    }
    const nextStreakBest = Math.max(prevUserStreakBest, nextStreakCurrent);

    // Strip internal key before running progress validator
    const cleanCompletedAt: Record<string, string> = {};
    for (const [k, v] of Object.entries(existingCompletedAtObj)) {
      if (k !== QUIZ_STATS_KEY && typeof v === "string") {
        cleanCompletedAt[k] = v;
      }
    }

    const rawProgressState: ProgressState = {
      version: 1,
      xp: existingRecord?.user?.xp ?? 0,
      completedDays: existingRecord?.completedDays ?? [],
      completedTasks: {
        ...existingCompletedTasksObj,
        quiz: masteredQuestionIds,
      },
      completedAt: cleanCompletedAt,
      code: (existingRecord?.code as Record<string, string>) || {},
      achievements: (existingRecord?.achievements as Record<string, string>) || {},
      streak: {
        current: nextStreakCurrent,
        best: nextStreakBest,
        lastActiveDate: today,
      },
      stats: {
        runs: existingRecord?.runsCount ?? 0,
        compileErrors: existingRecord?.compileErrorsCount ?? 0,
        checks: (existingRecord?.checksCount ?? 0) + 1,
        scannerDays: existingRecord?.scannerDays ?? [],
      },
    };

    const { sanitized: finalSanitized, calculatedXp: finalXp } =
      validateAndSanitizeProgress(rawProgressState);

    const dbCompletedAt: Record<string, unknown> = {
      ...finalSanitized.completedAt,
      [QUIZ_STATS_KEY]: updatedStats,
    };

    await prisma.$transaction([
      prisma.userProgress.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          completedDays: finalSanitized.completedDays,
          completedTasks: finalSanitized.completedTasks as unknown as Prisma.InputJsonValue,
          completedAt: dbCompletedAt as unknown as Prisma.InputJsonValue,
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
          completedAt: dbCompletedAt as unknown as Prisma.InputJsonValue,
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

    return NextResponse.json(
      {
        success: true,
        stats: updatedStats,
        attempt: attemptRecord,
        xpEarned,
        totalUserXp: finalXp,
        review,
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, private" } }
    );
  } catch (err: unknown) {
    console.error("POST /api/quiz error:", err);
    return NextResponse.json(
      { error: "Ошибка сохранения результатов квиза на сервере" },
      { status: 500 }
    );
  }
}
