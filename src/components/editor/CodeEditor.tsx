"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { Lesson, LessonTask } from "@/data/types";
import { runJava, checkTaskSolution, type CheckOutcome, usesScanner } from "@/lib/runner";
import type { RunResult } from "@/lib/run-types";
import { registerJavaCompletions } from "@/lib/editor/java-completions";
import {
  useProgress,
  saveCode,
  recordRun,
  completeTask,
  completeDay,
  recordFailedCheck,
  isTaskCompleted,
  completedTasksForDay,
} from "@/lib/progress/store";
import { fireConfetti } from "@/lib/confetti";
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
  Flame,
  ShieldAlert,
  CornerDownLeft,
} from "lucide-react";

interface CodeEditorProps {
  lesson: Lesson;
  activeTaskId?: string;
  onSelectTask?: (taskId: string) => void;
  onSuccess?: () => void;
}

type TabType = "terminal" | "stdin" | "tests";

/**
 * Detects if saved code was accidentally contaminated/leaked from another task.
 */
function getCleanInitialCode(
  rawSaved: string | undefined,
  currentTask: LessonTask | undefined,
  tasks: LessonTask[],
  fallbackStarter: string
): string {
  if (!rawSaved || !currentTask || tasks.length <= 1) {
    return rawSaved ?? currentTask?.starterCode ?? fallbackStarter;
  }

  // If saved code is literally identical to another task's starter code, it's a cross-task leak
  for (const other of tasks) {
    if (other.id === currentTask.id) continue;
    if (other.starterCode && rawSaved.trim() === other.starterCode.trim()) {
      return currentTask.starterCode ?? fallbackStarter;
    }
    // Check if distinctive comments from other task exist in rawSaved but NOT in currentTask
    const otherTodos: string[] = other.starterCode?.match(/\/\/\s*TODO[^\n]+/g) ?? [];
    const currentTodos: string[] = (currentTask.starterCode || "").match(/\/\/\s*TODO[^\n]+/g) ?? [];
    for (const todo of otherTodos) {
      if (!currentTodos.includes(todo) && rawSaved.includes(todo)) {
        return currentTask.starterCode ?? fallbackStarter;
      }
    }
  }

  return rawSaved;
}

