import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import crypto from "crypto";

const INSECURE_LEAKED_FALLBACK = "javaforge-production-super-secret-key-32-chars-long!";
let cachedSecret: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const envSecret = process.env.AUTH_SECRET?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!envSecret || envSecret === INSECURE_LEAKED_FALLBACK || envSecret.length < 32) {
      console.error(
        "[SECURITY CRITICAL] AUTH_SECRET is missing or insecure in production! Please set AUTH_SECRET in Vercel environment variables."
      );
      throw new Error(
        "FATAL: AUTH_SECRET must be configured with a random string of at least 32 characters in production."
      );
    }
    cachedSecret = new TextEncoder().encode(envSecret);
    return cachedSecret;
  }

  // Development/Local: If unset or leaked fallback, generate a random ephemeral key for this process
  if (!envSecret || envSecret === INSECURE_LEAKED_FALLBACK) {
    const ephemeral = crypto.randomBytes(32).toString("hex");
    cachedSecret = new TextEncoder().encode(ephemeral);
    return cachedSecret;
  }

  cachedSecret = new TextEncoder().encode(envSecret);
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
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    if (payload.userId && payload.username) {
      return {
        userId: String(payload.userId),
        username: String(payload.username),
        role: payload.role ? String(payload.role) : "student",
      };
    }
    return null;
  } catch {
    return null;
  }
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
        return await verifySessionToken(decodeURIComponent(match[1]));
      }
    }
  } catch {
    // ignore
  }

  return null;
}

export { SESSION_COOKIE_NAME };
