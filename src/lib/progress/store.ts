"use client";

import { useSyncExternalStore } from "react";
import { XP_PER_DAY } from "@/data/curriculum";
import { ACHIEVEMENTS, type AchievementDef } from "./achievements";
import { localStorageAdapter, type ProgressStorage } from "./storage";
import { createDefaultProgress, type DayStatus, type ProgressState } from "./types";

/* ------------------------------------------------------------------ */
/*  Tiny external store (works with React 19 useSyncExternalStore)     */
/* ------------------------------------------------------------------ */

const storage: ProgressStorage = localStorageAdapter;
const SERVER_SNAPSHOT: ProgressState = createDefaultProgress();

let state: ProgressState = SERVER_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  state = storage.load() ?? createDefaultProgress();
  loaded = true;
}

function emit() {
  listeners.forEach((l) => l());
}

let isHydrating = false;

/**
 * Hydrates progress directly from the backend database (Supabase PostgreSQL).
 * Automatically updates in-memory state and local storage cache.
 */
export async function hydrateFromServer(force = false): Promise<ProgressState | null> {
  if (typeof window === "undefined" || (isHydrating && !force)) return null;
  isHydrating = true;
  try {
    const res = await fetch("/api/progress", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.progress) {
        const serverProgress = data.progress as ProgressState;
        state = serverProgress;
        loaded = true;
        storage.save(serverProgress);
        emit();
        return serverProgress;
      }
    }
  } catch (err) {
    console.warn("[Database] Failed to hydrate progress from server:", err);
  } finally {
    isHydrating = false;
  }
  return null;
}

let syncTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Flushes any pending progress updates to the server immediately (e.g. before page unload).
 */
export function flushSync(): void {
  if (typeof window === "undefined") return;
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }
  if (state) {
    try {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }
}

function syncToServer(nextState: ProgressState) {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.progress && Array.isArray(data.progress.completedDays)) {
          // If server merged state with previously completed days or tasks
          const serverDays = data.progress.completedDays.length;
          const currentDays = nextState.completedDays.length;
          if (serverDays >= currentDays || (data.progress.xp && data.progress.xp >= nextState.xp)) {
            state = data.progress;
            storage.save(data.progress);
            emit();
          }
        }
      }
    } catch {
      // Offline: progress is safely preserved in localStorage
    }
  }, 400); // Fast 400ms debounce for immediate database persistence
}

function commit(next: ProgressState) {
  state = next;
  storage.save(next);
  syncToServer(next);
  emit();
}

export function resetStoreForLogout(): void {
  const empty = createDefaultProgress();
  state = empty;
  storage.clear();
  emit();
}

// Lifecycle listeners for seamless multi-device / multi-tab syncing
if (typeof window !== "undefined") {
  // 1. Initial hydration from database on startup
  setTimeout(() => hydrateFromServer(), 10);

  // 2. Re-hydrate from database when user returns to tab (switched from another browser/tab)
  window.addEventListener("focus", () => {
    hydrateFromServer();
  });

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushSync();
    } else if (document.visibilityState === "visible") {
      hydrateFromServer();
    }
  });

  window.addEventListener("beforeunload", () => {
    flushSync();
  });
}

let unwatchStorage: (() => void) | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && storage.watch) {
    // Sync progress between browser tabs.
    unwatchStorage = storage.watch(() => {
      state = storage.load() ?? createDefaultProgress();
      emit();
    });
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      unwatchStorage?.();
      unwatchStorage = undefined;
    }
  };
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function getProgress(): ProgressState {
  return getSnapshot();
}

/** Reactive progress state. Renders defaults on the server, real data after hydration. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};
/** `true` only on the client after hydration — use to avoid flashing default values. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/*  Dates & streak                                                     */
/* ------------------------------------------------------------------ */

export function dateKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function yesterdayKey(d = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return dateKey(y);
}

function touchStreak(s: ProgressState): ProgressState["streak"] {
  const today = dateKey();
  const { lastActiveDate, current, best } = s.streak;
  if (lastActiveDate === today) return s.streak;
  const next = lastActiveDate === yesterdayKey() ? current + 1 : 1;
  return { current: next, best: Math.max(best, next), lastActiveDate: today };
}

/** Streak shown in UI: resets to 0 if the learner skipped a whole day. */
export function displayStreak(s: ProgressState): number {
  const last = s.streak.lastActiveDate;
  if (!last) return 0;
  return last === dateKey() || last === yesterdayKey() ? s.streak.current : 0;
}

export function isActiveToday(s: ProgressState): boolean {
  return s.streak.lastActiveDate === dateKey();
}

/* ------------------------------------------------------------------ */
/*  Achievements                                                       */
/* ------------------------------------------------------------------ */

export interface ActionResult {
  xpGained: number;
  unlocked: AchievementDef[];
}

