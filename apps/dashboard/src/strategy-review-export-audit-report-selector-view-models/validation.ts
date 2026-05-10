/**
 * Phase 50 — Strategy Review Export Audit Report Selector View Models v1: validation.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_MAP,
} from '../strategy-review-export-audit-report-contract-selectors/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE,
  type StrategyReviewExportAuditReportSelectorViewModelSafetyResult,
  type StrategyReviewExportAuditReportSelectorViewModelValidationIssue,
  type StrategyReviewExportAuditReportSelectorViewModelValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditReportSelectorViewModelGeneratedAt,
  isValidStrategyReviewExportAuditReportSelectorViewModelKind,
  isValidStrategyReviewExportAuditReportSelectorViewModelName,
  isValidStrategyReviewExportAuditReportSelectorViewModelSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[^\s'"]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|XMLHttpRequest)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route|handler|fastify|express|listen\()\b/i;
const FORBIDDEN_WALLET_PATTERN = /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)\b/i;
const FORBIDDEN_EXECUTION_PATTERN = /\b(?:signTransaction|sendTransaction|execute|buy|sell|trade|order|signal|recommendation|investment advice)\b/i;
const EXCLUDED_SCAN_FIELDS = new Set([
  'viewModelId',
  'viewModelName',
  'sourceSelectorId',
  'sourceSelectorName',
  'sourceContractIds',
  'sourceViewModelIds',
  'sourceReportIds',
  'sourceAuditIds',
  'displayTitle',
  'displaySubtitle',
  'summary',
  'safetyNotes',
  'limitationItems',
  'nextPhaseNotes',
  'deterministicSeed',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportAuditReportSelectorViewModelValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, out: string[] = [], parentKey?: string): readonly string[] {
  if (typeof value === 'string') {
    if (parentKey === undefined || !EXCLUDED_SCAN_FIELDS.has(parentKey)) {
      out.push(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, out, parentKey));
  } else if (isRecord(value)) {
    Object.entries(value).forEach(([key, entry]) => collectStrings(entry, out, key));
  }
  return out;
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, index) => value === right[index]);
}

export function validateStrategyReviewExportAuditReportSelectorViewModelSafety(
  input: unknown,
): StrategyReviewExportAuditReportSelectorViewModelSafetyResult {
  const strings = collectStrings(input);
  const violations: string[] = [];

  for (const value of strings) {
    if (FORBIDDEN_URL_PATTERN.test(value)) {
      violations.push(`Detected live URL reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_NETWORK_PATTERN.test(value)) {
      violations.push(`Detected network runtime reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_FILESYSTEM_PATTERN.test(value)) {
      violations.push(`Detected filesystem/persistence reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_RUNTIME_PATTERN.test(value)) {
      violations.push(`Detected route/server/runtime reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_WALLET_PATTERN.test(value)) {
      violations.push(`Detected wallet/credential reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_EXECUTION_PATTERN.test(value)) {
      violations.push(`Detected execution/advisory reference: "${value.slice(0, 80)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateStrategyReviewExportAuditReportSelectorViewModel(
  input: unknown,
): StrategyReviewExportAuditReportSelectorViewModelValidationResult {
  const issues: StrategyReviewExportAuditReportSelectorViewModelValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (typeof input['viewModelId'] !== 'string' || input['viewModelId'].trim() === '') {
    issues.push(issue('INVALID_VIEW_MODEL_ID', 'viewModelId', 'viewModelId must be non-empty string'));
  }
  if (!isValidStrategyReviewExportAuditReportSelectorViewModelName(input['viewModelName'])) {
    issues.push(issue('INVALID_VIEW_MODEL_NAME', 'viewModelName', 'viewModelName is invalid'));
  }
  if (!isValidStrategyReviewExportAuditReportSelectorViewModelKind(input['viewModelKind'])) {
    issues.push(issue('INVALID_VIEW_MODEL_KIND', 'viewModelKind', 'viewModelKind is invalid'));
  }
  if (input['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 50'));
  }

  if (typeof input['sourceSelectorName'] !== 'string') {
    issues.push(issue('INVALID_SOURCE_SELECTOR_NAME', 'sourceSelectorName', 'sourceSelectorName must be string'));
  } else {
    const sourceSelector = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_MAP.get(
      input['sourceSelectorName'] as never,
    );
    if (!sourceSelector) {
      issues.push(issue('UNKNOWN_SOURCE_SELECTOR', 'sourceSelectorName', 'source selector reference is invalid'));
    } else {
      if (input['sourceSelectorId'] !== sourceSelector.selectorId) {
        issues.push(issue('SOURCE_SELECTOR_ID_MISMATCH', 'sourceSelectorId', 'sourceSelectorId does not match Phase 49 selector'));
      }
      if (input['sourceSelectorKind'] !== sourceSelector.selectorKind) {
        issues.push(issue('SOURCE_SELECTOR_KIND_MISMATCH', 'sourceSelectorKind', 'sourceSelectorKind does not match Phase 49 selector'));
      }

      const expectedContractIds = uniqueSorted(sourceSelector.sourceContractIds);
      const expectedViewModelIds = uniqueSorted(sourceSelector.sourceViewModelIds);
      const expectedReportIds = uniqueSorted(sourceSelector.sourceReportIds);
      const expectedAuditIds = uniqueSorted(sourceSelector.sourceAuditIds);

      if (!Array.isArray(input['sourceContractIds'])) {
        issues.push(issue('INVALID_SOURCE_CONTRACT_IDS', 'sourceContractIds', 'sourceContractIds must be array'));
      } else if (!arraysEqual(uniqueSorted(input['sourceContractIds'].map(String)), expectedContractIds)) {
        issues.push(issue('SOURCE_CONTRACT_IDS_MISMATCH', 'sourceContractIds', 'sourceContractIds must match Phase 49 selector'));
      }

      if (!Array.isArray(input['sourceViewModelIds'])) {
        issues.push(issue('INVALID_SOURCE_VIEW_MODEL_IDS', 'sourceViewModelIds', 'sourceViewModelIds must be array'));
      } else if (!arraysEqual(uniqueSorted(input['sourceViewModelIds'].map(String)), expectedViewModelIds)) {
        issues.push(issue('SOURCE_VIEW_MODEL_IDS_MISMATCH', 'sourceViewModelIds', 'sourceViewModelIds must match Phase 49 selector'));
      }

      if (!Array.isArray(input['sourceReportIds'])) {
        issues.push(issue('INVALID_SOURCE_REPORT_IDS', 'sourceReportIds', 'sourceReportIds must be array'));
      } else if (!arraysEqual(uniqueSorted(input['sourceReportIds'].map(String)), expectedReportIds)) {
        issues.push(issue('SOURCE_REPORT_IDS_MISMATCH', 'sourceReportIds', 'sourceReportIds must match Phase 49 selector'));
      }

      if (!Array.isArray(input['sourceAuditIds'])) {
        issues.push(issue('INVALID_SOURCE_AUDIT_IDS', 'sourceAuditIds', 'sourceAuditIds must be array'));
      } else if (!arraysEqual(uniqueSorted(input['sourceAuditIds'].map(String)), expectedAuditIds)) {
        issues.push(issue('SOURCE_AUDIT_IDS_MISMATCH', 'sourceAuditIds', 'sourceAuditIds must match Phase 49 selector'));
      }

      if (input['viewModelKind'] !== sourceSelector.selectorKind) {
        issues.push(issue('VIEW_MODEL_KIND_MISMATCH', 'viewModelKind', 'viewModelKind must match source selector kind'));
      }
    }
  }

  if (input['statusLabel'] !== 'ready' && input['statusLabel'] !== 'not_found' && input['statusLabel'] !== 'invalid_input') {
    issues.push(issue('INVALID_STATUS_LABEL', 'statusLabel', 'statusLabel is invalid'));
  }
  if (input['matchedLabel'] !== 'matched' && input['matchedLabel'] !== 'not_matched') {
    issues.push(issue('INVALID_MATCHED_LABEL', 'matchedLabel', 'matchedLabel is invalid'));
  }

  if (!isRecord(input['queryPanel'])) {
    issues.push(issue('INVALID_QUERY_PANEL', 'queryPanel', 'queryPanel must be object'));
  } else {
    const queryPanel = input['queryPanel'];
    if (typeof queryPanel['queryId'] !== 'string' || queryPanel['queryId'].trim() === '') {
      issues.push(issue('INVALID_QUERY_PANEL_QUERY_ID', 'queryPanel.queryId', 'queryId must be non-empty string'));
    }
    if (queryPanel['readOnly'] !== true || queryPanel['fixtureOnly'] !== true) {
      issues.push(issue('INVALID_QUERY_PANEL_SAFETY', 'queryPanel', 'queryPanel safety flags must remain true'));
    }
    if (!Array.isArray(queryPanel['filterLabels'])) {
      issues.push(issue('INVALID_QUERY_PANEL_FILTERS', 'queryPanel.filterLabels', 'filterLabels must be array'));
    }
  }

  if (!isRecord(input['resultPanel'])) {
    issues.push(issue('INVALID_RESULT_PANEL', 'resultPanel', 'resultPanel must be object'));
  } else {
    const resultPanel = input['resultPanel'];
    if (typeof resultPanel['resultId'] !== 'string' || resultPanel['resultId'].trim() === '') {
      issues.push(issue('INVALID_RESULT_PANEL_ID', 'resultPanel.resultId', 'resultId must be non-empty string'));
    }
    if (![200, 404, 422].includes(Number(resultPanel['statusCode']))) {
      issues.push(issue('INVALID_RESULT_PANEL_STATUS_CODE', 'resultPanel.statusCode', 'statusCode must be 200, 404, or 422'));
    }
    if (typeof resultPanel['contractCount'] !== 'number' || resultPanel['contractCount'] <= 0) {
      issues.push(issue('INVALID_RESULT_PANEL_CONTRACT_COUNT', 'resultPanel.contractCount', 'contractCount must be positive number'));
    }
    if (!Array.isArray(resultPanel['safetyNotes']) || resultPanel['safetyNotes'].length === 0) {
      issues.push(issue('INVALID_RESULT_PANEL_SAFETY_NOTES', 'resultPanel.safetyNotes', 'safetyNotes must be non-empty array'));
    }
  }

  if (!Array.isArray(input['summaryCards']) || input['summaryCards'].length === 0) {
    issues.push(issue('INVALID_SUMMARY_CARDS', 'summaryCards', 'summaryCards must be non-empty array'));
  }
  if (!Array.isArray(input['detailRows']) || input['detailRows'].length === 0) {
    issues.push(issue('INVALID_DETAIL_ROWS', 'detailRows', 'detailRows must be non-empty array'));
  }
  if (!Array.isArray(input['safetyBadges']) || input['safetyBadges'].length === 0) {
    issues.push(issue('INVALID_SAFETY_BADGES', 'safetyBadges', 'safetyBadges must be non-empty array'));
  }
  if (!Array.isArray(input['validationBadges']) || input['validationBadges'].length === 0) {
    issues.push(issue('INVALID_VALIDATION_BADGES', 'validationBadges', 'validationBadges must be non-empty array'));
  }
  if (!Array.isArray(input['limitationItems']) || input['limitationItems'].length === 0) {
    issues.push(issue('INVALID_LIMITATION_ITEMS', 'limitationItems', 'limitationItems must be non-empty array'));
  }
  if (!Array.isArray(input['nextPhaseNotes']) || input['nextPhaseNotes'].length === 0) {
    issues.push(issue('INVALID_NEXT_PHASE_NOTES', 'nextPhaseNotes', 'nextPhaseNotes must be non-empty array'));
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be object'));
  } else {
    const meta = input['meta'];
    if (meta['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE) {
      issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 50'));
    }
    if (!isValidStrategyReviewExportAuditReportSelectorViewModelGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'generatedAt must be deterministic constant'));
    }
    if (!isValidStrategyReviewExportAuditReportSelectorViewModelSource(meta['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'source must be deterministic constant'));
    }
  }

  if (!isRecord(input['capabilityFlags'])) {
    issues.push(issue('INVALID_CAPABILITY_FLAGS', 'capabilityFlags', 'capabilityFlags must be object'));
  } else {
    const capabilityFlags = input['capabilityFlags'];
    const requiredTrue = [
      'strategyReviewExportAuditReportSelectorViewModels',
      'syntheticStrategyReviewExportAuditReportSelectorViewModels',
      'deterministicStrategyReviewExportAuditReportSelectorViewModels',
      'localOnlyStrategyReviewExportAuditReportSelectorViewModels',
      'readOnlyStrategyReviewExportAuditReportSelectorViewModels',
      'fixtureDerivedStrategyReviewExportAuditReportSelectorViewModels',
    ] as const;
    const requiredFalse = [
      'strategyReviewExportAuditReportSelectorViewModelLiveData',
      'strategyReviewExportAuditReportSelectorViewModelNetworkAccess',
      'strategyReviewExportAuditReportSelectorViewModelPersistence',
      'strategyReviewExportAuditReportSelectorViewModelFilesystemWrites',
      'strategyReviewExportAuditReportSelectorViewModelDownloads',
      'strategyReviewExportAuditReportSelectorViewModelPdfGeneration',
      'strategyReviewExportAuditReportSelectorViewModelCsvGeneration',
      'strategyReviewExportAuditReportSelectorViewModelHtmlGeneration',
      'strategyReviewExportAuditReportSelectorViewModelRouteHandlers',
      'strategyReviewExportAuditReportSelectorViewModelHttpServer',
      'strategyReviewExportAuditReportSelectorViewModelRuntimeRequests',
      'strategyReviewExportAuditReportSelectorViewModelUiRendering',
      'strategyReviewExportAuditReportSelectorViewModelDomAccess',
      'strategyReviewExportAuditReportSelectorViewModelBackgroundJobs',
      'strategyReviewExportAuditReportSelectorViewModelScheduledJobs',
      'strategyReviewExportAuditReportSelectorViewModelExecution',
      'strategyReviewExportAuditReportSelectorViewModelTradingSignals',
      'strategyReviewExportAuditReportSelectorViewModelRecommendations',
      'strategyReviewExportAuditReportSelectorViewModelInvestmentAdvice',
    ] as const;

    for (const key of requiredTrue) {
      if (capabilityFlags[key] !== true) {
        issues.push(issue('CAPABILITY_TRUE_REQUIRED', `capabilityFlags.${key}`, `${key} must be true`));
      }
    }
    for (const key of requiredFalse) {
      if (capabilityFlags[key] !== false) {
        issues.push(issue('CAPABILITY_FALSE_REQUIRED', `capabilityFlags.${key}`, `${key} must be false`));
      }
    }
  }

  if (!isRecord(input['safety'])) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be object'));
  }
  if (!isRecord(input['validation'])) {
    issues.push(issue('INVALID_VALIDATION', 'validation', 'validation must be object'));
  }

  const safetyResult = validateStrategyReviewExportAuditReportSelectorViewModelSafety(input);
  if (!safetyResult.safe) {
    issues.push(
      issue(
        'UNSAFE_VIEW_MODEL_CONTENT',
        'root',
        `view model contains unsafe content (${safetyResult.violations.length} violation(s))`,
      ),
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
