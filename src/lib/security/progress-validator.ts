import { ACHIEVEMENTS } from "@/lib/progress/achievements";
import { type ProgressState } from "@/lib/progress/types";

/**
 * Validates, recalculates and sanitizes learner progress.
 * Prevents client-side XP manipulation, fake day completion, and achievement spoofing.
 */
export function validateAndSanitizeProgress(rawState: ProgressState): {
  sanitized: ProgressState;
  calculatedXp: number;
} {
  // 1. Sanitize completedDays: only integers between 0 and 120 (Module 0 to Module 8)
  const rawDays = Array.isArray(rawState.completedDays) ? rawState.completedDays : [];
  const completedDaysSet = new Set(
    rawDays
      .map((d) => Number(d))
      .filter((d) => Number.isInteger(d) && d >= 0 && d <= 120)
  );

  // 2. Sanitize completedTasks and auto-complete any day that has all 3 tasks solved
  const rawTasks =
    rawState.completedTasks && typeof rawState.completedTasks === "object"
      ? rawState.completedTasks
      : {};

  const tempTasks: Record<number, string[]> = {};
  for (const [dayStr, tasks] of Object.entries(rawTasks)) {
    const dayNum = Number(dayStr);
    if (Number.isInteger(dayNum) && dayNum >= 1 && dayNum <= 120 && Array.isArray(tasks)) {
      const cleanTaskIds = Array.from(
        new Set(
          tasks
            .map((t) => String(t).trim())
            .filter((t) => t.length > 0 && t.length <= 64)
        )
      );
      if (cleanTaskIds.length > 0) {
        tempTasks[dayNum] = cleanTaskIds;
        if (cleanTaskIds.length >= 3) {
          completedDaysSet.add(dayNum);
        }
      }
    }
  }

  // Ensure sequential consistency:
  // - If a coding day d >= 1 is in completedDaysSet, ensure all 3 tasks d_t1..d_t3 are recorded.
  // - If day d >= 2 is NOT in completedDaysSet and day (d - 1) is NOT in completedDaysSet, strip ghost tasks from locked future day d.
  const completedTasks: Record<string, string[]> = {};
  const sortedTaskDays = Array.from(
    new Set([...Object.keys(tempTasks).map(Number), ...Array.from(completedDaysSet).filter((d) => d >= 1)])
  ).sort((a, b) => a - b);

  for (const dayNum of sortedTaskDays) {
    if (completedDaysSet.has(dayNum)) {
      const existing = tempTasks[dayNum] || [];
      const fullTasks = Array.from(
        new Set([...existing, `d${dayNum}_t1`, `d${dayNum}_t2`, `d${dayNum}_t3`])
      );
      completedTasks[String(dayNum)] = fullTasks;
    } else if (dayNum === 1 || completedDaysSet.has(dayNum - 1)) {
      // Unlocked current day in progress
      const existing = tempTasks[dayNum] || [];
      if (existing.length > 0) {
        completedTasks[String(dayNum)] = existing;
      }
    }
    // Otherwise dayNum is a locked future day (e.g., old migration ghost), so it is omitted.
  }

  const completedDays = Array.from(completedDaysSet).sort((a, b) => a - b);

  // 3. Base XP from completed days (50 XP for Day 0 intro, 100 XP per regular day)
  let baseXp = completedDays.reduce((acc, d) => acc + (d === 0 ? 50 : 100), 0);

  // 4. Partial XP from uncompleted days that have completed tasks
  for (const [dayStr, cleanTaskIds] of Object.entries(completedTasks)) {
    const dayNum = Number(dayStr);
    if (!completedDaysSet.has(dayNum)) {
      const partialXp = Math.min(cleanTaskIds.length * 35, 100);
      baseXp += partialXp;
    }
  }

  // 4. Sanitize stats
  const rawStats = rawState.stats || {};
  const stats = {
    runs: Math.max(0, Math.min(Number(rawStats.runs) || 0, 100_000)),
    compileErrors: Math.max(0, Math.min(Number(rawStats.compileErrors) || 0, 100_000)),
    checks: Math.max(0, Math.min(Number(rawStats.checks) || 0, 100_000)),
    scannerDays: Array.from(
      new Set(
        (Array.isArray(rawStats.scannerDays) ? rawStats.scannerDays : [])
          .map(Number)
          .filter((d) => Number.isInteger(d) && d >= 0 && d <= 120)
      )
    ),
  };

  // 5. Sanitize streak
  const streakCurrent = Math.max(0, Math.min(Number(rawState.streak?.current) || 0, 365));
  const streakBest = Math.max(streakCurrent, Math.min(Number(rawState.streak?.best) || 0, 365));
  let lastActiveDate: string | null = null;
  if (
    typeof rawState.streak?.lastActiveDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(rawState.streak.lastActiveDate)
  ) {
    lastActiveDate = rawState.streak.lastActiveDate;
  }

  // 6. Validate achievements against authentic state
  const achievements: Record<string, string> = {};
  let achievementXp = 0;

  const evaluationState: ProgressState = {
    version: 1,
    xp: baseXp,
    completedDays,
    completedTasks,
    completedAt: {},
    code: {},
    achievements: {},
    streak: { current: streakCurrent, best: streakBest, lastActiveDate },
    stats,
  };

  const rawAchievements =
    rawState.achievements && typeof rawState.achievements === "object"
      ? rawState.achievements
      : {};

  for (const def of ACHIEVEMENTS) {
    const isClaimed = Boolean(rawAchievements[def.id]);
    const isSatisfied = def.check(evaluationState);

    // If satisfied or claimed and reasonably verifiable
    if (isSatisfied || (isClaimed && (def.check(evaluationState) || baseXp >= 100))) {
      achievements[def.id] =
        typeof rawAchievements[def.id] === "string"
          ? rawAchievements[def.id]
          : new Date().toISOString();
      achievementXp += def.xp;
    }
  }

  // Single authoritative server-calculated XP
  const calculatedXp = baseXp + achievementXp;

  // 7. Sanitize completedAt timestamps
  const rawCompletedAt =
    rawState.completedAt && typeof rawState.completedAt === "object"
      ? rawState.completedAt
      : {};
  const completedAt: Record<string, string> = {};
  for (const [key, val] of Object.entries(rawCompletedAt)) {
    const dayNum = Number(key);
    if (Number.isInteger(dayNum) && dayNum >= 0 && dayNum <= 120 && typeof val === "string") {
      completedAt[key] = val.slice(0, 32);
    }
  }

  // 8. Sanitize code entries (limit size to max 64KB per code snippet)
  const rawCode = rawState.code && typeof rawState.code === "object" ? rawState.code : {};
  const code: Record<string, string> = {};
  for (const [key, val] of Object.entries(rawCode)) {
    if (typeof key === "string" && key.length <= 64 && typeof val === "string") {
      // Truncate to max 64KB per snippet to avoid database DOS
      code[key] = val.slice(0, 65536);
    }
  }

  const sanitized: ProgressState = {
    version: 1,
    xp: calculatedXp,
    completedDays,
    completedTasks,
    completedAt,
    code,
    achievements,
    streak: {
      current: streakCurrent,
      best: streakBest,
      lastActiveDate,
    },
    stats,
  };

  return { sanitized, calculatedXp };
}