export function CodeEditor({ lesson, activeTaskId, onSelectTask, onSuccess }: CodeEditorProps) {
  const toast = useToast();
  const progress = useProgress();

  // Tasks of this day (fallback to root if empty)
  const tasks: LessonTask[] = lesson.tasks && lesson.tasks.length > 0 ? lesson.tasks : [];
  const currentTask: LessonTask | undefined =
    tasks.find((t) => t.id === activeTaskId) ?? tasks[0] ?? (lesson.task as LessonTask);

  const taskId = currentTask?.id ?? "default";
  const codeKey = `${lesson.day}_${taskId}`;

  // NEVER fall back to legacy day-wide code if this day has multiple tasks!
  const taskSpecificSaved = progress.code[codeKey];
  const legacySaved = tasks.length <= 1 ? progress.code[String(lesson.day)] : undefined;
  const initialCode = getCleanInitialCode(
    taskSpecificSaved ?? legacySaved,
    currentTask,
    tasks,
    lesson.starterCode ?? ""
  );

  const [code, setCode] = useState<string>(initialCode);
  const [stdin, setStdin] = useState<string>(currentTask?.sampleInput ?? lesson.sampleInput ?? "");
  const [activeTab, setActiveTab] = useState<TabType>("terminal");

  const [isRunning, setIsRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [checkOutcome, setCheckOutcome] = useState<CheckOutcome | null>(null);

  // Interactive Terminal State (IntelliJ IDEA Console style)
  const [terminalInputValue, setTerminalInputValue] = useState("");
  const [sessionInputs, setSessionInputs] = useState<string[]>([]);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const hasScanner = usesScanner(code) || /Scanner\s+[a-zA-Z0-9_$]+\s*=\s*new\s+Scanner/i.test(code);
  const isWaitingForInput = Boolean(
    runResult && runResult.status === "runtime_error" && runResult.stderr?.includes("NoSuchElementException")
  );

  // Debounced auto-save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // When switching day or active task
  useEffect(() => {
    // Clear any pending debounced auto-save from previous task immediately
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    const freshCodeKey = `${lesson.day}_${taskId}`;
    const freshTaskSaved = progress.code[freshCodeKey];
    const freshLegacySaved = tasks.length <= 1 ? progress.code[String(lesson.day)] : undefined;
    const freshCode = getCleanInitialCode(
      freshTaskSaved ?? freshLegacySaved,
      currentTask,
      tasks,
      lesson.starterCode ?? ""
    );

    setCode(freshCode);
    setStdin(currentTask?.sampleInput ?? lesson.sampleInput ?? "");
    setSessionInputs([]);
    setTerminalInputValue("");
    setRunResult(null);
    setCheckOutcome(null);
    setActiveTab("terminal");
  }, [lesson.day, taskId, currentTask?.starterCode, currentTask?.sampleInput, lesson.starterCode, lesson.sampleInput, tasks]);

  const handleCodeChange = (newCode?: string) => {
    const val = newCode ?? "";
    setCode(val);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveCode(lesson.day, val, taskId);
    }, 600);
  };

  const handleReset = () => {
    const targetStarter = currentTask?.starterCode ?? lesson.starterCode ?? "";
    if (window.confirm("Сбросить код к исходному шаблону этой задачи?")) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      setCode(targetStarter);
      saveCode(lesson.day, targetStarter, taskId);
      toast({
        variant: "info",
        title: "Код сброшен",
        description: "Редактор возвращен к начальному состоянию этой задачи.",
      });
    }
  };

  // Run Code ▶️
  const handleRun = async (overrideStdin?: string, clearSession = false) => {
    setIsRunning(true);
    setActiveTab("terminal");
    try {
      let inputToUse: string;
      if (overrideStdin !== undefined) {
        inputToUse = overrideStdin;
      } else if (hasScanner) {
        if (clearSession) {
          setSessionInputs([]);
          inputToUse = "";
        } else if (sessionInputs.length > 0) {
          inputToUse = sessionInputs.join("\n") + "\n";
        } else {
          inputToUse = "";
        }
      } else {
        inputToUse = stdin;
      }

      const res = await runJava(code, inputToUse);
      setRunResult(res);

      if (overrideStdin !== undefined) {
        setStdin(overrideStdin);
      }

      const isCompileErr = res.status === "compile_error";
      const { unlocked } = recordRun(isCompileErr);

      if (unlocked.length > 0) {
        unlocked.forEach((ach) => {
          fireConfetti("achievement");
          toast({
            variant: "achievement",
            title: ach.title,
            description: ach.description,
            badge: ach.xp > 0 ? `+${ach.xp} XP` : undefined,
          });
        });
      }

      if (res.status === "success") {
        toast({
          variant: "success",
          title: "Код успешно выполнен",
          description: `Время: ${res.timeMs} мс`,
        });
      } else if (res.status === "compile_error") {
        toast({
          variant: "error",
          title: "Ошибка компиляции",
          description: "Изучи детали в терминале внизу.",
        });
      } else if (res.status === "runtime_error") {
        if (res.stderr?.includes("NoSuchElementException")) {
          // Scanner awaits user input - focus input field
          setTimeout(() => terminalInputRef.current?.focus(), 150);
        } else {
          toast({
            variant: "error",
            title: "Ошибка во время выполнения",
            description: "Программа завершилась с исключением (Exception).",
          });
        }
      } else if (res.status === "timeout") {
        toast({
          variant: "error",
          title: "Превышено время выполнения",
          description: "Возможен бесконечный цикл (while/for).",
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

  const handleInteractiveInputSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = terminalInputValue.trim();
    if (!val) return;

    const nextInputs = [...sessionInputs, val];
    setSessionInputs(nextInputs);
    setTerminalInputValue("");

    const accumulatedStdin = nextInputs.join("\n") + "\n";
    await handleRun(accumulatedStdin);
    setTimeout(() => terminalInputRef.current?.focus(), 100);
  };

  const handleQuickFeed = async (inputStr: string) => {
    const lines = inputStr.trim().split("\n");
    setSessionInputs(lines);
    setTerminalInputValue("");
    await handleRun(inputStr + "\n");
  };

  const handleClearTerminal = () => {
    setRunResult(null);
    setSessionInputs([]);
    setTerminalInputValue("");
    setTimeout(() => terminalInputRef.current?.focus(), 100);
  };

  // Check Solution 🚀
  const handleCheck = async () => {
    setIsChecking(true);
    setActiveTab("tests");
    try {
      const testsToRun = currentTask?.tests ?? lesson.tests ?? [];
      const reqsToRun = currentTask?.requiredCode ?? lesson.requiredCode;

      if (testsToRun.length > 0) {
        const outcome = await checkTaskSolution({ tests: testsToRun, requiredCode: reqsToRun }, code);
        setCheckOutcome(outcome);

        if (outcome.passed) {
          await fireConfetti("success");

          const allTaskIds = tasks.map((t) => t.id);
          const taskXp = currentTask?.xp ?? 35;

          const res = completeTask(lesson.day, taskId, taskXp, allTaskIds, {
            code,
            usedScanner: usesScanner(code),
          });

          if (res.dayCompleted) {
            await fireConfetti("module");
            toast({
              variant: "success",
              title: `🎉 День ${lesson.day} полностью закрыт!`,
              description: `Все ${tasks.length} задачи выполнены! Открыт следующий день курса.`,
              badge: `+${taskXp} XP`,
              duration: 7000,
            });
          } else {
            toast({
              variant: "success",
              title: res.taskAlreadyCompleted ? "Тесты пройдены!" : "Задание выполнено!",
              description: res.taskAlreadyCompleted
                ? "Задача уже была зачтена ранее."
                : `Отличная работа! Начислено +${taskXp} XP`,
              badge: !res.taskAlreadyCompleted ? `+${taskXp} XP` : undefined,
            });
          }

          res.unlocked.forEach((ach) => {
            fireConfetti("achievement");
            toast({
              variant: "achievement",
              title: ach.title,
              description: ach.description,
              badge: ach.xp > 0 ? `+${ach.xp} XP` : undefined,
            });
          });

          // If day completed, optionally notify parent
          if (res.dayCompleted) {
            onSuccess?.();
          }
        } else {
          recordFailedCheck();
          toast({
            variant: "error",
            title: "Тесты не пройдены",
            description: "Проверь требования к коду и различия в выводе ниже.",
          });
        }
      } else {
        // Freeform / outline task
        const res = await runJava(code, stdin);
        setRunResult(res);
        setActiveTab("terminal");

        if (res.status === "success") {
          await fireConfetti("success");
          completeDay(lesson.day, { code });
          toast({
            variant: "success",
            title: "Код выполнен успешно!",
            description: "Эксперимент завершен.",
          });
          onSuccess?.();
        } else {
          toast({
            variant: "error",
            title: "Код содержит ошибки",
            description: "Исправь ошибки перед сдачей.",
          });
        }
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

  const isCurrentTaskCompleted = isTaskCompleted(progress, lesson.day, taskId);
  const completedInDay = completedTasksForDay(progress, lesson.day);
  const allTasksCompleted = tasks.length > 0 && tasks.every((t) => completedInDay.includes(t.id));

  return (
    <div className="flex h-full flex-col bg-[#09090b]">
      {/* 3 Tasks Selector Bar (if lesson has multiple tasks) */}
      {tasks.length > 1 && (
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0c0c0e] px-3 py-1.5 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 mr-1 hidden sm:inline">
              Задачи дня:
            </span>
            {tasks.map((t, idx) => {
              const isTaskDone = isTaskCompleted(progress, lesson.day, t.id);
              const isCurrent = t.id === taskId;
              const typeLabel =
                t.type === "warmup" ? "Разминка" : t.type === "practice" ? "Практика" : "Домашка ⭐️";

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTask?.(t.id)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    isCurrent
                      ? "bg-orange-500/20 text-orange-200 ring-1 ring-orange-500/40 font-semibold"
                      : isTaskDone
                      ? "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                  }`}
                >
                  {isTaskDone ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <span className="font-mono text-[10px] text-zinc-500">{idx + 1}.</span>
                  )}
                  <span>{typeLabel}</span>
                  <span className="text-[10px] font-mono opacity-70">+{t.xp}XP</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <span>Прогресс:</span>
            <span
              className={`font-semibold ${
                allTasksCompleted ? "text-emerald-400" : "text-orange-400"
              }`}
            >
              {completedInDay.length} / {tasks.length}
            </span>
          </div>
        </div>
      )}

      {/* Editor Top Toolbar */}
      <div className="flex h-11 items-center justify-between border-b border-white/[0.08] bg-[#09090b] px-4">
        {/* Left: File tab + language */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-zinc-900 border border-white/5 px-2.5 py-1 text-xs font-mono text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <span>Main.java</span>
          </div>
          {isCurrentTaskCompleted ? (
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              <Check className="h-3 w-3" />
              Задача сдана
            </span>
          ) : (
            <span
              className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500"
              title="Система проверяет требования к синтаксису и скрытые тест-кейсы"
            >
              <ShieldAlert className="h-3 w-3 text-orange-400/80" />
              <span>Ручной ввод кода</span>
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="focus-ring flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-zinc-900/60 px-2.5 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            title="Сбросить код к начальному шаблону"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Сбросить</span>
          </button>

          {/* Run Code Button */}
          <button
            type="button"
            disabled={isRunning || isChecking}
            onClick={() => handleRun(undefined, true)}
            className="focus-ring flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-800 px-3 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-700 hover:text-white disabled:opacity-50"
            title="Запустить код в песочнице с интерактивным терминалом"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-400" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current text-orange-400" />
            )}
            <span>Запустить</span>
          </button>

          {/* Check Solution Button */}
          <button
            type="button"
            disabled={isRunning || isChecking}
            onClick={handleCheck}
            className="focus-ring flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-3.5 text-xs font-bold text-white shadow-md shadow-orange-950/40 transition hover:from-orange-400 hover:to-amber-500 disabled:opacity-50"
            title="Автоматическая проверка всех тестов задания"
          >
            {isChecking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5" />
            )}
            <span>Проверить решение</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Area */}
      <div className="relative flex-1 min-h-[260px]">
        <Editor
          height="100%"
          language="java"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={(editor, monaco) => {
            // Register rich Java autocomplete, hover documentation, and IntelliJ live templates
            registerJavaCompletions(monaco);

            editor.onDidPaste(() => {
              toast({
                variant: "info",
                title: "💡 Совет: Пишите код руками",
                description:
                  "Написание кода вручную развивает мышечную память синтаксиса Java и уверенность на собеседованиях!",
                duration: 5000,
              });
            });
          }}
          options={{
            fontFamily: "var(--font-jetbrains), Consolas, 'Courier New', monospace",
            fontSize: 13,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
            insertSpaces: true,
            formatOnPaste: true,
            automaticLayout: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "all",
            padding: { top: 12, bottom: 12 },
            // IntelliJ-like autocompletion settings
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            acceptSuggestionOnCommitCharacter: true,
            snippetSuggestions: "top",
            wordBasedSuggestions: "allDocuments",
            parameterHints: { enabled: true },
            suggest: {
              preview: true,
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showKeywords: true,
              showSnippets: true,
            },
          }}
          loading={
            <div className="flex h-full items-center justify-center gap-2 bg-[#09090b] text-xs text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
              <span>Загрузка Monaco Editor...</span>
            </div>
          }
        />
      </div>

      {/* Bottom Panel (Terminal / stdin / tests) */}
      <div className="flex h-80 sm:h-96 flex-col border-t border-white/[0.08] bg-[#0c0c0e]">
        {/* Tab Headers */}
        <div className="flex h-9 items-center justify-between border-b border-white/[0.06] px-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("terminal")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeTab === "terminal"
                  ? "bg-white/10 text-zinc-100"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              <Terminal className="h-3 w-3 text-orange-400" />
              <span>Терминал</span>
              {runResult && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    runResult.status === "success"
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                  }`}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("stdin")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeTab === "stdin"
                  ? "bg-white/10 text-zinc-100"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              <Keyboard className="h-3 w-3 text-sky-400" />
              <span>Ввод (stdin)</span>
              {stdin.trim() && (
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tests")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeTab === "tests"
                  ? "bg-white/10 text-zinc-100"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              <CheckCircle className="h-3 w-3 text-emerald-400" />
              <span>Тесты задания</span>
              {checkOutcome && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    checkOutcome.passed ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
              )}
            </button>
          </div>

          {/* Execution details & Clear */}
          <div className="flex items-center gap-3">
            {runResult && (
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {runResult.timeMs} мс
                </span>
                <span>·</span>
                <span className="capitalize">{runResult.provider}</span>
              </div>
            )}
            {activeTab === "terminal" && (runResult || sessionInputs.length > 0) && (
              <button
                type="button"
                onClick={handleClearTerminal}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1"
                title="Очистить терминал"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Очистить</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
          {activeTab === "terminal" && (
            <div className="h-full flex flex-col justify-between -m-3">
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {isRunning ? (
                  <div className="flex h-28 items-center justify-center gap-2 text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                    <span>Компиляция и запуск Java...</span>
                  </div>
                ) : !runResult ? (
                  <div className="flex h-28 flex-col items-center justify-center text-zinc-500 space-y-1">
                    <Play className="h-5 w-5 opacity-40 text-orange-400" />
                    <p>Нажми «Запустить» или введи значение в консоль ❯ ниже</p>
                    <p className="text-[11px] text-zinc-600">
                      Интерактивный ввод и вывод System.out.println
                    </p>
                  </div>
                ) : runResult.status === "compile_error" ? (
                  <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>Ошибка компиляции (javac):</span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed text-[11px] opacity-90">
                      {runResult.compileOutput || runResult.stderr}
                    </pre>
                  </div>
                ) : isWaitingForInput ? (
                  <div className="space-y-2">
                    {runResult.stdout && (
                      <pre className="whitespace-pre-wrap leading-relaxed text-zinc-100 font-mono">
                        {runResult.stdout}
                      </pre>
                    )}

                    {sessionInputs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400 py-1">
                        <span className="text-zinc-500">Введено:</span>
                        {sessionInputs.map((inp, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 font-mono text-sky-300"
                          >
                            ❯ {inp}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200 animate-in fade-in">
                      <div className="flex items-center gap-2 font-semibold text-amber-300 mb-0.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span>Программа ожидает ввод с клавиатуры (Scanner)</span>
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        {sessionInputs.length === 0
                          ? "Введи имя (например: Мухаммад или Ибрагим) в строке ❯ ниже и нажми Enter ↵"
                          : "Введи год рождения (например: 2008 или 2005) в строке ❯ ниже и нажми Enter ↵"}
                      </p>
                    </div>
                  </div>
                ) : runResult.status === "runtime_error" ? (
                  <div className="space-y-2">
                    {runResult.stdout && (
                      <div className="text-zinc-200">
                        <div className="text-[10px] text-zinc-500 mb-1">STDOUT:</div>
                        <pre className="whitespace-pre-wrap leading-relaxed">
                          {runResult.stdout}
                        </pre>
                      </div>
                    )}
                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Исключение во время выполнения (Exception):</span>
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed text-[11px]">
                        {runResult.stderr}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                        <span>Вывод программы:</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        код возврата: 0
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed text-zinc-100">
                      {runResult.stdout || "(программа ничего не вывела в консоль)"}
                    </pre>

                    {sessionInputs.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-emerald-500/20 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                        <span className="text-zinc-500">Передано в System.in:</span>
                        {sessionInputs.map((inp, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 font-mono text-sky-300 font-medium"
                          >
                            ❯ {inp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Terminal Input Bar (IntelliJ IDEA Console Prompt) */}
              <div className="border-t border-white/[0.08] bg-[#09090b] px-3 py-2 space-y-2">
                {/* Quick Presets for Scanner */}
                {hasScanner && (
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-zinc-500 font-mono text-[10px]">Быстрый ввод:</span>
                      <button
                        type="button"
                        onClick={() => handleQuickFeed("Мухаммад\n2008")}
                        className="rounded bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 px-2 py-0.5 text-[11px] text-zinc-300 transition flex items-center gap-1"
                      >
                        <span>⚡ Мухаммад (2008)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickFeed("Ибрагим\n2005")}
                        className="rounded bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 px-2 py-0.5 text-[11px] text-zinc-300 transition flex items-center gap-1"
                      >
                        <span>⚡ Ибрагим (2005)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickFeed("Алекс\n2000")}
                        className="rounded bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 px-2 py-0.5 text-[11px] text-zinc-300 transition flex items-center gap-1"
                      >
                        <span>⚡ Алекс (2000)</span>
                      </button>
                    </div>

                    {sessionInputs.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearTerminal}
                        className="text-zinc-500 hover:text-zinc-300 transition text-[11px] flex items-center gap-1"
                        title="Очистить терминал и сбросить введенные данные"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Сбросить сессию</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Input form */}
                <form onSubmit={handleInteractiveInputSubmit} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-orange-400 select-none pl-1">
                    <span className={isWaitingForInput ? "animate-pulse text-amber-400" : "text-zinc-500"}>
                      ❯
                    </span>
                  </div>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInputValue}
                    onChange={(e) => setTerminalInputValue(e.target.value)}
                    disabled={isRunning}
                    placeholder={
                      isWaitingForInput
                        ? sessionInputs.length === 0
                          ? "Введи имя (например: Мухаммад или Ибрагим) и нажми Enter ↵"
                          : "Введи год рождения (например: 2008 или 2005) и нажми Enter ↵"
                        : hasScanner
                        ? "Введи данные для Scanner и нажми Enter ↵"
                        : "Ввод в System.in (нажми Enter для отправки)..."
                    }
                    className={`flex-1 rounded-md border bg-black/60 px-3 py-1.5 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition ${
                      isWaitingForInput
                        ? "border-amber-500/50 ring-1 ring-amber-500/30 focus:border-amber-400"
                        : "border-white/10 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isRunning || !terminalInputValue.trim()}
                    className="flex items-center gap-1.5 rounded-md bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 px-3 py-1.5 text-xs font-semibold text-orange-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Ввод</span>
                    <CornerDownLeft className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "stdin" && (
            <div className="h-full flex flex-col">
              <label className="text-[11px] text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Данные для Scanner (System.in):</span>
                <span className="text-[10px] text-zinc-500">
                  Каждое значение с новой строки
                </span>
              </label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Входные данные..."
                className="flex-1 w-full resize-none rounded-lg border border-white/10 bg-black/50 p-2.5 font-mono text-xs text-zinc-200 outline-none focus:border-orange-500/50"
              />
            </div>
          )}

          {activeTab === "tests" && (
            <div className="space-y-3">
              {isChecking ? (
                <div className="flex h-full items-center justify-center gap-2 py-8 text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                  <span>Проверка решения по всем тестам...</span>
                </div>
              ) : !checkOutcome ? (
                <div className="py-6 text-center text-zinc-500">
                  Нажми «Проверить решение», чтобы протестировать код на всех входных данных.
                </div>
              ) : (
                <>
                  {checkOutcome.requirementErrors.length > 0 && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-rose-400 mb-1">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Не выполнены требования к структуре кода:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-xs">
                        {checkOutcome.requirementErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {checkOutcome.tests.some((t) => t.result?.status === "compile_error") && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-rose-400 mb-1">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Ошибка компиляции кода (javac):</span>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-[11px] opacity-90">
                        {checkOutcome.tests.find((t) => t.result?.status === "compile_error")?.result?.compileOutput ||
                          checkOutcome.tests.find((t) => t.result?.status === "compile_error")?.result?.stderr}
                      </pre>
                    </div>
                  )}

                  <div className="space-y-2">
                    {checkOutcome.tests.map((t, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg border p-3 ${
                          t.passed
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-200"
                            : "border-rose-500/20 bg-rose-500/5 text-rose-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 font-semibold text-xs">
                            {t.passed ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <X className="h-3.5 w-3.5 text-rose-400" />
                            )}
                            <span className={t.passed ? "text-emerald-300" : "text-rose-300"}>
                              {t.test.label.startsWith("Тест") ? t.test.label : `Тест ${idx + 1}: ${t.test.label}`}
                            </span>
                          </div>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                              t.passed
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            {t.passed ? "PASSED" : "FAILED"}
                          </span>
                        </div>

                        {!t.passed && (
                          <div className="mt-2 space-y-1.5 text-[11px]">
                            {t.result?.status === "compile_error" ? (
                              <div className="rounded border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300">
                                <div className="font-semibold text-rose-400 mb-1 flex items-center gap-1">
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  <span>Ошибка компиляции javac:</span>
                                </div>
                                <pre className="whitespace-pre-wrap text-[11px] font-mono opacity-90">
                                  {t.result.compileOutput || t.result.stderr}
                                </pre>
                              </div>
                            ) : (
                              <>
                                {t.test.stdin && (
                                  <div className="text-zinc-400">
                                    Входные данные:{" "}
                                    <span className="text-zinc-200 font-bold">{JSON.stringify(t.test.stdin)}</span>
                                  </div>
                                )}
                                {t.missing && t.missing.length > 0 && (
                                  <div className="text-rose-300">
                                    Ожидалось в выводе:{" "}
                                    <span className="font-semibold text-white">
                                      {t.missing.map((m) => `«${m}»`).join(", ")}
                                    </span>
                                  </div>
                                )}
                                {t.result?.stdout && (
                                  <div className="text-zinc-400">
                                    Фактический вывод:{" "}
                                    <pre className="mt-1 rounded bg-black/40 p-1.5 text-zinc-200 whitespace-pre-wrap">
                                      {t.result.stdout}
                                    </pre>
                                  </div>
                                )}
                                {t.result?.status === "runtime_error" && t.result.stderr && (
                                  <div className="rounded border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300">
                                    <div className="font-semibold text-rose-400 mb-1 flex items-center gap-1">
                                      <AlertCircle className="h-3.5 w-3.5" />
                                      <span>Исключение во время выполнения (Exception):</span>
                                    </div>
                                    <pre className="whitespace-pre-wrap text-[11px] font-mono opacity-90">
                                      {t.result.stderr}
                                    </pre>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
