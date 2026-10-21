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
    id: "peer_1",
    username: "alex_senior",
    avatar: "🚀",
    xp: 2150,
    completedTasksCount: 48,
    completedDaysCount: 16,
    streak: 15,
  },
  {
    id: "peer_2",
    username: "code_ninja",
    avatar: "🥷",
    xp: 1640,
    completedTasksCount: 36,
    completedDaysCount: 12,
    streak: 9,
  },
  {
    id: "peer_3",
    username: "maria_backend",
    avatar: "💻",
    xp: 1320,
    completedTasksCount: 29,
    completedDaysCount: 9,
    streak: 7,
  },
  {
    id: "peer_4",
    username: "temirlan_java",
    avatar: "⚡️",
    xp: 980,
    completedTasksCount: 22,
    completedDaysCount: 7,
    streak: 5,
  },
  {
    id: "peer_5",
    username: "dmitry_spring",
    avatar: "🔥",
    xp: 750,
    completedTasksCount: 17,
    completedDaysCount: 5,
    streak: 4,
  },
  {
    id: "peer_6",
    username: "elena_it",
    avatar: "🦊",
    xp: 490,
    completedTasksCount: 11,
    completedDaysCount: 3,
    streak: 3,
  },
  {
    id: "peer_7",
    username: "ivan_student",
    avatar: "☕️",
    xp: 280,
    completedTasksCount: 6,
    completedDaysCount: 2,
    streak: 2,
  },
  {
    id: "peer_8",
    username: "ruslan_dev",
    avatar: "👾",
    xp: 150,
    completedTasksCount: 3,
    completedDaysCount: 1,
    streak: 1,
  },
];

function getLeague(rank: number, total: number): "Алмазная" | "Золотая" | "Серебряная" | "Бронзовая" {
  if (rank <= 3) return "Алмазная";
  if (rank <= 6) return "Золотая";
  if (rank <= 12) return "Серебряная";
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
    username: currentUser ? currentUser.username : "Ты (Гость)",
    avatar: currentUser?.avatar ?? "😎",
    xp: progress.xp,
    completedTasksCount: Math.max(userCompletedTasksCount, progress.completedDays.length * 3),
    completedDaysCount: progress.completedDays.length,
    streak: progress.streak.current,
    isCurrentUser: true,
    league: "Бронзовая",
  };

  const peersSource = (customPeers && customPeers.length > 0)
    ? customPeers
        .filter((p) => p.username !== currentUser?.username && p.id !== currentUser?.id)
        .map((p) => ({
          id: p.id,
          username: p.username,
          avatar: p.avatar,
          xp: p.xp,
          completedTasksCount: p.completedDays * 3,
          completedDaysCount: p.completedDays,
          streak: p.streak,
          isCurrentUser: false,
          league: "Бронзовая" as const,
        }))
    : PEER_STUDENTS.map((p) => ({
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
