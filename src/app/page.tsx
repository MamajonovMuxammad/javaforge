"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LessonContent } from "@/components/lesson/LessonContent";
import { ModuleZeroView } from "@/components/lesson/ModuleZeroView";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { LandingPage } from "@/components/landing/LandingPage";
import { AuthModal } from "@/components/modals/AuthModal";
import { LeaderboardModal } from "@/components/modals/LeaderboardModal";
import { getLesson, lessons, TOTAL_DAYS } from "@/data/curriculum";
import { useProgress, isTaskCompleted, completeDay } from "@/lib/progress/store";
import { useAuth } from "@/lib/auth/store";
import {
  BookOpen,
  Code2,
  Loader2,
  Lock,
  Sparkles,
  ArrowRight,
  User as UserIcon,
} from "lucide-react";

function JavaForgeApp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const progress = useProgress();
  const auth = useAuth();

  // Mode: "landing" or "app"
  const [view, setView] = useState<"landing" | "app">(() => {
    const dayParam = searchParams.get("day");
    const viewParam = searchParams.get("view");
    if (dayParam || viewParam === "app") return "app";
    return "landing";
  });

  const [currentDay, setCurrentDay] = useState<number>(() => {
    const p = searchParams.get("day");
    if (p !== null && p !== "") {
      const parsed = parseInt(p, 10);
      if (parsed >= 0 && parsed <= TOTAL_DAYS) return parsed;
    }
    return 0;
  });

  const lesson = getLesson(currentDay) ?? lessons[0];
  const lessonTasks = lesson.tasks && lesson.tasks.length > 0 ? lesson.tasks : [];

  // Active task ID state
  const [activeTaskId, setActiveTaskId] = useState<string>(() => {
    return lessonTasks[0]?.id ?? "default";
  });

  // Course Drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"theory" | "editor">("theory");

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);

  // Keep active task synced when day changes
  const prevDayRef = useRef(currentDay);
  useEffect(() => {
    const currentTasks = lesson.tasks && lesson.tasks.length > 0 ? lesson.tasks : [];
    const dayChanged = prevDayRef.current !== currentDay;
    prevDayRef.current = currentDay;

    if (dayChanged || !currentTasks.some((t) => t.id === activeTaskId)) {
      const uncompleted = currentTasks.find((t) => !isTaskCompleted(progress, currentDay, t.id));
      setActiveTaskId(uncompleted?.id ?? currentTasks[0]?.id ?? "default");
    }
  }, [currentDay, lesson.tasks, progress, activeTaskId]);

  // Sync state if URL query param changes
  useEffect(() => {
    const dayParam = searchParams.get("day");
    const viewParam = searchParams.get("view");

    if (dayParam || viewParam === "app") {
      setView("app");
    }

    if (dayParam !== null && dayParam !== "") {
      const parsed = parseInt(dayParam, 10);
      if (parsed >= 0 && parsed <= TOTAL_DAYS && parsed !== currentDay) {
        setCurrentDay(parsed);
      }
    } else if (progress.completedDays.length > 0) {
      const nextDay = Math.min(TOTAL_DAYS, Math.max(...progress.completedDays) + 1);
      if (nextDay !== currentDay) {
        setCurrentDay(nextDay);
      }
    }
  }, [searchParams, currentDay, progress.completedDays]);

  const handleStartCourse = (day = 0) => {
    setCurrentDay(day);
    setView("app");
    router.push(`/?day=${day}`, { scroll: false });
  };

  const handleSelectDay = (day: number) => {
    setCurrentDay(day);
    setView("app");
    router.push(`/?day=${day}`, { scroll: false });
    setIsSidebarOpen(false); // close drawer upon selecting a day
  };

  const handleSelectDayTask = (day: number, taskId: string) => {
    setCurrentDay(day);
    setActiveTaskId(taskId);
    setView("app");
    router.push(`/?day=${day}`, { scroll: false });
    setMobileTab("editor");
    setIsSidebarOpen(false);
  };

  const handleNextDay = () => {
    if (currentDay < TOTAL_DAYS) {
      handleSelectDay(currentDay + 1);
    }
  };

  const handlePrevDay = () => {
    if (currentDay > 0) {
      handleSelectDay(currentDay - 1);
    }
  };

  const handleGoHome = () => {
    setView("landing");
    router.push(`/`, { scroll: false });
  };

  // Render Landing Page if view is "landing"
  if (view === "landing") {
    return (
      <>
        <LandingPage
          onStartCourse={handleStartCourse}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenLeaderboard={() => setLeaderboardModalOpen(true)}
        />
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        <LeaderboardModal
          open={leaderboardModalOpen}
          onClose={() => setLeaderboardModalOpen(false)}
          onOpenAuth={() => {
            setLeaderboardModalOpen(false);
            setAuthModalOpen(true);
          }}
        />
      </>
    );
  }

  // Render Interactive IDE Workspace
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#09090b] text-zinc-100">
      {/* Top Header with Gamification & Drawer Toggle */}
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => {
          if (!auth.isAuthenticated) {
            setAuthModalOpen(true);
            return;
          }
          setIsSidebarOpen(!isSidebarOpen);
        }}
        onSelectDayTask={handleSelectDayTask}
        onGoHome={handleGoHome}
      />

      {/* Main Body with Slide-over Drawer + 2-Column Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Roadmap Sidebar Drawer (Collapsible) */}
        <Sidebar
          currentDay={currentDay}
          onSelectDay={handleSelectDay}
          isOpen={isSidebarOpen && auth.isAuthenticated}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Mobile View Switcher (Theory vs IDE) - hidden for theory-only Module 0 */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {currentDay > 0 && (
            <div className="flex lg:hidden border-b border-white/[0.08] bg-[#0c0c0e] px-4 py-2">
              <div className="grid grid-cols-2 w-full gap-2">
                <button
                  type="button"
                  onClick={() => setMobileTab("theory")}
                  className={`flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition ${
                    mobileTab === "theory"
                      ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Теория и задания</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("editor")}
                  className={`flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition ${
                    mobileTab === "editor"
                      ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Редактор кода (IDE)</span>
                </button>
              </div>
            </div>
          )}

          {/* Guest notification banner (non-blocking) */}
          {!auth.isAuthenticated && (
            <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border-b border-orange-500/20 px-4 py-2 flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span>
                  <strong>Режим ознакомления:</strong> вы можете изучать любые уроки и запускать код.{" "}
                  <span className="text-zinc-400 hidden sm:inline">Войдите в аккаунт, чтобы сохранять свои решения, XP и стрик.</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="ml-3 shrink-0 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold px-2.5 py-1 text-[11px] transition shadow-sm"
              >
                Войти / Регистрация
              </button>
            </div>
          )}

          {/* Main workspace: Module 0 Full-Width Interactive Reading vs Regular Two-Column IDE */}
          {currentDay === 0 ? (
            <main className="flex flex-1 overflow-y-auto bg-[#09090b]">
              <ModuleZeroView
                isCompleted={progress.completedDays.includes(0)}
                onComplete={() => {
                  completeDay(0, { xpReward: 50 });
                  handleSelectDay(1);
                }}
                onNext={() => handleSelectDay(1)}
              />
            </main>
          ) : (
            <main className="flex flex-1 overflow-hidden relative">
              {/* Left Column: Lesson Content (Theory, 3 Tasks, Videos) */}
              <div
                className={`flex-1 overflow-y-auto border-r border-white/[0.08] bg-[#09090b] transition-all duration-300 ${
                  mobileTab === "theory" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
                }`}
              >
                <LessonContent
                  lesson={lesson}
                  activeTaskId={activeTaskId}
                  onSelectTask={setActiveTaskId}
                  onNextDay={handleNextDay}
                  onPrevDay={handlePrevDay}
                  hasPrev={currentDay > 0}
                  hasNext={currentDay < TOTAL_DAYS}
                />
              </div>

              {/* Right Column: Interactive Code Sandbox */}
              <div
                className={`flex-1 overflow-hidden bg-[#09090b] transition-all duration-300 ${
                  mobileTab === "editor" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
                }`}
              >
                <CodeEditor
                  lesson={lesson}
                  activeTaskId={activeTaskId}
                  onSelectTask={setActiveTaskId}
                  onSuccess={handleNextDay}
                />
              </div>
            </main>
          )}
        </div>
      </div>

      {/* Modals for App View */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <LeaderboardModal
        open={leaderboardModalOpen}
        onClose={() => setLeaderboardModalOpen(false)}
        onOpenAuth={() => {
          setLeaderboardModalOpen(false);
          setAuthModalOpen(true);
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#09090b] text-zinc-400">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
            <span className="font-mono text-xs">Загрузка платформы JavaForge...</span>
          </div>
        </div>
      }
    >
      <JavaForgeApp />
    </Suspense>
  );
}
