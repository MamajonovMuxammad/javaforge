import type { ProgressState } from "./types";

export type AchievementIcon = "rocket" | "bug" | "party" | "keyboard" | "blocks" | "crown" | "flame" | "fire" | "terminal" | "gem";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: AchievementIcon;
  check: (s: ProgressState) => boolean;
}

const hasDays = (s: ProgressState, from: number, to: number) => {
  const done = new Set(s.completedDays);
  for (let d = from; d <= to; d++) if (!done.has(d)) return false;
  return true;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_run",
    title: "Первый запуск",
    description: "Запусти свой первый код в песочнице.",
    xp: 10,
    icon: "rocket",
    check: (s) => s.stats.runs >= 1,
  },
  {
    id: "first_bug",
    title: "Первый баг",
    description: "Получи первую ошибку компиляции. Это нормально — через это проходят все!",
    xp: 10,
    icon: "bug",
    check: (s) => s.stats.compileErrors >= 1,
  },
  {
    id: "first_task",
    title: "Hello, World!",
    description: "Успешно сдай первое задание.",
    xp: 25,
    icon: "party",
    check: (s) => s.completedDays.length >= 1,
  },
  {
    id: "scanner_master",
    title: "Повелитель Scanner",
    description: "Сдай 3 задания, в которых используется Scanner.",
    xp: 50,
    icon: "keyboard",
    check: (s) => s.stats.scannerDays.length >= 3,
  },
  {
    id: "module_1",
    title: "Фундамент заложен",
    description: "Заверши Модуль 1: базовый синтаксис.",
    xp: 100,
    icon: "blocks",
    check: (s) => hasDays(s, 1, 7),
  },
  {
    id: "oop_master",
    title: "ООП-Мастер",
    description: "Заверши Модуль 2: объектно-ориентированное программирование.",
    xp: 150,
    icon: "crown",
    check: (s) => hasDays(s, 8, 21),
  },
  {
    id: "streak_3",
    title: "В ритме",
    description: "Учись 3 дня подряд.",
    xp: 30,
    icon: "flame",
    check: (s) => s.streak.best >= 3,
  },
  {
    id: "streak_7",
    title: "Стрик 7 дней",
    description: "Учись 7 дней подряд без пропусков.",
    xp: 100,
    icon: "fire",
    check: (s) => s.streak.best >= 7,
  },
  {
    id: "runs_25",
    title: "Отладчик",
    description: "Запусти код 25 раз. Практика делает мастера.",
    xp: 30,
    icon: "terminal",
    check: (s) => s.stats.runs >= 25,
  },
  {
    id: "xp_1000",
    title: "Тысячник",
    description: "Набери 1000 XP.",
    xp: 0,
    icon: "gem",
    check: (s) => s.xp >= 1000,
  },
];

export const achievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id);

/* ------------------------------------------------------------------ */
/*  Levels                                                             */
/* ------------------------------------------------------------------ */

const LEVEL_TITLES = ["Новичок", "Стажёр", "Trainee", "Кодер", "Разработчик", "Junior-кандидат", "Junior", "Junior+"];
export const XP_PER_LEVEL = 250;

export function levelInfo(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const into = xp % XP_PER_LEVEL;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    into,
    progress: into / XP_PER_LEVEL,
    toNext: XP_PER_LEVEL - into,
  };
}
