"use client";

import React, { useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { fireConfetti } from "@/lib/confetti";
import type { PracticeTask } from "@/data/practice/types";
import { Sparkles, Trophy, ArrowRight, CheckCircle2, RotateCcw, List } from "lucide-react";

interface PracticeVictoryModalProps {
  open: boolean;
  onClose: () => void;
  task: PracticeTask;
  xpEarned: number;
  onNextTask?: () => void;
  onBackToList: () => void;
}

export function PracticeVictoryModal({
  open,
  onClose,
  task,
  xpEarned,
  onNextTask,
  onBackToList,
}: PracticeVictoryModalProps) {
  useEffect(() => {
    if (open) {
      fireConfetti();
    }
  }, [open]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Челлендж пройден!"
      subtitle={task.title}
      icon={<Trophy className="h-5 w-5 text-amber-400" />}
      size="md"
    >
      <div className="flex flex-col items-center text-center py-4 space-y-6">
        {/* 3D Animated Floating Trophy */}
        <div className="relative flex items-center justify-center">
          {/* Ambient Glow Orbs */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-yellow-400/20 blur-xl animate-pulse" />
          
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-orange-600/20 shadow-2xl shadow-amber-500/30 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)] transition-transform duration-700"
            style={{ perspective: "1000px" }}
          >
            <div className="relative [transform:translateZ(30px)]">
              <Trophy className="h-12 w-12 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-black shadow-md">
              <CheckCircle2 className="h-4 w-4 text-black stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Victory Text & Badges */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-sm font-semibold text-amber-300 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
            <span>+{xpEarned > 0 ? xpEarned : task.xp} Бонусных XP получено!</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Отличная работа, кодер!
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Все тесты пройдены без единой ошибки. Ты успешно закрепил тему{" "}
            <span className="text-orange-400 font-medium">«{task.topic}»</span> и
            набил руку на реальном коде.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={onBackToList}
            className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <List className="h-4 w-4 text-zinc-400" />
            <span>К списку заданий</span>
          </button>

          {onNextTask ? (
            <button
              type="button"
              onClick={onNextTask}
              className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              <span>Следующая задача</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              <span>Продолжить</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

