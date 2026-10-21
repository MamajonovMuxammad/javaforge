"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/lib/auth/store";
import { useToast } from "@/components/ui/Toaster";
import {
  X,
  User as UserIcon,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Coffee,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({ open, onClose, defaultMode = "login" }: AuthModalProps) {
  const toast = useToast();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const res = await registerUser(username, password, confirmPassword);
        if (!res.success) {
          setError(res.error || "Ошибка регистрации");
          setIsSubmitting(false);
          return;
        }

        toast({
          variant: "success",
          title: `Добро пожаловать, ${res.user?.username}! 🚀`,
          description: "Аккаунт создан. Все ваши достижения и прогресс привязаны к профилю.",
          duration: 5000,
        });
        onClose();
      } else {
        const res = await loginUser(username, password);
        if (!res.success) {
          setError(res.error || "Ошибка авторизации");
          setIsSubmitting(false);
          return;
        }

        toast({
          variant: "success",
          title: `С возвращением, ${res.user?.username}! 👋`,
          description: "Вы успешно вошли в свой аккаунт.",
          duration: 4000,
        });
        onClose();
      }
    } catch {
      setError("Произошла непредвиденная ошибка");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] shadow-2xl shadow-orange-950/20"
      >
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <Coffee className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {mode === "login" ? "Вход в JavaForge" : "Регистрация студента"}
              </h3>
              <p className="text-xs text-zinc-400">
                {mode === "login"
                  ? "Сохраняй стрик и соревнуйся в лидерборде"
                  : "Создай аккаунт и начни путь к Junior"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-2 pb-4">
          <div className="grid grid-cols-2 rounded-xl bg-zinc-900/80 p-1 border border-white/5">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                mode === "login"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                mode === "register"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Регистрация
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>Логин (Username)</span>
              {mode === "register" && (
                <span className="text-[10px] text-zinc-500">латиница, от 3 до 20 симв.</span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <UserIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === "register" ? "например, java_hero" : "ваш логин"}
                className="w-full rounded-xl border border-white/10 bg-zinc-950/70 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 font-mono"
              />
            </div>
            {mode === "register" && (
              <p className="text-[11px] text-zinc-500 leading-tight">
                Без мата, оскорблений и системных слов (admin, root).
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>Пароль</span>
              {mode === "register" && (
                <span className="text-[10px] text-zinc-500">минимум 6 символов</span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/70 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 font-mono"
              />
            </div>
          </div>

          {/* Confirm Password (only on Register) */}
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Повторите пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/70 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 font-mono"
                />
              </div>
            </div>
          )}

          {/* Value Prop Callout */}
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-[11px] text-zinc-400 flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
            <span>
              {mode === "register"
                ? "Все пройденные дни, набранный XP, полученные ачивки и написанный код сохраняются в вашем профиле."
                : "После входа загрузятся все ваши персональные сохранения и позиция в рейтинге студентов."}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
          >
            <span>{mode === "login" ? "Войти в профиль" : "Зарегистрироваться"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
