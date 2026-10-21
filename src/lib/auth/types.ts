export interface User {
  id: string;
  username: string;
  createdAt: string;
  avatar: string;
  role: "student" | "admin";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface StoredUserAccount extends User {
  passwordHash: string; // Base64 encoded or simple hash for local sandbox
}

/**
 * Reserved system / administrative usernames that learners cannot register.
 */
export const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "adm",
  "root",
  "system",
  "sysadmin",
  "support",
  "staff",
  "moderator",
  "mod",
  "owner",
  "master",
  "security",
  "official",
  "superuser",
  "developer",
  "dev",
  "javaforge",
  "bot",
]);

/**
 * Filter for offensive words, profanities, and slurs (Russian & English).
 */
export const PROFANITY_ROOTS = [
  // Russian
  "хуй",
  "хуе",
  "хуя",
  "хуи",
  "пизд",
  "ебат",
  "ебан",
  "ебу",
  "ёб",
  "бля",
  "бляд",
  "сука",
  "сучк",
  "мудак",
  "мудил",
  "гандон",
  "гондон",
  "шлюх",
  "чмо",
  "чмыр",
  "залуп",
  "говно",
  "говн",
  "дерьм",
  "жопа",
  "пидор",
  "педик",
  "дроч",
  // English
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "asshole",
  "bastard",
  "dick",
  "pussy",
  "retard",
  "nigger",
  "faggot",
  "whore",
  "slut",
  "cock",
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a username according to all business rules:
 * - Length 3 to 20
 * - Only Latin letters, numbers, underscores, dashes
 * - Not a reserved admin username
 * - Does not contain profanity / offensive language
 * - Is unique (not already taken by another user)
 */
export function validateUsername(
  username: string,
  existingUsernames: string[] = []
): ValidationResult {
  const trimmed = username.trim();

  if (!trimmed) {
    return { valid: false, error: "Логин не может быть пустым" };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: "Логин должен содержать минимум 3 символа" };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: "Логин не должен превышать 20 символов" };
  }

  // Allowed characters: Latin alphanumeric, underscores, hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "Логин может содержать только латинские буквы, цифры, дефис и подчеркивание",
    };
  }

  const lower = trimmed.toLowerCase();

  // Reserved admin names check
  if (RESERVED_USERNAMES.has(lower)) {
    return {
      valid: false,
      error: "Этот логин зарезервирован администрацией платформы. Выберите другой",
    };
  }

  for (const reserved of Array.from(RESERVED_USERNAMES)) {
    if (lower.startsWith(reserved + "_") || lower.endsWith("_" + reserved)) {
      return {
        valid: false,
        error: "Логин не может содержать системные префиксы (admin, root, etc.)",
      };
    }
  }

  // Profanity filter
  for (const root of PROFANITY_ROOTS) {
    if (lower.includes(root)) {
      return {
        valid: false,
        error: "Логин содержит недопустимые или нецензурные выражения. Пожалуйста, выберите корректное имя",
      };
    }
  }

  // Uniqueness check
  const isTaken = existingUsernames.some((u) => u.toLowerCase() === lower);
  if (isTaken) {
    return { valid: false, error: "Этот логин уже занят другим студентом. Придумайте другой" };
  }

  return { valid: true };
}

/**
 * Validates password strength & confirmation.
 */
export function validatePassword(password: string, confirmPassword?: string): ValidationResult {
  if (!password) {
    return { valid: false, error: "Введите пароль" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Пароль должен быть не короче 6 символов" };
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { valid: false, error: "Пароли не совпадают" };
  }

  return { valid: true };
}
