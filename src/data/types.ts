/**
 * Domain types for the JavaForge curriculum.
 * Every day includes rich theory, video search references, and minimum 3 tasks:
 * 1. Warmup (Разминка)
 * 2. Practice (Основная практика)
 * 3. Homework (Домашнее задание / Челлендж)
 */

export type Difficulty = "Лёгкий" | "Средний" | "Сложный";
export type TaskType = "warmup" | "practice" | "homework";

export type TheoryBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "code"; code: string; caption?: string; lang?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "callout";
      variant: "analogy" | "tip" | "warning" | "info";
      title: string;
      text: string;
    }
  | { type: "table"; head: string[]; rows: string[][] };

export interface VideoRef {
  author: "Алишев" | "Заур Трегулов" | string;
  /** Exact YouTube search query */
  query: string;
  note?: string;
}

export type ResourceKind = "docs" | "article" | "book" | "practice" | "tool" | "video";

/** External material for self-study (documentation, articles, books, trainers). */
export interface Resource {
  kind: ResourceKind;
  title: string;
  /** Books may have no URL */
  url?: string;
  note?: string;
  lang?: "ru" | "en";
}

/** Typical Junior interview question with a short model answer. */
export interface InterviewQA {
  q: string;
  a: string;
}

/** Extra content merged into a lesson from src/data/extras. */
export interface LessonExtras {
  /** Deeper theory shown after the main theory (or as main theory for outline days) */
  deepDive: TheoryBlock[];
  interview?: InterviewQA[];
  /** Topics / mini-assignments to explore on your own */
  selfStudy?: string[];
  resources?: Resource[];
}

export interface TestCase {
  label: string;
  /** Data passed to System.in */
  stdin?: string;
  /** Every string must be present in stdout (whitespace-normalised) */
  expected: string[];
}

export interface CodeRequirement {
  /** RegExp source checked against the user's code */
  pattern: string;
  flags?: string;
  message: string;
}

export interface LessonTask {
  id: string;
  type: TaskType;
  title: string;
  shortDesc: string;
  difficulty: Difficulty;
  xp: number;
  description: string;
  requirements?: string[];
  exampleInput?: string;
  exampleOutput?: string;
  starterCode: string;
  sampleInput?: string;
  tests: TestCase[];
  requiredCode?: CodeRequirement[];
  hints: string[];
  solution?: string;
}

export interface Lesson {
  day: number;
  moduleId: number;
  title: string;
  /** One-line summary for the sidebar / cards */
  short: string;
  difficulty: Difficulty;
  duration: string;
  xp: number;
  topics: string[];
  videos: VideoRef[];
  /** `false` → outline-only lesson */
  ready: boolean;
  theory: TheoryBlock[];
  tasks: LessonTask[];

  // Enrichment (see src/data/extras)
  deepDive?: TheoryBlock[];
  interview?: InterviewQA[];
  selfStudy?: string[];
  resources?: Resource[];

  // Backwards compatibility / convenience helpers
  task?: LessonTask;
  starterCode?: string;
  sampleInput?: string;
  tests?: TestCase[];
  requiredCode?: CodeRequirement[];
  hints?: string[];
  solution?: string;
}

export interface Module {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  fromDay: number;
  toDay: number;
  color: string;
}
