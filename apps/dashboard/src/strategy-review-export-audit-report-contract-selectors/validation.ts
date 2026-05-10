/**
 * Phase 49 — Strategy Review Export Audit Report API Contract Selectors v1: validation.
 */

import {
  validateStrategyReviewExportAuditReportApiContract,
  isValidStrategyReviewExportAuditReportApiContractKind,
  isValidStrategyReviewExportAuditReportApiContractName,
} from '../strategy-review-export-audit-report-contracts/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS } from '../strategy-review-export-audit-report-view-models/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE,
  type StrategyReviewExportAuditReportApiContractSelectorSafetyResult,
  type StrategyReviewExportAuditReportApiContractSelectorValidationIssue,
  type StrategyReviewExportAuditReportApiContractSelectorValidationResult,
  type StrategyReviewExportAuditReportApiContractSelectorResultValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditReportApiContractSelectorGeneratedAt,
  isValidStrategyReviewExportAuditReportApiContractSelectorKind,
  isValidStrategyReviewExportAuditReportApiContractSelectorName,
  isValidStrategyReviewExportAuditReportApiContractSelectorSource,
} from './normalization.js';

const EXCLUDED_SCAN_FIELDS = new Set([
  'selectorId',
  'selectorName',
  'queryId',
  'resultId',
  'contractId',
  'contractName',
  'sourceContractIds',
  'sourceContractNames',
  'sourceViewModelIds',
  'sourceReportIds',
  'sourceAuditIds',
  'deterministicSeed',
  'message',
  'details',
  'description',
  'summary',
  'displayTitle',
  'displaySubtitle',
  'viewModelName',
  'viewModelKind',
  'sourceReportName',
  'sourceAuditName',
  'sourceQueueReference',
  'limitationItems',
  'nextPhaseNotes',
]);

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[^\s'\"]+/i;
const FORBIDDEN_KEY_PATTERN = /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair)\b/i;
const FORBIDDEN_EXECUTION_PATTERN = /\b(?:signTransaction|sendTransaction)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:document\.|window\.|fetch\(|axios|WebSocket|fastify|express|listen\()\b/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportAuditReportApiContractSelectorValidationIssue {
  return { code, field, message, severity };
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, index) => value === right[index]);
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

function validateMeta(
  meta: unknown,
  issues: StrategyReviewExportAuditReportApiContractSelectorValidationIssue[],
): void {
  if (!isRecord(meta)) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be a non-null object'));
    return;
  }
  if (meta['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE) {
    issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 49'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractSelectorGeneratedAt(meta['generatedAt'])) {
    issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'generatedAt must be deterministic constant'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractSelectorSource(meta['source'])) {
    issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'source must be deterministic constant'));
  }
  if (meta['sourceContractPhase'] !== 48) {
    issues.push(issue('INVALID_META_SOURCE_CONTRACT_PHASE', 'meta.sourceContractPhase', 'sourceContractPhase must be 48'));
  }
  if (meta['sourceViewModelPhase'] !== 47) {
    issues.push(issue('INVALID_META_SOURCE_VIEW_MODEL_PHASE', 'meta.sourceViewModelPhase', 'sourceViewModelPhase must be 47'));
  }
  if (meta['fixtureOnly'] !== true || meta['readOnly'] !== true || meta['localOnly'] !== true || meta['pure'] !== true) {
    issues.push(issue('INVALID_META_SAFETY_FLAGS', 'meta', 'meta safety flags must remain true'));
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

function validateSafetyEnvelope(
  safety: unknown,
  issues: StrategyReviewExportAuditReportApiContractSelectorValidationIssue[],
): void {
  if (!isRecord(safety)) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be a non-null object'));
    return;
  }
  const requiredTrue = [
    'fixtureOnly',
    'syntheticOnly',
    'deterministic',
    'localOnly',
    'readOnly',
    'pure',
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
      issues.push(issue('INVALID_SAFETY_FLAG', `safety.${key}`, `${key} must be true`));
    }
  }
}

