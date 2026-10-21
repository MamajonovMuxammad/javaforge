"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { lessons, modules } from "@/data/curriculum";
import type { Lesson, LessonTask } from "@/data/types";
import { useProgress, isTaskCompleted, dayStatus } from "@/lib/progress/store";
import {
  GraduationCap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  Flame,
} from "lucide-react";

interface HomeworkModalProps {
  open: boolean;
  onClose: () => void;
  onSelectDayTask: (day: number, taskId: string) => void;
}

type FilterStatus = "all" | "completed" | "pending";

export function HomeworkModal({ open, onClose, onSelectDayTask }: HomeworkModalProps) {
  const progress = useProgress();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  // Extract all homework tasks across lessons
  const homeworkItems = useMemo(() => {
    const items: Array<{
      lesson: Lesson;
      task: LessonTask;
      moduleColor: string;
      moduleTitle: string;
      isDone: boolean;
      isLocked: boolean;
    }> = [];

    lessons.forEach((lesson) => {
      if (!lesson.tasks || lesson.tasks.length === 0) return;
      const hwTask = lesson.tasks.find((t) => t.type === "homework") ?? lesson.tasks[lesson.tasks.length - 1];
      if (!hwTask) return;

      const mod = modules.find((m) => m.id === lesson.moduleId);
      const isDone = isTaskCompleted(progress, lesson.day, hwTask.id);
      const status = dayStatus(progress, lesson.day);
      const isLocked = status === "locked";

      items.push({
        lesson,
        task: hwTask,
        moduleColor: mod?.color ?? "#f97316",
        moduleTitle: mod?.shortTitle ?? `Модуль ${lesson.moduleId}`,
        isDone,
        isLocked,
      });
    });

    return items;
  }, [progress]);

  const totalHw = homeworkItems.length;
  const completedHw = homeworkItems.filter((i) => i.isDone).length;
  const totalHwXp = homeworkItems.reduce((acc, i) => acc + (i.isDone ? i.task.xp : 0), 0);

  const filteredItems = homeworkItems.filter((item) => {
    if (statusFilter === "completed" && !item.isDone) return false;
    if (statusFilter === "pending" && item.isDone) return false;
    if (selectedModule !== null && item.lesson.moduleId !== selectedModule) return false;
    return true;
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Домашние задания курса"
      subtitle="Практические челленджи каждого дня для закрепления навыков"
      icon={<GraduationCap className="h-5 w-5 text-orange-400" />}
      size="lg"
    >
      <div className="space-y-4">
        {/* Top Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-white/5 bg-zinc-900/40 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">Сдано домашек</div>
              <div className="font-mono text-base font-bold text-zinc-100">
                {completedHw} <span className="text-xs text-zinc-500 font-normal">из {totalHw}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">Заработано за ДЗ</div>
              <div className="font-mono text-base font-bold text-amber-300">
                +{totalHwXp} <span className="text-xs text-amber-400/70 font-normal">XP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">Процент выполнения</div>
              <div className="font-mono text-base font-bold text-emerald-400">
                {totalHw > 0 ? Math.round((completedHw / totalHw) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                statusFilter === "all"
                  ? "bg-orange-500/15 text-orange-200 border border-orange-500/30"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              Все ДЗ ({totalHw})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                statusFilter === "completed"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              Сданные ({completedHw})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                statusFilter === "pending"
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              Ожидают ({totalHw - completedHw})
            </button>
          </div>

          {/* Module Selector */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="text-zinc-500 mr-1 text-[11px]">Модуль:</span>
            <button
              type="button"
              onClick={() => setSelectedModule(null)}
              className={`rounded px-2 py-0.5 text-[11px] ${
                selectedModule === null
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              Все
            </button>
            {modules.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModule(selectedModule === m.id ? null : m.id)}
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition ${
                  selectedModule === m.id
                    ? "bg-orange-500/20 text-orange-200 border border-orange-500/40 font-semibold"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span>М{m.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Homework Items List */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-500">
              По выбранным фильтрам домашних заданий не найдено.
            </div>
          ) : (
            filteredItems.map(({ lesson, task, moduleColor, moduleTitle, isDone, isLocked }) => (
              <div
                key={`${lesson.day}_${task.id}`}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${
                  isDone
                    ? "border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/30"
                    : isLocked
                    ? "border-white/[0.04] bg-zinc-950/40 opacity-70"
                    : "border-white/[0.08] bg-zinc-900/30 hover:border-orange-500/30 hover:bg-zinc-900/60"
                }`}
              >
                {/* Left: Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${moduleColor}20`,
                        color: moduleColor,
                      }}
                    >
                      День {lesson.day}
                    </span>
                    <span className="text-[10px] text-zinc-500">{moduleTitle}</span>
                    <span className="rounded bg-white/5 px-1.5 py-0.2 font-mono text-[10px] text-amber-300">
                      +{task.xp} XP
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white transition">
                    {task.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">
                    {task.shortDesc || task.description}
                  </p>
                </div>

                {/* Right: Action button */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isDone ? (
                    <div className="flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      <span>Сдано</span>
                    </div>
                  ) : isLocked ? (
                    <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500">
                      <Lock className="h-3.5 w-3.5" />
                      <span>День закрыт</span>
                    </div>
                  ) : (
                    <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300">
                      К выполнению
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDayTask(lesson.day, task.id);
                      onClose();
                    }}
                    className={`focus-ring flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                      isDone
                        ? "border border-white/10 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
                    }`}
                  >
                    <span>{isDone ? "Посмотреть" : "Решать"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