/** Grants newly satisfied achievements (looping, since XP rewards can unlock XP-based ones). */
function applyAchievements(next: ProgressState, baseXp: number): { state: ProgressState; result: ActionResult } {
  const unlocked: AchievementDef[] = [];
  let s = next;
  let changed = true;
  while (changed) {
    changed = false;
    for (const a of ACHIEVEMENTS) {
      if (!s.achievements[a.id] && a.check(s)) {
        s = { ...s, xp: s.xp + a.xp, achievements: { ...s.achievements, [a.id]: new Date().toISOString() } };
        unlocked.push(a);
        changed = true;
      }
    }
  }
  return { state: s, result: { xpGained: baseXp + unlocked.reduce((sum, a) => sum + a.xp, 0), unlocked } };
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

export function recordRun(compileError: boolean): ActionResult {
  const s = getSnapshot();
  const next: ProgressState = {
    ...s,
    streak: touchStreak(s),
    stats: {
      ...s.stats,
      runs: s.stats.runs + 1,
      compileErrors: s.stats.compileErrors + (compileError ? 1 : 0),
    },
  };
  const { state: finalState, result } = applyAchievements(next, 0);
  commit(finalState);
  return result;
}

export function recordFailedCheck(): void {
  const s = getSnapshot();
  commit({ ...s, streak: touchStreak(s), stats: { ...s.stats, checks: s.stats.checks + 1 } });
}

export function completeDay(day: number, opts: { code?: string; usedScanner?: boolean } = {}): ActionResult & { alreadyCompleted: boolean } {
  const s = getSnapshot();
  if (s.completedDays.includes(day)) {
    return { xpGained: 0, unlocked: [], alreadyCompleted: true };
  }
  const key = String(day);
  const next: ProgressState = {
    ...s,
    xp: s.xp + XP_PER_DAY,
    completedDays: [...s.completedDays, day].sort((a, b) => a - b),
    completedAt: { ...s.completedAt, [key]: new Date().toISOString() },
    code: opts.code !== undefined ? { ...s.code, [key]: opts.code } : s.code,
    streak: touchStreak(s),
    stats: {
      ...s.stats,
      checks: s.stats.checks + 1,
      scannerDays: opts.usedScanner && !s.stats.scannerDays.includes(day) ? [...s.stats.scannerDays, day] : s.stats.scannerDays,
    },
  };
  const { state: finalState, result } = applyAchievements(next, XP_PER_DAY);
  commit(finalState);
  return { ...result, alreadyCompleted: false };
}

export function completeTask(
  day: number,
  taskId: string,
  taskXp: number,
  allDayTaskIds: string[],
  opts: { code?: string; usedScanner?: boolean } = {}
): ActionResult & { dayCompleted: boolean; taskAlreadyCompleted: boolean } {
  const s = getSnapshot();
  const dayKey = String(day);
  const codeKey = `${day}_${taskId}`;
  const existingTasks = s.completedTasks[dayKey] ?? [];

  if (existingTasks.includes(taskId)) {
    return { xpGained: 0, unlocked: [], dayCompleted: s.completedDays.includes(day), taskAlreadyCompleted: true };
  }

  const updatedTasks = [...existingTasks, taskId];
  const allCompleted = allDayTaskIds.length > 0 && allDayTaskIds.every((id) => updatedTasks.includes(id));
  const isNewDayComplete = allCompleted && !s.completedDays.includes(day);

  let updatedCompletedDays = s.completedDays;
  let updatedCompletedAt = s.completedAt;
  if (isNewDayComplete) {
    updatedCompletedDays = [...s.completedDays, day].sort((a, b) => a - b);
    updatedCompletedAt = { ...s.completedAt, [dayKey]: new Date().toISOString() };
  }

  const next: ProgressState = {
    ...s,
    xp: s.xp + taskXp,
    completedDays: updatedCompletedDays,
    completedAt: updatedCompletedAt,
    completedTasks: {
      ...s.completedTasks,
      [dayKey]: updatedTasks,
    },
    code: opts.code !== undefined ? { ...s.code, [codeKey]: opts.code } : s.code,
    streak: touchStreak(s),
    stats: {
      ...s.stats,
      checks: s.stats.checks + 1,
      scannerDays: opts.usedScanner && !s.stats.scannerDays.includes(day) ? [...s.stats.scannerDays, day] : s.stats.scannerDays,
    },
  };

  const { state: finalState, result } = applyAchievements(next, taskXp);
  commit(finalState);
  return { ...result, dayCompleted: isNewDayComplete, taskAlreadyCompleted: false };
}

export function saveCode(day: number, code: string, taskId?: string): void {
  const s = getSnapshot();
  const dayKey = String(day);
  const taskKey = taskId ? `${day}_${taskId}` : null;
  if (taskKey && s.code[taskKey] === code) return;
  if (!taskKey && s.code[dayKey] === code) return;

  const nextCode = { ...s.code };
  if (taskKey) {
    nextCode[taskKey] = code;
  } else {
    nextCode[dayKey] = code;
  }
  commit({ ...s, code: nextCode });
}

export function clearCode(day: number, taskId?: string): void {
  const s = getSnapshot();
  const dayKey = String(day);
  const taskKey = taskId ? `${day}_${taskId}` : null;
  const code = { ...s.code };
  if (taskKey) {
    delete code[taskKey];
  } else {
    delete code[dayKey];
  }
  commit({ ...s, code });
}

export function resetProgress(): void {
  storage.clear();
  commit(createDefaultProgress());
}

/* ------------------------------------------------------------------ */
/*  Selectors                                                          */
/* ------------------------------------------------------------------ */

export function isTaskCompleted(s: ProgressState, day: number, taskId: string): boolean {
  const dayTasks = s.completedTasks?.[String(day)] ?? [];
  return dayTasks.includes(taskId) || s.completedDays.includes(day);
}

export function completedTasksForDay(s: ProgressState, day: number): string[] {
  return s.completedTasks?.[String(day)] ?? [];
}

export function dayStatus(s: ProgressState, day: number): DayStatus {
  if (s.completedDays.includes(day)) return "completed";
  if (day === 1 || s.completedDays.includes(day - 1)) return "current";
  return "locked";
}

/** First day that is not completed yet (the one to continue from). */
export function nextDay(s: ProgressState, totalDays: number): number {
  for (let d = 1; d <= totalDays; d++) {
    if (!s.completedDays.includes(d)) return d;
  }
  return totalDays;
}
