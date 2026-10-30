"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ALL_PRACTICE_TASKS,
  PRACTICE_CATEGORIES,
  getPracticeTaskById,
  getTotalPracticeXp,
  type PracticeTask,
} from "@/data/practice";
import { useProgress, isPracticeTaskCompleted } from "@/lib/progress/store";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";
import { PracticeSolver } from "@/components/practice/PracticeSolver";
import {
  Code2,
  Trophy,
  Sparkles,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  Zap,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  Layers,
  Cpu,
  Repeat,
  Split,
  Boxes,
  Binary,
  Server,
  Loader2,
} from "lucide-react";

type DifficultyFilter = "all" | "Лёгкий" | "Средний" | "Сложный";
type StatusFilter = "all" | "completed" | "pending";

function PracticeArenaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const progress = useProgress();

  // Active task selection via query parameter or state
  const selectedTaskId = searchParams.get("task");
  const activeTask = useMemo(() => {
    return selectedTaskId ? getPracticeTaskById(selectedTaskId) : null;
  }, [selectedTaskId]);

  // Filters
  const [selectedModule, setSelectedModule] = useState<number | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats
  const totalTasks = ALL_PRACTICE_TASKS.length;
  const completedTaskIds = useMemo(() => {
    return progress.completedTasks["practice"] ?? [];
  }, [progress.completedTasks]);

  const completedCount = useMemo(() => {
    return ALL_PRACTICE_TASKS.filter((t) => completedTaskIds.includes(t.id)).length;
  }, [completedTaskIds]);

  const earnedPracticeXp = useMemo(() => {
    return ALL_PRACTICE_TASKS.filter((t) => completedTaskIds.includes(t.id)).reduce(
      (sum, t) => sum + t.xp,
      0
    );
  }, [completedTaskIds]);

  const totalPossibleXp = useMemo(() => getTotalPracticeXp(), []);
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return ALL_PRACTICE_TASKS.filter((task) => {
      if (selectedModule !== "all" && task.moduleId !== selectedModule) return false;
      if (selectedDifficulty !== "all" && task.difficulty !== selectedDifficulty) return false;

      const isDone = completedTaskIds.includes(task.id);
      if (selectedStatus === "completed" && !isDone) return false;
      if (selectedStatus === "pending" && isDone) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchTopic = task.topic.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        if (!matchTitle && !matchTopic && !matchDesc) return false;
      }

      return true;
    });
  }, [selectedModule, selectedDifficulty, selectedStatus, searchQuery, completedTaskIds]);

  const handleSelectTask = (taskId: string) => {
    router.push(`/practice?task=${taskId}`);
  };

  const handleBackToList = () => {
    router.push("/practice");
  };

  // If a task is selected, show the focused solver view
  if (activeTask) {
    return (
      <PracticeSolver
        task={activeTask}
        allTasks={ALL_PRACTICE_TASKS}
        onBackToList={handleBackToList}
        onSelectTask={handleSelectTask}
      />
    );
  }

  const getDifficultyBadge = (diff: string) => {
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
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-[#09090b]/85 px-4 backdrop-blur-md lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/?view=app"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            title="Вернуться к основному курсу"
          >
            <ArrowLeft className="h-4 w-4 text-orange-400" />
            <span className="hidden sm:inline">В программу курса</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-md shadow-orange-500/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">
                  Практика <span className="text-orange-400">JavaForge</span>
                </span>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.2 font-mono text-[10px] font-bold text-orange-300">
                  Codewars Edition
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 hidden sm:block">
                Тренировочная арена дополнительных задач по темам
              </div>
            </div>
          </div>
        </div>

        {/* User Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono">+{earnedPracticeXp}</span>
            <span className="text-[10px] text-amber-400/80 font-normal">XP бонусов</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              {completedCount} / {totalTasks} решено ({progressPct}%)
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 3D Hero Banner with Interactive Stats */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-6 sm:p-10 shadow-2xl [transform-style:preserve-3d]">
          {/* Ambient Lighting Background */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                <Zap className="h-3.5 w-3.5 text-orange-400" />
                <span>Набиваем руку и мышечную память кода</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Каталог дополнительных задач <br />
                <span className="text-gradient">по всем модулям Java</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Решай реальные практические задачи в стиле Codewars. Теория доступна в
                удобной скрываемой боковой панели прямо в редакторе, не отвлекая от написания
                кода. Зарабатывай дополнительный опыт (XP) и оттачивай мастерство.
              </p>
            </div>

            {/* 3D Stats Card */}
            <div className="w-full lg:w-80 rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Общий прогресс практики:</span>
                <span className="font-mono font-bold text-orange-400">
                  {completedCount} из {totalTasks} ({progressPct}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-950 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Бонусный опыт
                  </div>
                  <div className="font-mono text-base font-bold text-amber-300">
                    +{earnedPracticeXp}{" "}
                    <span className="text-[11px] text-zinc-500 font-normal">/ {totalPossibleXp}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Ранг мастера
                  </div>
                  <div className="text-xs font-bold text-white">
                    {completedCount >= 40
                      ? "🏆 Архитектор"
                      : completedCount >= 20
                      ? "⚡ Мидл-практик"
                      : completedCount >= 5
                      ? "🚀 Кодер"
                      : "🌱 Новичок"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию задачи, теме или ключевым словам..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900/90 pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus-ring outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Очистить
                </button>
              )}
            </div>

            {/* Secondary Filters: Difficulty & Status */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {/* Difficulty Selector */}
              <div className="flex items-center rounded-xl border border-white/10 bg-zinc-900/90 p-1 text-xs">
                {(["all", "Лёгкий", "Средний", "Сложный"] as DifficultyFilter[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      selectedDifficulty === diff
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {diff === "all" ? "Все сложности" : diff}
                  </button>
                ))}
              </div>

              {/* Status Selector */}
              <div className="flex items-center rounded-xl border border-white/10 bg-zinc-900/90 p-1 text-xs">
                {(
                  [
                    { key: "all", label: "Все" },
                    { key: "pending", label: "Не решённые" },
                    { key: "completed", label: "Решённые" },
                  ] as { key: StatusFilter; label: string }[]
                ).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSelectedStatus(s.key)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      selectedStatus === s.key
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Module Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedModule("all")}
              className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                selectedModule === "all"
                  ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "border-white/10 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              Все модули ({totalTasks})
            </button>

            {PRACTICE_CATEGORIES.map((cat) => {
              const catTasks = ALL_PRACTICE_TASKS.filter((t) => t.moduleId === cat.moduleId);
              const catDone = catTasks.filter((t) => completedTaskIds.includes(t.id)).length;
              const isSelected = selectedModule === cat.moduleId;

              return (
                <button
                  key={cat.moduleId}
                  type="button"
                  onClick={() => setSelectedModule(cat.moduleId)}
                  className={`shrink-0 flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? "border-white/30 text-white shadow-lg"
                      : "border-white/10 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${cat.color}25` : undefined,
                    borderColor: isSelected ? cat.color : undefined,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.shortTitle}</span>
                  <span className="font-mono text-[10px] opacity-75">
                    ({catDone}/{catTasks.length})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks Grid using 3D Tilt Cards */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-white/5 bg-zinc-900/20 text-zinc-500 space-y-3">
            <Code2 className="h-10 w-10 opacity-30 text-orange-400" />
            <p className="text-sm font-medium">Задачи по выбранным фильтрам не найдены</p>
            <button
              type="button"
              onClick={() => {
                setSelectedModule("all");
                setSelectedDifficulty("all");
                setSelectedStatus("all");
                setSearchQuery("");
              }}
              className="text-xs text-orange-400 hover:underline"
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => {
              const isDone = completedTaskIds.includes(task.id);
              const category = PRACTICE_CATEGORIES.find((c) => c.moduleId === task.moduleId);
              const cardGlow = category?.color ? `${category.color}30` : "rgba(251, 146, 60, 0.25)";

              return (
                <Tilt3DCard
                  key={task.id}
                  glowColor={cardGlow}
                  onClick={() => handleSelectTask(task.id)}
                  className="cursor-pointer group flex flex-col justify-between"
                >
                  {/* Card Top: Topic & Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide"
                        style={{
                          backgroundColor: `${category?.color ?? "#f97316"}20`,
                          color: category?.color ?? "#fb923c",
                        }}
                      >
                        {task.topic}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded border px-2 py-0.2 font-mono text-[10px] font-semibold ${getDifficultyBadge(
                            task.difficulty
                          )}`}
                        >
                          {task.difficulty}
                        </span>

                        <span className="flex items-center gap-0.5 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-amber-300">
                          <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                          +{task.xp}
                        </span>
                      </div>
                    </div>

                    {/* Task Title */}
                    <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition mb-2">
                      {task.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {task.theory.summary}
                    </p>
                  </div>

                  {/* Card Bottom: Status & Action Button */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    {isDone ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Решено</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Тестов: {task.tests.length}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs font-semibold text-orange-400 group-hover:translate-x-1 transition-transform">
                      <span>{isDone ? "Открыть снова" : "Решать"}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Tilt3DCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#09090b] text-zinc-400">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
            <span className="font-mono text-xs">Загрузка каталога практики...</span>
          </div>
        </div>
      }
    >
      <PracticeArenaContent />
    </Suspense>
  );
}
