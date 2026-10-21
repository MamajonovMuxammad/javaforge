import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "javaforge-production-super-secret-key-32-chars-long!"
);

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
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<{ userId: string; username: string; role?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
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
      return await verifySessionToken(token);
    }
  } catch {
    // cookies() may throw outside request scope
  }

  return null;
}

export { SESSION_COOKIE_NAME };