function validateCapabilityFlags(
  flags: unknown,
  issues: StrategyReviewExportAuditReportApiContractSelectorValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITY_FLAGS', 'capabilityFlags', 'capabilityFlags must be a non-null object'));
    return;
  }
  const requiredTrue = [
    'strategyReviewExportAuditReportApiContractSelectors',
    'syntheticStrategyReviewExportAuditReportApiContractSelectors',
    'deterministicStrategyReviewExportAuditReportApiContractSelectors',
    'localOnlyStrategyReviewExportAuditReportApiContractSelectors',
    'readOnlyStrategyReviewExportAuditReportApiContractSelectors',
    'fixtureDerivedStrategyReviewExportAuditReportApiContractSelectors',
    'pureStrategyReviewExportAuditReportApiContractSelectors',
  ] as const;
  const requiredFalse = [
    'strategyReviewExportAuditReportApiContractSelectorLiveData',
    'strategyReviewExportAuditReportApiContractSelectorNetworkAccess',
    'strategyReviewExportAuditReportApiContractSelectorPersistence',
    'strategyReviewExportAuditReportApiContractSelectorFilesystemWrites',
    'strategyReviewExportAuditReportApiContractSelectorDownloads',
    'strategyReviewExportAuditReportApiContractSelectorPdfGeneration',
    'strategyReviewExportAuditReportApiContractSelectorCsvGeneration',
    'strategyReviewExportAuditReportApiContractSelectorHtmlGeneration',
    'strategyReviewExportAuditReportApiContractSelectorRouteHandlers',
    'strategyReviewExportAuditReportApiContractSelectorHttpServer',
    'strategyReviewExportAuditReportApiContractSelectorRuntimeRequests',
    'strategyReviewExportAuditReportApiContractSelectorUiRendering',
    'strategyReviewExportAuditReportApiContractSelectorDomAccess',
    'strategyReviewExportAuditReportApiContractSelectorBackgroundJobs',
    'strategyReviewExportAuditReportApiContractSelectorScheduledJobs',
    'strategyReviewExportAuditReportApiContractSelectorExecution',
    'strategyReviewExportAuditReportApiContractSelectorTradingSignals',
    'strategyReviewExportAuditReportApiContractSelectorRecommendations',
    'strategyReviewExportAuditReportApiContractSelectorInvestmentAdvice',
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

function validateValidationEnvelope(
  validation: unknown,
  issues: StrategyReviewExportAuditReportApiContractSelectorValidationIssue[],
): void {
  if (!isRecord(validation)) {
    issues.push(issue('INVALID_VALIDATION', 'validation', 'validation must be a non-null object'));
    return;
  }
  if (validation['fixtureOnly'] !== true) {
    issues.push(issue('INVALID_VALIDATION_FIXTURE_ONLY', 'validation.fixtureOnly', 'fixtureOnly must be true'));
  }
  const requiredPassed = [
    'structuralValidation',
    'safetyValidation',
    'sourceContractValidation',
    'sourceViewModelValidation',
    'queryValidation',
    'resultValidation',
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

function validateQuery(
  query: unknown,
  selectorKind: unknown,
  issues: StrategyReviewExportAuditReportApiContractSelectorValidationIssue[],
): void {
  if (!isRecord(query)) {
    issues.push(issue('INVALID_QUERY', 'query', 'query must be a non-null object'));
    return;
  }
  if (typeof query['queryId'] !== 'string' || query['queryId'].trim() === '') {
    issues.push(issue('INVALID_QUERY_ID', 'query.queryId', 'queryId must be a non-empty string'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractSelectorKind(query['queryKind'])) {
    issues.push(issue('INVALID_QUERY_KIND', 'query.queryKind', 'queryKind is invalid'));
  } else if (query['queryKind'] !== selectorKind) {
    issues.push(issue('QUERY_KIND_MISMATCH', 'query.queryKind', 'queryKind must match selectorKind'));
  }
  if (query['readOnly'] !== true || query['fixtureOnly'] !== true) {
    issues.push(issue('INVALID_QUERY_SAFETY', 'query', 'query must remain read-only and fixture-only'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractKind(query['contractKind'])) {
    issues.push(issue('INVALID_QUERY_CONTRACT_KIND', 'query.contractKind', 'contractKind is invalid'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractName(query['contractName'])) {
    issues.push(issue('INVALID_QUERY_CONTRACT_NAME', 'query.contractName', 'contractName is invalid'));
  }
  if (
    query['detailContractName'] !== null &&
    !isValidStrategyReviewExportAuditReportApiContractName(query['detailContractName'])
  ) {
    issues.push(issue('INVALID_QUERY_DETAIL_CONTRACT_NAME', 'query.detailContractName', 'detailContractName is invalid'));
  }
  if (![200, 404, 422].includes(Number(query['expectedStatusCode']))) {
    issues.push(issue('INVALID_QUERY_EXPECTED_STATUS_CODE', 'query.expectedStatusCode', 'expectedStatusCode must be 200, 404, or 422'));
  }

  if (query['contractKind'] === 'list') {
    if (!isRecord(query['pagination'])) {
      issues.push(issue('INVALID_QUERY_PAGINATION', 'query.pagination', 'list queries require pagination metadata'));
    }
  } else if (query['pagination'] !== null) {
    issues.push(issue('UNEXPECTED_QUERY_PAGINATION', 'query.pagination', 'non-list queries must not include pagination'));
  }

  if (!Array.isArray(query['filters'])) {
    issues.push(issue('INVALID_QUERY_FILTERS', 'query.filters', 'filters must be an array'));
  }

  if (query['contractKind'] === 'list') {
    if (!isRecord(query['sort'])) {
      issues.push(issue('INVALID_QUERY_SORT', 'query.sort', 'list queries require sort metadata'));
    }
  } else if (query['sort'] !== null) {
    issues.push(issue('UNEXPECTED_QUERY_SORT', 'query.sort', 'non-list queries must not include sort metadata'));
  }
}

export function validateStrategyReviewExportAuditReportApiContractSelectorResult(
  input: unknown,
): StrategyReviewExportAuditReportApiContractSelectorResultValidationResult {
  const issues: StrategyReviewExportAuditReportApiContractSelectorValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'result', 'result must be a non-null object')],
    };
  }

  if (typeof input['resultId'] !== 'string' || input['resultId'].trim() === '') {
    issues.push(issue('INVALID_RESULT_ID', 'result.resultId', 'resultId must be a non-empty string'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractSelectorKind(input['resultKind'])) {
    issues.push(issue('INVALID_RESULT_KIND', 'result.resultKind', 'resultKind is invalid'));
  }
  if (typeof input['matched'] !== 'boolean') {
    issues.push(issue('INVALID_RESULT_MATCHED', 'result.matched', 'matched must be a boolean'));
  }
  if (![200, 404, 422].includes(Number(input['statusCode']))) {
    issues.push(issue('INVALID_RESULT_STATUS_CODE', 'result.statusCode', 'statusCode must be 200, 404, or 422'));
  }

  if (!isRecord(input['contract'])) {
    issues.push(issue('INVALID_RESULT_CONTRACT', 'result.contract', 'contract must be a non-null object'));
  } else {
    const contractValidation = validateStrategyReviewExportAuditReportApiContract(input['contract']);
    if (!contractValidation.valid) {
      issues.push(issue('INVALID_RESULT_CONTRACT_SHAPE', 'result.contract', 'result.contract must be a valid Phase 48 contract'));
    }
  }

  if (!Array.isArray(input['contracts']) || input['contracts'].length === 0) {
    issues.push(issue('INVALID_RESULT_CONTRACTS', 'result.contracts', 'contracts must be a non-empty array'));
  } else {
    for (const [index, contract] of input['contracts'].entries()) {
      const contractValidation = validateStrategyReviewExportAuditReportApiContract(contract);
      if (!contractValidation.valid) {
        issues.push(issue('INVALID_RESULT_CONTRACT_MEMBER', `result.contracts[${index}]`, 'contracts entries must be valid Phase 48 contracts'));
      }
    }
  }

  if (Array.isArray(input['contracts']) && isRecord(input['contract'])) {
    const match = input['contracts'].some(contract =>
      isRecord(contract) &&
      contract['contractId'] === input['contract']['contractId'] &&
      contract['contractName'] === input['contract']['contractName'],
    );
    if (!match) {
      issues.push(issue('PRIMARY_CONTRACT_MISSING', 'result.contracts', 'contracts must include the primary contract'));
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_RESULT_META', 'result.meta', 'meta must be a non-null object'));
  } else {
    if (input['meta']['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE) {
      issues.push(issue('INVALID_RESULT_META_PHASE', 'result.meta.phase', 'result meta phase must be 49'));
    }
    if (input['meta']['sourceContractPhase'] !== 48) {
      issues.push(issue('INVALID_RESULT_META_SOURCE_CONTRACT_PHASE', 'result.meta.sourceContractPhase', 'result meta sourceContractPhase must be 48'));
    }
    if (input['meta']['sourceViewModelPhase'] !== 47) {
      issues.push(issue('INVALID_RESULT_META_SOURCE_VIEW_MODEL_PHASE', 'result.meta.sourceViewModelPhase', 'result meta sourceViewModelPhase must be 47'));
    }
    if (input['meta']['fixtureOnly'] !== true || input['meta']['readOnly'] !== true || input['meta']['localOnly'] !== true || input['meta']['pure'] !== true) {
      issues.push(issue('INVALID_RESULT_META_SAFETY', 'result.meta', 'result meta must remain safe'));
    }
  }

  if (!isRecord(input['safety'])) {
    issues.push(issue('INVALID_RESULT_SAFETY', 'result.safety', 'safety must be a non-null object'));
  } else {
    if (input['safety']['fixtureOnly'] !== true || input['safety']['readOnly'] !== true || input['safety']['localOnly'] !== true || input['safety']['pure'] !== true) {
      issues.push(issue('INVALID_RESULT_SAFETY_TRUE_FLAGS', 'result.safety', 'result safety true flags are invalid'));
    }
    const requiredFalse = [
      'liveData',
      'networkAccess',
      'persistence',
      'filesystemWrites',
      'downloads',
      'routeHandlers',
      'httpServer',
      'runtimeRequests',
      'uiRendering',
      'domAccess',
      'execution',
      'tradingSignals',
      'recommendations',
      'investmentAdvice',
    ] as const;
    for (const key of requiredFalse) {
      if (input['safety'][key] !== false) {
        issues.push(issue('INVALID_RESULT_SAFETY_FALSE_FLAG', `result.safety.${key}`, `${key} must be false`));
      }
    }
  }

  if (isRecord(input['contract']) && input['statusCode'] !== input['contract']['statusCode']) {
    issues.push(issue('RESULT_STATUS_CODE_MISMATCH', 'result.statusCode', 'result.statusCode must match result.contract.statusCode'));
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateStrategyReviewExportAuditReportApiContractSelector(
  input: unknown,
): StrategyReviewExportAuditReportApiContractSelectorValidationResult {
  const issues: StrategyReviewExportAuditReportApiContractSelectorValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (typeof input['selectorId'] !== 'string' || input['selectorId'].trim() === '') {
    issues.push(issue('INVALID_SELECTOR_ID', 'selectorId', 'selectorId must be a non-empty string'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractSelectorName(input['selectorName'])) {
    issues.push(issue('INVALID_SELECTOR_NAME', 'selectorName', 'selectorName is invalid'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractSelectorKind(input['selectorKind'])) {
    issues.push(issue('INVALID_SELECTOR_KIND', 'selectorKind', 'selectorKind is invalid'));
  }
  if (input['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 49'));
  }

  for (const field of ['sourceContractIds', 'sourceContractNames', 'sourceViewModelIds', 'sourceReportIds', 'sourceAuditIds'] as const) {
    if (!Array.isArray(input[field])) {
      issues.push(issue('INVALID_SOURCE_FIELD', field, `${field} must be an array`));
    }
  }

  validateQuery(input['query'], input['selectorKind'], issues);
  const resultValidation = validateStrategyReviewExportAuditReportApiContractSelectorResult(input['result']);
  issues.push(...resultValidation.issues);
  validateMeta(input['meta'], issues);
  validateSafetyEnvelope(input['safety'], issues);
  validateValidationEnvelope(input['validation'], issues);
  validateCapabilityFlags(input['capabilityFlags'], issues);

  if (isRecord(input['query']) && isRecord(input['result']) && isRecord(input['result']['contract'])) {
    if (input['query']['contractName'] !== input['result']['contract']['contractName']) {
      issues.push(issue('QUERY_RESULT_CONTRACT_NAME_MISMATCH', 'query.contractName', 'query.contractName must match result.contract.contractName'));
    }
    if (input['query']['expectedStatusCode'] !== input['result']['statusCode']) {
      issues.push(issue('QUERY_RESULT_STATUS_CODE_MISMATCH', 'query.expectedStatusCode', 'query.expectedStatusCode must match result.statusCode'));
    }
    if (input['selectorKind'] !== input['result']['resultKind']) {
      issues.push(issue('SELECTOR_RESULT_KIND_MISMATCH', 'result.resultKind', 'result.resultKind must match selectorKind'));
    }
    if (input['selectorKind'] !== input['query']['queryKind']) {
      issues.push(issue('SELECTOR_QUERY_KIND_MISMATCH', 'query.queryKind', 'query.queryKind must match selectorKind'));
    }

    const expectedContractIds = uniqueStrings(
      Array.isArray(input['result']['contracts'])
        ? input['result']['contracts']
            .filter(isRecord)
            .map(contract => String(contract['contractId']))
        : [],
    ).sort((left, right) => left.localeCompare(right));
    const expectedContractNames = uniqueStrings(
      Array.isArray(input['result']['contracts'])
        ? input['result']['contracts']
            .filter(isRecord)
            .map(contract => String(contract['contractName']))
        : [],
    ).sort((left, right) => left.localeCompare(right));
    const expectedViewModelIds = uniqueStrings(
      Array.isArray(input['result']['contracts'])
        ? input['result']['contracts']
            .filter(isRecord)
            .flatMap(contract =>
              Array.isArray(contract['sourceViewModelIds'])
                ? contract['sourceViewModelIds'].map(value => String(value))
                : [],
            )
        : [],
    ).sort((left, right) => left.localeCompare(right));
    const expectedReportIds = uniqueStrings(
      Array.isArray(input['result']['contracts'])
        ? input['result']['contracts']
            .filter(isRecord)
            .flatMap(contract =>
              Array.isArray(contract['sourceReportIds'])
                ? contract['sourceReportIds'].map(value => String(value))
                : [],
            )
        : [],
    ).sort((left, right) => left.localeCompare(right));
    const expectedAuditIds = uniqueStrings(
      Array.isArray(input['result']['contracts'])
        ? input['result']['contracts']
            .filter(isRecord)
            .flatMap(contract =>
              Array.isArray(contract['sourceAuditIds'])
                ? contract['sourceAuditIds'].map(value => String(value))
                : [],
            )
        : [],
    ).sort((left, right) => left.localeCompare(right));

    if (
      Array.isArray(input['sourceContractIds']) &&
      !arraysEqual([...input['sourceContractIds']].map(String).sort((left, right) => left.localeCompare(right)), expectedContractIds)
    ) {
      issues.push(issue('SOURCE_CONTRACT_IDS_MISMATCH', 'sourceContractIds', 'sourceContractIds must match result contracts'));
    }
    if (
      Array.isArray(input['sourceContractNames']) &&
      !arraysEqual([...input['sourceContractNames']].map(String).sort((left, right) => left.localeCompare(right)), expectedContractNames)
    ) {
      issues.push(issue('SOURCE_CONTRACT_NAMES_MISMATCH', 'sourceContractNames', 'sourceContractNames must match result contracts'));
    }
    if (
      Array.isArray(input['sourceViewModelIds']) &&
      !arraysEqual([...input['sourceViewModelIds']].map(String).sort((left, right) => left.localeCompare(right)), expectedViewModelIds)
    ) {
      issues.push(issue('SOURCE_VIEW_MODEL_IDS_MISMATCH', 'sourceViewModelIds', 'sourceViewModelIds must match result contracts'));
    }
    if (
      Array.isArray(input['sourceReportIds']) &&
      !arraysEqual([...input['sourceReportIds']].map(String).sort((left, right) => left.localeCompare(right)), expectedReportIds)
    ) {
      issues.push(issue('SOURCE_REPORT_IDS_MISMATCH', 'sourceReportIds', 'sourceReportIds must match result contracts'));
    }
    if (
      Array.isArray(input['sourceAuditIds']) &&
      !arraysEqual([...input['sourceAuditIds']].map(String).sort((left, right) => left.localeCompare(right)), expectedAuditIds)
    ) {
      issues.push(issue('SOURCE_AUDIT_IDS_MISMATCH', 'sourceAuditIds', 'sourceAuditIds must match result contracts'));
    }
  }

  if (input['selectorKind'] === 'error') {
    for (const field of ['sourceViewModelIds', 'sourceReportIds', 'sourceAuditIds'] as const) {
      if (Array.isArray(input[field]) && input[field].length !== 0) {
        issues.push(issue('ERROR_SELECTOR_SOURCE_DATA', field, `${field} must be empty for error selectors`));
      }
    }
  }

  if (Array.isArray(input['sourceViewModelIds'])) {
    const validViewModelIds = new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.map(viewModel => viewModel.viewModelId));
    for (const sourceViewModelId of input['sourceViewModelIds']) {
      if (typeof sourceViewModelId !== 'string' || !validViewModelIds.has(sourceViewModelId)) {
        issues.push(issue('INVALID_SOURCE_VIEW_MODEL_ID', 'sourceViewModelIds', `source view-model ID '${String(sourceViewModelId)}' is invalid`));
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateStrategyReviewExportAuditReportApiContractSelectorSafety(
  input: unknown,
): StrategyReviewExportAuditReportApiContractSelectorSafetyResult {
  const strings = collectStrings(input);
  const violations: string[] = [];

  for (const value of strings) {
    if (FORBIDDEN_URL_PATTERN.test(value)) {
      violations.push(`Detected live URL reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_KEY_PATTERN.test(value)) {
      violations.push(`Detected private key or credential reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_EXECUTION_PATTERN.test(value)) {
      violations.push(`Detected execution reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_FILESYSTEM_PATTERN.test(value)) {
      violations.push(`Detected filesystem or persistence reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_RUNTIME_PATTERN.test(value)) {
      violations.push(`Detected runtime/network/rendering reference: "${value.slice(0, 80)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}
