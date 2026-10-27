"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress, displayStreak, isActiveToday } from "@/lib/progress/store";
import { useAuth, logoutUser } from "@/lib/auth/store";
import { TOTAL_DAYS } from "@/data/curriculum";
import { AchievementsModal } from "@/components/modals/AchievementsModal";
import { ResetModal } from "@/components/modals/ResetModal";
import { HomeworkModal } from "@/components/modals/HomeworkModal";
import { LeaderboardModal } from "@/components/modals/LeaderboardModal";
import { AuthModal } from "@/components/modals/AuthModal";
import {
  Flame,
  Trophy,
  RotateCcw,
  Sparkles,
  Coffee,
  Menu,
  Terminal,
  GraduationCap,
  Home,
  LogOut,
  User as UserIcon,
  Zap,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onSelectDayTask?: (day: number, taskId: string) => void;
  onGoHome?: () => void;
  onTestLevelUp?: () => void;
}

export function Header({
  onToggleSidebar,
  isSidebarOpen,
  onSelectDayTask,
  onGoHome,
  onTestLevelUp,
}: HeaderProps) {
  const progress = useProgress();
  const auth = useAuth();

  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [homeworkOpen, setHomeworkOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const completedCount = progress.completedDays.length;
  const progressPct = Math.round((completedCount / TOTAL_DAYS) * 100);
  const streak = displayStreak(progress);
  const activeToday = isActiveToday(progress);
  const unlockedAchievementsCount = Object.keys(progress.achievements).length;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-[#09090b]/80 px-4 backdrop-blur-md lg:px-6">
        {/* Left: Brand + Course Drawer Toggle */}
        <div className="flex items-center gap-3">
          {/* Syllabus Drawer Toggle Button (Visible on ALL devices) */}
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            title={isSidebarOpen ? "Закрыть программу курса" : `Открыть программу курса (${TOTAL_DAYS} дней)`}
            aria-label="Программа курса"
          >
            <Menu className="h-4 w-4 text-orange-400" />
            <span className="hidden sm:inline">Программа</span>
            <span className="rounded bg-orange-500/20 px-1 py-0.2 font-mono text-[10px] text-orange-300 font-bold">
              {TOTAL_DAYS}д
            </span>
          </button>

          {/* Logo / Home Click */}
          <div
            onClick={onGoHome}
            className={`flex items-center gap-2.5 ${
              onGoHome ? "cursor-pointer group" : ""
            }`}
            title={onGoHome ? "Перейти на главную страницу (лендинг)" : undefined}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-md shadow-orange-500/20 transition group-hover:scale-105">
              <Coffee className="h-5 w-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-950 ring-1 ring-orange-500/40">
                <Terminal className="h-2 w-2 text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base">
                  Java<span className="text-orange-400">Forge</span>
                </span>
                {onGoHome && (
                  <span className="hidden xl:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.2 font-mono text-[9px] text-zinc-400 group-hover:text-zinc-200">
                    <Home className="h-2.5 w-2.5" />
                    Лендинг
                  </span>
                )}
              </div>
              <div className="text-[10px] text-zinc-400 hidden sm:block">
                Junior Java Backend Roadmap
              </div>
            </div>
          </div>
        </div>

        {/* Center: Overall Progress bar */}
        <div className="hidden lg:flex flex-col items-center justify-center max-w-xs lg:max-w-sm w-full mx-4">
          <div className="flex w-full justify-between items-center text-xs mb-1">
            <span className="text-zinc-400 font-medium">Прогресс курса:</span>
            <span className="font-mono font-semibold text-zinc-200">
              {completedCount} из {TOTAL_DAYS} дней ({progressPct}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Right: Gamification Badges, Leaderboard, Auth & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* XP Badge */}
          <div
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-300 shadow-sm"
            title="Очки опыта (XP) за решение задач и ачивки"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono">{progress.xp}</span>
            <span className="text-[10px] text-amber-400/80 font-normal">XP</span>
          </div>

          {/* Streak Badge */}
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold transition ${
              streak > 0
                ? "border-orange-500/30 bg-orange-500/10 text-orange-300 shadow-sm shadow-orange-950/20"
                : "border-white/5 bg-zinc-900/60 text-zinc-400"
            }`}
            title={
              activeToday
                ? `Стрик: ${streak} дн. (сегодня активно 🔥)`
                : `Стрик: ${streak} дн. Занимайся каждый день, чтобы не потерять стрик!`
            }
          >
            <Flame
              className={`h-4 w-4 ${
                streak > 0 ? "text-orange-400 animate-flicker" : "text-zinc-500"
              }`}
            />
            <span className="font-mono font-bold">{streak}</span>
          </div>

          {/* Leaderboard Button 🏆 */}
          <Link
            href="/leaderboard"
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20 hover:text-white"
            title="Открыть таблицу лидеров курса и персональную аналитику"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Лидерборд</span>
          </Link>

          {/* Homework Hub Button */}
          <button
            type="button"
            onClick={() => setHomeworkOpen(true)}
            className="focus-ring relative flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-200 transition hover:bg-orange-500/20 hover:text-white"
            title="Открыть центр домашних заданий курса"
          >
            <GraduationCap className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden md:inline">Домашки</span>
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500/30 px-1 font-mono text-[10px] font-bold text-orange-200">
              ⭐️
            </span>
          </button>

          {/* Achievements Button */}
          <button
            type="button"
            onClick={() => setAchievementsOpen(true)}
            className="focus-ring relative flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/80 px-2 py-1 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
            title="Открыть список ачивок"
          >
            <Trophy className="h-3.5 w-3.5 text-yellow-400" />
            <span className="hidden xl:inline">Ачивки</span>
            {unlockedAchievementsCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 font-mono text-[10px] font-bold text-white">
                {unlockedAchievementsCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Area */}
          {auth.isAuthenticated && auth.user ? (
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
              <div
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/80 px-2 py-1 text-xs"
                title={`Вы вошли как ${auth.user.username}`}
              >
                <span>{auth.user.avatar}</span>
                <span className="font-mono font-semibold text-zinc-200 hidden sm:inline max-w-[90px] truncate">
                  {auth.user.username}
                </span>
              </div>
              <button
                type="button"
                onClick={logoutUser}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/20 transition"
                title="Выйти из аккаунта"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-300 transition hover:bg-orange-500 hover:text-white"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Войти</span>
            </button>
          )}

          {/* Test Level-Up Transition Button (dev only) */}
          {onTestLevelUp && process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={onTestLevelUp}
              className="focus-ring flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-white"
              title="Показать анимацию перехода на новый день (День 3 → День 4)"
            >
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Тест перехода</span>
            </button>
          )}

          {/* Reset progress button (testing) */}
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-zinc-900/40 text-zinc-500 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
            title="Сбросить прогресс"
            aria-label="Сбросить прогресс"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Modals */}
      <HomeworkModal
        open={homeworkOpen}
        onClose={() => setHomeworkOpen(false)}
        onSelectDayTask={onSelectDayTask ?? (() => {})}
      />
      <AchievementsModal open={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
      <LeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        onOpenAuth={() => setAuthOpen(true)}
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <ResetModal open={resetOpen} onClose={() => setResetOpen(false)} />
    </>
  );
}
