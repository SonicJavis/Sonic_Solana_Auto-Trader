import type { PersistentAuditRecord, AuditStats, AuditLogRecord } from '@sonic/db';

const SEVERITY_ICONS: Record<string, string> = {
  debug: '🔍',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  critical: '🚨',
};

// ─── Legacy AuditLogRecord formatter (backward compat with phase2 tests) ─────

const LEGACY_REDACT_PATTERNS = [/token/i, /secret/i, /password/i, /private.*key/i, /api.*key/i, /mnemonic/i, /seed/i];

function legacyRedactValue(key: string, value: unknown): unknown {
  if (LEGACY_REDACT_PATTERNS.some((p) => p.test(key))) return '[REDACTED]';
  if (typeof value === 'string' && value.length >= 32 && /^[A-Za-z0-9_\-]+$/.test(value)) {
    return '[REDACTED]';
  }
  return value;
}

function legacyRedactDetails(details: string): string {
  try {
    const obj = JSON.parse(details) as Record<string, unknown>;
    const redacted: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      redacted[k] = legacyRedactValue(k, v);
    }
    return JSON.stringify(redacted);
  } catch {
    return '[parse error]';
  }
}

/**
 * Format a legacy AuditLogRecord for Telegram output.
 * Redacts sensitive values in the details JSON string.
 */
export function formatAuditRecord(record: AuditLogRecord): string {
  return [
    `[${record.timestamp}] ${record.eventType} (${record.severity})`,
    `  ${legacyRedactDetails(record.details)}`,
  ].join('\n');
}

/**
 * Format a list of legacy AuditLogRecord entries.
 */
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

// ─── Phase 4 PersistentAuditRecord formatter ─────────────────────────────────

/** Format a single PersistentAuditRecord for Telegram output (secret-safe) */
export function formatPersistentAuditRecord(record: PersistentAuditRecord): string {
  const icon = SEVERITY_ICONS[record.severity] ?? 'ℹ️';
  const ts = record.timestamp.replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
  const mode = record.mode ? ` [${record.mode}]` : '';
  const source = record.source ? ` (${record.source})` : '';
  // Prefer safeSummary; fall back to message; never expose raw detailsJson
  const text = record.safeSummary ?? record.message;
  return `${icon} ${ts}${source}${mode}\n  ${record.eventType}: ${text}`;
}

/** Format a list of PersistentAuditRecord entries for Telegram output */
export function formatAuditRecords(records: PersistentAuditRecord[], title: string): string {
  if (records.length === 0) {
    return `📋 ${title}\n\nNo audit events found.`;
  }
  const lines = [`📋 ${title}`, ''];
  for (const record of records) {
    lines.push(formatPersistentAuditRecord(record));
  }
  lines.push('', `Showing ${records.length} event(s)`);
  return lines.join('\n');
}

/** Format audit statistics for Telegram output */
export function formatAuditStats(stats: AuditStats): string {
  const lines = ['📊 Audit Statistics', ''];
  lines.push(`Total events: ${stats.total}`);
  if (stats.oldest) lines.push(`Oldest: ${stats.oldest}`);
  if (stats.newest) lines.push(`Newest: ${stats.newest}`);

  if (Object.keys(stats.byEventType).length > 0) {
    lines.push('', 'By event type:');
    for (const [type, count] of Object.entries(stats.byEventType).sort((a, b) => b[1] - a[1])) {
      lines.push(`  ${type}: ${count}`);
    }
  }

  if (Object.keys(stats.bySeverity).length > 0) {
    lines.push('', 'By severity:');
    for (const [sev, count] of Object.entries(stats.bySeverity).sort((a, b) => b[1] - a[1])) {
      const icon = SEVERITY_ICONS[sev] ?? '';
      lines.push(`  ${icon} ${sev}: ${count}`);
    }
  }

  return lines.join('\n');
}

/** Format /audit help text */
export function formatAuditHelp(): string {
  return [
    '📋 /audit — Audit Log Commands',
    '',
    '/audit            — Recent events (last 10)',
    '/audit recent     — Recent events (last 10)',
    '/audit page N     — Page N of events',
    '/audit severity X — Filter by severity (debug/info/warn/error/critical)',
    '/audit type X     — Filter by event type',
    '/audit source X   — Filter by source',
    '/audit stats      — Aggregate statistics',
    '/audit help       — Show this help',
    '',
    'No secrets are ever shown in audit output.',
  ].join('\n');
}
