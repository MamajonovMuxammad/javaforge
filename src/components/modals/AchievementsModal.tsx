"use client";

import { useProgress } from "@/lib/progress/store";
import { ACHIEVEMENTS, type AchievementDef, levelInfo } from "@/lib/progress/achievements";
import { Modal } from "@/components/ui/Modal";
import {
  Trophy,
  Rocket,
  Bug,
  PartyPopper,
  Keyboard,
  Boxes,
  Crown,
  Flame,
  Terminal,
  Gem,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface AchievementsModalProps {
  open: boolean;
  onClose: () => void;
}

function getIcon(icon: AchievementDef["icon"]) {
  switch (icon) {
    case "rocket":
      return <Rocket className="h-5 w-5" />;
    case "bug":
      return <Bug className="h-5 w-5" />;
    case "party":
      return <PartyPopper className="h-5 w-5" />;
    case "keyboard":
      return <Keyboard className="h-5 w-5" />;
    case "blocks":
      return <Boxes className="h-5 w-5" />;
    case "crown":
      return <Crown className="h-5 w-5" />;
    case "flame":
    case "fire":
      return <Flame className="h-5 w-5" />;
    case "terminal":
      return <Terminal className="h-5 w-5" />;
    case "gem":
    default:
      return <Gem className="h-5 w-5" />;
  }
}

export function AchievementsModal({ open, onClose }: AchievementsModalProps) {
  const progress = useProgress();
  const unlockedCount = Object.keys(progress.achievements).length;
  const currentLevel = levelInfo(progress.xp);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Достижения и трофеи"
      subtitle={`Разблокировано ${unlockedCount} из ${ACHIEVEMENTS.length} наград`}
      icon={<Trophy className="h-5 w-5 text-orange-400" />}
      size="lg"
    >
      <div className="space-y-6">
        {/* User Level Header Card */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-transparent p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Твой ранг
              </div>
              <div className="mt-0.5 text-xl font-bold text-white">
                Уровень {currentLevel.level}: {currentLevel.title}
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {progress.xp} XP всего · До уровня {currentLevel.level + 1} осталось {currentLevel.toNext} XP
              </div>
            </div>

            <div className="w-full sm:w-48">
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Прогресс уровня</span>
                <span>{Math.round(currentLevel.progress * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round(currentLevel.progress * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = Boolean(progress.achievements[ach.id]);
            const unlockedDate = isUnlocked ? progress.achievements[ach.id] : null;

            return (
              <div
                key={ach.id}
                className={`relative flex items-start gap-3.5 rounded-xl border p-4 transition-all ${
                  isUnlocked
                    ? "border-orange-500/30 bg-zinc-900/80 shadow-md shadow-orange-950/20"
                    : "border-white/5 bg-zinc-900/30 opacity-60"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${
                    isUnlocked
                      ? "bg-orange-500/15 text-orange-400 ring-orange-500/30 shadow-inner"
                      : "bg-zinc-800/60 text-zinc-500 ring-white/5"
                  }`}
                >
                  {isUnlocked ? getIcon(ach.icon) : <Lock className="h-4 w-4 text-zinc-600" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-semibold truncate ${
                        isUnlocked ? "text-zinc-100" : "text-zinc-400"
                      }`}
                    >
                      {ach.title}
                    </h4>
                    {ach.xp > 0 && (
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isUnlocked ? "text-orange-400" : "text-zinc-500"
                        }`}
                      >
                        +{ach.xp} XP
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{ach.description}</p>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Получено{" "}
                        {unlockedDate && (
                          <span className="text-zinc-500 font-normal">
                            ({new Date(unlockedDate).toLocaleDateString("ru-RU")})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-zinc-500">Заблокировано</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
