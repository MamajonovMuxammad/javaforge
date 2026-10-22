import { NextResponse } from "next/server";

interface RateLimitOptions {
  intervalSeconds: number;
  maxRequests: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding-window store for rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  // Run cleanup once every 60 seconds
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  const maxLifetime = 15 * 60 * 1000; // 15 minutes
  for (const [key, record] of rateLimitStore.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < maxLifetime);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
}

/**
 * Extracts client IP from request headers (supports Vercel, Cloudflare, proxies).
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "127.0.0.1";
}

/**
 * Checks sliding window rate limit for a given key.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  cleanupExpired();

  const now = Date.now();
  const windowStart = now - options.intervalSeconds * 1000;

  const record = rateLimitStore.get(key) || { timestamps: [] };
  const recentTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= options.maxRequests) {
    const oldestInWindow = recentTimestamps[0];
    const resetInSeconds = Math.max(
      1,
      Math.ceil((oldestInWindow + options.intervalSeconds * 1000 - now) / 1000)
    );
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  recentTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: recentTimestamps });

  return {
    allowed: true,
    remaining: options.maxRequests - recentTimestamps.length,
    resetInSeconds: options.intervalSeconds,
  };
}

/**
 * Standard 429 Too Many Requests response with Retry-After header.
 */
export function rateLimitResponse(resetInSeconds: number, customMessage?: string) {
  const message =
    customMessage ||
    `Слишком много запросов. Пожалуйста, подождите ${resetInSeconds} сек.`;

  return NextResponse.json(
    {
      error: message,
      retryAfter: resetInSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetInSeconds),
      },
    }
  );
}
