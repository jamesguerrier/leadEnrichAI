const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per key

/**
 * Basic in-memory rate limiter
 * NOTE: This is NOT persistent across serverless function invocations on Vercel
 * if they scale to multiple instances. For production, use Redis.
 */
export function isRateLimited(apiKeyId: string): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(apiKeyId) || { count: 0, lastReset: now };

  if (now - userData.lastReset > WINDOW_SIZE_MS) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(apiKeyId, userData);

  return userData.count > MAX_REQUESTS;
}
