// ============================================================
// NITYASĀDHANĀ — RATE LIMITING & ABUSE MITIGATION
// ============================================================

interface RateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically prune stale entries older than 2 hours
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.pruneStale(), 1000 * 60 * 30);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  private pruneStale() {
    const now = Date.now();
    const maxWindow = 1000 * 60 * 60 * 2; // 2 hours
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindow);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Sliding window rate limiter.
   * @param key Identifier (e.g. `invite_create:${guruId}` or `code_val:${ip}`)
   * @param limit Max allowed requests within the window
   * @param windowMs Window duration in milliseconds
   */
  check(
    key: string,
    limit: number,
    windowMs: number
  ): {
    allowed: boolean;
    remaining: number;
    resetMs: number;
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= limit) {
      const oldest = record.timestamps[0];
      const resetMs = oldest + windowMs - now;
      return {
        allowed: false,
        remaining: 0,
        resetMs: Math.max(0, resetMs),
      };
    }

    record.timestamps.push(now);
    return {
      allowed: true,
      remaining: limit - record.timestamps.length,
      resetMs: windowMs,
    };
  }

  /**
   * Reset limits for a specific key (useful for testing or administrative unlocks)
   */
  reset(key: string) {
    this.store.delete(key);
  }

  /**
   * Clear all records
   */
  clearAll() {
    this.store.clear();
  }
}

export const rateLimiter = new InMemoryRateLimiter();

// Preconfigured domain rate limiters
export const RATE_LIMITS = {
  INVITATION_CREATE: { limit: 20, windowMs: 1000 * 60 * 60 }, // 20 per hour
  INVITATION_VALIDATE: { limit: 15, windowMs: 1000 * 60 }, // 15 per minute
  INVITATION_ACCEPT: { limit: 10, windowMs: 1000 * 60 * 15 }, // 10 per 15 min
  REPORT_SUBMISSION: { limit: 30, windowMs: 1000 * 60 * 60 }, // 30 per hour
};
