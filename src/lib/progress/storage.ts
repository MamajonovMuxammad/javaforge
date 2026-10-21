import { createDefaultProgress, type ProgressState } from "./types";

/**
 * Persistence adapter. Swap `localStorageAdapter` for a Supabase-backed implementation
 * (same interface) to sync progress across devices — the store doesn't care where data lives.
 */
export interface ProgressStorage {
  load(): ProgressState | null;
  save(state: ProgressState): void;
  clear(): void;
  /** Subscribe to external changes (other tabs, realtime channel…). Returns unsubscribe. */
  watch?(onChange: () => void): () => void;
}

export const STORAGE_KEY = "javaforge:progress:v1";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Defensive merge so a corrupted or older payload never crashes the app. */
export function migrate(raw: unknown): ProgressState {
  const base = createDefaultProgress();
  if (!isRecord(raw)) return base;

  const numArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is number => typeof x === "number") : []);
  const strRec = (v: unknown) =>
    isRecord(v) ? Object.fromEntries(Object.entries(v).filter(([, val]) => typeof val === "string")) as Record<string, string> : {};
  const strArrRec = (v: unknown) =>
    isRecord(v)
      ? (Object.fromEntries(
          Object.entries(v)
            .filter(([, val]) => Array.isArray(val))
            .map(([k, val]) => [k, (val as unknown[]).filter((x): x is string => typeof x === "string")])
        ) as Record<string, string[]>)
      : {};

  const streak = isRecord(raw.streak) ? raw.streak : {};
  const stats = isRecord(raw.stats) ? raw.stats : {};

  return {
    version: 1,
    xp: typeof raw.xp === "number" && raw.xp >= 0 ? raw.xp : 0,
    completedDays: Array.from(new Set(numArr(raw.completedDays))).sort((a, b) => a - b),
    completedAt: strRec(raw.completedAt),
    completedTasks: strArrRec(raw.completedTasks),
    code: strRec(raw.code),
    achievements: strRec(raw.achievements),
    streak: {
      current: typeof streak.current === "number" ? streak.current : 0,
      best: typeof streak.best === "number" ? streak.best : 0,
      lastActiveDate: typeof streak.lastActiveDate === "string" ? streak.lastActiveDate : null,
    },
    stats: {
      runs: typeof stats.runs === "number" ? stats.runs : 0,
      compileErrors: typeof stats.compileErrors === "number" ? stats.compileErrors : 0,
      checks: typeof stats.checks === "number" ? stats.checks : 0,
      scannerDays: numArr(stats.scannerDays),
    },
  };
}

export const localStorageAdapter: ProgressStorage = {
  load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? migrate(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },
  save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota exceeded / private mode — ignore, progress stays in memory */
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
  watch(onChange) {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) onChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};
