import "server-only";
import type { RunResult } from "@/lib/run-types";

/**
 * Java execution service.
 *
 * Primary provider: Piston (`POST {PISTON_API_URL}/execute`).
 * Since 15.02.2026 the public emkc.org instance is whitelist-only, so we transparently
 * fall back to the free Wandbox API (OpenJDK 21) when Piston answers 401/403/429/5xx
 * or is unreachable. Self-host Piston and set PISTON_API_URL to make it primary again.
 *
 * Env:
 *   JAVA_RUNNER          auto | piston | wandbox   (default: auto)
 *   PISTON_API_URL       default https://emkc.org/api/v2/piston
 *   PISTON_API_KEY       optional Authorization header for whitelisted / private instances
 *   PISTON_JAVA_VERSION  default 15.0.2
 *   WANDBOX_COMPILER     default openjdk-jdk-21+35
 */

const PISTON_URL = (process.env.PISTON_API_URL ?? "https://emkc.org/api/v2/piston").replace(/\/+$/, "");
const PISTON_KEY = process.env.PISTON_API_KEY;
const PISTON_JAVA_VERSION = process.env.PISTON_JAVA_VERSION ?? "15.0.2";
const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const WANDBOX_COMPILER = process.env.WANDBOX_COMPILER ?? "openjdk-jdk-21+35";

const MAX_OUTPUT = 32_000;

class ProviderError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

/** Skip Piston for a while after it told us we are not allowed to use it. */
let pistonBlockedUntil = 0;

function truncate(text: string): string {
  if (!text) return "";
  return text.length > MAX_OUTPUT ? `${text.slice(0, MAX_OUTPUT)}\n… вывод обрезан (более ${MAX_OUTPUT} символов)` : text;
}

/* ------------------------------------------------------------------ */
/*  Piston                                                             */
/* ------------------------------------------------------------------ */

interface PistonStage {
  stdout?: string;
  stderr?: string;
  output?: string;
  code?: number | null;
  signal?: string | null;
}

async function runPiston(code: string, stdin: string): Promise<RunResult> {
  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(PISTON_KEY ? { Authorization: PISTON_KEY } : {}),
      },
      body: JSON.stringify({
        language: "java",
        version: PISTON_JAVA_VERSION,
        files: [{ name: "Main.java", content: code }],
        stdin,
        compile_timeout: 10_000,
        run_timeout: 5_000,
      }),
      signal: AbortSignal.timeout(25_000),
      cache: "no-store",
    });
  } catch (err) {
    throw new ProviderError(`Piston unreachable: ${(err as Error).message}`);
  }

  if (!res.ok) {
    throw new ProviderError(`Piston HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`, res.status);
  }

  const data = (await res.json()) as { compile?: PistonStage; run?: PistonStage; message?: string };
  if (!data.run && data.message) throw new ProviderError(`Piston: ${data.message}`);

  const timeMs = Date.now() - started;
  const compile = data.compile;
  if (compile && compile.code !== 0 && compile.code !== undefined && compile.code !== null) {
    return {
      status: "compile_error",
      stdout: "",
      stderr: "",
      compileOutput: truncate(compile.stderr || compile.output || compile.stdout || "Ошибка компиляции"),
      exitCode: compile.code,
      provider: "piston",
      timeMs,
    };
  }

  const run = data.run ?? {};
  const killed = run.signal === "SIGKILL";
  return {
    status: killed ? "timeout" : run.code === 0 ? "success" : "runtime_error",
    stdout: truncate(run.stdout ?? ""),
    stderr: truncate(run.stderr ?? ""),
    compileOutput: "",
    exitCode: run.code ?? null,
    provider: "piston",
    timeMs,
  };
}

/* ------------------------------------------------------------------ */
/*  Wandbox                                                            */
/* ------------------------------------------------------------------ */

/**
 * Wandbox compiles the source as `prog.java`, so a `public class Main` would not compile,
 * and its JVM writes stdout in ASCII (Cyrillic → "?"). We therefore drop the `public`
 * modifier and inject a one-line static initializer that switches System.out/err to UTF-8.
 * Everything is kept on the same line, so compiler/stack-trace line numbers stay correct.
 */
