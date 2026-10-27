/** Shared request/response contract between the browser and `/api/run`. */

export interface RunRequest {
  code: string;
  stdin?: string;
}

export type RunStatus = "success" | "compile_error" | "runtime_error" | "timeout";

export interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number | null;
  provider: "local" | "paiza" | "piston" | "wandbox";
  timeMs: number;
}

export interface RunErrorResponse {
  error: string;
}

export const MAX_CODE_LENGTH = 64_000;
export const MAX_STDIN_LENGTH = 16_000;
