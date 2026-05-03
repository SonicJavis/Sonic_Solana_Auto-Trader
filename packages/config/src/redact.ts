/**
 * Secret redaction utilities.
 * Deterministic output: always returns [REDACTED] for sensitive values.
 */

/** Key patterns that indicate sensitive data */
const SENSITIVE_KEY_PATTERNS: readonly RegExp[] = [
  /token/i,
  /secret/i,
  /private/i,
  /password/i,
  /mnemonic/i,
  /seed/i,
  /\bkey\b/i,
  /apikey/i,
  /api[-_]key/i,
  /credential/i,
  /bearer/i,
  /auth/i,
];

/** Value patterns that look like secrets regardless of key */
const SENSITIVE_VALUE_PATTERNS: readonly RegExp[] = [
  // JWT: three base64url segments separated by dots
  /^[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}$/,
  // Long hex strings (32+ chars)
  /^[0-9a-fA-F]{32,}$/,
  // Long base58-like (private keys, Solana addresses used as secrets)
  /^[1-9A-HJ-NP-Za-km-z]{32,}$/,
  // Long base64-like
  /^[A-Za-z0-9+/]{32,}={0,2}$/,
  // Bearer token prefix
  /^Bearer\s+\S+/i,
];

export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((p) => p.test(key));
}

function isSensitiveValue(value: string): boolean {
  // Don't redact very short strings or simple booleans/numbers
  if (value.length < 20) return false;
  return SENSITIVE_VALUE_PATTERNS.some((p) => p.test(value));
}

export function redactValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (isSensitiveValue(value)) return '[REDACTED]';
    return value;
  }
  if (value instanceof Error) {
    return { message: redactString(value.message), name: value.name };
  }
  if (Array.isArray(value)) {
    return value.map((v: unknown) => redactValue(v));
  }
  if (typeof value === 'object') {
    return redactObject(value as Record<string, unknown>);
  }
  return value;
}

export function redactObject(
  obj: Record<string, unknown>,
  seen: WeakSet<object> = new WeakSet(),
): Record<string, unknown> {
  if (seen.has(obj)) return { '[circular]': true };
  seen.add(obj);
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveKey(key)) {
      result[key] = '[REDACTED]';
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = redactObject(value as Record<string, unknown>, seen);
    } else if (Array.isArray(value)) {
      result[key] = (value as unknown[]).map((v) =>
        v !== null && typeof v === 'object' && !Array.isArray(v)
          ? redactObject(v as Record<string, unknown>, seen)
          : redactValue(v),
      );
    } else {
      result[key] = redactValue(value);
    }
  }
  return result;
}

export function redactString(value: string): string {
  // Pre-check: only scan strings that could contain secrets
  if (value.length < 32) return value;
  // Redact long hex strings — tight upper bound (128) prevents ReDoS
  let result = value.replace(/\b[0-9a-fA-F]{32,128}\b/g, '[REDACTED]');
  // Redact long alphanumeric token-like strings — tight upper bound (100) prevents ReDoS
  result = result.replace(/\b[A-Za-z0-9_/-]{40,100}\b/g, '[REDACTED]');
  return result;
}

export function safeStringify(value: unknown): string {
  try {
    const seen = new WeakSet<object>();
    return JSON.stringify(
      value,
      (_key, val: unknown) => {
        if (val !== null && typeof val === 'object') {
          if (seen.has(val as object)) return '[circular]';
          seen.add(val as object);
        }
        return val;
      },
      2,
    );
  } catch {
    return '[unserializable]';
  }
}

// Backward-compat alias used by existing code
export function redactSecrets(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  return redactObject(obj);
}

