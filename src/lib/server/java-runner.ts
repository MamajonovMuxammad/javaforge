import "server-only";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import type { RunResult } from "@/lib/run-types";

/**
 * Java execution service.
 *
 * Primary provider: Local Java (if installed on server/machine).
 * Falls back to Piston or Wandbox API when running in environments without local Java (e.g. serverless).
 *
 * Env:
 *   JAVA_RUNNER          auto | local | piston | wandbox   (default: auto)
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
/*  Local Java Runner (Ultra-fast & 100% reliable)                   */
/* ------------------------------------------------------------------ */

let localJavaAvailable: boolean | null = null;

async function checkLocalJava(): Promise<boolean> {
  if (localJavaAvailable !== null) return localJavaAvailable;
  return new Promise((resolve) => {
    try {
      const p = spawn("java", ["-version"], { windowsHide: true });
      p.on("error", () => {
        localJavaAvailable = false;
        resolve(false);
      });
      p.on("close", (code) => {
        localJavaAvailable = code === 0;
        resolve(localJavaAvailable);
      });
    } catch {
      localJavaAvailable = false;
      resolve(false);
    }
  });
}

async function runLocalJava(code: string, stdin = "", timeoutMs = 8_000): Promise<RunResult> {
  const started = Date.now();
  let tmpDir = "";
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "java_exec_"));
    const filePath = path.join(tmpDir, "Main.java");
    fs.writeFileSync(filePath, code, "utf8");
  } catch (err) {
    throw new ProviderError(`Не удалось создать временный файл: ${(err as Error).message}`);
  }

  return new Promise<RunResult>((resolve, reject) => {
    let child;
    try {
      child = spawn(
        "java",
        [
          "-Dfile.encoding=UTF-8",
          "-Dsun.stdout.encoding=UTF-8",
          "-Dsun.stderr.encoding=UTF-8",
          "Main.java",
        ],
        { cwd: tmpDir, windowsHide: true }
      );
    } catch (err) {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {}
      return reject(err);
    }

    let stdout = "";
    let stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      try {
        child.kill("SIGKILL");
      } catch {}
    }, timeoutMs);

    child.stdout.on("data", (d: Buffer) => {
      stdout += d.toString("utf8");
    });
    child.stderr.on("data", (d: Buffer) => {
      stderr += d.toString("utf8");
    });

    if (stdin) {
      try {
        child.stdin.write(stdin);
      } catch {}
    }
    try {
      child.stdin.end();
    } catch {}

    child.on("error", (err) => {
      clearTimeout(timer);
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {}
      reject(err);
    });

    child.on("close", (exitCode) => {
      clearTimeout(timer);
      const timeMs = Date.now() - started;
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {}

      if (killed) {
        return resolve({
          status: "timeout",
          stdout: truncate(stdout),
          stderr: "Превышено максимальное время выполнения программы (лимит 8 секунд)",
          compileOutput: "",
          exitCode: null,
          provider: "local",
          timeMs,
        });
      }

      const isCompileError =
        exitCode !== 0 && (stderr.includes("error:") || stderr.includes("compilation failed"));
      return resolve({
        status: isCompileError ? "compile_error" : exitCode === 0 ? "success" : "runtime_error",
        stdout: truncate(stdout),
        stderr: isCompileError ? "" : truncate(stderr),
        compileOutput: isCompileError ? truncate(stderr) : "",
        exitCode,
        provider: "local",
        timeMs,
      });
    });
  });
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

  // Infrastructure error: Wandbox container crashed or out of resources
  if (compilerError.includes("OCI runtime error") || compilerError.includes("Resource temporarily unavailable")) {
    throw new ProviderError(`Сервер Wandbox перегружен: ${compilerError.slice(0, 160)}`);
  }

  if (compilerError && exitCode !== 0 && !data.program_output) {
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
  const rawStderr = data.program_error || (exitCode !== 0 && compilerError ? compilerError : "");
  return {
    status: timedOut ? "timeout" : exitCode === 0 ? "success" : "runtime_error",
    stdout: cleanWandboxText(data.program_output),
    stderr: cleanWandboxText(rawStderr),
    compileOutput: "",
    exitCode,
    provider: "wandbox",
    timeMs,
  };
}

