import { env } from "@/config/env";
import { tooManyRequests } from "@/utils/response";

const store = new Map();

function key(req) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "local";
  return ip;
}

export function rateLimit(req) {
  const k = key(req);
  const now = Date.now();
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const max = env.RATE_LIMIT_MAX;

  const entry = store.get(k) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + windowMs;
  }
  entry.count += 1;
  store.set(k, entry);

  if (entry.count > max) {
    return tooManyRequests("Rate limited");
  }
  return null;
}

