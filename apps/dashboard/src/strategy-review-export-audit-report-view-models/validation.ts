/**
 * Phase 47 — Strategy Review Export Audit Report View Models v1: validation.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP,
  type StrategyReviewExportAuditReportFixtureName,
} from '../strategy-review-export-audit-report/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE,
  type StrategyReviewExportAuditReportViewModelSafetyResult,
  type StrategyReviewExportAuditReportViewModelValidationIssue,
  type StrategyReviewExportAuditReportViewModelValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditReportViewModelGeneratedAt,
  isValidStrategyReviewExportAuditReportViewModelKind,
  isValidStrategyReviewExportAuditReportViewModelName,
  isValidStrategyReviewExportAuditReportViewModelSeverity,
  isValidStrategyReviewExportAuditReportViewModelSource,
  isValidStrategyReviewExportAuditReportViewModelStatus,
} from './normalization.js';

const NETWORK_PATTERN = /\b(?:https?:\/\/|www\.|fetch\(|axios|WebSocket|XMLHttpRequest)\b/i;
const FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const EXECUTION_PATTERN = /\b(?:signTransaction|sendTransaction|execute trade|buy now|sell now|trade now)\b/i;
const RANDOMNESS_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\()\b/;
const WALLET_PATTERN = /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)\b/i;
const ADVISORY_PATTERN = /\b(?:recommendation|signal|investment advice)\b/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportAuditReportViewModelValidationIssue {
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

export function validateStrategyReviewExportAuditReportViewModel(
  input: unknown,
): StrategyReviewExportAuditReportViewModelValidationResult {
  const issues: StrategyReviewExportAuditReportViewModelValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (!isValidStrategyReviewExportAuditReportViewModelName(input['viewModelName'])) {
    issues.push(issue('INVALID_VIEW_MODEL_NAME', 'viewModelName', 'Invalid view model name'));
  }

  if (!isValidStrategyReviewExportAuditReportViewModelKind(input['viewModelKind'])) {
    issues.push(issue('INVALID_VIEW_MODEL_KIND', 'viewModelKind', 'Invalid view model kind'));
  }

  if (input['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 47'));
  }

  if (!isValidStrategyReviewExportAuditReportViewModelStatus(input['statusLabel'])) {
    issues.push(issue('INVALID_STATUS_LABEL', 'statusLabel', 'statusLabel is invalid'));
  }

  if (!isValidStrategyReviewExportAuditReportViewModelSeverity(input['severityLabel'])) {
    issues.push(issue('INVALID_SEVERITY_LABEL', 'severityLabel', 'severityLabel is invalid'));
  }

  if (typeof input['sourceReportId'] !== 'string' || input['sourceReportId'].trim() === '') {
    issues.push(issue('INVALID_SOURCE_REPORT_ID', 'sourceReportId', 'sourceReportId must be non-empty string'));
  }
  if (typeof input['sourceReportName'] !== 'string' || input['sourceReportName'].trim() === '') {
    issues.push(issue('INVALID_SOURCE_REPORT_NAME', 'sourceReportName', 'sourceReportName must be non-empty string'));
  }
  if (typeof input['sourceAuditId'] !== 'string' || input['sourceAuditId'].trim() === '') {
    issues.push(issue('INVALID_SOURCE_AUDIT_ID', 'sourceAuditId', 'sourceAuditId must be non-empty string'));
  }
  if (typeof input['sourceQueueReference'] !== 'string' || input['sourceQueueReference'].trim() === '') {
    issues.push(
      issue(
        'INVALID_SOURCE_QUEUE_REFERENCE',
        'sourceQueueReference',
        'sourceQueueReference must be non-empty string',
      ),
    );
  }

  if (!Array.isArray(input['summaryCards']) || input['summaryCards'].length === 0) {
    issues.push(issue('INVALID_SUMMARY_CARDS', 'summaryCards', 'summaryCards must be non-empty array'));
  } else {
    const cardIds = new Set<string>();
    const cardOrders = new Set<number>();
    for (const [index, card] of input['summaryCards'].entries()) {
      if (!isRecord(card)) {
        issues.push(issue('INVALID_SUMMARY_CARD', `summaryCards[${index}]`, 'summary card must be object'));
        continue;
      }
      if (typeof card['cardId'] !== 'string' || card['cardId'].trim() === '') {
        issues.push(issue('INVALID_SUMMARY_CARD_ID', `summaryCards[${index}].cardId`, 'cardId must be non-empty'));
      } else if (cardIds.has(card['cardId'])) {
        issues.push(issue('DUPLICATE_SUMMARY_CARD_ID', `summaryCards[${index}].cardId`, 'cardId must be unique'));
      } else {
        cardIds.add(card['cardId']);
      }
      if (typeof card['order'] !== 'number' || !Number.isInteger(card['order'])) {
        issues.push(issue('INVALID_SUMMARY_CARD_ORDER', `summaryCards[${index}].order`, 'order must be integer'));
      } else if (cardOrders.has(card['order'])) {
        issues.push(issue('DUPLICATE_SUMMARY_CARD_ORDER', `summaryCards[${index}].order`, 'order must be unique'));
      } else {
        cardOrders.add(card['order']);
      }
    }
  }

  if (!Array.isArray(input['detailSections']) || input['detailSections'].length === 0) {
    issues.push(issue('INVALID_DETAIL_SECTIONS', 'detailSections', 'detailSections must be non-empty array'));
  } else {
    const sectionOrders = new Set<number>();
    for (const [index, section] of input['detailSections'].entries()) {
      if (!isRecord(section)) {
        issues.push(issue('INVALID_DETAIL_SECTION', `detailSections[${index}]`, 'detail section must be object'));
        continue;
      }
      if (typeof section['order'] !== 'number' || !Number.isInteger(section['order'])) {
        issues.push(issue('INVALID_DETAIL_SECTION_ORDER', `detailSections[${index}].order`, 'order must be integer'));
      } else if (sectionOrders.has(section['order'])) {
        issues.push(issue('DUPLICATE_DETAIL_SECTION_ORDER', `detailSections[${index}].order`, 'order must be unique'));
      } else {
        sectionOrders.add(section['order']);
      }
      if (!Array.isArray(section['rows']) || section['rows'].length === 0) {
        issues.push(issue('INVALID_DETAIL_SECTION_ROWS', `detailSections[${index}].rows`, 'rows must be non-empty array'));
      }
      if (!Array.isArray(section['evidenceReferenceIds']) || section['evidenceReferenceIds'].length === 0) {
        issues.push(
          issue(
            'INVALID_DETAIL_SECTION_EVIDENCE_REFS',
            `detailSections[${index}].evidenceReferenceIds`,
            'evidenceReferenceIds must be non-empty array',
          ),
        );
      }
    }
  }

  if (!Array.isArray(input['evidenceItems']) || input['evidenceItems'].length === 0) {
    issues.push(issue('INVALID_EVIDENCE_ITEMS', 'evidenceItems', 'evidenceItems must be non-empty array'));
  } else {
    const evidenceIds = new Set<string>();
    const evidenceOrders = new Set<number>();

    for (const [index, item] of input['evidenceItems'].entries()) {
      if (!isRecord(item)) {
        issues.push(issue('INVALID_EVIDENCE_ITEM', `evidenceItems[${index}]`, 'evidence item must be object'));
        continue;
      }
      if (typeof item['evidenceId'] !== 'string' || item['evidenceId'].trim() === '') {
        issues.push(issue('INVALID_EVIDENCE_ID', `evidenceItems[${index}].evidenceId`, 'evidenceId must be non-empty'));
      } else if (evidenceIds.has(item['evidenceId'])) {
        issues.push(issue('DUPLICATE_EVIDENCE_ID', `evidenceItems[${index}].evidenceId`, 'evidenceId must be unique'));
      } else {
        evidenceIds.add(item['evidenceId']);
      }
      if (typeof item['order'] !== 'number' || !Number.isInteger(item['order'])) {
        issues.push(issue('INVALID_EVIDENCE_ORDER', `evidenceItems[${index}].order`, 'order must be integer'));
      } else if (evidenceOrders.has(item['order'])) {
        issues.push(issue('DUPLICATE_EVIDENCE_ORDER', `evidenceItems[${index}].order`, 'order must be unique'));
      } else {
        evidenceOrders.add(item['order']);
      }
      if (item['syntheticOnly'] !== true) {
        issues.push(issue('INVALID_EVIDENCE_SYNTHETIC_ONLY', `evidenceItems[${index}].syntheticOnly`, 'syntheticOnly must be true'));
      }
      if (item['liveData'] !== false) {
        issues.push(issue('INVALID_EVIDENCE_LIVE_DATA', `evidenceItems[${index}].liveData`, 'liveData must be false'));
      }
    }

    if (Array.isArray(input['detailSections'])) {
      const referencedEvidenceIds = new Set<string>();
      for (const section of input['detailSections']) {
        if (isRecord(section) && Array.isArray(section['evidenceReferenceIds'])) {
          for (const evidenceId of section['evidenceReferenceIds']) {
            if (typeof evidenceId === 'string') {
              referencedEvidenceIds.add(evidenceId);
            }
          }
        }
      }

      for (const evidenceId of evidenceIds) {
        if (!referencedEvidenceIds.has(evidenceId)) {
          issues.push(issue('ORPHAN_EVIDENCE_ITEM', 'evidenceItems', `Evidence ${evidenceId} is not referenced by any section`));
        }
      }
    }
  }

  if (!Array.isArray(input['safetyBadges']) || input['safetyBadges'].length === 0) {
    issues.push(issue('INVALID_SAFETY_BADGES', 'safetyBadges', 'safetyBadges must be non-empty array'));
  } else {
    for (const [index, badge] of input['safetyBadges'].entries()) {
      if (!isRecord(badge)) {
        issues.push(issue('INVALID_SAFETY_BADGE', `safetyBadges[${index}]`, 'safety badge must be object'));
        continue;
      }
      if (badge['safe'] !== true) {
        issues.push(issue('INVALID_SAFETY_BADGE_SAFE', `safetyBadges[${index}].safe`, 'safe must be true'));
      }
    }
  }

  if (!Array.isArray(input['validationBadges']) || input['validationBadges'].length === 0) {
    issues.push(issue('INVALID_VALIDATION_BADGES', 'validationBadges', 'validationBadges must be non-empty array'));
  }

  if (!Array.isArray(input['limitationItems']) || input['limitationItems'].length === 0) {
    issues.push(issue('INVALID_LIMITATION_ITEMS', 'limitationItems', 'limitationItems must be non-empty array'));
  }

  if (!isRecord(input['capabilityFlags'])) {
    issues.push(issue('INVALID_CAPABILITY_FLAGS', 'capabilityFlags', 'capabilityFlags must be object'));
  } else {
    const flags = input['capabilityFlags'];
    const requiredTrue = [
      'strategyReviewExportAuditReportViewModels',
      'syntheticStrategyReviewExportAuditReportViewModels',
      'deterministicStrategyReviewExportAuditReportViewModels',
      'localOnlyStrategyReviewExportAuditReportViewModels',
      'readOnlyStrategyReviewExportAuditReportViewModels',
      'fixtureDerivedStrategyReviewExportAuditReportViewModels',
    ] as const;
    const requiredFalse = [
      'strategyReviewExportAuditReportViewModelLiveData',
      'strategyReviewExportAuditReportViewModelNetworkAccess',
      'strategyReviewExportAuditReportViewModelPersistence',
      'strategyReviewExportAuditReportViewModelFilesystemWrites',
      'strategyReviewExportAuditReportViewModelDownloads',
      'strategyReviewExportAuditReportViewModelPdfGeneration',
      'strategyReviewExportAuditReportViewModelCsvGeneration',
      'strategyReviewExportAuditReportViewModelHtmlGeneration',
      'strategyReviewExportAuditReportViewModelUiRendering',
      'strategyReviewExportAuditReportViewModelDomAccess',
      'strategyReviewExportAuditReportViewModelBackgroundJobs',
      'strategyReviewExportAuditReportViewModelScheduledJobs',
      'strategyReviewExportAuditReportViewModelExecution',
      'strategyReviewExportAuditReportViewModelTradingSignals',
      'strategyReviewExportAuditReportViewModelRecommendations',
      'strategyReviewExportAuditReportViewModelInvestmentAdvice',
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
    if (meta['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE) {
      issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 47'));
    }
    if (!isValidStrategyReviewExportAuditReportViewModelGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'generatedAt must be deterministic constant'));
    }
    if (!isValidStrategyReviewExportAuditReportViewModelSource(meta['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'source must be deterministic constant'));
    }
  }

  if (!isRecord(input['safety'])) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be object'));
  }

  if (typeof input['sourceReportName'] === 'string') {
    const sourceFixture = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.get(
      input['sourceReportName'] as StrategyReviewExportAuditReportFixtureName,
    );
    if (!sourceFixture) {
      issues.push(issue('INVALID_SOURCE_REPORT_REFERENCE', 'sourceReportName', 'source report reference is invalid'));
    } else {
      if (input['sourceReportId'] !== sourceFixture.reportId) {
        issues.push(issue('SOURCE_REPORT_ID_MISMATCH', 'sourceReportId', 'sourceReportId does not match Phase 46 fixture'));
      }
      if (input['sourceAuditId'] !== sourceFixture.sourceAuditId) {
        issues.push(issue('SOURCE_AUDIT_ID_MISMATCH', 'sourceAuditId', 'sourceAuditId does not match Phase 46 fixture'));
      }
      if (input['sourceQueueReference'] !== sourceFixture.sourceQueueReference.sourceQueueFixtureName) {
        issues.push(
          issue(
            'SOURCE_QUEUE_REFERENCE_MISMATCH',
            'sourceQueueReference',
            'sourceQueueReference does not match Phase 46 fixture',
          ),
        );
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateStrategyReviewExportAuditReportViewModelSafety(
  input: unknown,
): StrategyReviewExportAuditReportViewModelSafetyResult {
  const strings = collectStrings(input);
  const violations: string[] = [];

  for (const value of strings) {
    if (NETWORK_PATTERN.test(value)) {
      violations.push(`Detected network-like content: "${value.slice(0, 80)}"`);
    }
    if (FILESYSTEM_PATTERN.test(value)) {
      violations.push(`Detected filesystem-like content: "${value.slice(0, 80)}"`);
    }
    if (EXECUTION_PATTERN.test(value)) {
      violations.push(`Detected execution-like content: "${value.slice(0, 80)}"`);
    }
    if (RANDOMNESS_PATTERN.test(value)) {
      violations.push(`Detected non-deterministic content: "${value.slice(0, 80)}"`);
    }
    if (WALLET_PATTERN.test(value)) {
      violations.push(`Detected wallet-like content: "${value.slice(0, 80)}"`);
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
