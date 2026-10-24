"use client";

import { useState, useEffect, useRef } from "react";
import type { Lesson, LessonTask, TheoryBlock, InterviewQA, Resource, ResourceKind } from "@/data/types";
import { youtubeSearchUrl } from "@/data/curriculum";
import { useProgress, isTaskCompleted, completedTasksForDay } from "@/lib/progress/store";
import {
  Video,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  BookOpen,
  CheckSquare,
  Clock,
  Sparkles,
  HelpCircle,
  Code,
  AlertTriangle,
  Info,
  Check,
  Flame,
  Star,
  Home,
  Briefcase,
  GraduationCap,
  BookMarked,
  Square,
  Layers,
} from "lucide-react";

interface LessonContentProps {
  lesson: Lesson;
  activeTaskId?: string;
  onSelectTask?: (taskId: string) => void;
  onNextDay?: () => void;
  onPrevDay?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

function renderTheoryBlock(block: TheoryBlock, idx: number) {
  switch (block.type) {
    case "h":
      return (
        <h3
          key={idx}
          className="mt-6 mb-3 text-base font-semibold text-zinc-100 flex items-center gap-2 border-b border-white/[0.06] pb-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          {block.text}
        </h3>
      );

    case "p":
      return (
        <p
          key={idx}
          className="my-3 text-sm leading-relaxed text-zinc-300"
          dangerouslySetInnerHTML={{
            __html: block.text.replace(
              /`([^`]+)`/g,
              '<code class="inline-code">$1</code>'
            ),
          }}
        />
      );

    case "code":
      return (
        <div key={idx} className="my-4 overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/90 shadow-md">
          {block.caption && (
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-zinc-900/60 px-4 py-1.5 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Code className="h-3 w-3 text-orange-400" />
                {block.caption}
              </span>
              <span className="text-[10px] text-zinc-500">Java</span>
            </div>
          )}
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-200">
            <code>{block.code}</code>
          </pre>
        </div>
      );

    case "list":
      return (
        <ul key={idx} className="my-3 space-y-1.5 pl-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400/80" />
              <span
                dangerouslySetInnerHTML={{
                  __html: item.replace(
                    /`([^`]+)`/g,
                    '<code class="inline-code">$1</code>'
                  ),
                }}
              />
            </li>
          ))}
        </ul>
      );

    case "callout": {
      const isAnalogy = block.variant === "analogy";
      const isWarning = block.variant === "warning";
      const isTip = block.variant === "tip";

      const borderClass = isAnalogy
        ? "border-purple-500/30 bg-purple-500/10 text-purple-200"
        : isWarning
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
        : isTip
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : "border-sky-500/30 bg-sky-500/10 text-sky-200";

      const Icon = isAnalogy ? Lightbulb : isWarning ? AlertTriangle : isTip ? Sparkles : Info;

      return (
        <div key={idx} className={`my-4 rounded-xl border p-4 ${borderClass}`}>
          <div className="flex items-center gap-2 font-semibold text-xs mb-1">
            <Icon className="h-4 w-4 shrink-0" />
            <span>{block.title}</span>
          </div>
          <p
            className="text-xs leading-relaxed opacity-90"
            dangerouslySetInnerHTML={{
              __html: block.text.replace(
                /`([^`]+)`/g,
                '<code class="inline-code">$1</code>'
              ),
            }}
          />
        </div>
      );
    }

    case "table":
      return (
        <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-zinc-950/40">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-zinc-900/60 font-semibold text-zinc-300">
              <tr>
                {block.head.map((th, hIdx) => (
                  <th key={hIdx} className="px-3.5 py-2.5">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-400">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2 font-mono text-zinc-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

/* ---------------- Helper Subcomponents for Enriched Content ---------------- */

function InterviewQASection({ items }: { items: InterviewQA[] }) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (openIndices.size === items.length) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(items.map((_, i) => i)));
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-zinc-900/60 to-zinc-950 p-5 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
          <Briefcase className="h-4 w-4" />
          <span>Вопросы с собеседований Junior ({items.length})</span>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="text-[11px] font-medium text-sky-400/80 hover:text-sky-300 transition"
        >
          {openIndices.size === items.length ? "Скрыть все ответы" : "Открыть все ответы"}
        </button>
      </div>
      <p className="text-xs text-zinc-400 mb-3.5 leading-relaxed">
        Проверь себя перед собеседованием: попробуй ответить самостоятельно, затем нажми на карточку, чтобы открыть эталонный ответ.
      </p>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const isOpen = openIndices.has(idx);
          return (
            <div
              key={idx}
              className="rounded-xl border border-white/5 bg-zinc-900/80 overflow-hidden transition hover:border-sky-500/30"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-start justify-between gap-3 p-3.5 text-left transition hover:bg-white/[0.02]"
              >
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5 rounded bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-300">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-zinc-200 leading-snug">
                    {item.q}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                    isOpen ? "rotate-180 text-sky-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-white/5 bg-black/30 p-3.5 pl-9 text-xs leading-relaxed text-zinc-300">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mb-1.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>Ответ на собеседовании:</span>
                  </div>
                  <p className="whitespace-pre-line text-zinc-300">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelfStudySection({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="my-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-zinc-900/60 to-zinc-950 p-5 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <GraduationCap className="h-4 w-4" />
          <span>Для самостоятельного изучения ({checked.size} из {items.length} готово)</span>
        </div>
      </div>
      <p className="text-xs text-zinc-400 mb-3.5 leading-relaxed">
        Темы и мини-эксперименты для углубления понимания. Отмечай выполненные пункты:
      </p>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const isDone = checked.has(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggle(idx)}
              className={`flex w-full items-start gap-3 p-2.5 rounded-xl border text-left transition ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/10 text-zinc-300 line-through opacity-75"
                  : "border-white/5 bg-zinc-900/80 text-zinc-200 hover:border-emerald-500/30"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Square className="h-4 w-4 text-zinc-500" />
                )}
              </div>
              <span
                className="text-xs leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: item.replace(
                    /`([^`]+)`/g,
                    '<code class="inline-code">$1</code>'
                  ),
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const resourceKindMeta: Record<
  ResourceKind,
  { label: string; color: string; border: string; bg: string }
> = {
  docs: {
    label: "Документация",
    color: "text-sky-400",
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
  },
  article: {
    label: "Статья",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
  },
  practice: {
    label: "Практика",
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  tool: {
    label: "Инструмент",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
  book: {
    label: "Книга",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  video: {
    label: "Видео",
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
  },
};

function ResourcesSection({ resources }: { resources: Resource[] }) {
  return (
    <div className="my-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-zinc-900/60 to-zinc-950 p-5 shadow-md">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
        <BookMarked className="h-4 w-4" />
        <span>Полезные материалы и документация</span>
      </div>
      <p className="text-xs text-zinc-400 mb-3.5 leading-relaxed">
        Официальные спецификации, проверенные статьи и тренажеры для самообучения:
      </p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {resources.map((res, idx) => {
          const meta = resourceKindMeta[res.kind] ?? resourceKindMeta.article;
          const content = (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${meta.border} ${meta.bg} ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  {res.lang && (
                    <span className="font-mono text-[10px] text-zinc-500 uppercase">
                      {res.lang}
                    </span>
                  )}
                </div>
                <div className="text-xs font-medium text-zinc-200 group-hover:text-purple-300 transition leading-snug">
                  {res.title}
                </div>
                {res.note && (
                  <div className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                    {res.note}
                  </div>
                )}
              </div>
              {res.url && (
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-purple-300">
                  <span>Перейти</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              )}
            </div>
          );

          if (res.url) {
            return (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/5 bg-zinc-900/80 p-3.5 transition hover:border-purple-500/40 hover:bg-zinc-800/80"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={idx}
              className="rounded-xl border border-white/5 bg-zinc-900/60 p-3.5"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LessonContent({
  lesson,
  activeTaskId,
  onSelectTask,
  onNextDay,
  onPrevDay,
  hasPrev,
  hasNext,
}: LessonContentProps) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const progress = useProgress();
  const rootRef = useRef<HTMLDivElement>(null);

  // Automatically scroll lesson theory to the very top when changing days
  useEffect(() => {
    rootRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [lesson.day]);

  const tasks = lesson.tasks && lesson.tasks.length > 0 ? lesson.tasks : [];
  const activeTask: LessonTask | undefined =
    tasks.find((t) => t.id === activeTaskId) ?? tasks[0] ?? (lesson.task as LessonTask);

  const hints = activeTask?.hints ?? lesson.hints ?? [];
  const solution = activeTask?.solution ?? lesson.solution;

  const difficultyColors = {
    Лёгкий: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    Средний: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    Сложный: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  }[lesson.difficulty];

  const completedInDay = completedTasksForDay(progress, lesson.day);

  return (
    <div ref={rootRef} className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 lg:p-7">
      {/* Lesson Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="rounded-md border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 font-mono text-xs font-bold text-orange-400">
            День {lesson.day}
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${difficultyColors}`}
          >
            {lesson.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="h-3 w-3" />
            {lesson.duration}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-amber-400">
            +{lesson.xp} XP
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {lesson.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{lesson.short}</p>

        {/* Topics badges */}
        {lesson.topics && lesson.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lesson.topics.map((t, i) => (
              <span
                key={i}
                className="rounded-md border border-white/5 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-400"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Video Recommendations Box */}
      {lesson.videos && lesson.videos.length > 0 && (
        <div className="my-5 rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/5 via-zinc-900/40 to-transparent p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">
            <Video className="h-4 w-4" />
            <span>Рекомендуемые видео-уроки</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {lesson.videos.map((vid, idx) => (
              <a
                key={idx}
                href={youtubeSearchUrl(vid.query)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-zinc-900/80 p-2.5 transition hover:border-red-500/30 hover:bg-zinc-800/80"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200 group-hover:text-red-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span>{vid.author}</span>
                  </div>
                  <div className="truncate text-[11px] text-zinc-400 mt-0.5">
                    {vid.note ?? vid.query}
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition group-hover:text-red-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Theory Section */}
      <div className="my-2 flex-1">
        {lesson.theory && lesson.theory.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              <BookOpen className="h-4 w-4 text-orange-400" />
              <span>Теория и логика работы</span>
            </div>
            <div className="space-y-1">
              {lesson.theory.map((b, i) => renderTheoryBlock(b, i))}
            </div>

            {lesson.deepDive && lesson.deepDive.length > 0 && lesson.deepDive !== lesson.theory && (
              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>Глубокое погружение & Архитектура (Deep Dive)</span>
                </div>
                <div className="space-y-1">
                  {lesson.deepDive.map((b, i) => renderTheoryBlock(b, i + 1000))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">
              {lesson.moduleId === 4
                ? "Модуль 4: Базы данных, PostgreSQL, JDBC и Git"
                : "Модуль 5: Spring Boot, REST API и Docker"}
            </h3>
            <p className="mt-1.5 text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Продвинутый модуль бэкенд-разработки. Изучай рекомендованные видео-лекции ведущих авторов (Алишев, Заур Трегулов) по ссылкам выше и закрепляй знания в редакторе!
            </p>
            {lesson.topics && lesson.topics.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
                {lesson.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-white/5 bg-zinc-800/60 px-2 py-0.5 text-[11px] text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Multi-Task Selector for the lesson */}
      {tasks.length > 0 && (
        <div className="mt-6 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <CheckSquare className="h-4 w-4 text-orange-400" />
              <span>Задания урока ({completedInDay.length} из {tasks.length} выполнено)</span>
            </div>
            <span className="text-[11px] text-zinc-400">
              Выполни все 3 задачи для открытия следующего дня
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {tasks.map((t, idx) => {
              const isDone = isTaskCompleted(progress, lesson.day, t.id);
              const isSelected = activeTask?.id === t.id;
              const typeIcon =
                t.type === "warmup" ? (
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                ) : t.type === "practice" ? (
                  <Code className="h-3.5 w-3.5 text-orange-400" />
                ) : (
                  <Star className="h-3.5 w-3.5 text-purple-400" />
                );

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTask?.(t.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-orange-500/50 bg-orange-500/10 shadow-sm"
                      : isDone
                      ? "border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/40"
                      : "border-white/5 bg-zinc-900/40 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                      {typeIcon}
                      <span>
                        {t.type === "warmup"
                          ? "1. Разминка"
                          : t.type === "practice"
                          ? "2. Практика"
                          : "3. Домашка"}
                      </span>
                    </div>
                    {isDone ? (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.2 rounded">
                        <Check className="h-2.5 w-2.5" /> Сдано
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-orange-400">+{t.xp}XP</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">{t.shortDesc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Specification Box */}
      {activeTask && (
        <div className="my-4 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-zinc-900/80 to-zinc-950 p-5 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <CheckSquare className="h-4 w-4" />
              <span>{activeTask.title}</span>
            </div>
            <span className="rounded bg-orange-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-orange-300">
              +{activeTask.xp} XP
            </span>
          </div>

          <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-line">
            {activeTask.description}
          </p>

          {/* Requirements list */}
          {activeTask.requirements && activeTask.requirements.length > 0 && (
            <div className="mt-3.5">
              <div className="text-xs font-semibold text-zinc-300 mb-1.5">
                Критерии приёмки и требования к коду:
              </div>
              <ul className="space-y-1 pl-1">
                {activeTask.requirements.map((req, rIdx) => (
                  <li
                    key={rIdx}
                    className="flex items-start gap-2 text-xs text-zinc-300"
                  >
                    <span className="mt-0.5 text-orange-400 font-bold">✓</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: req.replace(
                          /`([^`]+)`/g,
                          '<code class="inline-code">$1</code>'
                        ),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example Input / Output */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activeTask.exampleInput !== undefined && (
              <div className="rounded-lg border border-white/5 bg-black/40 p-3">
                <div className="text-[11px] font-mono font-semibold text-zinc-400 mb-1">
                  Пример ввода (System.in):
                </div>
                <pre className="font-mono text-xs text-zinc-200 whitespace-pre-wrap">
                  {activeTask.exampleInput}
                </pre>
              </div>
            )}
            <div className="rounded-lg border border-white/5 bg-black/40 p-3">
              <div className="text-[11px] font-mono font-semibold text-emerald-400/90 mb-1">
                Ожидаемый вывод:
              </div>
              <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap">
                {activeTask.exampleOutput}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Hints & Solution accordions */}
      <div className="space-y-2 mb-6">
        {hints.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-zinc-900/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="flex w-full items-center justify-between p-3.5 text-left text-xs font-semibold text-amber-300 hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-400" />
                <span>Подсказка ({hints.length})</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-zinc-500 transition-transform ${
                  showHints ? "rotate-180 text-zinc-300" : ""
                }`}
              />
            </button>
            {showHints && (
              <div className="border-t border-white/5 p-4 text-xs space-y-2 bg-black/20 text-zinc-300">
                {hints.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-mono text-amber-400">{i + 1}.</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: h.replace(
                          /`([^`]+)`/g,
                          '<code class="inline-code">$1</code>'
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {solution && (
          <div className="rounded-xl border border-white/5 bg-zinc-900/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="flex w-full items-center justify-between p-3.5 text-left text-xs font-semibold text-purple-300 hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-purple-400" />
                <span>Посмотреть авторское решение</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-zinc-500 transition-transform ${
                  showSolution ? "rotate-180 text-zinc-300" : ""
                }`}
              />
            </button>
            {showSolution && (
              <div className="border-t border-white/5 p-4 bg-zinc-950">
                <div className="text-[11px] text-zinc-400 mb-2">
                  Попробуй сначала написать код самостоятельно. Если застрял — изучи решение ниже:
                </div>
                <pre className="overflow-x-auto p-3 font-mono text-xs rounded-lg bg-zinc-900 border border-white/5 text-zinc-200">
                  <code>{solution}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Junior Interview Questions */}
      {lesson.interview && lesson.interview.length > 0 && (
        <InterviewQASection items={lesson.interview} />
      )}

      {/* Self-Study Checklist */}
      {lesson.selfStudy && lesson.selfStudy.length > 0 && (
        <SelfStudySection items={lesson.selfStudy} />
      )}

      {/* Recommended Documentation & Materials */}
      {lesson.resources && lesson.resources.length > 0 && (
        <ResourcesSection resources={lesson.resources} />
      )}

      {/* Prev / Next Day Footer */}
      <div className="mt-auto pt-4 border-t border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={onPrevDay}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
        >
          ← Предыдущий день
        </button>

        <span className="text-xs font-mono text-zinc-500">
          День {lesson.day} из 65
        </span>

        <button
          type="button"
          disabled={!hasNext}
          onClick={onNextDay}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange-950/40 transition hover:bg-orange-500 disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>Следующий день</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
