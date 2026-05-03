import type { AuditLogRecord } from '@sonic/db';

const REDACT_PATTERNS = [/token/i, /secret/i, /password/i, /private.*key/i, /api.*key/i, /mnemonic/i, /seed/i];

function redactValue(key: string, value: unknown): unknown {
  if (typeof key === 'string' && REDACT_PATTERNS.some((p) => p.test(key))) {
    return '[REDACTED]';
  }
  if (typeof value === 'string' && value.length >= 32 && /^[A-Za-z0-9_\-]+$/.test(value)) {
    return '[REDACTED]';
  }
  return value;
}

function redactDetails(details: string): string {
  try {
    const obj = JSON.parse(details) as Record<string, unknown>;
    const redacted: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      redacted[k] = redactValue(k, v);
    }
    return JSON.stringify(redacted);
  } catch {
    return '[parse error]';
  }
}

export function formatAuditRecord(record: AuditLogRecord): string {
  return [
    `[${record.timestamp}] ${record.eventType} (${record.severity})`,
    `  ${redactDetails(record.details)}`,
  ].join('\n');
}

export function formatAuditLog(records: AuditLogRecord[]): string {
  if (records.length === 0) {
    return 'Audit Log\n\nNo audit events recorded yet.';
  }
  const lines = ['Audit Log (recent events)', ''];
  for (const record of records) {
    lines.push(formatAuditRecord(record));
  }
  return lines.join('\n');
}
