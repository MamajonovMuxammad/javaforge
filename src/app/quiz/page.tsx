"use client";

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import {
  ALL_QUIZ_QUESTIONS,
  QUIZ_CATEGORIES,
  buildQuizDeck,
  getCategoryMeta,
  type QuizCategory,
  type QuizCategoryFilter,
  type QuizDifficultyFilter,
  type QuizMode,
  type QuizQuestion,
  type QuizServerStats,
  type QuizStudyLink,
} from "@/data/quiz";
import { useAuth, getAuthHeaders } from "@/lib/auth/store";
import { hydrateFromServer, useProgress } from "@/lib/progress/store";
import { AuthModal } from "@/components/modals/AuthModal";
import { fireConfetti } from "@/lib/confetti";
import { useToast } from "@/components/ui/Toaster";
import type { GradedQuizReviewItem } from "@/app/api/quiz/route";
import {
  ArrowLeft,
  Brain,
  BookOpen,
  Timer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Lightbulb,
  ChevronRight,
  Trophy,
  Target,
  Clock,
  ShieldCheck,
  Code2,
  Play,
  Loader2,
  Lock,
  User as UserIcon,
  Award,
  BarChart3,
  History,
  Check,
} from "lucide-react";

type QuizPhase = "lobby" | "running" | "submitting" | "results";

interface CollectedAnswer {
  questionId: string;
  selectedIndex: number | null;
  timeSpentSec: number;
}

interface QuizSubmitResponse {
  success: boolean;
  stats: QuizServerStats;
  attempt: {
    id: string;
    mode: QuizMode;
    difficulty: QuizDifficultyFilter;
    category: QuizCategoryFilter;
    score: number;
    total: number;
    accuracy: number;
    durationSec: number;
    xpEarned: number;
    createdAt: string;
  };
  xpEarned: number;
  totalUserXp: number;
  review: GradedQuizReviewItem[];
}

function formatDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m === 0) return `${rem} сек`;
  return `${m} мин ${rem < 10 ? "0" : ""}${rem} сек`;
}

function formatDateRu(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 16).replace("T", " ");
  }
}

function getGradeBadge(accuracy: number): {
  grade: "S" | "A" | "B" | "C";
  label: string;
  colorClass: string;
} {
  if (accuracy >= 90) {
    return {
      grade: "S",
      label: "Отличная готовность к собесу!",
      colorClass: "from-amber-400 to-orange-500 text-black shadow-orange-500/30",
    };
  }
  if (accuracy >= 75) {
    return {
      grade: "A",
      label: "Уверенный уровень Junior+",
      colorClass: "from-emerald-400 to-teal-500 text-black shadow-emerald-500/30",
    };
  }
  if (accuracy >= 50) {
    return {
      grade: "B",
      label: "Хорошая база, стоит повторить детали",
      colorClass: "from-sky-400 to-indigo-500 text-white shadow-sky-500/30",
    };
  }
  return {
    grade: "C",
    label: "Есть пробелы — изучи уроки по ссылкам ниже",
    colorClass: "from-rose-500 to-orange-600 text-white shadow-rose-500/30",
  };
}

function difficultyBadgeClass(diff: string): string {
  switch (diff) {
    case "Лёгкий":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "Средний":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "Сложный":
      return "border-rose-500/30 bg-rose-500/10 text-rose-400";
    default:
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-400";
  }
}

