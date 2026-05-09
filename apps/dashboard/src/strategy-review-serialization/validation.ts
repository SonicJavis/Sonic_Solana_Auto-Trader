/**
 * Phase 42 — Strategy Review Serialization Preview Fixtures v1: validation.
 *
 * Pure, deterministic validation and safety-validation helpers.
 * No thrown errors for expected invalid input, no timers, no network, no filesystem.
 */

import type {
  StrategyReviewSerializationSafetyResult,
  StrategyReviewSerializationValidationIssue,
  StrategyReviewSerializationValidationResult,
} from './types.js';
import {
  isValidStrategyReviewSerializationGeneratedAt,
  isValidStrategyReviewSerializationPreviewFixtureKind,
  isValidStrategyReviewSerializationPreviewFixtureName,
  isValidStrategyReviewSerializationPreviewFormat,
  isValidStrategyReviewSerializationSource,
} from './normalization.js';

// ─── Pattern constants ────────────────────────────────────────────────────────

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
  /\b(?:live data|real-time|solana rpc|provider api|jito|mev|mempool|yellowstone|geyser|websocket)\b/i;
const EXECUTION_PATTERN =
  /\b(?:sign transaction|send transaction|sendRawTransaction|swap|order fill|position|wallet connect)\b/i;
const ADVICE_PATTERN =
  /\b(?:investment advice|trading signal|price target|buy now|sell now|strong buy|strong sell)\b/i;
const WALLET_ADDRESS_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;
const TX_HASH_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewSerializationValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, out: string[] = []): readonly string[] {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, out));
  } else if (isRecord(value)) {
    Object.values(value).forEach(entry => collectStrings(entry, out));
  }
  return out;
}

// ─── Fixture validation ───────────────────────────────────────────────────────

export function validateStrategyReviewSerializationPreviewFixture(
  input: unknown,
): StrategyReviewSerializationValidationResult {
  const issues: StrategyReviewSerializationValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('INVALID_INPUT', 'fixture', 'Fixture must be a non-null object.')],
    };
  }

  if (!isValidStrategyReviewSerializationPreviewFixtureName(input['name'])) {
    issues.push(
      issue(
        'INVALID_NAME',
        'name',
        `Unsupported fixture name: ${String(input['name'])}.`,
      ),
    );
  }

  if (!isValidStrategyReviewSerializationPreviewFixtureKind(input['kind'])) {
    issues.push(
      issue(
        'INVALID_KIND',
        'kind',
        `Unsupported fixture kind: ${String(input['kind'])}.`,
      ),
    );
  }

  if (!isValidStrategyReviewSerializationPreviewFormat(input['format'])) {
    issues.push(
      issue(
        'INVALID_FORMAT',
        'format',
        `Unsupported preview format: ${String(input['format'])}.`,
      ),
    );
  }

  if (typeof input['title'] !== 'string' || input['title'].trim() === '') {
    issues.push(issue('MISSING_TITLE', 'title', 'title must be a non-empty string.'));
  }

  if (typeof input['description'] !== 'string' || input['description'].trim() === '') {
    issues.push(
      issue('MISSING_DESCRIPTION', 'description', 'description must be a non-empty string.'),
    );
  }

  if (!isRecord(input['reportReference'])) {
    issues.push(
      issue(
        'INVALID_REPORT_REFERENCE',
        'reportReference',
        'reportReference must be a non-null object.',
      ),
    );
  } else {
    const ref = input['reportReference'];
    if (ref['sourcePhase'] !== 41) {
      issues.push(
        issue(
          'INVALID_REPORT_REFERENCE_PHASE',
          'reportReference.sourcePhase',
          'reportReference.sourcePhase must be 41.',
        ),
      );
    }
    if (ref['fixtureOnly'] !== true) {
      issues.push(
        issue(
          'INVALID_REPORT_REFERENCE_FIXTURE_ONLY',
          'reportReference.fixtureOnly',
          'reportReference.fixtureOnly must be true.',
        ),
      );
    }
    if (ref['syntheticOnly'] !== true) {
      issues.push(
        issue(
          'INVALID_REPORT_REFERENCE_SYNTHETIC_ONLY',
          'reportReference.syntheticOnly',
          'reportReference.syntheticOnly must be true.',
        ),
      );
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be a non-null object.'));
  } else {
    const meta = input['meta'];
    if (meta['phase'] !== 42) {
      issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 42.'));
    }
    if (!isValidStrategyReviewSerializationGeneratedAt(meta['generatedAt'])) {
      issues.push(
        issue(
          'INVALID_META_GENERATED_AT',
          'meta.generatedAt',
          'meta.generatedAt must be the deterministic Phase 42 timestamp.',
        ),
      );
    }
    if (!isValidStrategyReviewSerializationSource(meta['source'])) {
      issues.push(
        issue(
          'INVALID_META_SOURCE',
          'meta.source',
          'meta.source must be the Phase 42 source string.',
        ),
      );
    }
    if (meta['fixtureOnly'] !== true) {
      issues.push(
        issue('INVALID_META_FIXTURE_ONLY', 'meta.fixtureOnly', 'meta.fixtureOnly must be true.'),
      );
    }
    if (meta['liveData'] !== false) {
      issues.push(
        issue('INVALID_META_LIVE_DATA', 'meta.liveData', 'meta.liveData must be false.'),
      );
    }
    if (meta['externalNetwork'] !== false) {
      issues.push(
        issue(
          'INVALID_META_EXTERNAL_NETWORK',
          'meta.externalNetwork',
          'meta.externalNetwork must be false.',
        ),
      );
    }
  }

  if (!isRecord(input['safetyBoundary'])) {
    issues.push(
      issue('INVALID_SAFETY_BOUNDARY', 'safetyBoundary', 'safetyBoundary must be a non-null object.'),
    );
  } else {
    const sb = input['safetyBoundary'];
    if (sb['noActualFileExport'] !== true) {
      issues.push(
        issue(
          'INVALID_SAFETY_BOUNDARY_FILE_EXPORT',
          'safetyBoundary.noActualFileExport',
          'safetyBoundary.noActualFileExport must be true.',
        ),
      );
    }
    if (sb['strategyReviewActualFileExport'] !== false) {
      issues.push(
        issue(
          'INVALID_SAFETY_BOUNDARY_ACTUAL_FILE_EXPORT',
          'safetyBoundary.strategyReviewActualFileExport',
          'strategyReviewActualFileExport must be false.',
        ),
      );
    }
  }

  if (
    isRecord(input) &&
    isRecord(input['meta']) &&
    input['meta']['fixtureOnly'] === true &&
    input['meta']['liveData'] === false
  ) {
    try {
      const s = JSON.stringify(input);
      if (typeof s !== 'string' || s.length === 0) {
        issues.push(
          issue('NOT_SERIALIZABLE', 'fixture', 'Fixture must be JSON serializable.', 'error'),
        );
      }
    } catch {
      issues.push(
        issue('NOT_SERIALIZABLE', 'fixture', 'Fixture must be JSON serializable.', 'error'),
      );
    }
  }

  return { valid: issues.length === 0, issues };
}

