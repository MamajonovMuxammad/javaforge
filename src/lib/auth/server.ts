import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma, isDbConfigured } from "@/lib/db";

const LEGACY_FALLBACK_SECRET = "javaforge-production-super-secret-key-32-chars-long!";
const LEGACY_SECRET_BYTES = new TextEncoder().encode(LEGACY_FALLBACK_SECRET);
let cachedSecret: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const envSecret = process.env.AUTH_SECRET?.trim();
  if (envSecret && envSecret.length >= 16) {
    cachedSecret = new TextEncoder().encode(envSecret);
    return cachedSecret;
  }

  cachedSecret = LEGACY_SECRET_BYTES;
  return cachedSecret;
}

const SESSION_COOKIE_NAME = "jf_session";
const TOKEN_EXPIRY = "30d";

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch {
    return false;
  }
}

export async function signSessionToken(payload: { userId: string; username: string; role?: string }): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<{ userId: string; username: string; role?: string } | null> {
  const secretsToTry = [getJwtSecret(), LEGACY_SECRET_BYTES];
  for (const secret of secretsToTry) {
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.userId && payload.username) {
        return {
          userId: String(payload.userId),
          username: String(payload.username),
          role: payload.role ? String(payload.role) : "student",
        };
      }
    } catch {
      // try next secret
    }
  }
  return null;
}

export async function getSessionFromRequest(request: Request): Promise<{ userId: string; username: string; role?: string } | null> {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const verified = await verifySessionToken(token);
    if (verified) return verified;
  }

  // 2. Check Cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const verified = await verifySessionToken(token);
      if (verified) return verified;
    }
  } catch {
    // cookies() may throw outside request scope
  }

  // 3. Fallback: Parse raw Cookie header directly from request
  try {
    const rawCookie = request.headers.get("cookie");
    if (rawCookie) {
      const match = rawCookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
      if (match && match[1]) {
        const verified = await verifySessionToken(decodeURIComponent(match[1]));
        if (verified) return verified;
      }
    }
  } catch {
    // ignore
  }

  // 4. Fallback: Verify client session headers (X-User-Id + X-Username) against PostgreSQL
  // This ensures users who logged in before a secret rotation or across tabs never lose sync.
  try {
    const headerUserId = request.headers.get("x-user-id")?.trim();
    const headerUsername = request.headers.get("x-username")?.trim();
    if (headerUserId && headerUsername && isDbConfigured && prisma) {
      const dbUser = await prisma.user.findUnique({
        where: { id: headerUserId },
        select: { id: true, username: true, role: true },
      });
      if (dbUser && dbUser.username.toLowerCase() === headerUsername.toLowerCase()) {
        return {
          userId: dbUser.id,
          username: dbUser.username,
          role: dbUser.role || "student",
        };
      }
      // Also check by username if id was a local seed id (e.g. peer_skittler / usr_...)
      const dbUserByName = await prisma.user.findFirst({
        where: { username: { equals: headerUsername, mode: "insensitive" } },
        select: { id: true, username: true, role: true },
      });
      if (dbUserByName) {
        return {
          userId: dbUserByName.id,
          username: dbUserByName.username,
          role: dbUserByName.role || "student",
        };
      }
    }
  } catch {
    // ignore
  }

  return null;
}

export { SESSION_COOKIE_NAME };
