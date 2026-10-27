"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProgress, syncNow } from "@/lib/progress/store";
import {
  getLeaderboardEntries,
  type LeaderboardSort,
  type LeaderboardEntry,
} from "@/lib/leaderboard/store";
import {
  X,
  Trophy,
  Flame,
  Sparkles,
  CheckCircle2,
  Medal,
  Crown,
  Shield,
  Layers,
} from "lucide-react";

interface LeaderboardModalProps {
  open: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export function LeaderboardModal({ open, onClose, onOpenAuth }: LeaderboardModalProps) {
  const progress = useProgress();
  const [sortBy, setSortBy] = useState<LeaderboardSort>("xp");
  const [serverPeers, setServerPeers] = useState<
    | Array<{
        id: string;
        username: string;
        avatar: string;
        xp: number;
        completedDays: number;
        completedTasksCount?: number;
        streak: number;
      }>
    | undefined
  >(undefined);

  useEffect(() => {
    if (!open) return;
    let active = true;
    syncNow()
      .catch(() => {})
      .finally(() => {
        fetch(`/api/leaderboard?t=${Date.now()}`, { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (active && data?.leaderboard && Array.isArray(data.leaderboard)) {
              setServerPeers(data.leaderboard);
            }
          })
          .catch(() => {});
      });
    return () => {
      active = false;
    };
  }, [open]);

  if (!open) return null;

  const entries = getLeaderboardEntries(progress, sortBy, serverPeers);
  const currentUserEntry = entries.find((e) => e.isCurrentUser);
  const currentUserRank = entries.findIndex((e) => e.isCurrentUser) + 1;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 font-bold text-black shadow-md shadow-amber-500/30 text-xs">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 font-bold text-black shadow-md shadow-zinc-400/20 text-xs">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-amber-900 font-bold text-white shadow-md shadow-amber-800/20 text-xs">
          🥉
        </div>
      );
    }
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-white/5 font-mono text-xs font-semibold text-zinc-400">
        #{rank}
      </div>
    );
  };

  const getLeagueColor = (league: LeaderboardEntry["league"]) => {
    switch (league) {
      case "Алмазная":
        return "border-sky-500/30 bg-sky-500/10 text-sky-300";
      case "Золотая":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "Серебряная":
        return "border-zinc-400/30 bg-zinc-400/10 text-zinc-300";
      default:
        return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[88vh] max-h-[680px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] shadow-2xl shadow-orange-950/20"
      >
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-inner">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Таблица лидеров JavaForge
                </h3>
                <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-amber-300">
                  Сезон 2026
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Соревнуйся за место в Алмазной лиге и докажи свой скилл в Java
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/leaderboard"
              onClick={onClose}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300 transition hover:bg-orange-500 hover:text-white"
            >
              <span>Вся статистика</span>
              <span>→</span>
            </Link>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sorting Tabs Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-zinc-950/60 px-6 py-2.5">
          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Сортировать по:
          </span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSortBy("xp")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sortBy === "xp"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>По опыту (XP)</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy("tasks")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sortBy === "tasks"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>По задачам</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy("streak")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sortBy === "streak"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>По стрику</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {entries.map((entry, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between rounded-xl border p-3 transition ${
                  entry.isCurrentUser
                    ? "border-orange-500/40 bg-orange-500/10 shadow-md shadow-orange-950/20 ring-1 ring-orange-500/20"
                    : "border-white/5 bg-zinc-900/50 hover:bg-zinc-900/80"
                }`}
              >
                {/* Left: Rank + Avatar + Name + League */}
                <div className="flex items-center gap-3">
                  {getRankBadge(rank)}

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 border border-white/10 text-base shadow-sm">
                    {entry.avatar}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-100 font-mono">
                        {entry.username}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="rounded bg-orange-500 px-1.5 py-0.2 font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                          Ты
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-medium border ${getLeagueColor(
                          entry.league
                        )}`}
                      >
                        {entry.league} лига
                      </span>
                      <span className="text-[11px] text-zinc-500 hidden sm:inline">
                        {entry.completedDaysCount} дн. • {entry.completedTasksCount} задач решено
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics (Streak + XP) */}
                <div className="flex items-center gap-4 text-right">
                  <div className="flex items-center gap-1 text-xs text-orange-400 font-medium">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{entry.streak} дн.</span>
                  </div>

                  <div className="min-w-[70px]">
                    <div className="flex items-center justify-end gap-1 font-mono text-sm font-bold text-amber-300">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>{entry.xp}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500">очков XP</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Status Bar Footer */}
        <div className="border-t border-white/[0.08] bg-zinc-950/90 p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs">
              #{currentUserRank}
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Твое текущее место в рейтинге: #{currentUserRank}
              </div>
              <div className="text-[11px] text-zinc-400">
                Решай задачи и получай XP, чтобы подняться в Алмазную лигу!
              </div>
            </div>
          </div>

          {onOpenAuth && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="text-xs font-medium text-orange-400 hover:text-orange-300 underline underline-offset-4 transition"
            >
              Войти в свой профиль
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