/* ------------------------------------------------------------------ */
/*  Paiza.IO (Fast, stable, free, requires no API key)                 */
/* ------------------------------------------------------------------ */

async function runPaiza(code: string, stdin = ""): Promise<RunResult> {
  const started = Date.now();
  let createRes: Response;
  try {
    const params = new URLSearchParams({
      source_code: code,
      language: "java",
      input: stdin,
      api_key: "guest",
    });
    createRes = await fetch("https://api.paiza.io/runners/create", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
  } catch (err) {
    throw new ProviderError(`Paiza unreachable: ${(err as Error).message}`);
  }

  if (!createRes.ok) {
    throw new ProviderError(`Paiza HTTP ${createRes.status}`, createRes.status);
  }

  const createData = (await createRes.json()) as { id?: string; error?: string };
  if (!createData.id) {
    throw new ProviderError(`Paiza error: ${createData.error || "no run id"}`);
  }

  const id = createData.id;
  // Poll until finished (typically takes 800 - 1500 ms)
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 600));
    let detailRes: Response;
    try {
      detailRes = await fetch(`https://api.paiza.io/runners/get_details?id=${id}&api_key=guest`, {
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });
    } catch {
      continue;
    }

    if (!detailRes.ok) continue;

    const details = (await detailRes.json()) as {
      status?: string;
      build_result?: string;
      build_stdout?: string;
      build_stderr?: string;
      result?: string;
      stdout?: string;
      stderr?: string;
      exit_code?: number;
    };

    if (details.status === "completed") {
      const timeMs = Date.now() - started;
      if (details.build_result === "failure") {
        return {
          status: "compile_error",
          stdout: "",
          stderr: "",
          compileOutput: truncate(details.build_stderr || details.build_stdout || "Ошибка компиляции javac"),
          exitCode: 1,
          provider: "paiza",
          timeMs,
        };
      }

      const isTimeout = details.result === "timeout";
      const isRuntimeError = details.result === "failure";

      return {
        status: isTimeout ? "timeout" : isRuntimeError ? "runtime_error" : "success",
        stdout: truncate(details.stdout ?? ""),
        stderr: truncate(details.stderr ?? ""),
        compileOutput: "",
        exitCode: details.exit_code ?? (isRuntimeError ? 1 : 0),
        provider: "paiza",
        timeMs,
      };
    }
  }

  throw new ProviderError("Paiza timeout polling details");
}

/* ------------------------------------------------------------------ */
/*  Public entry                                                       */
/* ------------------------------------------------------------------ */

export async function executeJava(code: string, stdin = ""): Promise<RunResult> {
  const mode = (process.env.JAVA_RUNNER ?? "auto").toLowerCase();

  if (mode === "local") return runLocalJava(code, stdin);
  if (mode === "paiza") return runPaiza(code, stdin);
  if (mode === "wandbox") return runWandbox(code, stdin);
  if (mode === "piston") return runPiston(code, stdin);

  // Auto mode:
  // 1. Try local Java first (super fast: ~300-600ms, 100% reliable)
  if (await checkLocalJava()) {
    try {
      return await runLocalJava(code, stdin);
    } catch (err) {
      console.warn(`[java-runner] Local runner failed, falling back to remote: ${(err as Error).message}`);
    }
  }

  // 2. Try Paiza.io (fast cloud execution, ~1 sec, no key needed, rock-solid on Vercel)
  try {
    return await runPaiza(code, stdin);
  } catch (err) {
    console.warn(`[java-runner] Paiza runner failed, falling back: ${(err as Error).message}`);
  }

  // 3. Try Piston if unblocked
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

  // 4. Fall back to Wandbox
  return runWandbox(code, stdin);
}
