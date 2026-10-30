export type PracticeDifficulty = "Лёгкий" | "Средний" | "Сложный";

export interface PracticeTheory {
  title: string;
  summary: string;
  keyPoints: string[];
  codeExample: string;
  pitfalls?: string[];
}

export interface PracticeTest {
  label: string;
  stdin?: string;
  expected: string[];
}

export interface PracticeRequirement {
  pattern: string;
  flags?: string;
  message: string;
}

export interface PracticeTask {
  id: string;
  moduleId: number;
  moduleName: string;
  topic: string;
  title: string;
  difficulty: PracticeDifficulty;
  xp: number;
  description: string;
  requirements?: string[];
  exampleInput?: string;
  exampleOutput?: string;
  starterCode: string;
  sampleInput?: string;
  theory: PracticeTheory;
  tests: PracticeTest[];
  requiredCode?: PracticeRequirement[];
  hints: string[];
}

export interface PracticeCategory {
  moduleId: number;
  moduleName: string;
  shortTitle: string;
  color: string;
  description: string;
  iconName?: string;
}

