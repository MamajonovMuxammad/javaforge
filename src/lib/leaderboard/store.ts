import type { ProgressState } from "@/lib/progress/types";
import { getCurrentUser } from "@/lib/auth/store";
import { validateAndSanitizeProgress } from "@/lib/security/progress-validator";

export type LeaderboardSort = "xp" | "tasks" | "streak";

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  completedTasksCount: number;
  completedDaysCount: number;
  streak: number;
  isCurrentUser: boolean;
  league: "Алмазная" | "Золотая" | "Серебряная" | "Бронзовая";
}

const PEER_STUDENTS = [
  {
    id: "cmvkkl34d0000jv086y8tjidg",
    username: "Nazar",
    avatar: "⚡️",
    xp: 605,
    completedTasksCount: 14,
    completedDaysCount: 5,
    streak: 3,
  },
  {
    id: "cmvi7jwgy0000egwoq8v5rv10",
    username: "wercis",
    avatar: "🚀",
    xp: 385,
    completedTasksCount: 9,
    completedDaysCount: 4,
    streak: 2,
  },
  {
    id: "cmvjf8aco0000jq0743nk68wk",
    username: "Skittler",
    avatar: "👾",
    xp: 300,
    completedTasksCount: 6,
    completedDaysCount: 3,
    streak: 2,
  },
];

function getLeague(rank: number): "Алмазная" | "Золотая" | "Серебряная" | "Бронзовая" {
  if (rank === 1) return "Алмазная";
  if (rank === 2) return "Золотая";
  if (rank === 3) return "Серебряная";
  return "Бронзовая";
}

export function countRealCompletedTasks(progress: ProgressState): number {
  const { sanitized } = validateAndSanitizeProgress(progress);
  let count = 0;
  const countedDays = new Set<number>();

  for (const [dayStr, tasks] of Object.entries(sanitized.completedTasks || {})) {
    const dayNum = Number(dayStr);
    // Day 0 is Module 0 (environment setup) and has 0 coding tasks
    if (dayNum <= 0) continue;
    countedDays.add(dayNum);
    if (Array.isArray(tasks)) {
      count += sanitized.completedDays.includes(dayNum) ? Math.max(tasks.length, 3) : tasks.length;
    }
  }

  for (const d of sanitized.completedDays) {
    if (d >= 1 && !countedDays.has(d)) {
      count += 3;
    }
  }

  return count;
}

/**
 * Generates the unified live leaderboard merging active peers with the user's real progress.
 */
export function getLeaderboardEntries(
  progress: ProgressState,
  sortBy: LeaderboardSort = "xp",
  customPeers?: Array<{
    id: string;
    username: string;
    avatar: string;
    xp: number;
    completedDays: number;
    completedTasksCount?: number;
    streak: number;
  }>
): LeaderboardEntry[] {
  const currentUser = getCurrentUser();
  const currentUsernameLower = (currentUser?.username ?? "wercis").toLowerCase();
  const { sanitized, calculatedXp } = validateAndSanitizeProgress(progress);
  const localTasksCount = countRealCompletedTasks(sanitized);
  const localDaysCount = sanitized.completedDays.length;
  const localXp = Math.max(progress.xp, calculatedXp);

  const serverMatch = customPeers?.find(
    (p) => p.username.toLowerCase() === currentUsernameLower || (currentUser?.id && p.id === currentUser.id)
  );

  const currentUserEntry: LeaderboardEntry = {
    id: serverMatch?.id ?? currentUser?.id ?? "current_user",
    username: serverMatch?.username ?? currentUser?.username ?? "wercis",
    avatar: serverMatch?.avatar ?? currentUser?.avatar ?? "🚀",
    xp: Math.max(localXp, serverMatch?.xp ?? 0),
    completedTasksCount: Math.max(localTasksCount, serverMatch?.completedTasksCount ?? 0),
    completedDaysCount: Math.max(localDaysCount, serverMatch?.completedDays ?? 0),
    streak: Math.max(sanitized.streak.current, serverMatch?.streak ?? 1, 1),
    isCurrentUser: true,
    league: "Алмазная",
  };

  const allowedUsernames = new Set(["wercis", "nazar", "skittler"]);

  const peersSource: LeaderboardEntry[] =
    customPeers && customPeers.length > 0
      ? customPeers
          .filter((p) => {
            const lower = p.username.toLowerCase();
            return (
              allowedUsernames.has(lower) &&
              lower !== currentUsernameLower &&
              p.id !== currentUser?.id
            );
          })
          .map((p) => {
            const codingDays = Math.max(0, p.completedDays - 1);
            return {
              id: p.id,
              username: p.username,
              avatar: p.avatar,
              xp: p.xp,
              completedTasksCount:
                typeof p.completedTasksCount === "number"
                  ? p.completedTasksCount
                  : codingDays * 3,
              completedDaysCount: p.completedDays,
              streak: Math.max(p.streak, 1),
              isCurrentUser: false,
              league: "Бронзовая" as const,
            };
          })
      : PEER_STUDENTS.filter((p) => p.username.toLowerCase() !== currentUsernameLower).map(
          (p) => ({
            ...p,
            isCurrentUser: false,
            league: "Бронзовая" as const,
          })
        );

  const allEntries: LeaderboardEntry[] = [currentUserEntry, ...peersSource];

  // Sort by requested criterion
  allEntries.sort((a, b) => {
    if (sortBy === "xp") return b.xp - a.xp;
    if (sortBy === "tasks") return b.completedTasksCount - a.completedTasksCount;
    if (sortBy === "streak") return b.streak - a.streak;
    return b.xp - a.xp;
  });

  // Assign league tiers based on sorted position
  return allEntries.map((entry, index) => ({
    ...entry,
    league: getLeague(index + 1),
  }));
}
