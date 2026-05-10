/**
 * Phase 46 — Strategy Review Export Audit Report Fixtures v1: validation.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE,
  type StrategyReviewExportAuditReportSafetyResult,
  type StrategyReviewExportAuditReportValidationIssue,
  type StrategyReviewExportAuditReportValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditReportFixtureKind,
  isValidStrategyReviewExportAuditReportFixtureName,
  isValidStrategyReviewExportAuditReportGeneratedAt,
  isValidStrategyReviewExportAuditReportSeverity,
  isValidStrategyReviewExportAuditReportSource,
  isValidStrategyReviewExportAuditReportState,
} from './normalization.js';

const NETWORK_PATTERN = /\b(?:https?:\/\/|www\.|fetch\(|axios|XMLHttpRequest|WebSocket)\b/i;
const FS_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const EXEC_PATTERN = /\b(?:signTransaction|sendTransaction|buy now|sell now|execute trade)\b/i;
const RANDOM_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\()\b/;
const ADVISORY_PATTERN = /\b(?:financial advice|investment advice|guaranteed return|profit signal)\b/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportAuditReportValidationIssue {
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

export function validateStrategyReviewExportAuditReportFixture(
  input: unknown,
): StrategyReviewExportAuditReportValidationResult {
  const issues: StrategyReviewExportAuditReportValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (!isValidStrategyReviewExportAuditReportFixtureName(input['reportName'])) {
    issues.push(issue('INVALID_REPORT_NAME', 'reportName', 'Invalid reportName'));
  }

  if (!isValidStrategyReviewExportAuditReportFixtureKind(input['reportKind'])) {
    issues.push(issue('INVALID_REPORT_KIND', 'reportKind', 'Invalid reportKind'));
  }

  if (input['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 46'));
  }

  if (!isValidStrategyReviewExportAuditReportState(input['reportState'])) {
    issues.push(issue('INVALID_REPORT_STATE', 'reportState', 'Invalid reportState'));
  }

  if (!isValidStrategyReviewExportAuditReportSeverity(input['reportSeverity'])) {
    issues.push(issue('INVALID_REPORT_SEVERITY', 'reportSeverity', 'Invalid reportSeverity'));
  }

  if (!isValidStrategyReviewExportAuditReportGeneratedAt(input['generatedAt'])) {
    issues.push(issue('INVALID_GENERATED_AT', 'generatedAt', 'generatedAt must be deterministic constant'));
  }

  if (!isRecord(input['sourceQueueReference'])) {
    issues.push(issue('INVALID_SOURCE_QUEUE_REFERENCE', 'sourceQueueReference', 'sourceQueueReference must be object'));
  } else {
    const sourceQueueReference = input['sourceQueueReference'];
    if (sourceQueueReference['sourcePhase'] !== 44) {
      issues.push(issue('INVALID_SOURCE_QUEUE_PHASE', 'sourceQueueReference.sourcePhase', 'sourcePhase must be 44'));
    }
    if (typeof sourceQueueReference['sourceQueueFixtureName'] !== 'string') {
      issues.push(issue('INVALID_SOURCE_QUEUE_NAME', 'sourceQueueReference.sourceQueueFixtureName', 'sourceQueueFixtureName must be string'));
    }
  }

  if (!Array.isArray(input['sections']) || input['sections'].length === 0) {
    issues.push(issue('INVALID_SECTIONS', 'sections', 'sections must be non-empty array'));
  } else {
    const orders = new Set<number>();
    for (const [index, section] of input['sections'].entries()) {
      if (!isRecord(section)) {
        issues.push(issue('INVALID_SECTION', `sections[${index}]`, 'section must be object'));
        continue;
      }
      if (typeof section['sectionId'] !== 'string' || section['sectionId'].trim() === '') {
        issues.push(issue('INVALID_SECTION_ID', `sections[${index}].sectionId`, 'sectionId must be non-empty'));
      }
      if (typeof section['order'] !== 'number' || !Number.isInteger(section['order'])) {
        issues.push(issue('INVALID_SECTION_ORDER', `sections[${index}].order`, 'order must be integer'));
      } else if (orders.has(section['order'])) {
        issues.push(issue('DUPLICATE_SECTION_ORDER', `sections[${index}].order`, 'section order must be unique'));
      } else {
        orders.add(section['order']);
      }
      if (!Array.isArray(section['evidenceReferenceIds'])) {
        issues.push(issue('INVALID_SECTION_EVIDENCE_IDS', `sections[${index}].evidenceReferenceIds`, 'evidenceReferenceIds must be array'));
      }
    }
  }

  if (!Array.isArray(input['evidenceReferences']) || input['evidenceReferences'].length === 0) {
    issues.push(issue('INVALID_EVIDENCE_REFERENCES', 'evidenceReferences', 'evidenceReferences must be non-empty array'));
  } else {
    const evidenceIds = new Set<string>();
    for (const [index, evidence] of input['evidenceReferences'].entries()) {
      if (!isRecord(evidence)) {
        issues.push(issue('INVALID_EVIDENCE_REFERENCE', `evidenceReferences[${index}]`, 'evidence reference must be object'));
        continue;
      }
      const evidenceReferenceId = evidence['evidenceReferenceId'];
      if (typeof evidenceReferenceId !== 'string' || evidenceReferenceId.trim() === '') {
        issues.push(issue('INVALID_EVIDENCE_ID', `evidenceReferences[${index}].evidenceReferenceId`, 'evidenceReferenceId must be non-empty'));
      } else if (evidenceIds.has(evidenceReferenceId)) {
        issues.push(issue('DUPLICATE_EVIDENCE_ID', `evidenceReferences[${index}].evidenceReferenceId`, 'evidenceReferenceId must be unique'));
      } else {
        evidenceIds.add(evidenceReferenceId);
      }
    }

    const referenced = new Set<string>();
    if (Array.isArray(input['sections'])) {
      for (const section of input['sections']) {
        if (isRecord(section) && Array.isArray(section['evidenceReferenceIds'])) {
          for (const evidenceId of section['evidenceReferenceIds']) {
            if (typeof evidenceId === 'string') {
              referenced.add(evidenceId);
            }
          }
        }
      }
    }

    for (const evidenceId of evidenceIds) {
      if (!referenced.has(evidenceId)) {
        issues.push(issue('ORPHAN_EVIDENCE_REFERENCE', 'evidenceReferences', `evidence ${evidenceId} is not referenced by any section`));
      }
    }
  }

  if (!isRecord(input['capabilityFlags'])) {
    issues.push(issue('INVALID_CAPABILITY_FLAGS', 'capabilityFlags', 'capabilityFlags must be object'));
  } else {
    const flags = input['capabilityFlags'];
    const requiredTrue = [
      'strategyReviewExportAuditReportFixtures',
      'syntheticStrategyReviewExportAuditReports',
      'deterministicStrategyReviewExportAuditReports',
      'localOnlyStrategyReviewExportAuditReports',
      'readOnlyStrategyReviewExportAuditReports',
    ] as const;
    const requiredFalse = [
      'strategyReviewActualAuditReports',
      'strategyReviewReportDownloads',
      'strategyReviewReportPdfGeneration',
      'strategyReviewReportCsvGeneration',
      'strategyReviewReportHtmlGeneration',
      'strategyReviewReportFilesystemWrites',
      'strategyReviewReportPersistence',
      'strategyReviewReportBackgroundJobs',
      'strategyReviewReportScheduledJobs',
      'strategyReviewReportLiveData',
      'strategyReviewReportNetworkAccess',
      'strategyReviewReportTradingSignals',
      'strategyReviewReportRecommendations',
      'strategyReviewReportInvestmentAdvice',
      'strategyReviewReportExecution',
    ] as const;

    for (const key of requiredTrue) {
      if (flags[key] !== true) {
        issues.push(issue('CAPABILITY_TRUE_REQUIRED', `capabilityFlags.${key}`, `${key} must be true`));
      }
    }

    for (const key of requiredFalse) {
      if (flags[key] !== false) {
        issues.push(issue('CAPABILITY_FALSE_REQUIRED', `capabilityFlags.${key}`, `${key} must be false`));
      }
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be object'));
  } else {
    const meta = input['meta'];
    if (meta['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE) {
      issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 46'));
    }
    if (!isValidStrategyReviewExportAuditReportGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant'));
    }
    if (!isValidStrategyReviewExportAuditReportSource(meta['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant'));
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateStrategyReviewExportAuditReportSafety(
  input: unknown,
): StrategyReviewExportAuditReportSafetyResult {
  const strings = collectStrings(input);
  const violations: string[] = [];

  for (const value of strings) {
    if (NETWORK_PATTERN.test(value)) {
      violations.push(`Detected network-like content: "${value.slice(0, 80)}"`);
    }
    if (FS_PATTERN.test(value)) {
      violations.push(`Detected filesystem-like content: "${value.slice(0, 80)}"`);
    }
    if (EXEC_PATTERN.test(value)) {
      violations.push(`Detected execution-like content: "${value.slice(0, 80)}"`);
    }
    if (RANDOM_PATTERN.test(value)) {
      violations.push(`Detected nondeterministic content: "${value.slice(0, 80)}"`);
    }
    if (ADVISORY_PATTERN.test(value)) {
      violations.push(`Detected advisory-like content: "${value.slice(0, 80)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}
