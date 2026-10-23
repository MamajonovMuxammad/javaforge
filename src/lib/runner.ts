import type { Lesson, LessonTask, TestCase, CodeRequirement } from "@/data/types";
import type { RunErrorResponse, RunResult } from "@/lib/run-types";

/** Calls our own API route which proxies to Piston / Wandbox. */
export async function runJava(code: string, stdin = ""): Promise<RunResult> {
  let res: Response;
  try {
    res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, stdin }),
    });
  } catch {
    throw new Error("Нет соединения с сервером. Проверь интернет.");
  }
  const data = (await res.json().catch(() => null)) as RunResult | RunErrorResponse | null;
  if (!res.ok || !data || "error" in data) {
    throw new Error(data && "error" in data ? data.error : `Ошибка сервера (${res.status})`);
  }
  return data;
}

/* ------------------------------------------------------------------ */
/*  Checking                                                           */
/* ------------------------------------------------------------------ */

/** Lenient comparison: trims lines, collapses spaces, adds space after comma if missing, treats «ё» as «е». */
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([!?:.,])/g, "$1")
    .replace(/,([^\s\d])/g, ", $1")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/ё/g, "е")
    .replace(/Ё/g, "Е");
}

/** Strips interactive Scanner prompts like "Введите число:", "Enter name:", etc. so they don't break evaluation */
export function stripPrompts(stdout: string): string {
  return stdout
    .split("\n")
    .map((line) =>
      line.replace(
        /(?:^|\b)(?:введите|enter|input|укажите|введи|напишите|дайте|скажите|число)[^:\n]*[:?]?\s*/gi,
        ""
      )
    )
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

/** Comprehensive normalization for fuzzy/tolerant comparison */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ё/g, "е")
    .replace(/[«»“”]/g, '"')
    .replace(/\s*[:=\-—–]\s*/g, ": ")
    .replace(/,([^\s\d])/g, ", $1")
    .split("\n")
    .map((line) => line.trim().replace(/[!?.]$/, ""))
    .join("\n");
}

export function matchesSingleExpected(expected: string, stdout: string): boolean {
  const normExp = normalizeText(expected);
  const normAct = normalizeText(stdout);
  const strippedAct = normalizeText(stripPrompts(stdout));

  // 1. Direct includes in raw or stripped
  if (normAct.includes(normExp) || strippedAct.includes(normExp)) {
    return true;
  }

  // 2. Float dot vs comma (e.g. 2.5 vs 2,5)
  const expComma = normExp.replace(/(\d+)\.(\d+)/g, "$1,$2");
  const expDot = normExp.replace(/(\d+),(\d+)/g, "$1.$2");
  if (
    normAct.includes(expComma) ||
    normAct.includes(expDot) ||
    strippedAct.includes(expComma) ||
    strippedAct.includes(expDot)
  ) {
    return true;
  }

  // 3. Float .0 vs integer (e.g. 150.0 vs 150)
  const expNoZero = normExp.replace(/(\d+)\.0\b/g, "$1");
  if (normAct.includes(expNoZero) || strippedAct.includes(expNoZero)) {
    return true;
  }
  const expWithZero = normExp.replace(/\b(\d+)\b(?![\.\,\d])/g, "$1.0");
  if (normAct.includes(expWithZero) || strippedAct.includes(expWithZero)) {
    return true;
  }

  // 4. Labeled match: 'label: value' (e.g. "Студент: Иван", "Скидка: 150", "Допуск: true")
  const colonIdx = normExp.indexOf(":");
  if (colonIdx > 0) {
    const label = normExp.slice(0, colonIdx).trim();
    const value = normExp.slice(colonIdx + 1).trim();
    const allLines = (normAct + "\n" + strippedAct).split("\n");
    for (const line of allLines) {
      if (line.includes(label)) {
        if (line.includes(value)) return true;
        const valNoZero = value.replace(/(\d+)\.0\b/g, "$1");
        if (line.includes(valNoZero)) return true;
        const valComma = value.replace(/(\d+)\.(\d+)/g, "$1,$2");
        if (line.includes(valComma)) return true;
        if (value === "true" && (line.includes("да") || line.includes("true"))) return true;
        if (value === "false" && (line.includes("нет") || line.includes("false"))) return true;
      }
    }
  }

  // 5. Without separators (punctuation-free match)
  const stripPunct = (s: string) => s.replace(/[:=\-—–]/g, " ").replace(/\s+/g, " ").trim();
  if (
    stripPunct(normAct).includes(stripPunct(normExp)) ||
    stripPunct(strippedAct).includes(stripPunct(normExp))
  ) {
    return true;
  }

  return false;
}

export interface TestOutcome {
  test: TestCase;
  passed: boolean;
  missing: string[];
  result?: RunResult;
  error?: string;
}

export interface CheckOutcome {
  passed: boolean;
  requirementErrors: string[];
  tests: TestOutcome[];
}

/** Strips // and /* *\/ comments so requirements can't be satisfied by a comment. */
export function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

export function checkRequirements(task: { requiredCode?: CodeRequirement[] }, code: string): string[] {
  const source = stripComments(code);
  return (task.requiredCode ?? [])
    .filter((req) => !new RegExp(req.pattern, req.flags).test(source))
    .map((req) => req.message);
}

export function evaluateOutput(test: TestCase, stdout: string): string[] {
  return test.expected.filter((exp) => {
    // If expected item has '|', treat as alternative acceptable outputs
    const options = exp.split("|").map((opt) => opt.trim());
    return !options.some((opt) => matchesSingleExpected(opt, stdout));
  });
}

export async function checkTaskSolution(task: { tests: TestCase[]; requiredCode?: CodeRequirement[] }, code: string): Promise<CheckOutcome> {
  const requirementErrors = checkRequirements(task, code);

  const tests = await Promise.all(
    task.tests.map(async (test): Promise<TestOutcome> => {
      try {
        const result = await runJava(code, test.stdin ?? "");
        if (result.status !== "success") {
          return { test, passed: false, missing: test.expected, result };
        }
        const missing = evaluateOutput(test, result.stdout);
        return { test, passed: missing.length === 0, missing, result };
      } catch (err) {
        return { test, passed: false, missing: test.expected, error: (err as Error).message };
      }
    }),
  );

  return {
    passed: requirementErrors.length === 0 && tests.every((t) => t.passed),
    requirementErrors,
    tests,
  };
}

/** Backwards-compatible checkSolution for lessons or tasks */
export async function checkSolution(target: Lesson | LessonTask, code: string): Promise<CheckOutcome> {
  const tests = target.tests ?? (target as Lesson).task?.tests ?? [];
  const requiredCode = target.requiredCode ?? (target as Lesson).task?.requiredCode;
  return checkTaskSolution({ tests, requiredCode }, code);
}

export function usesScanner(code: string): boolean {
  return /new\s+Scanner\s*\(/.test(stripComments(code));
}
