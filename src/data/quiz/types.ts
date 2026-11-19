export type QuizDifficulty = "Лёгкий" | "Средний" | "Сложный";
export type QuizDifficultyFilter = "all" | QuizDifficulty;

export type QuizCategory = "core" | "oop" | "collections" | "sql" | "spring";
export type QuizCategoryFilter = "all" | QuizCategory;

export type QuizMode = "study" | "timed" | "mistakes";

export interface QuizStudyLink {
  title: string;
  url: string;
  type: "lesson" | "practice" | "docs";
  day?: number;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  xp: number; // 10 for Лёгкий, 15 for Средний, 25 for Сложный
  timeLimitSec: number; // 30 for Лёгкий, 45 for Средний, 60 for Сложный
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  theoryHint: string;
  relatedLinks: QuizStudyLink[];
}

export interface QuizCategoryMeta {
  id: QuizCategory;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  daysRange: string;
}

export interface QuizAttemptRecord {
  id: string;
  mode: QuizMode;
  difficulty: QuizDifficultyFilter;
  category: QuizCategoryFilter;
  score: number;
  total: number;
  accuracy: number;
  durationSec: number;
  xpEarned: number;
  createdAt: string;
}

export interface QuizTopicStat {
  answered: number;
  correct: number;
}

export interface QuizServerStats {
  totalQuizzes: number;
  studyQuizzes: number;
  timedQuizzes: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestTimedAccuracy: number;
  totalTimeSpentSec: number;
  earnedQuizXp: number;
  masteredQuestionIds: string[];
  wrongQuestionIds: string[];
  topicStats: Record<QuizCategory, QuizTopicStat>;
  history: QuizAttemptRecord[];
}