const UTF8_INIT =
  'static{try{System.setOut(new java.io.PrintStream(new java.io.FileOutputStream(java.io.FileDescriptor.out),true,"UTF-8"));' +
  'System.setErr(new java.io.PrintStream(new java.io.FileOutputStream(java.io.FileDescriptor.err),true,"UTF-8"));}' +
  "catch(java.io.UnsupportedEncodingException e){}}";

function prepareForWandbox(code: string): string {
  const publicMain = /\bpublic\s+((?:(?:final|abstract|strictfp)\s+)*)class\s+Main\b([^{]*)\{/;
  if (publicMain.test(code)) {
    return code.replace(publicMain, (_m, mods: string, rest: string) => `${mods}class Main${rest}{${UTF8_INIT}`);
  }
  const anyMain = /\bclass\s+Main\b([^{]*)\{/;
  if (anyMain.test(code)) {
    return code.replace(anyMain, (_m, rest: string) => `class Main${rest}{${UTF8_INIT}`);
  }
  return code;
}

function cleanWandboxText(text: string | undefined): string {
  if (!text) return "";
  return truncate(text.split(UTF8_INIT).join("").replace(/prog\.java/g, "Main.java"));
}

interface WandboxResponse {
  status?: string;
  signal?: string;
  compiler_error?: string;
  compiler_output?: string;
  program_output?: string;
  program_error?: string;
}

async function runWandbox(code: string, stdin: string): Promise<RunResult> {
  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(WANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: WANDBOX_COMPILER,
        code: prepareForWandbox(code),
        stdin,
        "compiler-option-raw": "-encoding\nUTF-8",
        save: false,
      }),
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });
  } catch (err) {
    throw new ProviderError(`Wandbox unreachable: ${(err as Error).message}`);
  }
  if (!res.ok) {
    throw new ProviderError(`Wandbox HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`, res.status);
  }

  const data = (await res.json()) as WandboxResponse;
  const timeMs = Date.now() - started;
  const exitCode = data.status !== undefined && data.status !== "" ? Number(data.status) : null;
  const compilerError = data.compiler_error ?? "";

  if (/: error:/.test(compilerError) && !data.program_output) {
    return {
      status: "compile_error",
      stdout: "",
      stderr: "",
      compileOutput: cleanWandboxText(compilerError),
      exitCode,
      provider: "wandbox",
      timeMs,
    };
  }

  const signal = (data.signal ?? "").toLowerCase();
  const timedOut = signal.includes("kill") || signal.includes("xcpu") || exitCode === 137;
  return {
    status: timedOut ? "timeout" : exitCode === 0 ? "success" : "runtime_error",
    stdout: cleanWandboxText(data.program_output),
    stderr: cleanWandboxText(data.program_error),
    compileOutput: "",
    exitCode,
    provider: "wandbox",
    timeMs,
  };
}

/* ------------------------------------------------------------------ */
/*  Public entry                                                       */
/* ------------------------------------------------------------------ */

export async function executeJava(code: string, stdin = ""): Promise<RunResult> {
  const mode = (process.env.JAVA_RUNNER ?? "auto").toLowerCase();

  if (mode === "wandbox") return runWandbox(code, stdin);
  if (mode === "piston") return runPiston(code, stdin);

  if (Date.now() >= pistonBlockedUntil) {
    try {
      return await runPiston(code, stdin);
    } catch (err) {
      const status = err instanceof ProviderError ? err.status : undefined;
      // 401/403 → not whitelisted: don't retry for 6h. Rate limit / outage → 2 min.
      const backoff = status === 401 || status === 403 ? 6 * 60 * 60 * 1000 : 2 * 60 * 1000;
      pistonBlockedUntil = Date.now() + backoff;
      console.warn(`[java-runner] Piston unavailable, falling back to Wandbox: ${(err as Error).message}`);
    }
  }
  return runWandbox(code, stdin);
}
