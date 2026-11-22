type Window = { count: number; resetAt: number };

export const createRateLimiter = ({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) => {
  const windows = new Map<string, Window>();

  return (key: string, now = Date.now()) => {
    if (windows.size > 10_000)
      for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);

    const current = windows.get(key);
    if (!current || current.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (current.count >= limit)
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
      };
    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  };
};
