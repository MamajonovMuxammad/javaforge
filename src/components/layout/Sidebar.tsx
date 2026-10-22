"use client";

import { useState } from "react";
import { modules, lessonsOfModule, TOTAL_DAYS } from "@/data/curriculum";
import { useProgress, dayStatus } from "@/lib/progress/store";
import {
  CheckCircle2,
  Lock,
  ChevronDown,
  Sparkles,
  BookOpen,
  Code2,
  X,
} from "lucide-react";

interface SidebarProps {
  currentDay: number;
  onSelectDay: (day: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentDay, onSelectDay, isOpen = false, onClose }: SidebarProps) {
  const progress = useProgress();

  // Find which module the currentDay belongs to and keep it open by default
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = { 0: true, 1: true };
    const currentMod = modules.find((m) => currentDay >= m.fromDay && currentDay <= m.toDay);
    if (currentMod) initial[currentMod.id] = true;
    return initial;
  });

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Backdrop (works on mobile AND desktop when drawer is open) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Slide-over Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 sm:w-96 flex-col border-r border-white/[0.08] bg-[#0c0c0e]/95 backdrop-blur-xl shadow-2xl shadow-black/80 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-orange-400" />
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
              Программа курса
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-500">
              {progress.completedDays.length} / {TOTAL_DAYS}
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                title="Закрыть программу курса"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modules Accordion List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {modules.map((mod) => {
            const modLessons = lessonsOfModule(mod.id);
            const isExpanded = Boolean(expandedModules[mod.id]);
            const completedInMod = modLessons.filter((l) =>
              progress.completedDays.includes(l.day)
            ).length;
            const isFullyCompleted = completedInMod === modLessons.length;
            const isCurrentModule = modLessons.some((l) => l.day === currentDay);

            return (
              <div
                key={mod.id}
                className={`overflow-hidden rounded-xl border transition-all ${
                  isCurrentModule
                    ? "border-orange-500/30 bg-zinc-900/40 shadow-sm"
                    : "border-white/[0.06] bg-zinc-900/20 hover:border-white/10"
                }`}
              >
                {/* Module Trigger */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center justify-between p-3.5 text-left transition hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: mod.color }}
                      />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Модуль {mod.id}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {mod.fromDay === mod.toDay
                          ? `(День ${mod.fromDay})`
                          : `(Дни ${mod.fromDay}–${mod.toDay})`}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-zinc-100 truncate">
                      {mod.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] font-semibold rounded-md px-1.5 py-0.5 ${
                        isFullyCompleted
                          ? "bg-emerald-500/15 text-emerald-400"
                          : completedInMod > 0
                          ? "bg-orange-500/15 text-orange-300"
                          : "bg-white/5 text-zinc-500"
                      }`}
                    >
                      {completedInMod}/{modLessons.length}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-zinc-300" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Lesson List */}
                {isExpanded && (
                  <div className="border-t border-white/[0.04] bg-black/20 p-1.5 space-y-1">
                    {modLessons.map((lesson) => {
                      const status = dayStatus(progress, lesson.day);
                      const isSelected = lesson.day === currentDay;
                      const isCompleted = status === "completed";
                      const isLocked = status === "locked";
                      const isCurrent = status === "current";

                      return (
                        <button
                          key={lesson.day}
                          type="button"
                          onClick={() => {
                            onSelectDay(lesson.day);
                            onClose?.();
                          }}
                          className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                            isSelected
                              ? "bg-orange-500/15 text-orange-200 font-medium ring-1 ring-orange-500/30"
                              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                          }`}
                        >
                          {/* Status Icon */}
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : isCurrent ? (
                              <div className="relative flex h-4 w-4 items-center justify-center">
                                <span className="absolute h-2.5 w-2.5 rounded-full bg-orange-400/40 animate-ping" />
                                <span className="h-2 w-2 rounded-full bg-orange-400" />
                              </div>
                            ) : (
                              <BookOpen className="h-3.5 w-3.5 text-zinc-600 group-hover:text-orange-400/80 transition" />
                            )}
                          </div>

                          {/* Day Number */}
                          <span
                            className={`font-mono text-[11px] ${
                              isSelected
                                ? "text-orange-400 font-bold"
                                : isCompleted
                                ? "text-zinc-500"
                                : "text-zinc-500"
                            }`}
                          >
                            D{lesson.day}
                          </span>

                          {/* Title */}
                          <span className="min-w-0 flex-1 truncate text-zinc-300 group-hover:text-zinc-100">
                            {lesson.title}
                          </span>

                          {/* Ready pill for interactive lessons */}
                          {lesson.ready && (
                            <span
                              className="shrink-0 flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] font-medium bg-orange-500/10 text-orange-300"
                              title="Интерактивное задание с автопроверкой"
                            >
                              <Code2 className="h-2.5 w-2.5" />
                              IDE
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="border-t border-white/[0.06] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <Sparkles className="h-3 w-3 text-orange-400" />
            <span>Каждое задание даёт +50 XP</span>
          </div>
        </div>
      </aside>
    </>
  );
}
