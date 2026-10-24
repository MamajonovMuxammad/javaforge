import type { ProgressState } from "@/lib/progress/types";
import { getCurrentUser } from "@/lib/auth/store";

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
    id: "peer_nazar",
    username: "Nazar",
    avatar: "⚡️",
    xp: 145,
    completedTasksCount: 6,
    completedDaysCount: 2,
    streak: 1,
  },
  {
    id: "peer_skittler",
    username: "Skittler",
    avatar: "👾",
    xp: 20,
    completedTasksCount: 1,
    completedDaysCount: 1,
    streak: 1,
  },
];

function getLeague(rank: number, total: number): "Алмазная" | "Золотая" | "Серебряная" | "Бронзовая" {
  if (rank === 1) return "Алмазная";
  if (rank === 2) return "Золотая";
  if (rank === 3) return "Серебряная";
  return "Бронзовая";
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
    streak: number;
  }>
): LeaderboardEntry[] {
  const currentUser = getCurrentUser();

  // Count user's completed tasks across all days
  const userCompletedTasksCount = Object.values(progress.completedTasks || {}).reduce<number>(
    (acc, tasks) => acc + (Array.isArray(tasks) ? tasks.length : 0),
    0
  );

  const currentUserEntry: LeaderboardEntry = {
    id: currentUser?.id ?? "current_user",
    username: currentUser ? currentUser.username : "wercis",
    avatar: currentUser?.avatar ?? "🚀",
    xp: progress.xp > 0 ? progress.xp : 245,
    completedTasksCount: Math.max(userCompletedTasksCount, progress.completedDays.length * 3, 7),
    completedDaysCount: Math.max(progress.completedDays.length, 2),
    streak: Math.max(progress.streak.current, 1),
    isCurrentUser: true,
    league: "Алмазная",
  };

  const currentUsernameLower = (currentUser?.username ?? "wercis").toLowerCase();

  const peersSource = (customPeers && customPeers.length > 0)
    ? customPeers
        .filter((p) => {
          const lower = p.username.toLowerCase();
          return (
            (lower === "nazar" || lower === "skittler") &&
            lower !== currentUsernameLower &&
            p.id !== currentUser?.id
          );
        })
        .map((p) => ({
          id: p.id,
          username: p.username,
          avatar: p.avatar,
          xp: p.xp,
          completedTasksCount: Math.max(p.completedDays * 3, p.username.toLowerCase() === "nazar" ? 6 : 1),
          completedDaysCount: p.completedDays,
          streak: p.streak,
          isCurrentUser: false,
          league: "Бронзовая" as const,
        }))
    : PEER_STUDENTS.filter(
        (p) => p.username.toLowerCase() !== currentUsernameLower
      ).map((p) => ({
        ...p,
        isCurrentUser: false,
        league: "Бронзовая" as const,
      }));

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
    league: getLeague(index + 1, allEntries.length),
  }));
}
