import { executeJava } from "@/lib/server/java-runner";
import { MAX_CODE_LENGTH, MAX_STDIN_LENGTH, type RunErrorResponse, type RunRequest, type RunResult } from "@/lib/run-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function error(message: string, status: number) {
  return Response.json({ error: message } satisfies RunErrorResponse, { status });
}

export async function POST(request: Request) {
  let body: Partial<RunRequest>;
  try {
    body = (await request.json()) as Partial<RunRequest>;
  } catch {
    return error("Некорректный JSON в запросе", 400);
  }

  const code = typeof body.code === "string" ? body.code : "";
  const stdin = typeof body.stdin === "string" ? body.stdin : "";

  if (!code.trim()) return error("Код пустой — напиши хотя бы одну строку", 400);
  if (code.length > MAX_CODE_LENGTH) return error("Слишком длинный код (лимит 64 КБ)", 413);
  if (stdin.length > MAX_STDIN_LENGTH) return error("Слишком длинный stdin (лимит 16 КБ)", 413);

  try {
    const result: RunResult = await executeJava(code, stdin);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[api/run]", err);
    return error("Сервис компиляции временно недоступен. Попробуй ещё раз через минуту.", 502);
  }
}
