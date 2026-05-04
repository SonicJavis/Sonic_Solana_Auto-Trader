/**
 * Phase 7A — Deduplication and TTL helpers.
 *
 * Provides:
 *   - DedupeStore: an in-memory set of recently-seen dedupe keys with TTL tracking
 *   - isDuplicate: checks whether a key was already seen within its TTL window
 *   - isExpired: checks whether an event has exceeded its TTL
 *
 * No external cache, Redis, or queue dependency.
 * Clock injection is supported for deterministic testing.
 */

/**
 * Entry stored for each dedupe key: the timestamp when it was first seen.
 */
interface DedupeEntry {
  readonly seenAt: number;
  readonly ttlMs: number;
}

/** A function that returns the current time in milliseconds. Injected for testability. */
export type ClockFn = () => number;

const DEFAULT_CLOCK: ClockFn = () => Date.now();

/**
 * In-memory deduplication store.
 *
 * Tracks recently-seen dedupe keys and their TTLs.
 * Expired entries are lazily pruned on each operation.
 */
export class DedupeStore {
  private readonly entries = new Map<string, DedupeEntry>();
  private readonly clock: ClockFn;

  constructor(clock: ClockFn = DEFAULT_CLOCK) {
    this.clock = clock;
  }

  /**
   * Check whether the given key is a duplicate (was seen within its TTL window).
   * If not a duplicate, record the key and return false.
   * If already seen and TTL has not expired, return true.
   * If already seen and TTL has expired, treat as new and record again.
   *
   * @param key     The dedupe key.
   * @param ttlMs   How long (ms) after first observation to consider a repeat a duplicate.
   */
  isDuplicate(key: string, ttlMs: number): boolean {
    this.prune();
    const now = this.clock();
    const existing = this.entries.get(key);
    if (existing !== undefined) {
      const age = now - existing.seenAt;
      if (age < existing.ttlMs) {
        // Still within TTL — it's a duplicate
        return true;
      }
      // TTL has expired — fall through and record as new
    }
    this.entries.set(key, { seenAt: now, ttlMs });
    return false;
  }

  /**
   * Remove all expired entries.
   */
  prune(): void {
    const now = this.clock();
    for (const [key, entry] of this.entries) {
      if (now - entry.seenAt >= entry.ttlMs) {
        this.entries.delete(key);
      }
    }
  }

  /** Clear all entries (test utility). */
  clear(): void {
    this.entries.clear();
  }

  /** Number of currently tracked (possibly some expired) entries. */
  get size(): number {
    return this.entries.size;
  }
}

/**
 * Check whether an event has exceeded its TTL.
 *
 * @param timestampIso  The event's ISO-8601 timestamp string.
 * @param ttlMs         The TTL in milliseconds.
 * @param now           Optional current time in ms (defaults to Date.now()).
 * @returns true if the event is expired (age >= ttlMs), false otherwise.
 */
export function isEventExpired(
  timestampIso: string,
  ttlMs: number,
  now: number = Date.now(),
): boolean {
  const eventTime = new Date(timestampIso).getTime();
  if (isNaN(eventTime)) return true; // Unparseable timestamp → treat as expired
  return now - eventTime >= ttlMs;
}

/**
 * Generate a dedupe key from a category and type string.
 * The key is deterministic and safe to store.
 *
 * @param category  Event category.
 * @param type      Event type.
 * @param extra     Optional extra discriminator (e.g. a safe token symbol).
 */
export function buildDedupeKey(category: string, type: string, extra?: string): string {
  const parts = [category, type];
  if (extra !== undefined && extra.length > 0) {
    parts.push(extra);
  }
  return parts.join(':');
}
