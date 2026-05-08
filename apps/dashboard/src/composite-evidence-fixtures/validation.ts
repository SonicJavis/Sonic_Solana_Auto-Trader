/**
 * apps/dashboard/src/composite-evidence-fixtures/validation.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Validation & Safety
 *
 * Pure validation helpers. No mutation, no side effects, no throws for expected input.
 */

import type {
  CompositeEvidenceFixtureSafetyResult,
  CompositeEvidenceFixtureValidationIssue,
  CompositeEvidenceFixtureValidationResult,
} from './types.js';
import {
  isValidCompositeEvidenceFixtureKind,
  isValidCompositeEvidenceFixtureName,
  isValidGeneratedAt,
  isValidSource,
} from './normalization.js';

// ─── Safety patterns ──────────────────────────────────────────────────────────

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /\b(?:\+?\d{1,2}\s*)?(?:\(?\d{3}\)?[-.\s]*)\d{3}[-.\s]*\d{4}\b/;
const STREET_PATTERN =
  /\b\d{1,5}\s+[A-Za-z0-9.'-]+\s(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr)\b/i;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/i;
const STACK_TRACE_PATTERN =
  /(?:TypeError:|ReferenceError:|SyntaxError:|\bat\s+\S+\s+\()|(?:\bat Object\.)/;
const LOCAL_PATH_PATTERN = /(?:\/home\/|\/Users\/|C:\\Users\\|file:\/\/)/;
const SECRET_PATTERN =
  /\b(?:private key|seed phrase|mnemonic|api key|secret token|access token|BEGIN PRIVATE KEY)\b/i;
const LIVE_DATA_PATTERN =
  /\b(?:live data|real-time|scraped|api collected|solana rpc|provider api|jito|mev|mempool|yellowstone|geyser|helius|websocket|fetch\(\)|axios)\b/i;
const ADVICE_PATTERN =
  /\b(?:investment advice|recommendation|trading signal|buy now|sell now|entry point|exit target|price target)\b/i;
const EXECUTION_PATTERN =
  /\b(?:execute trade|place order|swap now|send transaction|sign transaction|connect wallet)\b/i;
const ACCUSATION_PATTERN =
  /\b(?:criminal|fraudster|scammer|thief|real manipulator|guilty party|proven manipulation by)\b/i;
const SOLANA_ADDRESS_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;
const TX_HASH_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function makeIssue(
  code: string,
  message: string,
  field: string,
  severity: 'error' | 'warning' = 'error',
): CompositeEvidenceFixtureValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, results: string[] = []): readonly string[] {
  if (typeof value === 'string') {
    results.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, results);
    }
  } else if (isRecord(value)) {
    for (const v of Object.values(value)) {
      collectStrings(v, results);
    }
  }
  return results;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateCompositeEvidenceDashboardReportFixture(
  fixture: unknown,
): CompositeEvidenceFixtureValidationResult {
  const issues: CompositeEvidenceFixtureValidationIssue[] = [];

  if (!isRecord(fixture)) {
    return {
      valid: false,
      issues: [makeIssue('NOT_OBJECT', 'Fixture must be a non-null object.', 'fixture')],
    };
  }

  if (!isValidCompositeEvidenceFixtureName(fixture['name'])) {
    issues.push(
      makeIssue('INVALID_NAME', `Unrecognized fixture name: ${String(fixture['name'])}.`, 'name'),
    );
  }

  if (!isValidCompositeEvidenceFixtureKind(fixture['kind'])) {
    issues.push(
      makeIssue('INVALID_KIND', `Unrecognized fixture kind: ${String(fixture['kind'])}.`, 'kind'),
    );
  }

  if (typeof fixture['title'] !== 'string' || fixture['title'].trim() === '') {
    issues.push(makeIssue('MISSING_TITLE', 'title must be a non-empty string.', 'title'));
  }

  if (typeof fixture['description'] !== 'string' || fixture['description'].trim() === '') {
    issues.push(
      makeIssue('MISSING_DESCRIPTION', 'description must be a non-empty string.', 'description'),
    );
  }

  if (!isRecord(fixture['meta'])) {
    issues.push(makeIssue('MISSING_META', 'meta must be a non-null object.', 'meta'));
  } else {
    const meta = fixture['meta'] as Record<string, unknown>;
    if (!isValidGeneratedAt(meta['generatedAt'])) {
      issues.push(
        makeIssue(
          'INVALID_GENERATED_AT',
          'meta.generatedAt must be the deterministic Phase 35 constant.',
          'meta.generatedAt',
        ),
      );
    }
    if (!isValidSource(meta['source'])) {
      issues.push(
        makeIssue(
          'INVALID_SOURCE',
          'meta.source must be the Phase 35 source constant.',
          'meta.source',
        ),
      );
    }
    if (meta['liveData'] !== false) {
      issues.push(
        makeIssue('LIVE_DATA_ENABLED', 'meta.liveData must be false.', 'meta.liveData'),
      );
    }
    if (meta['externalNetwork'] !== false) {
      issues.push(
        makeIssue(
          'EXTERNAL_NETWORK_ENABLED',
          'meta.externalNetwork must be false.',
          'meta.externalNetwork',
        ),
      );
    }
    if (meta['persistence'] !== false) {
      issues.push(
        makeIssue(
          'PERSISTENCE_ENABLED',
          'meta.persistence must be false.',
          'meta.persistence',
        ),
      );
    }
    if (meta['nonAdvisory'] !== true) {
      issues.push(
        makeIssue(
          'NOT_NON_ADVISORY',
          'meta.nonAdvisory must be true.',
          'meta.nonAdvisory',
        ),
      );
    }
    if (meta['nonAccusatory'] !== true) {
      issues.push(
        makeIssue(
          'NOT_NON_ACCUSATORY',
          'meta.nonAccusatory must be true.',
          'meta.nonAccusatory',
        ),
      );
    }
  }

  if (!isRecord(fixture['summary'])) {
    issues.push(
      makeIssue('MISSING_SUMMARY', 'summary must be a non-null object.', 'summary'),
    );
  } else {
    const summary = fixture['summary'] as Record<string, unknown>;
    if (summary['nonAdvisory'] !== true) {
      issues.push(
        makeIssue(
          'SUMMARY_NOT_NON_ADVISORY',
          'summary.nonAdvisory must be true.',
          'summary.nonAdvisory',
        ),
      );
    }
    if (summary['safeToDisplay'] !== true) {
      issues.push(
        makeIssue(
          'SUMMARY_NOT_SAFE_TO_DISPLAY',
          'summary.safeToDisplay must be true.',
          'summary.safeToDisplay',
        ),
      );
    }
  }

  return { valid: issues.length === 0, issues };
}

