/**
 * Phase 45 — Strategy Review Export Audit Fixtures v1: validation.
 *
 * Pure, deterministic validation and safety-validation helpers.
 * No thrown errors for expected invalid input, no timers, no network, no filesystem.
 */

import type {
  StrategyReviewExportAuditSafetyResult,
  StrategyReviewExportAuditValidationIssue,
  StrategyReviewExportAuditValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditFixtureKind,
  isValidStrategyReviewExportAuditFixtureName,
  isValidStrategyReviewExportAuditGeneratedAt,
  isValidStrategyReviewExportAuditSeverity,
  isValidStrategyReviewExportAuditSource,
  isValidStrategyReviewExportAuditState,
} from './normalization.js';

const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/i;
const LOCAL_PATH_PATTERN = /(?:\/home\/|\/Users\/|C:\\Users\\|file:\/\/)/;
const SECRET_PATTERN =
  /\b(?:private key|seed phrase|mnemonic|api key|secret token|access token|BEGIN PRIVATE KEY)\b/i;
const EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|sendRawTransaction|swap|order fill|buy now|sell now)\b/i;
const NETWORK_PATTERN = /\b(?:fetch|axios|websocket|XMLHttpRequest|Solana RPC)\b/i;
const DYNAMIC_CODE_PATTERN = /(?:child_process|exec\(|eval\(|Function\()/;
const DOWNLOAD_PATTERN =
  /\b(?:Blob|URL\.createObjectURL|download\(|createWriteStream|writeFileSync|fs\.writeFile)\b/;
const TIMER_PATTERN = /\b(?:Date\.now|new Date|Math\.random|setTimeout|setInterval)\b/;
const DOM_PATTERN = /\b(?:document|window|localStorage|sessionStorage)\b/;
const WALLET_HASH_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportAuditValidationIssue {
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

export function validateStrategyReviewExportAuditFixture(
  input: unknown,
): StrategyReviewExportAuditValidationResult {
  const issues: StrategyReviewExportAuditValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (!isValidStrategyReviewExportAuditFixtureName(input['name'])) {
    issues.push(
      issue('INVALID_NAME', 'name', `Invalid or missing fixture name: ${String(input['name'])}`),
    );
  }

  if (!isValidStrategyReviewExportAuditFixtureKind(input['kind'])) {
    issues.push(
      issue('INVALID_KIND', 'kind', `Invalid or missing fixture kind: ${String(input['kind'])}`),
    );
  }

  if (typeof input['title'] !== 'string' || input['title'].trim() === '') {
    issues.push(issue('INVALID_TITLE', 'title', 'title must be a non-empty string'));
  }

  if (typeof input['description'] !== 'string' || input['description'].trim() === '') {
    issues.push(
      issue('INVALID_DESCRIPTION', 'description', 'description must be a non-empty string'),
    );
  }

  if (!isRecord(input['auditItem'])) {
    issues.push(issue('INVALID_AUDIT_ITEM', 'auditItem', 'auditItem must be a non-null object'));
  } else {
    const ai = input['auditItem'];
    if (typeof ai['auditItemId'] !== 'string' || ai['auditItemId'].trim() === '') {
      issues.push(
        issue('INVALID_AUDIT_ITEM_ID', 'auditItem.auditItemId', 'auditItemId must be non-empty string'),
      );
    }
    if (!isValidStrategyReviewExportAuditState(ai['state'])) {
      issues.push(
        issue('INVALID_STATE', 'auditItem.state', `Invalid audit state: ${String(ai['state'])}`),
      );
    }
    if (!isValidStrategyReviewExportAuditSeverity(ai['severity'])) {
      issues.push(
        issue(
          'INVALID_SEVERITY',
          'auditItem.severity',
          `Invalid audit severity: ${String(ai['severity'])}`,
        ),
      );
    }
    if (!isRecord(ai['queueReference'])) {
      issues.push(
        issue(
          'INVALID_QUEUE_REFERENCE',
          'auditItem.queueReference',
          'queueReference must be a non-null object',
        ),
      );
    } else {
      if (ai['queueReference']['sourcePhase'] !== 44) {
        issues.push(
          issue(
            'INVALID_SOURCE_PHASE',
            'auditItem.queueReference.sourcePhase',
            'sourcePhase must be 44',
          ),
        );
      }
      if (ai['queueReference']['fixtureOnly'] !== true) {
        issues.push(
          issue(
            'MISSING_FIXTURE_ONLY',
            'auditItem.queueReference.fixtureOnly',
            'fixtureOnly must be true',
          ),
        );
      }
      if (ai['queueReference']['syntheticOnly'] !== true) {
        issues.push(
          issue(
            'MISSING_SYNTHETIC_ONLY',
            'auditItem.queueReference.syntheticOnly',
            'syntheticOnly must be true',
          ),
        );
      }
    }
    if (!Array.isArray(ai['findings'])) {
      issues.push(
        issue('INVALID_FINDINGS', 'auditItem.findings', 'findings must be an array'),
      );
    }
    if (!isValidStrategyReviewExportAuditGeneratedAt(ai['auditedAt'])) {
      issues.push(
        issue('INVALID_AUDITED_AT', 'auditItem.auditedAt', 'auditedAt must be the deterministic constant'),
      );
    }
    if (ai['fixtureOnly'] !== true) {
      issues.push(
        issue('MISSING_FIXTURE_ONLY', 'auditItem.fixtureOnly', 'fixtureOnly must be true'),
      );
    }
    if (ai['syntheticOnly'] !== true) {
      issues.push(
        issue('MISSING_SYNTHETIC_ONLY', 'auditItem.syntheticOnly', 'syntheticOnly must be true'),
      );
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be a non-null object'));
  } else {
    const m = input['meta'];
    if (m['phase'] !== 45) {
      issues.push(issue('INVALID_PHASE', 'meta.phase', 'meta.phase must be 45'));
    }
    if (!isValidStrategyReviewExportAuditGeneratedAt(m['generatedAt'])) {
      issues.push(
        issue(
          'INVALID_GENERATED_AT',
          'meta.generatedAt',
          'meta.generatedAt must be the deterministic constant',
        ),
      );
    }
    if (!isValidStrategyReviewExportAuditSource(m['source'])) {
      issues.push(
        issue('INVALID_SOURCE', 'meta.source', 'meta.source must be the deterministic constant'),
      );
    }
    if (m['fixtureOnly'] !== true) {
      issues.push(issue('MISSING_FIXTURE_ONLY', 'meta.fixtureOnly', 'fixtureOnly must be true'));
    }
    if (m['syntheticOnly'] !== true) {
      issues.push(
        issue('MISSING_SYNTHETIC_ONLY', 'meta.syntheticOnly', 'syntheticOnly must be true'),
      );
    }
    if (m['auditExecutionDisabled'] !== true) {
      issues.push(
        issue(
          'AUDIT_EXECUTION_NOT_DISABLED',
          'meta.auditExecutionDisabled',
          'auditExecutionDisabled must be true',
        ),
      );
    }
    const falseFlags = [
      'actualAuditLogs',
      'auditPersistence',
      'auditFileWrites',
      'auditExternalNetwork',
      'actualQueueWorkers',
      'scheduledJobs',
      'backgroundJobs',
      'actualFileExport',
      'filesystemWrites',
      'downloadSupport',
      'externalNetwork',
      'persistence',
      'execution',
      'tradingSignals',
      'investmentAdvice',
    ] as const;
    for (const flag of falseFlags) {
      if (m[flag] !== false) {
        issues.push(
          issue(`FLAG_NOT_FALSE_${flag.toUpperCase()}`, `meta.${flag}`, `meta.${flag} must be false`),
        );
      }
    }
  }

  if (!isRecord(input['safetyBoundary'])) {
    issues.push(
      issue('INVALID_SAFETY_BOUNDARY', 'safetyBoundary', 'safetyBoundary must be a non-null object'),
    );
  } else {
    const sb = input['safetyBoundary'];
    if (sb['strategyReviewExportAuditFixtures'] !== true) {
      issues.push(
        issue(
          'MISSING_AUDIT_FIXTURES_FLAG',
          'safetyBoundary.strategyReviewExportAuditFixtures',
          'strategyReviewExportAuditFixtures must be true',
        ),
      );
    }
  }

  if (!Array.isArray(input['safeNotes'])) {
    issues.push(issue('INVALID_SAFE_NOTES', 'safeNotes', 'safeNotes must be an array'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateStrategyReviewExportAuditSafety(
  input: unknown,
): StrategyReviewExportAuditSafetyResult {
  const violations: string[] = [];
  const strings = collectStrings(input);

  for (const s of strings) {
    if (URL_PATTERN.test(s)) {
      violations.push(`String contains URL: "${s.slice(0, 60)}"`);
    }
    if (LOCAL_PATH_PATTERN.test(s)) {
      violations.push(`String contains local path: "${s.slice(0, 60)}"`);
    }
    if (SECRET_PATTERN.test(s)) {
      violations.push(`String contains secret-like term: "${s.slice(0, 60)}"`);
    }
    if (EXECUTION_PATTERN.test(s)) {
      violations.push(`String contains execution-like term: "${s.slice(0, 60)}"`);
    }
    if (NETWORK_PATTERN.test(s)) {
      violations.push(`String contains network-like term: "${s.slice(0, 60)}"`);
    }
    if (DYNAMIC_CODE_PATTERN.test(s)) {
      violations.push(`String contains dynamic-code term: "${s.slice(0, 60)}"`);
    }
    if (DOWNLOAD_PATTERN.test(s)) {
      violations.push(`String contains download-like term: "${s.slice(0, 60)}"`);
    }
    if (TIMER_PATTERN.test(s)) {
      violations.push(`String contains timer/random term: "${s.slice(0, 60)}"`);
    }
    if (DOM_PATTERN.test(s)) {
      violations.push(`String contains DOM-like term: "${s.slice(0, 60)}"`);
    }
    if (WALLET_HASH_PATTERN.test(s) && s.length >= 32 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(s)) {
      violations.push(`String resembles wallet address or tx hash: "${s.slice(0, 60)}"`);
    }
  }

  return { safe: violations.length === 0, violations };
}