// ─── Safety validation ────────────────────────────────────────────────────────

export function validateStrategyReviewSerializationSafety(
  input: unknown,
): StrategyReviewSerializationSafetyResult {
  const violations: string[] = [];

  const strings = collectStrings(input);

  for (const str of strings) {
    if (EMAIL_PATTERN.test(str)) {
      violations.push(`Personal email detected: "${str.slice(0, 40)}"`);
    }
    if (PHONE_PATTERN.test(str)) {
      violations.push(`Phone number pattern detected: "${str.slice(0, 40)}"`);
    }
    if (STREET_PATTERN.test(str)) {
      violations.push(`Street address pattern detected: "${str.slice(0, 40)}"`);
    }
    if (URL_PATTERN.test(str)) {
      violations.push(`External URL detected: "${str.slice(0, 60)}"`);
    }
    if (STACK_TRACE_PATTERN.test(str)) {
      violations.push(`Stack trace pattern detected: "${str.slice(0, 60)}"`);
    }
    if (LOCAL_PATH_PATTERN.test(str)) {
      violations.push(`Local filesystem path detected: "${str.slice(0, 60)}"`);
    }
    if (SECRET_PATTERN.test(str)) {
      violations.push(`Secret/credential pattern detected: "${str.slice(0, 60)}"`);
    }
    if (LIVE_DATA_PATTERN.test(str)) {
      violations.push(`Live-data reference detected: "${str.slice(0, 60)}"`);
    }
    if (EXECUTION_PATTERN.test(str)) {
      violations.push(`Execution logic reference detected: "${str.slice(0, 60)}"`);
    }
    if (ADVICE_PATTERN.test(str)) {
      violations.push(`Investment advice detected: "${str.slice(0, 60)}"`);
    }
    if (WALLET_ADDRESS_PATTERN.test(str)) {
      violations.push(`Wallet address pattern detected: "${str.slice(0, 60)}"`);
    }
    if (TX_HASH_PATTERN.test(str)) {
      violations.push(`Transaction hash pattern detected: "${str.slice(0, 60)}"`);
    }
  }

  const uniqueViolations = [...new Set(violations)].sort();
  return { safe: uniqueViolations.length === 0, violations: uniqueViolations };
}
