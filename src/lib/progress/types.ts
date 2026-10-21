/** Shape of everything we persist about a learner. Versioned for future migrations / Supabase sync. */
export interface ProgressState {
  version: 1;
  xp: number;
  completedDays: number[];
  /** day → ISO timestamp */
  completedAt: Record<string, string>;
  /** day → array of completed taskIds, e.g. {"1": ["d1_t1", "d1_t2", "d1_t3"]} */
  completedTasks: Record<string, string[]>;
  /** `${day}_${taskId}` or `${day}` → last code written in the editor */
  code: Record<string, string>;
  /** achievement id → ISO timestamp */
  achievements: Record<string, string>;
  streak: {
    current: number;
    best: number;
    /** Local date key YYYY-MM-DD of the last learning activity */
    lastActiveDate: string | null;
  };
  stats: {
    runs: number;
    compileErrors: number;
    checks: number;
    /** Days whose accepted solution used Scanner */
    scannerDays: number[];
  };
}

export const createDefaultProgress = (): ProgressState => ({
  version: 1,
  xp: 0,
  completedDays: [],
  completedAt: {},
  completedTasks: {},
  code: {},
  achievements: {},
  streak: { current: 0, best: 0, lastActiveDate: null },
  stats: { runs: 0, compileErrors: 0, checks: 0, scannerDays: [] },
});

export type DayStatus = "completed" | "current" | "locked";
