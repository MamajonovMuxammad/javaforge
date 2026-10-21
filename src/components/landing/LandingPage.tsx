"use client";

import { useState } from "react";
import { modules, lessonsOfModule, TOTAL_DAYS } from "@/data/curriculum";
import {
  Sparkles,
  Play,
  Terminal,
  Trophy,
  Flame,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Coffee,
  Check,
  ChevronRight,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Lock,
  HelpCircle,
} from "lucide-react";
import { useAuth, logoutUser } from "@/lib/auth/store";
import { useProgress } from "@/lib/progress/store";

interface LandingPageProps {
  onStartCourse: (day?: number) => void;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
}

const FAQ_ITEMS = [
  {
    q: "Действительно ли платформа и курс бесплатны?",
    a: "Да, JavaForge на 100% бесплатен. Все 65 дней обучения, 195+ задач (Разминка, Практика, Домашка), облачный компилятор OpenJDK 21 и автоматические тесты доступны без каких-либо платных подписок или скрытых платежей.",
  },
  {
    q: "Нужно ли что-то скачивать и настраивать (JDK, IntelliJ IDEA)?",
    a: "Нет, ничего устанавливать не нужно! Вся работа происходит прямо в вашем браузере. Мы встроили полноценную Monaco IDE с автодополнением методов (IntelliSense), быстрыми шаблонами sout/psvm и реальным запуском через OpenJDK 21 в защищенном облачном контейнере.",
  },
  {
    q: "Зачем нужна регистрация на платформе?",
    a: "Регистрация создает персональный профиль студента: она навсегда сохраняет ваш пройденный прогресс, написанный код для каждой задачи, стрик (огонь непрерывных дней учебы), заработанный опыт (XP) и место в общестуденческой таблице лидеров.",
  },
  {
    q: "Смогу ли я устроиться на позицию Java Junior после курса?",
    a: "Программа охватывает полный стек требований современного Java Junior разработчика: Core Java, ООП, Collections Framework, Multithreading, JVM & Garbage Collection, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, REST API, Docker и основы микросервисов. В материалах также разбираются реальные каверзные вопросы технических собеседований.",
  },
  {
    q: "Как устроена защита от списывания?",
    a: "Каждое решение автоматически проверяется на нескольких наборах входных данных (включая скрытые краевые кейсы), а код анализируется на использование требуемых конструкций (например, использование реального Scanner или циклов). Просто вывести готовый ответ не получится — код должен быть честным и рабочим!",
  },
  {
    q: "Что делать, если задача не получается?",
    a: "Во вкладке «Тесты» под редактором подробно отображаются входные данные, ожидаемый вывод и фактический результат вашей программы. Если возникли сложности, в каждой задаче есть подсказки (Hints), а также подробный эталонный код с объяснением (Solution).",
  },
];