// ─── Safety validation ────────────────────────────────────────────────────────

export function validateCompositeEvidenceDashboardReportSafety(
  fixture: unknown,
): CompositeEvidenceFixtureSafetyResult {
  const violations: string[] = [];

  const strings = collectStrings(fixture);

  for (const text of strings) {
    if (EMAIL_PATTERN.test(text)) violations.push(`PII_EMAIL: ${text}`);
    if (PHONE_PATTERN.test(text)) violations.push(`PII_PHONE: ${text}`);
    if (STREET_PATTERN.test(text)) violations.push(`PII_ADDRESS: ${text}`);
    if (URL_PATTERN.test(text)) violations.push(`URL_PRESENT: ${text}`);
    if (STACK_TRACE_PATTERN.test(text)) violations.push(`STACK_TRACE: ${text}`);
    if (LOCAL_PATH_PATTERN.test(text)) violations.push(`LOCAL_PATH: ${text}`);
    if (SECRET_PATTERN.test(text)) violations.push(`SECRET: ${text}`);
    if (LIVE_DATA_PATTERN.test(text)) violations.push(`LIVE_DATA: ${text}`);
    if (ADVICE_PATTERN.test(text)) violations.push(`ADVICE: ${text}`);
    if (EXECUTION_PATTERN.test(text)) violations.push(`EXECUTION: ${text}`);
    if (ACCUSATION_PATTERN.test(text)) violations.push(`ACCUSATION: ${text}`);
    if (SOLANA_ADDRESS_PATTERN.test(text)) violations.push(`SOLANA_ADDRESS: ${text}`);
    if (TX_HASH_PATTERN.test(text)) violations.push(`TX_HASH: ${text}`);
  }

  return {
    safe: violations.length === 0,
    violations: [...new Set(violations)],
  };
}
