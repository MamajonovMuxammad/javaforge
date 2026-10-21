"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Info, Trophy, X, XCircle } from "lucide-react";

export type ToastVariant = "success" | "error" | "info" | "achievement";

export interface ToastInput {
  variant?: ToastVariant;
  title: string;
  description?: string;
  /** e.g. "+50 XP" */
  badge?: string;
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastInput, "variant" | "title">> {
  id: number;
  description?: string;
  badge?: string;
  leaving: boolean;
}

const ToastContext = createContext<((t: ToastInput) => void) | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const STYLES: Record<ToastVariant, { icon: typeof Info; ring: string; iconColor: string; glow: string }> = {
  success: { icon: CheckCircle2, ring: "border-emerald-400/25", iconColor: "text-emerald-400", glow: "from-emerald-400/15" },
  error: { icon: XCircle, ring: "border-rose-400/25", iconColor: "text-rose-400", glow: "from-rose-400/15" },
  info: { icon: Info, ring: "border-white/10", iconColor: "text-orange-300", glow: "from-orange-400/10" },
  achievement: { icon: Trophy, ring: "border-orange-400/40", iconColor: "text-orange-300", glow: "from-orange-400/25" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 260);
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = ++idRef.current;
      const item: ToastItem = {
        id,
        variant: input.variant ?? "info",
        title: input.title,
        description: input.description,
        badge: input.badge,
        leaving: false,
      };
      setToasts((ts) => [...ts.slice(-4), item]);
      const duration = input.duration ?? (input.variant === "achievement" ? 6000 : 4200);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-[10000] flex w-[min(380px,calc(100vw-2.5rem))] flex-col gap-2.5"
      >
        {toasts.map((t) => {
          const s = STYLES[t.variant];
          const Icon = s.icon;
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto relative overflow-hidden rounded-xl border ${s.ring} glass shadow-2xl shadow-black/50 ${
                t.leaving ? "animate-toast-out" : "animate-toast-in"
              }`}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.glow} to-transparent`} />
              {t.variant === "achievement" && <div className="shimmer-bar pointer-events-none absolute inset-0 opacity-20" />}
              <div className="relative flex items-start gap-3 p-3.5">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 ${s.iconColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {t.variant === "achievement" && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-300/80">Ачивка</span>
                    )}
                    {t.badge && (
                      <span className="rounded-md bg-orange-400/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-orange-300">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-zinc-50">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-[13px] leading-snug text-zinc-400">{t.description}</p>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="focus-ring -mr-1 -mt-1 rounded-md p-1 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
                  aria-label="Закрыть уведомление"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
