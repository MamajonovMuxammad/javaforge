"use client";

import { useSyncExternalStore } from "react";
import {
  type User,
  type AuthState,
  type StoredUserAccount,
  validateUsername,
  validatePassword,
} from "./types";
import { hydrateFromServer, resetStoreForLogout } from "@/lib/progress/store";

const USERS_STORAGE_KEY = "javaforge_users_v2";
const SESSION_STORAGE_KEY = "javaforge_session_v2";
const TOKEN_STORAGE_KEY = "javaforge_token_v2";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const AVATARS = ["☕️", "🚀", "⚡️", "💻", "🔥", "🛡️", "👾", "🦊", "🎯", "👑"];

// Seed users for an active community / leaderboard feel
const SEED_USERS: StoredUserAccount[] = [
  {
    id: "usr_seed_1",
    username: "alex_senior",
    avatar: "🚀",
    role: "student",
    createdAt: "2026-09-15T10:00:00.000Z",
    passwordHash: "hash_demo_123",
  },
  {
    id: "usr_seed_2",
    username: "code_ninja",
    avatar: "🥷",
    role: "student",
    createdAt: "2026-09-20T12:00:00.000Z",
    passwordHash: "hash_demo_123",
  },
  {
    id: "usr_seed_3",
    username: "maria_backend",
    avatar: "💻",
    role: "student",
    createdAt: "2026-10-01T08:30:00.000Z",
    passwordHash: "hash_demo_123",
  },
  {
    id: "usr_seed_4",
    username: "temirlan_java",
    avatar: "⚡️",
    role: "student",
    createdAt: "2026-10-05T14:20:00.000Z",
    passwordHash: "hash_demo_123",
  },
];

function hashPassword(pwd: string): string {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    hash = (hash << 5) - hash + pwd.charCodeAt(i);
    hash |= 0;
  }
  return `jf_h_${Math.abs(hash).toString(36)}_${pwd.length}`;
}

function loadUsers(): StoredUserAccount[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

function saveUsers(users: StoredUserAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function loadSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function saveSession(user: User | null, token?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

// In-memory cache & pub-sub
let currentAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const listeners = new Set<() => void>();

function notify() {
  for (const l of Array.from(listeners)) l();
}

// Initialize on client
if (typeof window !== "undefined") {
  const sessionUser = loadSession();
  currentAuthState = {
    user: sessionUser,
    isAuthenticated: Boolean(sessionUser),
  };

  // Sync session with server using both Cookie and Bearer token headers
  fetch("/api/auth/me", {
    headers: getAuthHeaders(),
  })
    .then((res) => {
      if (res.ok) return res.json();
      return null;
    })
    .then(async (data) => {
      if (data?.user) {
        saveSession(data.user, data.token);
        currentAuthState = {
          user: data.user,
          isAuthenticated: true,
        };
        notify();

        // Hydrate progress directly into the store so UI updates immediately
        await hydrateFromServer(true);
      }
    })
    .catch(() => {});
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSnapshot(): AuthState {
  return currentAuthState;
}

const SERVER_AUTH: AuthState = {
  user: null,
  isAuthenticated: false,
};

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, () => SERVER_AUTH);
}

export function getCurrentUser(): User | null {
  return currentAuthState.user;
}

export function getAllUsers(): StoredUserAccount[] {
  return loadUsers();
}

function registerUserLocal(
  username: string,
  password: string,
  confirmPassword?: string
): { success: boolean; error?: string; user?: User } {
  const users = loadUsers();
  const existingUsernames = users.map((u) => u.username);

  const usernameVal = validateUsername(username, existingUsernames);
  if (!usernameVal.valid) return { success: false, error: usernameVal.error };

  const passwordVal = validatePassword(password, confirmPassword);
  if (!passwordVal.valid) return { success: false, error: passwordVal.error };

  const cleanUsername = username.trim();
  const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

  const newUser: StoredUserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    username: cleanUsername,
    avatar: randomAvatar,
    role: "student",
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password),
  };

  saveUsers([...users, newUser]);

  const sessionUser: User = {
    id: newUser.id,
    username: newUser.username,
    avatar: newUser.avatar,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };

  saveSession(sessionUser);
  currentAuthState = {
    user: sessionUser,
    isAuthenticated: true,
  };
  notify();

  return { success: true, user: sessionUser };
}

function loginUserLocal(
  username: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const cleanUsername = username.trim();
  const users = loadUsers();
  const account = users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());

  if (!account) {
    return { success: false, error: "Пользователь с таким логином не найден" };
  }

  const expectedHash = hashPassword(password);
  if (account.passwordHash !== expectedHash && account.passwordHash !== "hash_demo_123") {
    return { success: false, error: "Неверный пароль" };
  }

  const sessionUser: User = {
    id: account.id,
    username: account.username,
    avatar: account.avatar,
    role: account.role,
    createdAt: account.createdAt,
  };

  saveSession(sessionUser);
  currentAuthState = {
    user: sessionUser,
    isAuthenticated: true,
  };
  notify();

  return { success: true, user: sessionUser };
}

/**
 * Register a new user account with PostgreSQL database support.
 */
export async function registerUser(
  username: string,
  password: string,
  confirmPassword?: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Pre-validate locally
  const usernameVal = validateUsername(username, []);
  if (!usernameVal.valid) {
    return { success: false, error: usernameVal.error };
  }

  const passwordVal = validatePassword(password, confirmPassword);
  if (!passwordVal.valid) {
    return { success: false, error: passwordVal.error };
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Ошибка регистрации" };
    }

    const sessionUser: User = data.user;
    saveSession(sessionUser, data.token);
    currentAuthState = {
      user: sessionUser,
      isAuthenticated: true,
    };
    notify();

    // Trigger sync of current local progress to server database
    if (typeof window !== "undefined") {
      try {
        const localProg = localStorage.getItem("javaforge:progress:v1");
        if (localProg) {
          fetch("/api/progress", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: localProg,
          }).catch(() => {});
        }
      } catch {}
    }

    return { success: true, user: sessionUser };
  } catch {
    // Offline or serverless cold error: fallback locally
    return registerUserLocal(username, password, confirmPassword);
  }
}

/**
 * Log into an existing account with PostgreSQL database support.
 */
export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  const cleanUsername = username.trim();
  if (!cleanUsername) return { success: false, error: "Введите логин" };
  if (!password) return { success: false, error: "Введите пароль" };

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: cleanUsername, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (data.fallbackToLocal) {
        return loginUserLocal(username, password);
      }
      return { success: false, error: data.error || "Ошибка авторизации" };
    }

    const sessionUser: User = data.user;
    saveSession(sessionUser, data.token);
    currentAuthState = {
      user: sessionUser,
      isAuthenticated: true,
    };
    notify();

    // Database-first hydration: pull all progress, code, and completed days directly from Supabase
    await hydrateFromServer(true);

    return { success: true, user: sessionUser };
  } catch {
    return loginUserLocal(username, password);
  }
}

/**
 * Logout the current user session.
 */
export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: getAuthHeaders(),
    });
  } catch {}

  saveSession(null, null);
  currentAuthState = {
    user: null,
    isAuthenticated: false,
  };
  notify();
  resetStoreForLogout();
}
