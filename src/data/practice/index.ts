import { module1PracticeTasks } from "./module1";
import { module2PracticeTasks } from "./module2";
import { module3PracticeTasks } from "./module3";
import { module4PracticeTasks } from "./module4";
import { module5PracticeTasks } from "./module5";
import { module6PracticeTasks } from "./module6";
import { module7PracticeTasks } from "./module7";
import type { PracticeTask, PracticeCategory } from "./types";

export * from "./types";

export const ALL_PRACTICE_TASKS: PracticeTask[] = [
  ...module1PracticeTasks,
  ...module2PracticeTasks,
  ...module3PracticeTasks,
  ...module4PracticeTasks,
  ...module5PracticeTasks,
  ...module6PracticeTasks,
  ...module7PracticeTasks,
];

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    moduleId: 1,
    moduleName: "Модуль 1: Базовый синтаксис и переменные",
    shortTitle: "Синтаксис и типы",
    color: "#fb923c",
    description: "Примитивные типы, кастинг, Scanner, побитовые операции, денежные и геометрические расчеты.",
    iconName: "Binary",
  },
  {
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    shortTitle: "Строки и Условия",
    color: "#f59e0b",
    description: "String API, регулярные подстроки, палиндромы, валидация паролей, налоги и жадные алгоритмы.",
    iconName: "Split",
  },
  {
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    shortTitle: "Циклы и Массивы",
    color: "#10b981",
    description: "Два указателя, in-place реверс, удаление дубликатов, матрицы NxM, след и диагонали, префиксные суммы.",
    iconName: "Repeat",
  },
  {
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    shortTitle: "Методы и Рекурсия",
    color: "#06b6d4",
    description: "Перегрузка методов, рекурсивные алгоритмы, бинарный поиск, сжатие RLE, чистые функции и статистика.",
    iconName: "Cpu",
  },
  {
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    shortTitle: "ООП",
    color: "#a78bfa",
    description: "Инкапсуляция, static генераторы ID, наследование, полиморфизм интерфейсов, кастомные исключения и equals.",
    iconName: "Boxes",
  },
  {
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    shortTitle: "Коллекции & Streams",
    color: "#38bdf8",
    description: "ArrayList removeIf, HashSet, частотные словари на HashMap, Stream filter, sorted, groupingBy и summaryStats.",
    iconName: "Layers",
  },
  {
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    shortTitle: "Backend & Алгоритмы",
    color: "#34d399",
    description: "Парсеры логов NGINX, LRU-кэш на LinkedHashMap, HTTP роутер, валидация DTO, Rate Limiter и Two Sum.",
    iconName: "Server",
  },
];

export function getAllPracticeTasks(): PracticeTask[] {
  return ALL_PRACTICE_TASKS;
}

export function getPracticeTaskById(id: string): PracticeTask | undefined {
  return ALL_PRACTICE_TASKS.find((t) => t.id === id);
}

export function getPracticeTasksByModule(moduleId: number): PracticeTask[] {
  return ALL_PRACTICE_TASKS.filter((t) => t.moduleId === moduleId);
}

export function getTotalPracticeXp(): number {
  return ALL_PRACTICE_TASKS.reduce((acc, t) => acc + t.xp, 0);
}