function QuizArenaContent() {
  const auth = useAuth();
  const progress = useProgress();
  const toast = useToast();

  // Phase & Auth modal
  const [phase, setPhase] = useState<QuizPhase>("lobby");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Server-only statistics state (never stored in localStorage)
  const [serverStats, setServerStats] = useState<QuizServerStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Quiz configuration (Lobby)
  const [selectedMode, setSelectedMode] = useState<QuizMode>("study");
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficultyFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<QuizCategoryFilter>("all");
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Active quiz session state
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isStudyRevealed, setIsStudyRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [collectedAnswers, setCollectedAnswers] = useState<CollectedAnswer[]>([]);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);

  // Track timing with refs to avoid stale closures on timer tick
  const questionStartMsRef = useRef<number>(Date.now());
  const sessionStartMsRef = useRef<number>(Date.now());
  const collectedRef = useRef<CollectedAnswer[]>([]);
  const isAdvancingRef = useRef<boolean>(false);

  // Post-quiz results
  const [resultData, setResultData] = useState<QuizSubmitResponse | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong">("all");

  // Fetch 100% server-stored quiz stats from PostgreSQL
  const fetchServerQuizStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await fetch(`/api/quiz?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) {
        throw new Error("Не удалось загрузить статистику с сервера");
      }
      const data = await res.json();
      setServerStats(data?.stats ?? null);
    } catch (err) {
      setStatsError((err as Error).message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServerQuizStats();
  }, [auth.isAuthenticated, auth.user?.id, fetchServerQuizStats]);

  // Available count preview for current filters
  const availableQuestionsCount = useMemo(() => {
    return buildQuizDeck({
      difficulty: selectedDifficulty,
      category: selectedCategory,
      count: ALL_QUIZ_QUESTIONS.length,
      mode: selectedMode,
      wrongQuestionIds: serverStats?.wrongQuestionIds ?? [],
    }).length;
  }, [selectedDifficulty, selectedCategory, selectedMode, serverStats?.wrongQuestionIds]);

  // Submit all collected answers to server
  const finishAndSubmitQuiz = useCallback(
    async (finalAnswers: CollectedAnswer[], activeMode: QuizMode, activeDiff: QuizDifficultyFilter, activeCat: QuizCategoryFilter) => {
      setPhase("submitting");
      const totalDurationSec = Math.max(
        1,
        Math.round((Date.now() - sessionStartMsRef.current) / 1000)
      );

      if (!auth.isAuthenticated) {
        // Guest preview grading without persisting to localStorage
        const review: GradedQuizReviewItem[] = finalAnswers
          .map((a) => {
            const q = ALL_QUIZ_QUESTIONS.find((item) => item.id === a.questionId);
            if (!q) return null;
            return {
              questionId: q.id,
              question: q.question,
              codeSnippet: q.codeSnippet,
              category: q.category,
              difficulty: q.difficulty,
              options: q.options,
              selectedIndex: a.selectedIndex,
              correctIndex: q.correctIndex,
              isCorrect: a.selectedIndex !== null && a.selectedIndex === q.correctIndex,
              timedOut: a.selectedIndex === null,
              explanation: q.explanation,
              relatedLinks: q.relatedLinks,
              newlyMastered: false,
            };
          })
          .filter(Boolean) as GradedQuizReviewItem[];

        const score = review.filter((r) => r.isCorrect).length;
        const total = Math.max(1, review.length);
        const accuracy = Math.round((score / total) * 100);

        setResultData({
          success: true,
          stats: serverStats ?? {
            totalQuizzes: 0,
            studyQuizzes: 0,
            timedQuizzes: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            bestTimedAccuracy: 0,
            totalTimeSpentSec: 0,
            earnedQuizXp: 0,
            masteredQuestionIds: [],
            wrongQuestionIds: [],
            topicStats: {
              core: { answered: 0, correct: 0 },
              oop: { answered: 0, correct: 0 },
              collections: { answered: 0, correct: 0 },
              sql: { answered: 0, correct: 0 },
              spring: { answered: 0, correct: 0 },
            },
            history: [],
          },
          attempt: {
            id: `guest_${Date.now()}`,
            mode: activeMode,
            difficulty: activeDiff,
            category: activeCat,
            score,
            total,
            accuracy,
            durationSec: totalDurationSec,
            xpEarned: 0,
            createdAt: new Date().toISOString(),
          },
          xpEarned: 0,
          totalUserXp: progress.xp,
          review,
        });
        setReviewFilter("all");
        setPhase("results");
        toast({
          variant: "info",
          title: "Гостевой режим",
          description: "Войдите в аккаунт, чтобы результаты и статистика квизов сохранялись на сервере.",
        });
        return;
      }

      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            mode: activeMode,
            difficulty: activeDiff,
            category: activeCat,
            totalDurationSec,
            answers: finalAnswers,
          }),
          cache: "no-store",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Ошибка сохранения результатов квиза");
        }

        setServerStats(data.stats);
        setResultData(data);
        setReviewFilter("all");
        setPhase("results");

        // Hydrate global user XP / streak / achievements directly from PostgreSQL
        await hydrateFromServer(true);

        if (data.attempt.accuracy >= 70) {
          await fireConfetti("success");
        }
        toast({
          variant: "success",
          title: `Квиз завершён: ${data.attempt.score} из ${data.attempt.total} (${data.attempt.accuracy}%)`,
          description:
            data.xpEarned > 0
              ? `Статистика сохранена на сервере. Начислено +${data.xpEarned} XP!`
              : "Статистика и история обновлены на сервере.",
          badge: data.xpEarned > 0 ? `+${data.xpEarned} XP` : undefined,
        });
      } catch (err) {
        toast({
          variant: "error",
          title: "Ошибка сохранения",
          description: (err as Error).message,
        });
        setPhase("lobby");
      }
    },
    [auth.isAuthenticated, progress.xp, serverStats, toast]
  );

  // Start Quiz Handler
  const handleStartQuiz = (overrideCategory?: QuizCategoryFilter, overrideMode?: QuizMode) => {
    const modeToUse = overrideMode ?? selectedMode;
    const catToUse = overrideCategory ?? selectedCategory;

    if (modeToUse === "mistakes" && (!auth.isAuthenticated || (serverStats?.wrongQuestionIds.length ?? 0) === 0)) {
      if (!auth.isAuthenticated) {
        setAuthModalOpen(true);
      } else {
        toast({
          variant: "info",
          title: "Ошибок пока нет",
          description: "Сначала пройдите тренировочный квиз или экзамен на время.",
        });
      }
      return;
    }

    const builtDeck = buildQuizDeck({
      difficulty: selectedDifficulty,
      category: catToUse,
      count: questionCount,
      mode: modeToUse,
      wrongQuestionIds: serverStats?.wrongQuestionIds ?? [],
    });

    if (builtDeck.length === 0) {
      toast({
        variant: "error",
        title: "Вопросы не найдены",
        description: "Попробуйте расширить фильтры сложности или темы.",
      });
      return;
    }

    if (overrideCategory !== undefined) setSelectedCategory(overrideCategory);
    if (overrideMode !== undefined) setSelectedMode(overrideMode);

    setDeck(builtDeck);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsStudyRevealed(false);
    setShowHint(false);
    collectedRef.current = [];
    setCollectedAnswers([]);
    questionStartMsRef.current = Date.now();
    sessionStartMsRef.current = Date.now();
    isAdvancingRef.current = false;
    setTimeLeftSec(builtDeck[0].timeLimitSec);
    setResultData(null);
    setPhase("running");
  };

  const currentQuestion: QuizQuestion | undefined = deck[currentIdx];

  // Record current answer and move forward (or reveal in study mode)
  const handleCommitAnswer = useCallback(
    (chosenIndex: number | null, forcedAdvance = false) => {
      if (!currentQuestion || isAdvancingRef.current) return;

      // In study/mistakes mode, clicking an answer first reveals explanation before moving next
      if (selectedMode !== "timed" && !isStudyRevealed && !forcedAdvance) {
        if (chosenIndex === null) return;
        setSelectedOption(chosenIndex);
        setIsStudyRevealed(true);
        return;
      }

      isAdvancingRef.current = true;
      const elapsedSec = Math.max(
        1,
        Math.round((Date.now() - questionStartMsRef.current) / 1000)
      );

      const finalChoice =
        selectedMode !== "timed" && isStudyRevealed ? selectedOption : chosenIndex;

      const entry: CollectedAnswer = {
        questionId: currentQuestion.id,
        selectedIndex: finalChoice,
        timeSpentSec: elapsedSec,
      };

      const nextCollected = [...collectedRef.current, entry];
      collectedRef.current = nextCollected;
      setCollectedAnswers(nextCollected);

      if (currentIdx + 1 < deck.length) {
        const nextQ = deck[currentIdx + 1];
        setCurrentIdx((idx) => idx + 1);
        setSelectedOption(null);
        setIsStudyRevealed(false);
        setShowHint(false);
        questionStartMsRef.current = Date.now();
        setTimeLeftSec(nextQ.timeLimitSec);
        isAdvancingRef.current = false;
      } else {
        finishAndSubmitQuiz(nextCollected, selectedMode, selectedDifficulty, selectedCategory);
      }
    },
    [
      currentQuestion,
      selectedMode,
      isStudyRevealed,
      selectedOption,
      currentIdx,
      deck,
      finishAndSubmitQuiz,
      selectedDifficulty,
      selectedCategory,
    ]
  );

  // Strict per-question countdown timer for Timed Exam mode
  useEffect(() => {
    if (phase !== "running" || selectedMode !== "timed" || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCommitAnswer(null, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, selectedMode, currentQuestion, currentIdx, handleCommitAnswer]);

  // Keyboard shortcuts (1-4 to select option, Enter to continue)
  useEffect(() => {
    if (phase !== "running" || !currentQuestion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (authModalOpen) return;
      if (e.key >= "1" && e.key <= "4") {
        const idx = Number(e.key) - 1;
        if (selectedMode === "timed") {
          setSelectedOption(idx);
        } else if (!isStudyRevealed) {
          handleCommitAnswer(idx);
        }
      } else if (e.key === "Enter") {
        if (selectedMode === "timed" && selectedOption !== null) {
          e.preventDefault();
          handleCommitAnswer(selectedOption, true);
        } else if (selectedMode !== "timed" && isStudyRevealed) {
          e.preventDefault();
          handleCommitAnswer(selectedOption, true);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, currentQuestion, authModalOpen, selectedMode, isStudyRevealed, selectedOption, handleCommitAnswer]);

  // Unique recommended lessons collected from incorrect/timed-out answers on results screen
  const missedLessonLinks = useMemo<QuizStudyLink[]>(() => {
    if (!resultData) return [];
    const seenUrls = new Set<string>();
    const links: QuizStudyLink[] = [];
    for (const item of resultData.review) {
      if (item.isCorrect) continue;
      for (const link of item.relatedLinks) {
        if (!seenUrls.has(link.url)) {
          seenUrls.add(link.url);
          links.push(link);
        }
      }
    }
    return links;
  }, [resultData]);

  const overallAccuracy =
    serverStats && serverStats.totalQuestionsAnswered > 0
      ? Math.round((serverStats.totalCorrectAnswers / serverStats.totalQuestionsAnswered) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-[#09090b]/85 px-4 backdrop-blur-md lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/?view=app"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            title="Вернуться к основному курсу"
          >
            <ArrowLeft className="h-4 w-4 text-orange-400" />
            <span className="hidden sm:inline">В курс</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-md shadow-orange-500/20">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">
                  Собес & Квизы <span className="text-orange-400">JavaForge</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.2 font-mono text-[10px] font-semibold text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  Server Sync
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 hidden sm:block">
                Тренажёр технических собеседований · {ALL_QUIZ_QUESTIONS.length} вопросов
              </div>
            </div>
          </div>
        </div>

        {/* Right Nav & User Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/practice"
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <Code2 className="h-3.5 w-3.5 text-orange-400" />
            <span>Доп. задания</span>
          </Link>

          <Link
            href="/leaderboard"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Лидерборд</span>
          </Link>

          {auth.isAuthenticated && auth.user ? (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-2.5 py-1 text-xs">
              <span>{auth.user.avatar}</span>
              <span className="font-mono font-semibold text-zinc-200 hidden sm:inline">
                {auth.user.username}
              </span>
              <span className="font-mono font-bold text-amber-400">{progress.xp} XP</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/15 px-3 py-1.5 text-xs font-semibold text-orange-300 transition hover:bg-orange-500 hover:text-white"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Войти</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* =============================================================== */}
        {/* PHASE 1: LOBBY & CONFIGURATION + SERVER DASHBOARD               */}
        {/* =============================================================== */}
        {phase === "lobby" && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-6 sm:p-9 shadow-2xl">
              <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                    <Target className="h-3.5 w-3.5 text-orange-400" />
                    <span>Подготовка к техническому собеседованию Java Junior</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Проверь знания теории и{" "}
                    <span className="text-gradient">прокачайся к офферу</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Выбирай режим обучения со ссылками на уроки или жёсткий экзамен на время без
                    подсказок. Вся статистика, точность по темам и список ошибок хранятся строго на
                    сервере в твоём профиле PostgreSQL.
                  </p>
                </div>

                {/* Quick Server Mastery Summary */}
                <div className="w-full lg:w-72 shrink-0 rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Освоено вопросов</span>
                    <span className="font-mono font-bold text-orange-400">
                      {serverStats?.masteredQuestionIds.length ?? 0} / {ALL_QUIZ_QUESTIONS.length}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900 border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
                      style={{
                        width: `${Math.round(
                          ((serverStats?.masteredQuestionIds.length ?? 0) /
                            ALL_QUIZ_QUESTIONS.length) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase">Опыт с квизов</div>
                      <div className="font-mono font-bold text-amber-300">
                        +{serverStats?.earnedQuizXp ?? 0} XP
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase">Лучший экзамен</div>
                      <div className="font-mono font-bold text-emerald-400">
                        {serverStats?.bestTimedAccuracy ?? 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest / Unauthenticated Warning Banner */}
            {!auth.isAuthenticated && (
              <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-zinc-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Войдите в аккаунт для сохранения серверной статистики
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                      Статистика квизов и работа над ошибками хранятся только в базе данных сервера
                      (ничего не сохраняется локально в браузере). Без входа квиз работает в
                      ознакомительном режиме без начисления XP.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="shrink-0 rounded-xl bg-orange-500 hover:bg-orange-400 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition"
                >
                  Войти / Регистрация
                </button>
              </div>
            )}

            {/* Step 1: Select Quiz Mode */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                <Sparkles className="h-4 w-4 text-orange-400" />
                <span>1. Выбери формат квиза</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mode A: Study Mode */}
                <button
                  type="button"
                  onClick={() => setSelectedMode("study")}
                  className={`flex flex-col justify-between text-left rounded-2xl border p-5 transition-all ${
                    selectedMode === "study"
                      ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/40"
                      : "border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/80"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                        Без таймера
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">Обучение и разбор</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Спокойно изучай вопросы. Если не знаешь ответ — внизу сразу есть прямые ссылки
                      на уроки курса, чтобы прочитать тему перед ответом.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-sky-400">
                    <span>✓ Подсказки и ссылки на уроки</span>
                    {selectedMode === "study" && <Check className="h-4 w-4 text-orange-400" />}
                  </div>
                </button>

                {/* Mode B: Timed Exam Mode */}
                <button
                  type="button"
                  onClick={() => setSelectedMode("timed")}
                  className={`flex flex-col justify-between text-left rounded-2xl border p-5 transition-all ${
                    selectedMode === "timed"
                      ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/40"
                      : "border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/80"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Timer className="h-5 w-5" />
                      </div>
                      <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                        30–60 сек / вопрос
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">Экзамен на время</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Условия реального собеседования. Ссылки на курсы и подсказки отключены —
                      отвечай на таймер. Итоги сохраняются в твой рекорд.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-amber-400">
                    <span>⚡ Строгий таймер, без ссылок</span>
                    {selectedMode === "timed" && <Check className="h-4 w-4 text-orange-400" />}
                  </div>
                </button>

                {/* Mode C: Mistakes Review */}
                <button
                  type="button"
                  onClick={() => setSelectedMode("mistakes")}
                  className={`flex flex-col justify-between text-left rounded-2xl border p-5 transition-all ${
                    selectedMode === "mistakes"
                      ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/40"
                      : "border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/80"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <RotateCcw className="h-5 w-5" />
                      </div>
                      <span className="rounded-md border border-white/10 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-300">
                        Ошибок: {serverStats?.wrongQuestionIds.length ?? 0}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">Работа над ошибками</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Закрывай пробелы! Квиз формируется только из тех вопросов, в которых ты ранее
                      ошибся или не уложился во время.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-rose-400">
                    <span>🎯 Ссылки на теорию включены</span>
                    {selectedMode === "mistakes" && <Check className="h-4 w-4 text-orange-400" />}
                  </div>
                </button>
              </div>
            </section>

            {/* Step 2: Difficulty, Category & Question Count Controls */}
            <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Difficulty */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    2. Уровень сложности
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["all", "Лёгкий", "Средний", "Сложный"] as QuizDifficultyFilter[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDifficulty(d)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          selectedDifficulty === d
                            ? "border-orange-500 bg-orange-500/20 text-white"
                            : "border-white/10 bg-zinc-950/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                        }`}
                      >
                        {d === "all" ? "Микс (Все)" : d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question count */}
                <div className="lg:col-span-3 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    3. Вопросов
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 15, 20].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`rounded-xl border px-3 py-2 font-mono text-xs font-bold transition ${
                          questionCount === cnt
                            ? "border-orange-500 bg-orange-500/20 text-white"
                            : "border-white/10 bg-zinc-950/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Action */}
                <div className="lg:col-span-4 flex flex-col justify-end">
                  <button
                    type="button"
                    disabled={availableQuestionsCount === 0 && selectedMode !== "mistakes"}
                    onClick={() => handleStartQuiz()}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:opacity-40"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>
                      Начать квиз (
                      {selectedMode === "mistakes"
                        ? availableQuestionsCount
                        : Math.min(questionCount, availableQuestionsCount)}{" "}
                      вопр.)
                    </span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Тема вопросов
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      selectedCategory === "all"
                        ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                        : "border-white/10 bg-zinc-950/70 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    Все темы ({ALL_QUIZ_QUESTIONS.length})
                  </button>

                  {QUIZ_CATEGORIES.map((cat) => {
                    const countInCat = ALL_QUIZ_QUESTIONS.filter(
                      (q) => q.category === cat.id
                    ).length;
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                          active
                            ? "text-white shadow-md"
                            : "border-white/10 bg-zinc-950/70 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        }`}
                        style={{
                          backgroundColor: active ? `${cat.color}25` : undefined,
                          borderColor: active ? cat.color : undefined,
                        }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.shortTitle}</span>
                        <span className="font-mono text-[10px] opacity-75">({countInCat})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Step 3: Server Analytics Dashboard */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  <span>Серверная аналитика и прогресс подготовки</span>
                </div>
                {statsLoading && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-400" />
                    Синхронизация с БД...
                  </span>
                )}
              </div>

              {statsError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  {statsError}
                </div>
              )}

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                  <div className="text-[11px] text-zinc-400 mb-1">Пройдено квизов</div>
                  <div className="font-mono text-2xl font-bold text-white">
                    {serverStats?.totalQuizzes ?? 0}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Экзаменов: {serverStats?.timedQuizzes ?? 0}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                  <div className="text-[11px] text-zinc-400 mb-1">Общая точность</div>
                  <div className="font-mono text-2xl font-bold text-emerald-400">
                    {overallAccuracy}%
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {serverStats?.totalCorrectAnswers ?? 0} из{" "}
                    {serverStats?.totalQuestionsAnswered ?? 0} верно
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                  <div className="text-[11px] text-zinc-400 mb-1">Освоено уникальных</div>
                  <div className="font-mono text-2xl font-bold text-amber-300">
                    {serverStats?.masteredQuestionIds.length ?? 0}
                    <span className="text-sm font-normal text-zinc-500">
                      {" "}
                      / {ALL_QUIZ_QUESTIONS.length}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    +{serverStats?.earnedQuizXp ?? 0} XP начислено
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                  <div className="text-[11px] text-zinc-400 mb-1">Ошибок к повторению</div>
                  <div className="font-mono text-2xl font-bold text-rose-400">
                    {serverStats?.wrongQuestionIds.length ?? 0}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Времени в квизах: {formatDuration(serverStats?.totalTimeSpentSec ?? 0)}
                  </div>
                </div>
              </div>

              {/* Topic Mastery Grid + Recent Server History */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Topic Mastery Breakdown */}
                <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-zinc-900/40 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-orange-400" />
                    <span>Владение темами Java</span>
                  </h3>
                  <div className="space-y-3.5">
                    {QUIZ_CATEGORIES.map((cat) => {
                      const stat = serverStats?.topicStats?.[cat.id] ?? {
                        answered: 0,
                        correct: 0,
                      };
                      const pct =
                        stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;

                      return (
                        <div key={cat.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="font-semibold text-zinc-200">{cat.shortTitle}</span>
                              <span className="text-[10px] text-zinc-500">{cat.daysRange}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-zinc-400">
                                {stat.correct}/{stat.answered} ({pct}%)
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStartQuiz(cat.id, "study")}
                                className="rounded bg-white/5 hover:bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-300 transition"
                              >
                                Тренировать
                              </button>
                            </div>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-950 border border-white/5">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: cat.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* History Table */}
                <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-zinc-900/40 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="h-4 w-4 text-sky-400" />
                    <span>История попыток (PostgreSQL)</span>
                  </h3>

                  {!serverStats || serverStats.history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 space-y-2">
                      <Brain className="h-8 w-8 opacity-30 text-orange-400" />
                      <p className="text-xs">
                        {auth.isAuthenticated
                          ? "Пока нет завершённых квизов. Запусти первый тест выше!"
                          : "Войди в аккаунт и пройди квиз, чтобы видеть историю своих попыток."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-white/10 text-[11px] uppercase text-zinc-500">
                          <tr>
                            <th className="pb-2 pr-3">Режим</th>
                            <th className="pb-2 pr-3">Тема / Сложность</th>
                            <th className="pb-2 pr-3">Результат</th>
                            <th className="pb-2 pr-3">Время</th>
                            <th className="pb-2 text-right">Дата</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {serverStats.history.slice(0, 8).map((h) => {
                            const modeLabel =
                              h.mode === "timed"
                                ? "⏱ Экзамен"
                                : h.mode === "mistakes"
                                ? "🎯 Ошибки"
                                : "📖 Обучение";
                            const catTitle =
                              h.category === "all"
                                ? "Все темы"
                                : getCategoryMeta(h.category).shortTitle;

                            return (
                              <tr key={h.id} className="hover:bg-white/[0.02]">
                                <td className="py-2.5 pr-3 font-medium text-zinc-200 whitespace-nowrap">
                                  {modeLabel}
                                </td>
                                <td className="py-2.5 pr-3 text-zinc-400">
                                  {catTitle} ·{" "}
                                  <span className="text-zinc-300">
                                    {h.difficulty === "all" ? "Микс" : h.difficulty}
                                  </span>
                                </td>
                                <td className="py-2.5 pr-3 font-mono whitespace-nowrap">
                                  <span
                                    className={
                                      h.accuracy >= 75
                                        ? "text-emerald-400 font-bold"
                                        : h.accuracy >= 50
                                        ? "text-amber-300 font-bold"
                                        : "text-rose-400 font-bold"
                                    }
                                  >
                                    {h.score}/{h.total} ({h.accuracy}%)
                                  </span>
                                  {h.xpEarned > 0 && (
                                    <span className="ml-1.5 text-[10px] text-amber-400">
                                      +{h.xpEarned}XP
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 pr-3 text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                                  {formatDuration(h.durationSec)}
                                </td>
                                <td className="py-2.5 text-right text-zinc-500 whitespace-nowrap font-mono text-[11px]">
                                  {formatDateRu(h.createdAt)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =============================================================== */}
        {/* PHASE 2: ACTIVE QUIZ RUNNER                                     */}
        {/* =============================================================== */}
        {phase === "running" && currentQuestion && (
          <div className="max-w-3xl mx-auto space-y-5 py-2">
            {/* Top Progress & Timer Bar */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Прервать текущий квиз? Результаты не сохранятся.")) {
                        setPhase("lobby");
                      }
                    }}
                    className="rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition"
                  >
                    Выйти
                  </button>
                  <span className="font-mono text-xs font-bold text-white">
                    Вопрос {currentIdx + 1} из {deck.length}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${difficultyBadgeClass(
                      currentQuestion.difficulty
                    )}`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <span
                    className="rounded border px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      borderColor: `${getCategoryMeta(currentQuestion.category).color}50`,
                      backgroundColor: `${getCategoryMeta(currentQuestion.category).color}15`,
                      color: getCategoryMeta(currentQuestion.category).color,
                    }}
                  >
                    {getCategoryMeta(currentQuestion.category).shortTitle}
                  </span>
                </div>

                {/* Right: Timer (strictly for timed mode) or Mode badge */}
                {selectedMode === "timed" ? (
                  <div
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-xs font-bold transition ${
                      timeLeftSec <= 10
                        ? "border-rose-500 bg-rose-500/20 text-rose-300 animate-pulse"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{timeLeftSec} сек</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-300">
                    <BookOpen className="h-3 w-3" />
                    <span>
                      {selectedMode === "mistakes" ? "Работа над ошибками" : "Режим обучения"}
                    </span>
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-950">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / deck.length) * 100}%` }}
                />
              </div>

              {/* Countdown Bar for Timed Mode */}
              {selectedMode === "timed" && (
                <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-950">
                  <div
                    className={`h-full transition-all duration-1000 linear ${
                      timeLeftSec <= 10 ? "bg-rose-500" : "bg-sky-400"
                    }`}
                    style={{
                      width: `${Math.max(
                        0,
                        (timeLeftSec / currentQuestion.timeLimitSec) * 100
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Question Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-6 sm:p-7 shadow-2xl space-y-5">
              <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Optional Code Snippet */}
              {currentQuestion.codeSnippet && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
                  <div className="flex items-center justify-between border-b border-white/[0.06] bg-zinc-900/70 px-3.5 py-1.5 text-[11px] font-mono text-zinc-400">
                    <span>Java / SQL Snippet</span>
                    <span className="text-orange-400">Код вопроса</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs sm:text-sm leading-relaxed text-amber-100">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* 4 Answer Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const letter = ["A", "B", "C", "D"][idx];
                  const isChosen = selectedOption === idx;
                  const isCorrectOpt = idx === currentQuestion.correctIndex;

                  let btnClass =
                    "border-white/10 bg-zinc-900/60 text-zinc-200 hover:border-orange-500/40 hover:bg-zinc-900";

                  if (selectedMode !== "timed" && isStudyRevealed) {
                    if (isCorrectOpt) {
                      btnClass =
                        "border-emerald-500 bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/40";
                    } else if (isChosen && !isCorrectOpt) {
                      btnClass =
                        "border-rose-500 bg-rose-500/15 text-rose-100 ring-1 ring-rose-500/40";
                    } else {
                      btnClass = "border-white/5 bg-zinc-950/50 text-zinc-500 opacity-60";
                    }
                  } else if (isChosen) {
                    btnClass =
                      "border-orange-500 bg-orange-500/15 text-white ring-1 ring-orange-500/40";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={selectedMode !== "timed" && isStudyRevealed}
                      onClick={() => {
                        if (selectedMode === "timed") {
                          setSelectedOption(idx);
                        } else {
                          handleCommitAnswer(idx);
                        }
                      }}
                      className={`group flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left text-xs sm:text-sm transition-all ${btnClass}`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition ${
                          selectedMode !== "timed" && isStudyRevealed && isCorrectOpt
                            ? "border-emerald-400 bg-emerald-500 text-black"
                            : selectedMode !== "timed" && isStudyRevealed && isChosen && !isCorrectOpt
                            ? "border-rose-400 bg-rose-500 text-white"
                            : isChosen
                            ? "border-orange-400 bg-orange-500 text-white"
                            : "border-white/15 bg-zinc-950 text-zinc-400 group-hover:border-orange-500/40 group-hover:text-orange-300"
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 leading-relaxed pt-0.5">{opt}</span>
                      <span className="hidden sm:inline font-mono text-[10px] text-zinc-600 pt-1">
                        [{idx + 1}]
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer inside Question Card */}
              {selectedMode === "timed" ? (
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] text-zinc-500">
                    🔒 В режиме экзамена на время подсказки и ссылки на уроки отключены
                  </span>
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={() => handleCommitAnswer(selectedOption, true)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 disabled:opacity-40 transition"
                  >
                    <span>
                      {currentIdx + 1 === deck.length ? "Завершить экзамен" : "Ответить и далее"}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                isStudyRevealed && (
                  <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                    <div
                      className={`rounded-2xl border p-4 text-xs leading-relaxed ${
                        selectedOption === currentQuestion.correctIndex
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold mb-1.5 text-sm">
                        {selectedOption === currentQuestion.correctIndex ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Верно! Отличный ответ</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-rose-400" />
                            <span>
                              Неверно. Правильный вариант:{" "}
                              {["A", "B", "C", "D"][currentQuestion.correctIndex]}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-zinc-200">{currentQuestion.explanation}</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCommitAnswer(selectedOption, true)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 transition"
                      >
                        <span>
                          {currentIdx + 1 === deck.length
                            ? "Посмотреть результаты"
                            : "Следующий вопрос"}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* STUDY LINKS & HINT SECTION (ONLY shown in "study" or "mistakes" mode — NEVER in "timed") */}
            {selectedMode !== "timed" && (
              <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-zinc-900/60 to-zinc-950 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                    <BookOpen className="h-4 w-4 text-sky-400" />
                    <span>Не знаешь ответ? Изучи тему в курсе и затем ответь:</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowHint((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    <span>{showHint ? "Скрыть наводку" : "Теоретическая наводка"}</span>
                  </button>
                </div>

                {showHint && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-200 leading-relaxed">
                    💡 {currentQuestion.theoryHint}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQuestion.relatedLinks.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/80 p-3 text-xs transition hover:border-sky-500/40 hover:bg-zinc-800/80"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-400 mb-0.5">
                          <span>
                            {link.type === "lesson"
                              ? "Урок курса"
                              : link.type === "practice"
                              ? "Тренажёр кода"
                              : "Документация"}
                          </span>
                        </div>
                        <div className="font-medium text-zinc-200 group-hover:text-sky-300 truncate">
                          {link.title}
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-sky-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* PHASE 3: SUBMITTING TO SERVER                                   */}
        {/* =============================================================== */}
        {phase === "submitting" && (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-orange-400" />
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-white">
                Проверяем ответы и сохраняем статистику на сервере...
              </p>
              <p className="text-xs text-zinc-400">Обновляем историю и опыт XP в PostgreSQL</p>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PHASE 4: RESULTS & MISTAKE REVIEW                               */}
        {/* =============================================================== */}
        {phase === "results" && resultData && (
          <div className="max-w-4xl mx-auto space-y-6">
            {(() => {
              const badge = getGradeBadge(resultData.attempt.accuracy);
              const avgSec = Math.round(
                resultData.attempt.durationSec / Math.max(1, resultData.attempt.total)
              );

              return (
                <>
                  {/* Result Summary Card */}
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 p-6 sm:p-8 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div
                          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.colorClass} font-mono text-4xl font-black shadow-xl`}
                        >
                          {badge.grade}
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                            {resultData.attempt.mode === "timed"
                              ? "Итоги экзамена на время"
                              : resultData.attempt.mode === "mistakes"
                              ? "Итоги работы над ошибками"
                              : "Итоги обучающего квиза"}
                          </div>
                          <h2 className="text-2xl font-extrabold text-white">{badge.label}</h2>
                          <p className="text-xs text-zinc-400">
                            Правильных ответов:{" "}
                            <strong className="text-white">
                              {resultData.attempt.score} из {resultData.attempt.total}
                            </strong>{" "}
                            ({resultData.attempt.accuracy}%) · Время:{" "}
                            <strong className="text-white">
                              {formatDuration(resultData.attempt.durationSec)}
                            </strong>{" "}
                            (~{avgSec} сек/вопрос)
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-2">
                        {resultData.xpEarned > 0 ? (
                          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 font-mono text-sm font-bold text-amber-300">
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            <span>+{resultData.xpEarned} XP</span>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-1.5 text-xs text-zinc-400">
                            {auth.isAuthenticated
                              ? "Новые вопросы пройдены · XP учтён"
                              : "Войдите для сохранения XP"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleStartQuiz()}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Пройти ещё раз</span>
                      </button>

                      {auth.isAuthenticated &&
                        (serverStats?.wrongQuestionIds.length ?? 0) > 0 && (
                          <button
                            type="button"
                            onClick={() => handleStartQuiz("all", "mistakes")}
                            className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-200 hover:bg-rose-500/25 transition"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                            <span>
                              Повторить ошибки ({serverStats?.wrongQuestionIds.length})
                            </span>
                          </button>
                        )}

                      <button
                        type="button"
                        onClick={() => setPhase("lobby")}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition"
                      >
                        <span>Вернуться к аналитике и выбору режима</span>
                      </button>
                    </div>
                  </div>

                  {/* Auto-collected Study Recommendations for Missed Questions */}
                  {missedLessonLinks.length > 0 && (
                    <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                        <BookOpen className="h-4 w-4" />
                        <span>
                          Рекомендуемые уроки курса для закрытия пробелов ({missedLessonLinks.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {missedLessonLinks.map((link, i) => (
                          <Link
                            key={i}
                            href={link.url}
                            className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-900/80 p-3 text-xs font-medium text-zinc-200 hover:border-sky-500/40 hover:text-sky-300 transition"
                          >
                            <span className="truncate">{link.title}</span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Question-by-Question Review */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Детальный разбор вопросов</h3>
                      <div className="flex items-center rounded-xl border border-white/10 bg-zinc-900 p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setReviewFilter("all")}
                          className={`rounded-lg px-3 py-1 font-medium transition ${
                            reviewFilter === "all"
                              ? "bg-zinc-800 text-white"
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          Все ({resultData.review.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewFilter("wrong")}
                          className={`rounded-lg px-3 py-1 font-medium transition ${
                            reviewFilter === "wrong"
                              ? "bg-rose-500/20 text-rose-300"
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          Ошибки ({resultData.review.filter((r) => !r.isCorrect).length})
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {resultData.review
                        .filter((r) => (reviewFilter === "wrong" ? !r.isCorrect : true))
                        .map((item, idx) => (
                          <div
                            key={item.questionId}
                            className={`rounded-2xl border p-5 space-y-3 ${
                              item.isCorrect
                                ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                                : "border-rose-500/25 bg-rose-500/[0.04]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                {item.isCorrect ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <div className="text-xs sm:text-sm font-bold text-white">
                                    {idx + 1}. {item.question}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span
                                      className={`rounded border px-1.5 py-0.2 text-[10px] font-semibold ${difficultyBadgeClass(
                                        item.difficulty
                                      )}`}
                                    >
                                      {item.difficulty}
                                    </span>
                                    {item.timedOut && (
                                      <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-300">
                                        Время истекло
                                      </span>
                                    )}
                                    {item.newlyMastered && (
                                      <span className="rounded bg-amber-500/20 px-1.5 py-0.2 font-mono text-[10px] font-bold text-amber-300">
                                        +15 XP
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {item.codeSnippet && (
                              <pre className="rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-[11px] text-amber-100 overflow-x-auto">
                                {item.codeSnippet}
                              </pre>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div
                                className={`rounded-xl border p-2.5 ${
                                  item.isCorrect
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                    : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                                }`}
                              >
                                <span className="text-[10px] uppercase opacity-75 block mb-0.5">
                                  Твой ответ:
                                </span>
                                <span className="font-medium">
                                  {item.selectedIndex !== null
                                    ? item.options[item.selectedIndex]
                                    : "Нет ответа (тайм-аут)"}
                                </span>
                              </div>

                              {!item.isCorrect && (
                                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-200">
                                  <span className="text-[10px] uppercase opacity-75 block mb-0.5">
                                    Правильный ответ:
                                  </span>
                                  <span className="font-medium">
                                    {item.options[item.correctIndex]}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="rounded-xl bg-black/30 p-3 text-xs text-zinc-300 leading-relaxed">
                              <strong className="text-zinc-100">Объяснение:</strong>{" "}
                              {item.explanation}
                            </div>

                            {item.relatedLinks.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {item.relatedLinks.map((lnk, lIdx) => (
                                  <Link
                                    key={lIdx}
                                    href={lnk.url}
                                    className="inline-flex items-center gap-1 rounded-lg border border-sky-500/25 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300 hover:bg-sky-500/20 transition"
                                  >
                                    <BookOpen className="h-3 w-3" />
                                    <span>{lnk.title}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </main>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#09090b] text-zinc-400">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
            <span className="font-mono text-xs">Загрузка тренажёра собеседований...</span>
          </div>
        </div>
      }
    >
      <QuizArenaContent />
    </Suspense>
  );
}
