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
  const out = normalizeOutput(stdout);
  return test.expected.filter((exp) => {
    // If expected item has '|', treat as alternative acceptable outputs
    if (exp.includes("|")) {
      const options = exp.split("|").map((opt) => normalizeOutput(opt.trim()));
      return !options.some((opt) => out.includes(opt));
    }
    return !out.includes(normalizeOutput(exp));
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
