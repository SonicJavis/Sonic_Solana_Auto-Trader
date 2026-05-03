import type { AppConfig } from './schema.js';
import { SENSITIVE_FIELDS } from './schema.js';
import { isSensitiveKey, redactValue } from './redact.js';

export interface ConfigProvenanceEntry {
  readonly field: string;
  readonly source: 'env' | 'default' | 'derived';
  readonly sensitive: boolean;
  readonly redacted: boolean;
  readonly defaultUsed: boolean;
  readonly safeDisplayValue: string;
}

function isSensitiveField(field: string): boolean {
  return SENSITIVE_FIELDS.has(field) || isSensitiveKey(field);
}

function safeDisplay(field: string, value: unknown): string {
  if (isSensitiveField(field)) return '[REDACTED]';
  if (value === undefined || value === null) return 'undefined';
  const redacted = redactValue(value);
  if (redacted === '[REDACTED]') return '[REDACTED]';
  if (Array.isArray(redacted)) {
    return redacted.length === 0 ? '[]' : `[${redacted.length} items]`;
  }
  return String(redacted);
}

export function getConfigProvenance(
  env: NodeJS.ProcessEnv,
  config: AppConfig,
): ConfigProvenanceEntry[] {
  const entries: ConfigProvenanceEntry[] = [];
  const fields = Object.keys(config) as (keyof AppConfig)[];
  for (const field of fields) {
    const envVal = env[field];
    const sensitive = isSensitiveField(field);
    const defaultUsed = envVal === undefined;
    const source: 'env' | 'default' = defaultUsed ? 'default' : 'env';
    entries.push({
      field,
      source,
      sensitive,
      redacted: sensitive,
      defaultUsed,
      safeDisplayValue: safeDisplay(field, config[field]),
    });
  }
  return entries;
}
