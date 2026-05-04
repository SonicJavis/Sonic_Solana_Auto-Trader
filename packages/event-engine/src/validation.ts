/**
 * Phase 7A — Event envelope validation helpers.
 *
 * Validates that an EventEnvelope (or partial input) meets all required
 * structural and safety constraints before it is accepted by the event bus.
 *
 * Validation rules:
 *   - id must be a non-empty string
 *   - category must be a known EventCategory value
 *   - type must be a non-empty string with no whitespace
 *   - source must be a known EventSourceType value
 *   - severity must be a known EventSeverity value
 *   - timestamp must be a parseable ISO-8601 string and not in the future
 *   - payload must be a plain object (no functions, no circular refs, no raw Errors)
 *   - payload must be within the size limit when serialized
 *   - dedupeKey, if present, must be a non-empty string
 *   - ttlMs, if present, must be a positive integer
 *   - safeToPersist and safeToDisplay must be booleans
 */

import { EVENT_CATEGORIES, EVENT_SOURCE_TYPES, EVENT_SEVERITIES } from './types.js';
import type { EventCategory, EventSourceType, EventSeverity } from './types.js';
import type { EventEnvelope, EventPayload } from './event-envelope.js';
import { engineErr } from './errors.js';
import type { EventEngineResult } from './errors.js';

/** Maximum serialized payload size in bytes (10 KB). */
export const MAX_PAYLOAD_BYTES = 10_240;

/** Tolerance for timestamps in the future (allow up to 5 seconds of clock drift). */
const FUTURE_TOLERANCE_MS = 5_000;

/** Check that a value is a known EventCategory. */
export function isValidCategory(value: unknown): value is EventCategory {
  return EVENT_CATEGORIES.includes(value as EventCategory);
}

/** Check that a value is a known EventSourceType. */
export function isValidSourceType(value: unknown): value is EventSourceType {
  return EVENT_SOURCE_TYPES.includes(value as EventSourceType);
}

/** Check that a value is a known EventSeverity. */
export function isValidSeverity(value: unknown): value is EventSeverity {
  return EVENT_SEVERITIES.includes(value as EventSeverity);
}

/** Check that a string is a valid ISO-8601 timestamp and not too far in the future. */
export function isValidTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) return false;
  const t = new Date(value).getTime();
  if (isNaN(t)) return false;
  return t <= Date.now() + FUTURE_TOLERANCE_MS;
}

/**
 * Check that a payload is a plain object with no functions, class instances,
 * raw Errors, Symbols, circular references, or other non-serializable values.
 */
export function isSafePayload(value: unknown): value is EventPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  // Must be a plain object (not a class instance like Error, Date, etc.)
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  const visited = new Set<object>();
  return hasOnlySafeValues(value, visited);
}

/**
 * Recursively verify that all values are safe, tracking visited objects to
 * detect circular references without stack overflow.
 */
function hasOnlySafeValues(val: unknown, visited: Set<object>): boolean {
  if (val === null) return true;
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return true;
  if (typeof val === 'function' || typeof val === 'symbol' || typeof val === 'bigint') return false;
  if (typeof val !== 'object') return false;

  // Detect circular reference
  const obj = val as object;
  if (visited.has(obj)) return false;
  visited.add(obj);

  // Arrays are allowed in values (EventPayloadValue includes arrays)
  if (Array.isArray(val)) {
    for (const item of val) {
      if (!hasOnlySafeValues(item, visited)) return false;
    }
    return true;
  }
  // Plain objects only — no class instances (e.g. Error, Date, Map, Set, etc.)
  if (Object.getPrototypeOf(val) !== Object.prototype) return false;
  for (const v of Object.values(val as Record<string, unknown>)) {
    if (!hasOnlySafeValues(v, visited)) return false;
  }
  return true;
}

/**
 * Check that a serialized payload does not exceed MAX_PAYLOAD_BYTES.
 * Uses JSON character count as an approximation (1 char ≥ 1 byte in UTF-8 for ASCII).
 */
