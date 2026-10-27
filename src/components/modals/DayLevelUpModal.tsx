"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Zap, ArrowRight, Trophy, Flame, BookOpen, CheckCircle2 } from "lucide-react";
import { getLesson, TOTAL_DAYS } from "@/data/curriculum";

interface DayLevelUpModalProps {
  open: boolean;
  fromDay: number;
  toDay: number;
  onProceed: (nextDay: number) => void;
  onClose?: () => void;
}

export function DayLevelUpModal({
  open,
  fromDay,
  toDay,
  onProceed,
  onClose,
}: DayLevelUpModalProps) {
  // Stage: 0 = "old_day", 1 = "cracking", 2 = "shattered", 3 = "new_day_reveal"
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nextLesson = getLesson(toDay);
  const prevLesson = getLesson(fromDay);

  // Soundless electric canvas effects (lightning bolts & sparks)
  useEffect(() => {
    if (!open) {
      setStage(0);
      return;
    }

    // Sequence of animations:
    // 0 -> 1 (cracking starts at 700ms)
    // 1 -> 2 (shattering burst at 1500ms)
    // 2 -> 3 (new day emerges at 2000ms)
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1500);
    const t3 = setTimeout(() => setStage(3), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [open]);

  // Lightning & Sparkles Canvas Animation
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const colors = ["#f97316", "#fbbf24", "#38bdf8", "#818cf8", "#34d399"];

    function spawnBurst(cx: number, cy: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 1.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: Math.random() * 50 + 40,
        });
      }
    }

    // Lightning bolt generator
    interface Bolt {
      segments: Array<{ x: number; y: number }>;
      alpha: number;
      color: string;
    }
    const bolts: Bolt[] = [];

    function generateBolt(x1: number, y1: number, x2: number, y2: number): Bolt {
      const segments: Array<{ x: number; y: number }> = [{ x: x1, y: y1 }];
      let cx = x1;
      let cy = y1;
      const steps = 14;
      const dx = (x2 - x1) / steps;
      const dy = (y2 - y1) / steps;

      for (let i = 1; i < steps; i++) {
        cx += dx + (Math.random() - 0.5) * 45;
        cy += dy + (Math.random() - 0.5) * 45;
        segments.push({ x: cx, y: cy });
      }
      segments.push({ x: x2, y: y2 });
      return {
        segments,
        alpha: 1,
        color: Math.random() > 0.5 ? "#38bdf8" : "#fbbf24",
      };
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Random lightning bursts occasionally
      if (frame % 25 === 0 && Math.random() > 0.3) {
        const cx = width / 2;
        const cy = height / 2;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 350 + 150;
        bolts.push(
          generateBolt(
            cx + Math.cos(angle) * 50,
            cy + Math.sin(angle) * 50,
            cx + Math.cos(angle) * dist,
            cy + Math.sin(angle) * dist
          )
        );
      }

      // Draw and fade bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        bolt.alpha -= 0.05;
        if (bolt.alpha <= 0) {
          bolts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = bolt.color;
        ctx.globalAlpha = bolt.alpha;

        for (let j = 0; j < bolt.segments.length; j++) {
          const pt = bolt.segments[j];
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Continuous floating energy particles
      if (particles.length < 120 && Math.random() > 0.4) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 400,
          y: height / 2 + (Math.random() - 0.5) * 300,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2.5 - 0.5,
          radius: Math.random() * 2.5 + 1,
          alpha: 0.9,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 60,
        });
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Trigger explosive particle shockwave on shatter
    const burstTimer = setTimeout(() => {
      spawnBurst(width / 2, height / 2, 70);
    }, 1500);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(burstTimer);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/92 backdrop-blur-2xl p-4 selection:bg-orange-500/30">
      {/* Background Lightning Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Radial Neon Energy Rings in Background */}
      <div className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-sky-500/20 blur-[130px] animate-pulse" />

      {/* Center Main Animation Card */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Stages 0 and 1: Old Day Cracking */}
        {stage < 2 && (
          <div
            className={`flex flex-col items-center transition-all duration-500 ${
              stage === 1 ? "scale-105 animate-[shake_0.4s_ease-in-out_infinite]" : "scale-100"
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-300 shadow-lg shadow-orange-950/40 mb-4 animate-pulse">
              <CheckCircle2 className="h-4 w-4 text-orange-400" />
              <span>День {fromDay} успешно завершён!</span>
            </div>

            <div className="relative my-4 select-none">
              {/* Massive Glowing Number */}
              <div
                className={`font-black text-9xl sm:text-[140px] font-mono leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-orange-400 to-amber-600 transition-all filter drop-shadow-[0_0_40px_rgba(249,115,22,0.9)] ${
                  stage === 1 ? "opacity-95" : "opacity-100"
                }`}
              >
                {fromDay}
              </div>

              {/* Fissure / Cracking Overlays */}
              {stage === 1 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Glowing crack lines */}
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
                    <path
                      d="M 50 15 L 48 35 L 53 48 L 47 62 L 52 85"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="animate-pulse filter drop-shadow-[0_0_8px_#38bdf8]"
                    />
                    <path
                      d="M 48 35 L 32 42 L 20 40"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                      className="animate-pulse filter drop-shadow-[0_0_8px_#fbbf24]"
                    />
                    <path
                      d="M 53 48 L 68 55 L 82 50"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      className="animate-pulse filter drop-shadow-[0_0_8px_#38bdf8]"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-white/20 animate-ping rounded-full blur-md" />
                </div>
              )}
            </div>

            <p className="text-zinc-300 text-sm font-medium">
              {prevLesson ? prevLesson.title : `Тема Дня ${fromDay}`} закрыта на 100%
            </p>
            <div className="text-xs text-orange-400 font-mono mt-1">
              {stage === 1 ? "⚡️ Переход на следующий уровень..." : "Готовим следующий день..."}
            </div>
          </div>
        )}

        {/* Stage 2: Shatter Explosion Flash */}
        {stage === 2 && (
          <div className="flex flex-col items-center justify-center h-48 animate-ping">
            <div className="text-7xl">💥</div>
            <div className="h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl animate-pulse" />
          </div>
        )}

        {/* Stage 3: New Day Reveal with Majestic Effects */}
        {stage === 3 && (
          <div className="w-full flex flex-col items-center animate-[zoomIn_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Top Level-Up Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/15 px-5 py-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-cyan-300 shadow-xl shadow-cyan-950/60 ring-2 ring-cyan-400/20 mb-3 animate-pulse">
              <Zap className="h-4 w-4 text-cyan-300 fill-cyan-300" />
              <span>НОВЫЙ УРОВЕНЬ РАЗБЛОКИРОВАН!</span>
              <Sparkles className="h-4 w-4 text-amber-300" />
            </div>

            {/* Glowing New Number */}
            <div className="relative my-2 select-none group">
              <div className="font-black text-9xl sm:text-[145px] font-mono leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 via-sky-400 to-indigo-500 filter drop-shadow-[0_0_45px_rgba(56,189,248,0.95)]">
                {toDay}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-[11px] font-black uppercase tracking-wider text-white px-3 py-0.5 shadow-lg shadow-sky-500/40">
                ДЕНЬ {toDay}
              </div>
            </div>

            {/* Next Lesson Preview Card */}
            <div className="w-full rounded-3xl border border-sky-500/30 bg-gradient-to-b from-zinc-900/90 via-zinc-900/70 to-zinc-950 p-6 sm:p-7 text-left shadow-2xl shadow-sky-950/50 backdrop-blur-xl mt-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
                <span className="text-sky-400 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  Следующая тема курса:
                </span>
                <span className="font-mono text-zinc-500">
                  Урок {toDay} из {TOTAL_DAYS - 1}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {nextLesson?.title ?? `День ${toDay}`}
              </h3>

              {nextLesson?.short && (
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  {nextLesson.short}
                </p>
              )}

              {/* Perks / Rewards */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/[0.08] text-center">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2">
                  <div className="text-xs font-bold text-amber-300 font-mono">
                    +{nextLesson?.xp ?? 45} XP
                  </div>
                  <div className="text-[10px] text-zinc-400">Награда</div>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-2">
                  <div className="text-xs font-bold text-orange-300 font-mono flex items-center justify-center gap-1">
                    <Flame className="h-3 w-3" />
                    Стрик +1
                  </div>
                  <div className="text-[10px] text-zinc-400">Серия побед</div>
                </div>

                <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-2">
                  <div className="text-xs font-bold text-sky-300 font-mono">
                    {nextLesson?.tasks?.length ?? 3} задачи
                  </div>
                  <div className="text-[10px] text-zinc-400">Включая ДЗ</div>
                </div>
              </div>

              {/* Action Button: Start Learning New Day */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onProceed(toDay)}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-orange-500 py-3.5 px-6 font-bold text-white text-base shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:brightness-110 active:scale-[0.99] transition"
                >
                  <span>Начать изучение Дня {toDay}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
