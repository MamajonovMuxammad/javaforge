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
  let verified: { userId: string; username: string; role?: string } | null = null;

  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    verified = await verifySessionToken(token);
  }

  // 2. Check Cookie
  if (!verified) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        verified = await verifySessionToken(token);
      }
    } catch {
      // cookies() may throw outside request scope
    }
  }

  // 3. Fallback: Parse raw Cookie header directly from request
  if (!verified) {
    try {
      const rawCookie = request.headers.get("cookie");
      if (rawCookie) {
        const match = rawCookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
        if (match && match[1]) {
          verified = await verifySessionToken(decodeURIComponent(match[1]));
        }
      }
    } catch {
      // ignore
    }
  }

  if (!verified) {
    return null;
  }

  // 4. Verify account status against PostgreSQL when database is active (blocks banned/deleted users)
  if (isDbConfigured && prisma) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: verified.userId },
        select: { id: true, username: true, role: true },
      });
      if (!dbUser || dbUser.role === "banned") {
        return null;
      }
      return {
        userId: dbUser.id,
        username: dbUser.username,
        role: dbUser.role || "student",
      };
    } catch {
      // If DB has a transient connection hiccup, still trust the cryptographically verified JWT
    }
  }

  if (verified.role === "banned") {
    return null;
  }

  return verified;
}

export { SESSION_COOKIE_NAME };
