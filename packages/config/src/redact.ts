const SECRET_PATTERNS = [/token/i, /secret/i, /password/i, /private.*key/i, /api.*key/i];

export function redactSecrets(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SECRET_PATTERNS.some((p) => p.test(key))) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function redactString(value: string): string {
  return value.replace(/\b[A-Za-z0-9_-]{32,}\b/g, '[REDACTED]');
}