export function isPayloadWithinSizeLimit(payload: EventPayload): boolean {
  try {
    // JSON.stringify length is an approximation; actual UTF-8 bytes may be higher for
    // multi-byte characters, but this provides a reasonable and dependency-free check.
    return JSON.stringify(payload).length <= MAX_PAYLOAD_BYTES;
  } catch {
    return false;
  }
}

/**
 * Validate a complete EventEnvelope.
 * Returns ok(envelope) if valid, err(EventEngineError) if not.
 */
export function validateEventEnvelope(
  envelope: unknown,
): EventEngineResult<EventEnvelope> {
  if (envelope === null || typeof envelope !== 'object' || Array.isArray(envelope)) {
    return engineErr('INVALID_EVENT_ID', 'Event must be a plain object');
  }

  const e = envelope as Record<string, unknown>;

  // id
  if (typeof e['id'] !== 'string' || e['id'].length === 0) {
    return engineErr('INVALID_EVENT_ID', 'Event id must be a non-empty string');
  }

  // category
  if (!isValidCategory(e['category'])) {
    return engineErr(
      'INVALID_EVENT_CATEGORY',
      `Event category "${String(e['category'])}" is not a valid EventCategory`,
    );
  }

  // type
  if (typeof e['type'] !== 'string' || e['type'].length === 0 || /\s/.test(e['type'])) {
    return engineErr(
      'INVALID_EVENT_TYPE',
      'Event type must be a non-empty string with no whitespace',
    );
  }

  // source
  if (!isValidSourceType(e['source'])) {
    return engineErr(
      'INVALID_EVENT_SOURCE',
      `Event source "${String(e['source'])}" is not a valid EventSourceType`,
    );
  }

  // severity
  if (!isValidSeverity(e['severity'])) {
    return engineErr(
      'INVALID_EVENT_SEVERITY',
      `Event severity "${String(e['severity'])}" is not a valid EventSeverity`,
    );
  }

  // timestamp
  if (!isValidTimestamp(e['timestamp'])) {
    return engineErr(
      'INVALID_EVENT_TIMESTAMP',
      'Event timestamp must be a valid ISO-8601 string not in the future',
    );
  }

  // payload
  if (!isSafePayload(e['payload'])) {
    return engineErr(
      'UNSAFE_EVENT_PAYLOAD',
      'Event payload must be a plain serializable object with no functions, class instances, Errors, or circular references',
    );
  }
  if (!isPayloadWithinSizeLimit(e['payload'] as EventPayload)) {
    return engineErr(
      'EVENT_PAYLOAD_TOO_LARGE',
      `Event payload exceeds the ${MAX_PAYLOAD_BYTES}-byte limit`,
    );
  }

  // dedupeKey (optional)
  if (e['dedupeKey'] !== undefined) {
    if (typeof e['dedupeKey'] !== 'string' || e['dedupeKey'].length === 0) {
      return engineErr('INVALID_DEDUPE_KEY', 'dedupeKey must be a non-empty string when present');
    }
  }

  // ttlMs (optional)
  if (e['ttlMs'] !== undefined) {
    if (typeof e['ttlMs'] !== 'number' || !Number.isInteger(e['ttlMs']) || e['ttlMs'] <= 0) {
      return engineErr('INVALID_TTL', 'ttlMs must be a positive integer when present');
    }
  }

  // safeToPersist / safeToDisplay
  if (typeof e['safeToPersist'] !== 'boolean') {
    return engineErr('UNSAFE_EVENT_PAYLOAD', 'safeToPersist must be a boolean');
  }
  if (typeof e['safeToDisplay'] !== 'boolean') {
    return engineErr('UNSAFE_EVENT_PAYLOAD', 'safeToDisplay must be a boolean');
  }

  return { ok: true, value: e as unknown as EventEnvelope };
}
