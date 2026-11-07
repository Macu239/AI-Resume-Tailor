import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** Shared limiter: 5 requests per 60 seconds per identifier (IP). Null when Upstash is not configured. */
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "60 s"),
      })
    : null;

/**
 * Extracts a best-effort client identifier from a request for rate limiting.
 * @param request - The incoming request.
 * @returns The first IP in the x-forwarded-for header, or "unknown".
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0].trim() ?? "unknown";
}

/**
 * Checks whether the client has exceeded the rate limit.
 * Fails open: if Upstash is not configured or unreachable, the request is allowed.
 * @param request - The incoming request.
 * @returns True if the request should be rejected with 429.
 */
export async function isRateLimited(request: Request): Promise<boolean> {
  if (!ratelimit) return false;
  try {
    const { success } = await ratelimit.limit(getClientIp(request));
    return !success;
  } catch (err) {
    console.warn("[ratelimit] Upstash unavailable, skipping rate limit", err);
    return false;
  }
}
