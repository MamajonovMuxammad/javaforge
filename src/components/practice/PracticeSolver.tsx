"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import type { PracticeTask } from "@/data/practice/types";
import { runJava, checkTaskSolution, type CheckOutcome } from "@/lib/runner";
import type { RunResult } from "@/lib/run-types";
import { registerJavaCompletions } from "@/lib/editor/java-completions";
import {
  useProgress,
  completePracticeTask,
  savePracticeCode,
  isPracticeTaskCompleted,
  getPracticeCode,
} from "@/lib/progress/store";
import { PracticeVictoryModal } from "./PracticeVictoryModal";
import { useToast } from "@/components/ui/Toaster";
import {
  Play,
  CheckCircle,
  RotateCcw,
  Terminal,
  Keyboard,
  Clock,
  Sparkles,
  AlertCircle,
  Check,
  X,
  Loader2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Copy,
  Lightbulb,
  CheckCircle2,
  Code2,
} from "lucide-react";

interface PracticeSolverProps {
  task: PracticeTask;
  allTasks: PracticeTask[];
  onBackToList: () => void;
  onSelectTask: (taskId: string) => void;
}

type TabType = "description" | "tests" | "stdin" | "terminal";

export function PracticeSolver({
  task,
  allTasks,
  onBackToList,
  onSelectTask,
}: PracticeSolverProps) {
  const progress = useProgress();
  const toast = useToast();

  // Theory is HIDDEN BY DEFAULT per user requirement
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  // Active editor code
  const [code, setCode] = useState<string>(() => {
    return getPracticeCode(progress, task.id) ?? task.starterCode;
  });

  // Current task index and navigation
  const currentIndex = allTasks.findIndex((t) => t.id === task.id);
  const prevTask = currentIndex > 0 ? allTasks[currentIndex - 1] : null;
  const nextTask = currentIndex >= 0 && currentIndex < allTasks.length - 1 ? allTasks[currentIndex + 1] : null;

  // Sync code when task changes
  useEffect(() => {
    const saved = getPracticeCode(progress, task.id);
    setCode(saved ?? task.starterCode);
    setRunResult(null);
    setCheckOutcome(null);
    setStdin(task.sampleInput ?? task.exampleInput ?? "");
    setActiveTab("description");
  }, [task.id]);

  // Terminal & execution states
  const [stdin, setStdin] = useState<string>(task.sampleInput ?? task.exampleInput ?? "");
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [isRunning, setIsRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [checkOutcome, setCheckOutcome] = useState<CheckOutcome | null>(null);

  // Victory modal
  const [victoryModalOpen, setVictoryModalOpen] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Hint expansion
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const isCompleted = isPracticeTaskCompleted(progress, task.id);

  // Auto-save code on change
  const handleCodeChange = (newVal: string | undefined) => {
    const text = newVal ?? "";
    setCode(text);
    savePracticeCode(task.id, text);
  };

  // Reset code to starter template
  const handleReset = () => {
    if (window.confirm("Сбросить код к исходному шаблону задачи?")) {
      setCode(task.starterCode);
      savePracticeCode(task.id, task.starterCode);
      toast({
        variant: "info",
        title: "Код сброшен",
        description: "Шаблон задачи восстановлен к первоначальному состоянию.",
      });
    }
  };

  // Run code with stdin
  const handleRun = async () => {
    if (isRunning || isChecking) return;
    setIsRunning(true);
    setActiveTab("terminal");
    try {
      const res = await runJava(code, stdin);
      setRunResult(res);
      if (res.status === "success") {
        toast({
          variant: "success",
          title: "Код выполнен",
          description: `Время: ${res.timeMs ?? 0} мс`,
        });
      } else if (res.status === "compile_error") {
        toast({
          variant: "error",
          title: "Ошибка компиляции",
          description: "Проверь синтаксис в окне терминала.",
        });
      } else {
        toast({
          variant: "error",
          title: "Ошибка выполнения",
          description: "Возникло исключение в программе.",
        });
      }
    } catch (err) {
      toast({
        variant: "error",
        title: "Ошибка запуска",
        description: (err as Error).message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Check solution against all test cases
  const handleCheck = async () => {
    if (isRunning || isChecking) return;
    setIsChecking(true);
    setActiveTab("tests");
    try {
      const outcome = await checkTaskSolution(task, code);
      setCheckOutcome(outcome);

      if (outcome.passed) {
        const res = completePracticeTask(task.id, task.xp, { code });
        setEarnedXp(res.xpGained);
        setVictoryModalOpen(true);
      } else {
        toast({
          variant: "error",
          title: "Тесты не пройдены",
          description: "Проверь детали ошибок во вкладке «Тесты».",
        });
      }
    } catch (err) {
      toast({
        variant: "error",
        title: "Сбой при проверке",
        description: (err as Error).message,
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to run
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [code, stdin, isRunning, isChecking]);

  const copyTheoryCode = () => {
    if (!task.theory.codeExample) return;
    navigator.clipboard.writeText(task.theory.codeExample);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Лёгкий":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "Средний":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "Сложный":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      default:
        return "text-zinc-400 border-zinc-500/30 bg-zinc-500/10";
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Top Header Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0c0c0e] px-4">
        {/* Left: Back button & Task Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToList}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            title="Вернуться к каталогу дополнительных заданий"
          >
            <ArrowLeft className="h-4 w-4 text-orange-400" />
            <span className="hidden sm:inline">Каталог заданий</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Module tag */}
          <span className="hidden md:inline-flex rounded-md border border-white/10 bg-zinc-800/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400 truncate max-w-[160px]">
            {task.topic}
          </span>

          <h1 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {task.title}
          </h1>

          {/* Difficulty and XP */}
          <span
            className={`hidden sm:inline-flex rounded border px-2 py-0.5 text-[10px] font-semibold ${getDifficultyColor(
              task.difficulty
            )}`}
          >
            {task.difficulty}
          </span>

          <span className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-300">
            <Sparkles className="h-3 w-3 text-amber-400" />
            +{task.xp} XP
          </span>

          {isCompleted && (
            <span className="flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span className="hidden sm:inline">Решено</span>
            </span>
          )}
        </div>

        {/* Right: Theory Toggle Button & Task Switcher */}
        <div className="flex items-center gap-2">
          {/* CRITICAL FEATURE: Theory Toggle Button */}
          <button
            type="button"
            onClick={() => setIsTheoryOpen(!isTheoryOpen)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              isTheoryOpen
                ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "border-orange-500/40 bg-orange-500/15 text-orange-300 hover:bg-orange-500/25 hover:text-white"
            }`}
            title={isTheoryOpen ? "Закрыть панель теории" : "Открыть теорию и подсказки к теме"}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isTheoryOpen ? "Скрыть теорию" : "Теория к теме"}
            </span>
          </button>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              type="button"
              disabled={!prevTask}
              onClick={() => prevTask && onSelectTask(prevTask.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none"
              title={prevTask ? `Предыдущая: ${prevTask.title}` : "Нет предыдущей"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!nextTask}
              onClick={() => nextTask && onSelectTask(nextTask.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none"
              title={nextTask ? `Следующая: ${nextTask.title}` : "Нет следующей"}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* COLLAPSIBLE THEORY PANEL (Hidden by default, slides in smoothly on user click) */}
        {isTheoryOpen && (
          <aside className="w-80 sm:w-96 shrink-0 border-r border-white/[0.08] bg-[#0c0c0f] flex flex-col z-30 animate-in slide-in-from-left duration-200">
            {/* Theory Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] p-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white leading-none">
                    {task.theory.title}
                  </h2>
                  <span className="text-[10px] text-zinc-400">{task.topic}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTheoryOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                title="Скрыть теорию"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Theory Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
              <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-3 text-zinc-300">
                <p>{task.theory.summary}</p>
              </div>

              {/* Key points */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                  Ключевые концепции
                </div>
                <ul className="space-y-1.5 pl-1">
                  {task.theory.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-zinc-300">
                      <span className="text-orange-500 font-bold shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Example */}
              {task.theory.codeExample && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                    <span>Паттерн кода</span>
                    <button
                      type="button"
                      onClick={copyTheoryCode}
                      className="flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 hover:text-white transition"
                    >
                      {codeCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Копировать</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-[11px] text-amber-200 overflow-x-auto">
                    {task.theory.codeExample}
                  </pre>
                </div>
              )}

              {/* Pitfalls */}
              {task.theory.pitfalls && task.theory.pitfalls.length > 0 && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 space-y-1 text-rose-200">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Частая ошибка</span>
                  </div>
                  {task.theory.pitfalls.map((pit, idx) => (
                    <p key={idx} className="text-[11px] opacity-90">
                      {pit}
                    </p>
                  ))}
                </div>
              )}

              {/* Hints */}
              {task.hints && task.hints.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Подсказки к задаче
                  </div>
                  {task.hints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/5 bg-zinc-900/60 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenHintIndex(openHintIndex === idx ? null : idx)
                        }
                        className="flex w-full items-center justify-between p-2.5 text-left text-xs font-medium text-zinc-300 hover:text-white"
                      >
                        <span className="flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                          Подсказка {idx + 1}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {openHintIndex === idx ? "Скрыть" : "Показать"}
                        </span>
                      </button>
                      {openHintIndex === idx && (
                        <div className="border-t border-white/5 bg-zinc-950/60 p-2.5 text-[11px] text-zinc-400 leading-relaxed">
                          {hint}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Center / Right Split: Left is Monaco IDE, Right is Task Description & Tests */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Monaco Editor Pane (Centered and Spacious) */}
          <div className="flex flex-1 flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#09090b] min-w-0">
            {/* Editor Top Bar */}
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0f0f12] px-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-orange-400" />
                <span className="font-mono text-xs font-semibold text-zinc-200">
                  Main.java
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
                  title="Сбросить код к начальному шаблону"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span className="hidden sm:inline">Сбросить</span>
                </button>

                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isRunning || isChecking}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-800/80 px-2.5 py-1 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition disabled:opacity-50"
                  title="Запустить код (Ctrl + Enter)"
                >
                  {isRunning ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-400" />
                  ) : (
                    <Play className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                  )}
                  <span>Запустить</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={isRunning || isChecking}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 transition disabled:opacity-50"
                  title="Проверить все тесты задачи"
                >
                  {isChecking ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5" />
                  )}
                  <span>Проверить решение</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor Component */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="java"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                beforeMount={registerJavaCompletions}
                options={{
                  fontFamily: "var(--font-jetbrains), Consolas, 'Courier New', monospace",
                  fontSize: 13,
                  lineHeight: 20,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  tabSize: 4,
                  insertSpaces: true,
                  automaticLayout: true,
                  cursorBlinking: "smooth",
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: true,
                  },
                }}
                loading={
                  <div className="flex h-full items-center justify-center gap-2 text-xs text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                    <span>Загрузка редактора...</span>
                  </div>
                }
              />
            </div>
          </div>

          {/* Right Pane: Task Details, Tests, Terminal & Stdin */}
          <div className="flex flex-1 flex-col bg-[#09090b] min-w-0 max-w-full lg:max-w-xl">
            {/* Tabs Header */}
            <div className="flex h-10 shrink-0 border-b border-white/[0.08] bg-[#0c0c0f] px-2">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`flex items-center gap-1.5 border-b-2 px-3 text-xs font-semibold transition ${
                  activeTab === "description"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Задание</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tests")}
                className={`flex items-center gap-1.5 border-b-2 px-3 text-xs font-semibold transition ${
                  activeTab === "tests"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Тесты</span>
                {checkOutcome && (
                  <span
                    className={`flex h-2 w-2 rounded-full ${
                      checkOutcome.passed ? "bg-emerald-400" : "bg-rose-500"
                    }`}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("stdin")}
                className={`flex items-center gap-1.5 border-b-2 px-3 text-xs font-semibold transition ${
                  activeTab === "stdin"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Keyboard className="h-3.5 w-3.5" />
                <span>Ввод (stdin)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("terminal")}
                className={`flex items-center gap-1.5 border-b-2 px-3 text-xs font-semibold transition ${
                  activeTab === "terminal"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Терминал</span>
                {runResult && (
                  <span
                    className={`flex h-2 w-2 rounded-full ${
                      runResult.status === "success"
                        ? "bg-emerald-400"
                        : "bg-rose-500"
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 text-xs">
              {/* TAB 1: DESCRIPTION */}
              {activeTab === "description" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-white mb-2">
                      {task.title}
                    </h2>
                    <div className="prose-lesson text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {task.description}
                    </div>
                  </div>

                  {/* Example Input / Output */}
                  {task.exampleInput && (
                    <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3 space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Пример входных данных:
                      </div>
                      <pre className="rounded-lg bg-zinc-950 p-2.5 font-mono text-zinc-200 overflow-x-auto">
                        {task.exampleInput}
                      </pre>
                    </div>
                  )}

                  {task.exampleOutput && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                        Ожидаемый вывод:
                      </div>
                      <pre className="rounded-lg bg-zinc-950 p-2.5 font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                        {task.exampleOutput}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TESTS */}
              {activeTab === "tests" && (
                <div className="space-y-3">
                  {!checkOutcome ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 space-y-2">
                      <CheckCircle className="h-8 w-8 opacity-40 text-orange-400" />
                      <p>Нажми «Проверить решение», чтобы запустить автотесты</p>
                      <p className="text-[11px] text-zinc-600">
                        Всего тестов для этой задачи: {task.tests.length}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Status header banner */}
                      <div
                        className={`rounded-xl border p-3 flex items-center gap-3 ${
                          checkOutcome.passed
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        {checkOutcome.passed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-sm">
                            {checkOutcome.passed
                              ? "Все тесты успешно пройдены!"
                              : "Некоторые тесты завершились с ошибкой"}
                          </div>
                          <div className="text-[11px] opacity-80">
                            Пройдено:{" "}
                            {checkOutcome.tests.filter((t) => t.passed).length} из{" "}
                            {checkOutcome.tests.length}
                          </div>
                        </div>
                      </div>

                      {/* Individual test outcomes */}
                      {checkOutcome.tests.map((t, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl border p-3 space-y-2 ${
                            t.passed
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : "border-rose-500/20 bg-rose-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-200">
                              {t.test.label}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                t.passed
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-rose-500/20 text-rose-300"
                              }`}
                            >
                              {t.passed ? "PASSED" : "FAILED"}
                            </span>
                          </div>

                          {t.test.stdin && (
                            <div className="text-[11px] text-zinc-400">
                              <span className="text-zinc-500">Ввод: </span>
                              <code className="rounded bg-zinc-900 px-1 py-0.5 font-mono text-zinc-300">
                                {t.test.stdin.trim()}
                              </code>
                            </div>
                          )}

                          {t.missing.length > 0 && (
                            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-[11px] text-rose-300 space-y-1">
                              <div className="font-semibold">Ожидалось в выводе:</div>
                              {t.missing.map((m, mIdx) => (
                                <div key={mIdx} className="font-mono text-rose-200">
                                  «{m}»
                                </div>
                              ))}
                              {t.result?.stdout && (
                                <div className="mt-2 pt-2 border-t border-rose-500/20">
                                  <div className="text-zinc-400 font-semibold mb-1">
                                    Фактический вывод программы:
                                  </div>
                                  <pre className="font-mono whitespace-pre-wrap text-zinc-300">
                                    {t.result.stdout}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: STDIN */}
              {activeTab === "stdin" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">
                      Входные данные для ручного запуска (System.in):
                    </span>
                    {task.exampleInput && (
                      <button
                        type="button"
                        onClick={() => setStdin(task.exampleInput ?? "")}
                        className="text-[11px] text-orange-400 hover:underline"
                      >
                        Вставить пример
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={6}
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Введи данные для передачи в scanner.nextLine(), scanner.nextInt()..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 focus-ring outline-none"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Каждая строка соответствует следующему вызову scanner.nextLine() или считыванию чисел.
                  </p>
                </div>
              )}

              {/* TAB 4: TERMINAL */}
              {activeTab === "terminal" && (
                <div className="space-y-3">
                  {isRunning ? (
                    <div className="flex h-32 items-center justify-center gap-2 text-zinc-400">
                      <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                      <span>Компиляция и выполнение Java кода...</span>
                    </div>
                  ) : !runResult ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 space-y-2">
                      <Play className="h-8 w-8 opacity-40 text-orange-400" />
                      <p>Нажми «Запустить», чтобы увидеть вывод программы</p>
                    </div>
                  ) : runResult.status === "compile_error" ? (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-rose-300 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>Ошибка компиляции (javac):</span>
                      </div>
                      <pre className="font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                        {runResult.compileOutput || runResult.stderr}
                      </pre>
                    </div>
                  ) : runResult.status === "runtime_error" ? (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-rose-300 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>Ошибка времени выполнения (Exception):</span>
                      </div>
                      <pre className="font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                        {runResult.stderr}
                      </pre>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Вывод программы:</span>
                        <span>Время: {runResult.timeMs ?? 0} мс</span>
                      </div>
                      <pre className="rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-zinc-100 whitespace-pre-wrap leading-relaxed">
                        {runResult.stdout || "(Пустой вывод)"}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Victory Modal with 3D animation */}
      <PracticeVictoryModal
        open={victoryModalOpen}
        onClose={() => setVictoryModalOpen(false)}
        task={task}
        xpEarned={earnedXp}
        onNextTask={
          nextTask
            ? () => {
                setVictoryModalOpen(false);
                onSelectTask(nextTask.id);
              }
            : undefined
        }
        onBackToList={() => {
          setVictoryModalOpen(false);
          onBackToList();
        }}
      />
    </div>
  );
}