export function LandingPage({
  onStartCourse,
  onOpenAuth,
  onOpenLeaderboard,
}: LandingPageProps) {
  const auth = useAuth();
  const progress = useProgress();
  const [selectedModule, setSelectedModule] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const completedCount = progress.completedDays.length;
  const nextDayToLearn = Math.min(
    65,
    progress.completedDays.length > 0 ? Math.max(...progress.completedDays) + 1 : 1
  );

  const handleCourseAction = (day?: number) => {
    onStartCourse(day ?? nextDayToLearn);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 selection:bg-orange-500/30 selection:text-orange-200 scroll-smooth">
      {/* Background Decorative Mesh & Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-b from-orange-600/20 via-amber-500/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -left-32 w-[480px] h-[480px] bg-gradient-to-r from-orange-600/10 to-transparent blur-[130px] rounded-full" />
        <div className="absolute top-[65%] -right-32 w-[520px] h-[520px] bg-gradient-to-l from-amber-500/10 to-transparent blur-[140px] rounded-full" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Landing Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#070709]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleCourseAction(1)}>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25">
              <Coffee className="h-5 w-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-950 ring-1 ring-orange-500/40">
                <Terminal className="h-2 w-2 text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  Java<span className="text-orange-400">Forge</span>
                </span>
                <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-orange-300">
                  Bootcamp 2026
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#curriculum" className="transition hover:text-zinc-100">
              Программа
            </a>
            <a href="#features" className="transition hover:text-zinc-100">
              Преимущества
            </a>
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 transition hover:text-amber-300"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Лидерборд</span>
            </button>
            <a href="#faq" className="transition hover:text-zinc-100">
              FAQ
            </a>
          </div>

          {/* Right Actions: Auth + CTA */}
          <div className="flex items-center gap-3">
            {auth.isAuthenticated && auth.user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-2.5 py-1 text-xs">
                  <span>{auth.user.avatar}</span>
                  <span className="font-semibold text-zinc-200 font-mono">
                    {auth.user.username}
                  </span>
                  <span className="text-amber-400 font-mono text-[11px] font-bold">
                    {progress.xp} XP
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition"
                  title="Выйти из аккаунта"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
              >
                Войти
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCourseAction(nextDayToLearn)}
              className="group relative flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110 active:scale-95"
            >
              {!auth.isAuthenticated && <Lock className="h-3 w-3 opacity-80" />}
              <span>{completedCount > 0 ? `Продолжить (День ${nextDayToLearn})` : "К тренажеру"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-medium text-orange-300 shadow-inner mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
            <span>Интерактивный буткемп Java 2026 · От 0 до Junior</span>
            <span className="rounded-full bg-orange-500/30 px-1.5 py-0.2 text-[10px] font-bold text-orange-200">
              NEW
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Освой <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">Java Backend</span>{" "}
            с нуля до Junior на реальном коде
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed mb-10">
            65 дней интенсивной практики в браузере: от первой строчки в <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded">Scanner</code> до Spring Boot, PostgreSQL, Docker и микросервисов.
            С умным автодополнением как в IntelliJ IDEA и реальным запуском Java.
          </p>

          {/* Hero Center CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              type="button"
              onClick={() => handleCourseAction(nextDayToLearn)}
              className="w-full sm:w-auto group relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-8 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-orange-500/30 transition hover:brightness-110 hover:shadow-orange-500/40 active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{completedCount > 0 ? `Продолжить обучение (День ${nextDayToLearn})` : "Начать обучение бесплатно"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-6 py-4 text-sm sm:text-base font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white hover:border-amber-500/30"
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Таблица лидеров</span>
            </button>

            {!auth.isAuthenticated && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm sm:text-base font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <UserIcon className="h-4 w-4 text-zinc-400" />
                <span>Создать аккаунт</span>
              </button>
            )}
          </div>

          {/* Interactive IDE Simulator Mockup */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#0d0d11]/90 p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl text-left">
            {/* Window controls bar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-zinc-400 font-semibold">
                  Main.java — JavaForge Cloud IDE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                  <Check className="h-3 w-3" /> OpenJDK 21
                </span>
                <span className="rounded bg-orange-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-orange-400 border border-orange-500/20">
                  IntelliSense Active
                </span>
              </div>
            </div>

            {/* Simulated Code Body */}
            <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-zinc-300">
              <p><span className="text-orange-400">import</span> java.util.Scanner;</p>
              <p className="mt-2"><span className="text-orange-400">public class</span> <span className="text-amber-300">Main</span> &#123;</p>
              <p className="pl-4">
                <span className="text-orange-400">public static void</span> <span className="text-sky-400">main</span>(String[] args) &#123;
              </p>
              <p className="pl-8 text-zinc-500">// Вводим имя и начинаем путь Junior разработчика</p>
              <p className="pl-8">
                <span className="text-amber-300">Scanner</span> scanner = <span className="text-orange-400">new</span> <span className="text-amber-300">Scanner</span>(System.in);
              </p>
              <p className="pl-8">
                <span className="text-amber-300">String</span> devName = scanner.<span className="text-emerald-400 font-semibold underline decoration-dotted underline-offset-4">nextLine()</span>;
              </p>
              <p className="pl-8 mt-2">
                System.out.<span className="text-sky-400">println</span>(<span className="text-emerald-300">&quot;🚀 Привет, &quot;</span> + devName + <span className="text-emerald-300">&quot;! Добро пожаловать в JavaForge!&quot;</span>);
              </p>
              <p className="pl-4">&#125;</p>
              <p>&#125;</p>
            </div>

            {/* Terminal Preview Output */}
            <div className="mt-2 rounded-xl border border-white/5 bg-black/70 p-4 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] mb-2 border-b border-white/5 pb-1.5">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Terminal className="h-3.5 w-3.5 text-orange-400" />
                  Терминал (javac & java)
                </span>
                <span className="text-emerald-400 font-semibold">18 мс · PASSED</span>
              </div>
              <p className="text-emerald-300 font-semibold">
                &gt; javac Main.java &amp;&amp; java Main
              </p>
              <p className="text-zinc-100 mt-1">
                🚀 Привет, Junior! Добро пожаловать в JavaForge! Твой стрик начался: 1 день 🔥
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-10 border-y border-white/[0.08] bg-[#0b0b0f]/80 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                65
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">
                Дней интенсивной программы
              </div>
            </div>
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                195+
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">
                Практических задач (3 на день)
              </div>
            </div>
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-400">
                100%
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">
                В браузере (без установки JDK)
              </div>
            </div>
            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                0 ₽
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">
                Бесплатно навсегда
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-MODULE CURRICULUM ROADMAP SHOWCASE */}
      <section id="curriculum" className="relative z-10 py-20 sm:py-28 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
              Структурированная дорожная карта
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              От первой строчки кода до Production в Spring Boot
            </h3>
            <p className="text-zinc-400 mt-3 text-sm sm:text-base">
              Каждый день разбит на 3 последовательные задачи: Разминка, Основная практика и Домашнее задание с автопроверкой.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {modules.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModule(m.id)}
                className={`flex flex-col text-left p-4 rounded-xl border transition ${
                  selectedModule === m.id
                    ? "border-orange-500/50 bg-orange-500/10 shadow-lg shadow-orange-950/20 ring-1 ring-orange-500/30"
                    : "border-white/10 bg-zinc-900/50 hover:bg-zinc-900 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-orange-400">Модуль {m.id}</span>
                  <span className="font-mono text-zinc-500 text-[11px]">
                    {m.fromDay}–{m.toDay} дни
                  </span>
                </div>
                <div className="font-semibold text-sm text-zinc-100 line-clamp-1">
                  {m.title}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Module Detail Card */}
          {(() => {
            const cur = modules.find((m) => m.id === selectedModule) ?? modules[0];
            const modLessons = lessonsOfModule(cur.id);

            return (
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      Модуль {cur.id} · {cur.fromDay}–{cur.toDay} дни ({modLessons.length} уроков)
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-1">{cur.title}</h4>
                    <p className="text-sm text-zinc-400 mt-1 max-w-2xl">{cur.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCourseAction(cur.fromDay)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-400 active:scale-95 shadow-md shadow-orange-500/20 shrink-0"
                  >
                    {!auth.isAuthenticated && <Lock className="h-3 w-3 opacity-80" />}
                    <span>Начать день {cur.fromDay}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Day Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {modLessons.map((l) => (
                    <div
                      key={l.day}
                      onClick={() => handleCourseAction(l.day)}
                      className="group cursor-pointer rounded-xl border border-white/5 bg-black/40 p-3.5 transition hover:border-orange-500/40 hover:bg-orange-500/5 flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono mb-1">
                          <span className="font-bold text-orange-400">День {l.day}</span>
                          <span className="text-zinc-500">· 3 задачи</span>
                        </div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white line-clamp-1">
                          {l.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                          {l.short}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-orange-400 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="relative z-10 py-20 bg-[#09090d]/80 border-t border-white/[0.08] scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
              Технологии и опыт обучения
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Сделано разработчиками для будущих разработчиков
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-orange-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 mb-4">
                <Cpu className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Реальный запуск Java в облаке
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Твой код компилируется официальным компилятором OpenJDK 21. Никаких эмуляций — ты работаешь с реальным javac, стандартными потоками ввода System.in и выводом в консоль.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-orange-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                IntelliJ IDEA-автодополнение
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Поставь точку после <code className="text-amber-300">scanner.</code> или переменной строки — и мгновенно получай подсказки методов: nextLine, nextInt, length, substring. Шаблоны <code className="text-amber-300">sout</code> и <code className="text-amber-300">psvm</code> работают прямо в браузере.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-orange-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Лидерборд и геймификация
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Зарабатывай очки опыта (XP) за каждую решенную задачу, поддерживай ежедневный огонь стрика и соревнуйся со студентами курса за место в Алмазной лиге.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-orange-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Античит и скрытые тесты
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Нельзя просто захардкодить ответ в <code className="text-emerald-300">System.out.println</code>. Решение автоматически тестируется на нескольких разных наборах данных (hidden test cases) и проверяет обязательные конструкции.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-orange-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                3 уровня задач в каждом дне
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Каждый день включает: Разминку для быстрого старта, Основную практику для закрепления темы и комплексное Домашнее задание с повышенной наградой XP.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition hover:border-orange-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Понятная теория без воды
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Короткие статьи с наглядными диаграммами памяти (Stack и Heap), разбором подводных камней и реальными паттернами, которые спрашивают на технических собеседованиях.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 py-20 bg-[#070709] border-t border-white/[0.08] scroll-mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300 mb-3">
              <HelpCircle className="h-3.5 w-3.5 text-orange-400" />
              <span>Часто задаваемые вопросы</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Все, что нужно знать перед стартом
            </h3>
            <p className="text-zinc-400 mt-2 text-sm">
              Ответы на популярные вопросы студентов и начинающих Java-разработчиков
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-orange-500/40 bg-zinc-900/80 shadow-lg shadow-orange-950/10"
                      : "border-white/10 bg-zinc-900/40 hover:border-white/20 hover:bg-zinc-900/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left transition"
                  >
                    <span className="font-semibold text-sm sm:text-base text-zinc-100 pr-4">
                      {item.q}
                    </span>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border transition shrink-0 ${
                        isOpen
                          ? "border-orange-500/40 bg-orange-500/20 text-orange-300 rotate-180"
                          : "border-white/10 bg-white/5 text-zinc-400"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/15 via-zinc-900/80 to-zinc-950 p-8 sm:p-14 shadow-2xl shadow-orange-950/30">
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Готов начать путь в Java Backend?
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Прямо сейчас открой День 1, запусти свою первую программу со <code className="text-orange-300 font-mono">Scanner</code> и получи первые 25 XP.
            </p>

            <button
              type="button"
              onClick={() => handleCourseAction(1)}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/30 transition hover:brightness-110 active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Перейти к Дню 1 бесплатно</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#050507] py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-orange-400" />
            <span className="font-semibold text-zinc-300">JavaForge Bootcamp</span>
            <span>— интерактивная подготовка Java Junior</span>
          </div>
          <div>Разработано для студентов и начинающих backend-разработчиков © 2026</div>
        </div>
      </footer>
    </div>
  );
}
