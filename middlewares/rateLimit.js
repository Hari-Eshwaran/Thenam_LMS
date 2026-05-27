import { AppError } from "../utils/appError.js";

const buckets = new Map();

function resolveKey(req) {
  return req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
}

export function rateLimit({ windowMs = 60_000, max = 120 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = resolveKey(req);
    const bucket = buckets.get(key);

    if (!bucket || now >= bucket.expiresAt) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      return next(new AppError("Rate limit exceeded.", 429, { retryAfterMs: bucket.expiresAt - now }));
    }

    bucket.count += 1;
    return next();
  };
}
