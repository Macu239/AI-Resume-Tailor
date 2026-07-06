import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** Shared limiter: 5 requests per 60 seconds per identifier (IP). */
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

/**
 * Extracts a best-effort client identifier from a request for rate limiting.
 * @param request - The incoming request.
 * @returns The first IP in the x-forwarded-for header, or "unknown".
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0].trim() ?? "unknown";
}
