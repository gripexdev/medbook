type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  medbookRateLimitStore?: Map<string, RateLimitEntry>;
};

const rateLimitStore = globalForRateLimit.medbookRateLimitStore ?? new Map<string, RateLimitEntry>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.medbookRateLimitStore = rateLimitStore;
}

export function applyRateLimit({
  key,
  limit,
  windowMs
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    });

    return {
      success: true,
      remaining: limit - 1,
      resetAt: now + windowMs
    };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt
    };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return {
    success: true,
    remaining: Math.max(limit - existing.count, 0),
    resetAt: existing.resetAt
  };
}
