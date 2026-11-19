import { CORE_AND_OOP_QUESTIONS } from "./questions-core-oop";
import { ADVANCED_QUESTIONS } from "./questions-advanced";
import type {
  QuizCategory,
  QuizCategoryFilter,
  QuizCategoryMeta,
  QuizDifficultyFilter,
  QuizMode,
  QuizQuestion,
  QuizServerStats,
} from "./types";

export * from "./types";

export const QUIZ_XP_PER_MASTERED_QUESTION = 15;

export const QUIZ_CATEGORIES: QuizCategoryMeta[] = [
  {
    id: "core",
    title: "Java Core & Синтаксис",
    shortTitle: "Core Java",
    description: "Примитивы, кастинг, String, циклы, массивы, перегрузка, память Stack и рекурсия.",
    color: "#fb923c",
    daysRange: "Дни 1–25",
  },
  {
    id: "oop",
    title: "ООП & Память JVM",
    shortTitle: "ООП & JVM",
    description: "Конструкторы, static/final, полиморфизм, интерфейсы, equals/hashCode и исключения.",
    color: "#a78bfa",
    daysRange: "Дни 26–39",
  },
  {
    id: "collections",
    title: "Коллекции & Stream API",
    shortTitle: "Collections & Streams",
    description: "Generics & PECS, ArrayList vs LinkedList, HashMap изнутри, Iterator, Lambdas и Optional.",
    color: "#38bdf8",
    daysRange: "Дни 40–53",
  },
  {
    id: "sql",
    title: "SQL, Базы данных & Git",
    shortTitle: "SQL & Git",
    description: "JOIN, GROUP BY/HAVING, B-Tree индексы, ACID, изоляция транзакций, JDBC, Flyway и Git.",
    color: "#34d399",
    daysRange: "Дни 54–68",
  },
  {
    id: "spring",
    title: "Spring Boot, REST & Docker",
    shortTitle: "Spring & Docker",
    description: "REST API, IoC/DI, Bean Scopes, DTO, Hibernate N+1, @Transactional, JWT и Docker.",
    color: "#f472b6",
    daysRange: "Дни 69–83",
  },
];

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  ...CORE_AND_OOP_QUESTIONS,
  ...ADVANCED_QUESTIONS,
];

const QUESTION_MAP = new Map<string, QuizQuestion>(
  ALL_QUIZ_QUESTIONS.map((q) => [q.id, q])
);

export function getQuizQuestionById(id: string): QuizQuestion | undefined {
  return QUESTION_MAP.get(id);
}

export function createEmptyQuizServerStats(): QuizServerStats {
  return {
    totalQuizzes: 0,
    studyQuizzes: 0,
    timedQuizzes: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    bestTimedAccuracy: 0,
    totalTimeSpentSec: 0,
    earnedQuizXp: 0,
    masteredQuestionIds: [],
    wrongQuestionIds: [],
    topicStats: {
      core: { answered: 0, correct: 0 },
      oop: { answered: 0, correct: 0 },
      collections: { answered: 0, correct: 0 },
      sql: { answered: 0, correct: 0 },
      spring: { answered: 0, correct: 0 },
    },
    history: [],
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildQuizDeck(opts: {
  difficulty: QuizDifficultyFilter;
  category: QuizCategoryFilter;
  count: number;
  mode: QuizMode;
  wrongQuestionIds?: string[];
}): QuizQuestion[] {
  let pool = ALL_QUIZ_QUESTIONS;

  if (opts.mode === "mistakes") {
    const wrongSet = new Set(opts.wrongQuestionIds ?? []);
    pool = ALL_QUIZ_QUESTIONS.filter((q) => wrongSet.has(q.id));
  }

  if (opts.category !== "all") {
    pool = pool.filter((q) => q.category === opts.category);
  }

  if (opts.difficulty !== "all") {
    pool = pool.filter((q) => q.difficulty === opts.difficulty);
  }

  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(opts.count, shuffled.length));
}

export function getCategoryMeta(cat: QuizCategory): QuizCategoryMeta {
  return QUIZ_CATEGORIES.find((c) => c.id === cat) ?? QUIZ_CATEGORIES[0];
}
