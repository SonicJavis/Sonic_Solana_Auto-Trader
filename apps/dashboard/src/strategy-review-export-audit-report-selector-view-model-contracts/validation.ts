/**
 * Phase 51 — Strategy Review Export Audit Report Selector View Model API Contracts v1: validation.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP,
  type StrategyReviewExportAuditReportSelectorViewModel,
} from '../strategy-review-export-audit-report-selector-view-models/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractSafetyResult,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractGeneratedAt,
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractKind,
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractName,
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[^\s'"]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|XMLHttpRequest|RPC)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route|handler|fastify|express|listen\(|server)\b/i;
const FORBIDDEN_WALLET_PATTERN = /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|execute|swap|buy|sell|trade|order|signal|recommendation|investment advice)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'contractId',
  'contractName',
  'selectorViewModelId',
  'selectorViewModelName',
  'sourceSelectorId',
  'sourceSelectorName',
  'sourceSelectorViewModelIds',
  'sourceSelectorIds',
  'sourceContractIds',
  'sourceViewModelIds',
  'sourceReportIds',
  'sourceAuditIds',
  'deterministicSeed',
  'displayTitle',
  'displaySubtitle',
  'summary',
  'safetyNotes',
  'limitationItems',
  'nextPhaseNotes',
  'message',
  'details',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue {
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

function validateMeta(
  meta: unknown,
  issues: StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue[],
): void {
  if (!isRecord(meta)) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be object'));
    return;
  }

  if (meta['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE) {
    issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 51'));
  }
  if (!isValidStrategyReviewExportAuditReportSelectorViewModelApiContractGeneratedAt(meta['generatedAt'])) {
    issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'generatedAt must be deterministic constant'));
  }
  if (!isValidStrategyReviewExportAuditReportSelectorViewModelApiContractSource(meta['source'])) {
    issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'source must be deterministic constant'));
  }

  if (meta['sourceSelectorViewModelPhase'] !== 50) {
    issues.push(issue('INVALID_META_SOURCE_SELECTOR_VIEW_MODEL_PHASE', 'meta.sourceSelectorViewModelPhase', 'sourceSelectorViewModelPhase must be 50'));
  }
  if (meta['sourceSelectorPhase'] !== 49) {
    issues.push(issue('INVALID_META_SOURCE_SELECTOR_PHASE', 'meta.sourceSelectorPhase', 'sourceSelectorPhase must be 49'));
  }
  if (meta['sourceContractPhase'] !== 48) {
    issues.push(issue('INVALID_META_SOURCE_CONTRACT_PHASE', 'meta.sourceContractPhase', 'sourceContractPhase must be 48'));
  }
  if (meta['sourceViewModelPhase'] !== 47) {
    issues.push(issue('INVALID_META_SOURCE_VIEW_MODEL_PHASE', 'meta.sourceViewModelPhase', 'sourceViewModelPhase must be 47'));
  }
  if (meta['sourceReportPhase'] !== 46) {
    issues.push(issue('INVALID_META_SOURCE_REPORT_PHASE', 'meta.sourceReportPhase', 'sourceReportPhase must be 46'));
  }
  if (meta['sourceAuditPhase'] !== 45) {
    issues.push(issue('INVALID_META_SOURCE_AUDIT_PHASE', 'meta.sourceAuditPhase', 'sourceAuditPhase must be 45'));
  }

  const requiredTrue = ['fixtureOnly', 'readOnly', 'localOnly'] as const;
  for (const key of requiredTrue) {
    if (meta[key] !== true) {
      issues.push(issue('INVALID_META_TRUE_FLAG', `meta.${key}`, `${key} must be true`));
    }
  }

  const requiredFalse = [
    'liveData',
    'networkAccess',
    'persistence',
    'filesystemWrites',
    'downloads',
    'pdfGeneration',
    'csvGeneration',
    'htmlGeneration',
    'routeHandlers',
    'httpServer',
    'runtimeRequests',
    'uiRendering',
    'domAccess',
    'backgroundJobs',
    'scheduledJobs',
    'execution',
    'tradingSignals',
    'recommendations',
    'investmentAdvice',
  ] as const;

  for (const key of requiredFalse) {
    if (meta[key] !== false) {
      issues.push(issue('INVALID_META_FALSE_FLAG', `meta.${key}`, `${key} must be false`));
    }
  }
}

function validateSafety(
  safety: unknown,
  issues: StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue[],
): void {
  if (!isRecord(safety)) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be object'));
    return;
  }

  const requiredTrue = [
    'fixtureOnly',
    'syntheticOnly',
    'deterministic',
    'localOnly',
    'readOnly',
    'nonExecutable',
    'nonAdvisory',
    'noLiveData',
    'noNetworkAccess',
    'noPersistence',
    'noFilesystemWrites',
    'noDownloads',
    'noPdfGeneration',
    'noCsvGeneration',
    'noHtmlGeneration',
    'noRouteHandlers',
    'noHttpServer',
    'noRuntimeRequests',
    'noUiRendering',
    'noDomAccess',
    'noBackgroundJobs',
    'noScheduledJobs',
    'noExecution',
    'noTradingSignals',
    'noRecommendations',
    'noInvestmentAdvice',
  ] as const;

  for (const key of requiredTrue) {
    if (safety[key] !== true) {
      issues.push(issue('INVALID_SAFETY_TRUE_FLAG', `safety.${key}`, `${key} must be true`));
    }
  }
}

function validateValidationEnvelope(
  validation: unknown,
  issues: StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue[],
): void {
  if (!isRecord(validation)) {
    issues.push(issue('INVALID_VALIDATION', 'validation', 'validation must be object'));
    return;
  }
  if (validation['fixtureOnly'] !== true) {
    issues.push(issue('INVALID_VALIDATION_FIXTURE_ONLY', 'validation.fixtureOnly', 'fixtureOnly must be true'));
  }
  const requiredPassed = [
    'structuralValidation',
    'safetyValidation',
    'sourceSelectorViewModelValidation',
    'sourceSelectorValidation',
    'sourceContractValidation',
    'responseEnvelopeValidation',
    'paginationValidation',
    'limitationValidation',
  ] as const;
  for (const key of requiredPassed) {
    if (validation[key] !== 'passed') {
      issues.push(issue('INVALID_VALIDATION_STATUS', `validation.${key}`, `${key} must be passed`));
    }
  }
  if (validation['issueCount'] !== 0) {
    issues.push(issue('INVALID_VALIDATION_ISSUE_COUNT', 'validation.issueCount', 'issueCount must be 0'));
  }
}

function validateCapabilityFlags(
  flags: unknown,
  issues: StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITY_FLAGS', 'capabilityFlags', 'capabilityFlags must be object'));
    return;
  }

  const requiredTrue = [
    'strategyReviewExportAuditReportSelectorViewModelApiContracts',
    'syntheticStrategyReviewExportAuditReportSelectorViewModelApiContracts',
    'deterministicStrategyReviewExportAuditReportSelectorViewModelApiContracts',
    'localOnlyStrategyReviewExportAuditReportSelectorViewModelApiContracts',
    'readOnlyStrategyReviewExportAuditReportSelectorViewModelApiContracts',
    'fixtureDerivedStrategyReviewExportAuditReportSelectorViewModelApiContracts',
  ] as const;

  const requiredFalse = [
    'strategyReviewExportAuditReportSelectorViewModelApiContractLiveData',
    'strategyReviewExportAuditReportSelectorViewModelApiContractNetworkAccess',
    'strategyReviewExportAuditReportSelectorViewModelApiContractPersistence',
    'strategyReviewExportAuditReportSelectorViewModelApiContractFilesystemWrites',
    'strategyReviewExportAuditReportSelectorViewModelApiContractDownloads',
    'strategyReviewExportAuditReportSelectorViewModelApiContractPdfGeneration',
    'strategyReviewExportAuditReportSelectorViewModelApiContractCsvGeneration',
    'strategyReviewExportAuditReportSelectorViewModelApiContractHtmlGeneration',
    'strategyReviewExportAuditReportSelectorViewModelApiContractRouteHandlers',
    'strategyReviewExportAuditReportSelectorViewModelApiContractHttpServer',
    'strategyReviewExportAuditReportSelectorViewModelApiContractRuntimeRequests',
    'strategyReviewExportAuditReportSelectorViewModelApiContractUiRendering',
    'strategyReviewExportAuditReportSelectorViewModelApiContractDomAccess',
    'strategyReviewExportAuditReportSelectorViewModelApiContractBackgroundJobs',
    'strategyReviewExportAuditReportSelectorViewModelApiContractScheduledJobs',
    'strategyReviewExportAuditReportSelectorViewModelApiContractExecution',
    'strategyReviewExportAuditReportSelectorViewModelApiContractTradingSignals',
    'strategyReviewExportAuditReportSelectorViewModelApiContractRecommendations',
    'strategyReviewExportAuditReportSelectorViewModelApiContractInvestmentAdvice',
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

function getSourceViewModelById(sourceSelectorViewModelId: string): StrategyReviewExportAuditReportSelectorViewModel | null {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.find(
    selectorViewModel => selectorViewModel.viewModelId === sourceSelectorViewModelId,
  ) ?? null;
}

function validateSourceReferences(
  input: Record<string, unknown>,
  issues: StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue[],
): void {
  if (!Array.isArray(input['sourceSelectorViewModelIds'])) {
    issues.push(issue('INVALID_SOURCE_SELECTOR_VIEW_MODEL_IDS', 'sourceSelectorViewModelIds', 'sourceSelectorViewModelIds must be array'));
    return;
  }

  const sourceSelectorViewModelIds = input['sourceSelectorViewModelIds'].map(String);
  const validIds = new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(model => model.viewModelId));

  for (const sourceSelectorViewModelId of sourceSelectorViewModelIds) {
    if (!validIds.has(sourceSelectorViewModelId)) {
      issues.push(issue('UNKNOWN_SOURCE_SELECTOR_VIEW_MODEL_ID', 'sourceSelectorViewModelIds', `Unknown source selector view-model ID '${sourceSelectorViewModelId}'`));
    }
  }

  const sourceSelectorViewModels = sourceSelectorViewModelIds
    .map(sourceSelectorViewModelId => getSourceViewModelById(sourceSelectorViewModelId))
    .filter((value): value is StrategyReviewExportAuditReportSelectorViewModel => value !== null);

  const expectedSourceSelectorIds = uniqueSorted(
    sourceSelectorViewModels.map(sourceSelectorViewModel => sourceSelectorViewModel.sourceSelectorId),
  );
  const expectedSourceContractIds = uniqueSorted(
    sourceSelectorViewModels.flatMap(sourceSelectorViewModel => [...sourceSelectorViewModel.sourceContractIds]),
  );

  if (!Array.isArray(input['sourceSelectorIds'])) {
    issues.push(issue('INVALID_SOURCE_SELECTOR_IDS', 'sourceSelectorIds', 'sourceSelectorIds must be array'));
  } else if (!arraysEqual(uniqueSorted(input['sourceSelectorIds'].map(String)), expectedSourceSelectorIds)) {
    issues.push(issue('SOURCE_SELECTOR_IDS_MISMATCH', 'sourceSelectorIds', 'sourceSelectorIds must match derived Phase 50 sources'));
  }

  if (!Array.isArray(input['sourceContractIds'])) {
    issues.push(issue('INVALID_SOURCE_CONTRACT_IDS', 'sourceContractIds', 'sourceContractIds must be array'));
  } else if (!arraysEqual(uniqueSorted(input['sourceContractIds'].map(String)), expectedSourceContractIds)) {
    issues.push(issue('SOURCE_CONTRACT_IDS_MISMATCH', 'sourceContractIds', 'sourceContractIds must match derived Phase 50 sources'));
  }

  if (input['contractKind'] === 'list' || input['contractKind'] === 'summary') {
    const expectedAllSourceSelectorViewModelIds = uniqueSorted(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(selectorViewModel => selectorViewModel.viewModelId),
    );
    if (!arraysEqual(uniqueSorted(sourceSelectorViewModelIds), expectedAllSourceSelectorViewModelIds)) {
      issues.push(issue('INCOMPLETE_SOURCE_SELECTOR_VIEW_MODEL_SET', 'sourceSelectorViewModelIds', 'list/summary contracts must include all Phase 50 selector view models'));
    }
  }

  if (input['contractKind'] === 'detail') {
    if (sourceSelectorViewModelIds.length !== 1) {
      issues.push(issue('DETAIL_SOURCE_COUNT', 'sourceSelectorViewModelIds', 'detail contracts must reference exactly one selector view model'));
    }
  }

  if (input['contractKind'] === 'error') {
    if (sourceSelectorViewModelIds.length !== 0) {
      issues.push(issue('ERROR_SOURCE_SELECTOR_VIEW_MODEL_IDS', 'sourceSelectorViewModelIds', 'error contracts must have empty sourceSelectorViewModelIds'));
    }
    if (Array.isArray(input['sourceSelectorIds']) && input['sourceSelectorIds'].length !== 0) {
      issues.push(issue('ERROR_SOURCE_SELECTOR_IDS', 'sourceSelectorIds', 'error contracts must have empty sourceSelectorIds'));
    }
    if (Array.isArray(input['sourceContractIds']) && input['sourceContractIds'].length !== 0) {
      issues.push(issue('ERROR_SOURCE_CONTRACT_IDS', 'sourceContractIds', 'error contracts must have empty sourceContractIds'));
    }
  }
}

export function validateStrategyReviewExportAuditReportSelectorViewModelApiContractSafety(
  input: unknown,
): StrategyReviewExportAuditReportSelectorViewModelApiContractSafetyResult {
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
      violations.push(`Detected filesystem or persistence reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_RUNTIME_PATTERN.test(value)) {
      violations.push(`Detected runtime route/server reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_WALLET_PATTERN.test(value)) {
      violations.push(`Detected wallet or credential reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_EXECUTION_PATTERN.test(value)) {
      violations.push(`Detected execution or advisory reference: "${value.slice(0, 80)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateStrategyReviewExportAuditReportSelectorViewModelApiContract(
  input: unknown,
): StrategyReviewExportAuditReportSelectorViewModelApiContractValidationResult {
  const issues: StrategyReviewExportAuditReportSelectorViewModelApiContractValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (typeof input['contractId'] !== 'string' || input['contractId'].trim() === '') {
    issues.push(issue('INVALID_CONTRACT_ID', 'contractId', 'contractId must be non-empty string'));
  }
  if (!isValidStrategyReviewExportAuditReportSelectorViewModelApiContractName(input['contractName'])) {
    issues.push(issue('INVALID_CONTRACT_NAME', 'contractName', 'contractName is invalid'));
  }
  if (!isValidStrategyReviewExportAuditReportSelectorViewModelApiContractKind(input['contractKind'])) {
    issues.push(issue('INVALID_CONTRACT_KIND', 'contractKind', 'contractKind is invalid'));
  }
  if (input['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 51'));
  }
  if (typeof input['endpointPattern'] !== 'string' || input['endpointPattern'].trim() === '') {
    issues.push(issue('INVALID_ENDPOINT_PATTERN', 'endpointPattern', 'endpointPattern must be non-empty string'));
  }
  if (input['method'] !== 'GET') {
    issues.push(issue('INVALID_METHOD', 'method', 'method must be GET'));
  }
  if (input['readOnly'] !== true) {
    issues.push(issue('INVALID_READ_ONLY', 'readOnly', 'readOnly must be true'));
  }
  if (input['fixtureOnly'] !== true) {
    issues.push(issue('INVALID_FIXTURE_ONLY', 'fixtureOnly', 'fixtureOnly must be true'));
  }

  validateSourceReferences(input, issues);

  if (input['contractKind'] === 'list') {
    if (input['success'] !== true || input['statusCode'] !== 200 || input['error'] !== null) {
      issues.push(issue('INVALID_LIST_RESPONSE_ENVELOPE', 'success/statusCode/error', 'list contract envelope is invalid'));
    }
    if (!Array.isArray(input['data']) || input['data'].length !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length) {
      issues.push(issue('INVALID_LIST_DATA', 'data', 'list data must include all Phase 50 selector view models'));
    }
    if (!isRecord(input['pagination'])) {
      issues.push(issue('INVALID_LIST_PAGINATION', 'pagination', 'list contracts require pagination metadata'));
    }
    if (!Array.isArray(input['filters']) || input['filters'].length === 0) {
      issues.push(issue('INVALID_LIST_FILTERS', 'filters', 'list contracts require deterministic filters metadata'));
    }
    if (!Array.isArray(input['sorts']) || input['sorts'].length === 0) {
      issues.push(issue('INVALID_LIST_SORTS', 'sorts', 'list contracts require deterministic sorts metadata'));
    }
  }

  if (input['contractKind'] === 'detail') {
    if (input['success'] !== true || input['statusCode'] !== 200 || input['error'] !== null) {
      issues.push(issue('INVALID_DETAIL_RESPONSE_ENVELOPE', 'success/statusCode/error', 'detail contract envelope is invalid'));
    }
    if (!isRecord(input['data'])) {
      issues.push(issue('INVALID_DETAIL_DATA', 'data', 'detail data must be object'));
    } else {
      if (!isRecord(input['data']['summary'])) {
        issues.push(issue('INVALID_DETAIL_SUMMARY', 'data.summary', 'detail summary must be object'));
      }
      if (!isRecord(input['data']['selectorViewModel'])) {
        issues.push(issue('INVALID_DETAIL_SELECTOR_VIEW_MODEL', 'data.selectorViewModel', 'selectorViewModel must be object'));
      } else {
        const selectorViewModel = input['data']['selectorViewModel'];
        if (selectorViewModel['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE) {
          issues.push(issue('INVALID_DETAIL_SELECTOR_VIEW_MODEL_PHASE', 'data.selectorViewModel.phase', 'selectorViewModel phase must be 50'));
        }
        if (typeof selectorViewModel['viewModelId'] !== 'string' || !STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP.has(selectorViewModel['viewModelName'] as never)) {
          issues.push(issue('INVALID_DETAIL_SELECTOR_VIEW_MODEL_REFERENCE', 'data.selectorViewModel', 'selectorViewModel must reference a valid Phase 50 selector view model'));
        }
      }
      if (!Array.isArray(input['data']['limitationItems']) || input['data']['limitationItems'].length === 0) {
        issues.push(issue('INVALID_DETAIL_LIMITATION_ITEMS', 'data.limitationItems', 'detail limitationItems must be non-empty array'));
      }
      if (!Array.isArray(input['data']['nextPhaseNotes']) || input['data']['nextPhaseNotes'].length === 0) {
        issues.push(issue('INVALID_DETAIL_NEXT_PHASE_NOTES', 'data.nextPhaseNotes', 'detail nextPhaseNotes must be non-empty array'));
      }
    }
    if (input['pagination'] !== null || !Array.isArray(input['filters']) || input['filters'].length !== 0 || !Array.isArray(input['sorts']) || input['sorts'].length !== 0) {
      issues.push(issue('INVALID_DETAIL_QUERY_METADATA', 'pagination/filters/sorts', 'detail contracts must not include pagination/filters/sorts'));
    }
  }

  if (input['contractKind'] === 'summary') {
    if (input['success'] !== true || input['statusCode'] !== 200 || input['error'] !== null) {
      issues.push(issue('INVALID_SUMMARY_RESPONSE_ENVELOPE', 'success/statusCode/error', 'summary contract envelope is invalid'));
    }
    if (!isRecord(input['data'])) {
      issues.push(issue('INVALID_SUMMARY_DATA', 'data', 'summary data must be object'));
    } else {
      if (input['data']['totalSelectorViewModels'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length) {
        issues.push(issue('INVALID_SUMMARY_TOTAL', 'data.totalSelectorViewModels', 'summary total must match Phase 50 selector view model count'));
      }
      if (!Array.isArray(input['data']['byKind']) || !Array.isArray(input['data']['byStatus']) || !Array.isArray(input['data']['byMatched'])) {
        issues.push(issue('INVALID_SUMMARY_GROUPS', 'data', 'summary group arrays are required'));
      }
    }
    if (input['pagination'] !== null || !Array.isArray(input['filters']) || input['filters'].length !== 0 || !Array.isArray(input['sorts']) || input['sorts'].length !== 0) {
      issues.push(issue('INVALID_SUMMARY_QUERY_METADATA', 'pagination/filters/sorts', 'summary contracts must not include pagination/filters/sorts'));
    }
  }

  if (input['contractKind'] === 'error') {
    if (input['success'] !== false) {
      issues.push(issue('INVALID_ERROR_SUCCESS', 'success', 'error contracts must set success=false'));
    }
    if (input['statusCode'] !== 404 && input['statusCode'] !== 422) {
      issues.push(issue('INVALID_ERROR_STATUS_CODE', 'statusCode', 'error contract statusCode must be 404 or 422'));
    }
    if (input['data'] !== null) {
      issues.push(issue('INVALID_ERROR_DATA', 'data', 'error contracts must set data=null'));
    }
    if (!isRecord(input['error'])) {
      issues.push(issue('INVALID_ERROR_OBJECT', 'error', 'error contracts must provide error object'));
    } else if (input['error']['fixtureOnly'] !== true) {
      issues.push(issue('INVALID_ERROR_FIXTURE_ONLY', 'error.fixtureOnly', 'error.fixtureOnly must be true'));
    }
    if (input['pagination'] !== null || !Array.isArray(input['filters']) || input['filters'].length !== 0 || !Array.isArray(input['sorts']) || input['sorts'].length !== 0) {
      issues.push(issue('INVALID_ERROR_QUERY_METADATA', 'pagination/filters/sorts', 'error contracts must not include pagination/filters/sorts'));
    }
  }

  validateMeta(input['meta'], issues);
  validateSafety(input['safety'], issues);
  validateValidationEnvelope(input['validation'], issues);
  validateCapabilityFlags(input['capabilityFlags'], issues);

  const safetyResult = validateStrategyReviewExportAuditReportSelectorViewModelApiContractSafety(input);
  if (!safetyResult.safe) {
    issues.push(issue('UNSAFE_CONTRACT_CONTENT', 'root', `contract contains unsafe content (${safetyResult.violations.length} violation(s))`));
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
