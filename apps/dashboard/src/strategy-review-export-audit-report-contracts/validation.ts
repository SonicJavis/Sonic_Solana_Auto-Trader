/**
 * Phase 48 — Strategy Review Export Audit Report Read-Only API Contracts v1: validation.
 *
 * Structural and safety validation helpers for Phase 48 API contract fixtures.
 * Returns typed validation results. Does not throw for normal validation failures.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
  type StrategyReviewExportAuditReportApiContractSafetyResult,
  type StrategyReviewExportAuditReportApiContractValidationIssue,
  type StrategyReviewExportAuditReportApiContractValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditReportApiContractGeneratedAt,
  isValidStrategyReviewExportAuditReportApiContractKind,
  isValidStrategyReviewExportAuditReportApiContractName,
  isValidStrategyReviewExportAuditReportApiContractSource,
} from './normalization.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS } from '../strategy-review-export-audit-report-view-models/index.js';

// ─── Safety patterns ───────────────────────────────────────────────────────────

// Fields whose string values are legitimate fixture identifiers or documentation
// asserting the ABSENCE of unsafe behavior. These are excluded from content scanning.
const EXCLUDED_SCAN_FIELDS = new Set([
  'limitationItems',
  'nextPhaseNotes',
  'errorMessage',
  'message',
  'details',
  'description',
  'summary',
  'displayTitle',
  'displaySubtitle',
  'sourceAuditName',
  'sourceReportName',
  'viewModelName',
  'viewModelKind',
  'sourceReportKind',
  'sourceQueueReference',
  'contractName',
  'contractId',
  'badgeId',
  'cardId',
  'sectionId',
  'evidenceId',
  'rowId',
  'deterministicSeed',
]);

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[^\s'"]+/i;
const FORBIDDEN_KEY_PATTERN = /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair)\b/i;
const FORBIDDEN_EXECUTION_PATTERN = /\b(?:signTransaction|sendTransaction)\b/i;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportAuditReportApiContractValidationIssue {
  return { code, field, message, severity };
}

// Fields that legitimately document the ABSENCE of unsafe behavior (not implementation).
const DOCUMENTATION_FIELDS = EXCLUDED_SCAN_FIELDS;

function collectStrings(value: unknown, out: string[] = [], parentKey?: string): readonly string[] {
  if (typeof value === 'string') {
    // Skip strings in excluded fields — they are identifiers or documentation.
    if (parentKey === undefined || !DOCUMENTATION_FIELDS.has(parentKey)) {
      out.push(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, out, parentKey));
  } else if (isRecord(value)) {
    Object.entries(value).forEach(([key, entry]) => collectStrings(entry, out, key));
  }
  return out;
}

// ─── Meta validation ───────────────────────────────────────────────────────────

function validateContractMeta(
  meta: unknown,
  issues: StrategyReviewExportAuditReportApiContractValidationIssue[],
): void {
  if (!isRecord(meta)) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be a non-null object'));
    return;
  }
  if (meta['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE) {
    issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 48'));
  }
  if (!isValidStrategyReviewExportAuditReportApiContractGeneratedAt(meta['generatedAt'])) {
    issues.push(
      issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'generatedAt must be deterministic constant'),
    );
  }
  if (!isValidStrategyReviewExportAuditReportApiContractSource(meta['source'])) {
    issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'source must be deterministic constant'));
  }
  if (meta['fixtureOnly'] !== true) {
    issues.push(issue('INVALID_META_FIXTURE_ONLY', 'meta.fixtureOnly', 'fixtureOnly must be true'));
  }
  if (meta['readOnly'] !== true) {
    issues.push(issue('INVALID_META_READ_ONLY', 'meta.readOnly', 'readOnly must be true'));
  }
  if (meta['liveData'] !== false) {
    issues.push(issue('INVALID_META_LIVE_DATA', 'meta.liveData', 'liveData must be false'));
  }
  if (meta['networkAccess'] !== false) {
    issues.push(
      issue('INVALID_META_NETWORK_ACCESS', 'meta.networkAccess', 'networkAccess must be false'),
    );
  }
  if (meta['persistence'] !== false) {
    issues.push(issue('INVALID_META_PERSISTENCE', 'meta.persistence', 'persistence must be false'));
  }
  if (meta['execution'] !== false) {
    issues.push(issue('INVALID_META_EXECUTION', 'meta.execution', 'execution must be false'));
  }
  if (meta['recommendations'] !== false) {
    issues.push(
      issue('INVALID_META_RECOMMENDATIONS', 'meta.recommendations', 'recommendations must be false'),
    );
  }
  if (meta['tradingSignals'] !== false) {
    issues.push(
      issue('INVALID_META_TRADING_SIGNALS', 'meta.tradingSignals', 'tradingSignals must be false'),
    );
  }
  if (meta['investmentAdvice'] !== false) {
    issues.push(
      issue('INVALID_META_INVESTMENT_ADVICE', 'meta.investmentAdvice', 'investmentAdvice must be false'),
    );
  }
}

// ─── Safety envelope validation ────────────────────────────────────────────────

function validateSafetyEnvelope(
  safety: unknown,
  issues: StrategyReviewExportAuditReportApiContractValidationIssue[],
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
    'noUiRendering',
    'noDomAccess',
    'noBackgroundJobs',
    'noScheduledJobs',
    'noRouteHandlers',
    'noHttpServer',
    'noRuntimeRequests',
  ] as const;
  for (const key of requiredTrue) {
    if (safety[key] !== true) {
      issues.push(issue('SAFETY_TRUE_REQUIRED', `safety.${key}`, `safety.${key} must be true`));
    }
  }
}

// ─── Capability flags validation ───────────────────────────────────────────────

function validateCapabilityFlags(
  flags: unknown,
  issues: StrategyReviewExportAuditReportApiContractValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITY_FLAGS', 'capabilityFlags', 'capabilityFlags must be object'));
    return;
  }
  const requiredTrue = [
    'strategyReviewExportAuditReportApiContracts',
    'syntheticStrategyReviewExportAuditReportApiContracts',
    'deterministicStrategyReviewExportAuditReportApiContracts',
    'localOnlyStrategyReviewExportAuditReportApiContracts',
    'readOnlyStrategyReviewExportAuditReportApiContracts',
    'fixtureDerivedStrategyReviewExportAuditReportApiContracts',
  ] as const;
  const requiredFalse = [
    'strategyReviewExportAuditReportApiContractLiveData',
    'strategyReviewExportAuditReportApiContractNetworkAccess',
    'strategyReviewExportAuditReportApiContractPersistence',
    'strategyReviewExportAuditReportApiContractFilesystemWrites',
    'strategyReviewExportAuditReportApiContractDownloads',
    'strategyReviewExportAuditReportApiContractPdfGeneration',
    'strategyReviewExportAuditReportApiContractCsvGeneration',
    'strategyReviewExportAuditReportApiContractHtmlGeneration',
    'strategyReviewExportAuditReportApiContractRouteHandlers',
    'strategyReviewExportAuditReportApiContractHttpServer',
    'strategyReviewExportAuditReportApiContractRuntimeRequests',
    'strategyReviewExportAuditReportApiContractUiRendering',
    'strategyReviewExportAuditReportApiContractDomAccess',
    'strategyReviewExportAuditReportApiContractBackgroundJobs',
    'strategyReviewExportAuditReportApiContractScheduledJobs',
    'strategyReviewExportAuditReportApiContractExecution',
    'strategyReviewExportAuditReportApiContractTradingSignals',
    'strategyReviewExportAuditReportApiContractRecommendations',
    'strategyReviewExportAuditReportApiContractInvestmentAdvice',
  ] as const;

  for (const key of requiredTrue) {
    if (flags[key] !== true) {
      issues.push(
        issue('CAPABILITY_TRUE_REQUIRED', `capabilityFlags.${key}`, `${key} must be true`),
      );
    }
  }
  for (const key of requiredFalse) {
    if (flags[key] !== false) {
      issues.push(
        issue('CAPABILITY_FALSE_REQUIRED', `capabilityFlags.${key}`, `${key} must be false`),
      );
    }
  }
}

// ─── Source view model reference validation ─────────────────────────────────────

function validateSourceViewModelIds(
  ids: unknown,
  expectedFromPhase47: boolean,
  issues: StrategyReviewExportAuditReportApiContractValidationIssue[],
): void {
  if (!Array.isArray(ids)) {
    issues.push(
      issue('INVALID_SOURCE_VIEW_MODEL_IDS', 'sourceViewModelIds', 'sourceViewModelIds must be array'),
    );
    return;
  }
  if (expectedFromPhase47) {
    const phase47Ids = new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.map(vm => vm.viewModelId));
    for (const id of ids) {
      if (typeof id !== 'string' || !phase47Ids.has(id)) {
        issues.push(
          issue(
            'INVALID_SOURCE_VIEW_MODEL_ID',
            'sourceViewModelIds',
            `source view model ID '${String(id)}' is not a valid Phase 47 view model ID`,
          ),
        );
      }
    }
  }
}

// ─── Main validation ───────────────────────────────────────────────────────────

export function validateStrategyReviewExportAuditReportApiContract(
  input: unknown,
): StrategyReviewExportAuditReportApiContractValidationResult {
  const issues: StrategyReviewExportAuditReportApiContractValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (typeof input['contractId'] !== 'string' || input['contractId'].trim() === '') {
    issues.push(issue('INVALID_CONTRACT_ID', 'contractId', 'contractId must be non-empty string'));
  }

  if (!isValidStrategyReviewExportAuditReportApiContractName(input['contractName'])) {
    issues.push(issue('INVALID_CONTRACT_NAME', 'contractName', 'contractName is invalid'));
  }

  if (!isValidStrategyReviewExportAuditReportApiContractKind(input['contractKind'])) {
    issues.push(issue('INVALID_CONTRACT_KIND', 'contractKind', 'contractKind is invalid'));
  }

  if (input['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 48'));
  }

  if (typeof input['endpointPattern'] !== 'string' || input['endpointPattern'].trim() === '') {
    issues.push(
      issue('INVALID_ENDPOINT_PATTERN', 'endpointPattern', 'endpointPattern must be non-empty string'),
    );
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

  const kind = input['contractKind'];

  if (kind === 'list' || kind === 'detail' || kind === 'summary') {
    if (input['success'] !== true) {
      issues.push(issue('INVALID_SUCCESS', 'success', 'success must be true for list/detail/summary'));
    }
    if (input['statusCode'] !== 200) {
      issues.push(issue('INVALID_STATUS_CODE', 'statusCode', 'statusCode must be 200 for success contracts'));
    }
    if (input['error'] !== null) {
      issues.push(
        issue('INVALID_ERROR', 'error', 'error must be null for list/detail/summary contracts'),
      );
    }
  }

  if (kind === 'error') {
    if (input['success'] !== false) {
      issues.push(issue('INVALID_SUCCESS', 'success', 'success must be false for error contracts'));
    }
    const statusCode = input['statusCode'];
    if (statusCode !== 404 && statusCode !== 422) {
      issues.push(
        issue('INVALID_STATUS_CODE', 'statusCode', 'statusCode must be 404 or 422 for error contracts'),
      );
    }
    if (input['data'] !== null) {
      issues.push(issue('INVALID_DATA', 'data', 'data must be null for error contracts'));
    }
    if (!isRecord(input['error'])) {
      issues.push(issue('INVALID_ERROR_SHAPE', 'error', 'error must be object for error contracts'));
    } else {
      if (input['error']['fixtureOnly'] !== true) {
        issues.push(
          issue('INVALID_ERROR_FIXTURE_ONLY', 'error.fixtureOnly', 'error.fixtureOnly must be true'),
        );
      }
    }
  }

  // Source view model refs: validate for list/detail/summary; error contracts have empty arrays
  if (kind !== 'error') {
    validateSourceViewModelIds(input['sourceViewModelIds'], true, issues);
  } else {
    if (!Array.isArray(input['sourceViewModelIds']) || input['sourceViewModelIds'].length !== 0) {
      issues.push(
        issue(
          'INVALID_ERROR_SOURCE_IDS',
          'sourceViewModelIds',
          'error contracts must have empty sourceViewModelIds',
        ),
      );
    }
  }

  validateContractMeta(input['meta'], issues);
  validateSafetyEnvelope(input['safety'], issues);
  validateCapabilityFlags(input['capabilityFlags'], issues);

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ─── Safety validation ─────────────────────────────────────────────────────────

export function validateStrategyReviewExportAuditReportApiContractSafety(
  input: unknown,
): StrategyReviewExportAuditReportApiContractSafetyResult {
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
      violations.push(`Detected transaction execution reference: "${value.slice(0, 80)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}
