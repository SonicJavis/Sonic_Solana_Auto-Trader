/**
 * Phase 52 — Strategy Review Export Audit Report Surface Registry v1: validation.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE,
  type StrategyReviewExportAuditReportSurfaceRegistrySafetyResult,
  type StrategyReviewExportAuditReportSurfaceRegistryValidationIssue,
  type StrategyReviewExportAuditReportSurfaceRegistryValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportAuditReportSurfaceRegistryEntryKind,
  isValidStrategyReviewExportAuditReportSurfaceRegistryEntryName,
  isValidStrategyReviewExportAuditReportSurfaceRegistryGeneratedAt,
  isValidStrategyReviewExportAuditReportSurfaceRegistrySource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[^\s'"]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|XMLHttpRequest|RPC)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route|handler|fastify|express|listen\(|server)\b/i;
const FORBIDDEN_WALLET_PATTERN = /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|execute|swap|buy|sell|trade|order|signal|recommendation|investment advice)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'registryId',
  'registryName',
  'entryId',
  'entryName',
  'entryKind',
  'modulePath',
  'docPath',
  'testPath',
  'policyDocPath',
  'milestoneName',
  'source',
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
): StrategyReviewExportAuditReportSurfaceRegistryValidationIssue {
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

function validateCapabilities(
  flags: unknown,
  issues: StrategyReviewExportAuditReportSurfaceRegistryValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITIES', 'capabilitySummary', 'capabilitySummary must be object'));
    return;
  }

  const requiredTrue = [
    'strategyReviewExportAuditReportSurfaceRegistry',
    'syntheticStrategyReviewExportAuditReportSurfaceRegistry',
    'deterministicStrategyReviewExportAuditReportSurfaceRegistry',
    'localOnlyStrategyReviewExportAuditReportSurfaceRegistry',
    'readOnlyStrategyReviewExportAuditReportSurfaceRegistry',
    'fixtureDerivedStrategyReviewExportAuditReportSurfaceRegistry',
    'aggressiveSafePhasePolicy',
    'preventsUnnecessaryDerivativeLayers',
  ] as const;

  const requiredFalse = [
    'strategyReviewExportAuditReportSurfaceRegistryLiveData',
    'strategyReviewExportAuditReportSurfaceRegistryNetworkAccess',
    'strategyReviewExportAuditReportSurfaceRegistryPersistence',
    'strategyReviewExportAuditReportSurfaceRegistryFilesystemWrites',
    'strategyReviewExportAuditReportSurfaceRegistryDownloads',
    'strategyReviewExportAuditReportSurfaceRegistryPdfGeneration',
    'strategyReviewExportAuditReportSurfaceRegistryCsvGeneration',
    'strategyReviewExportAuditReportSurfaceRegistryHtmlGeneration',
    'strategyReviewExportAuditReportSurfaceRegistryRouteHandlers',
    'strategyReviewExportAuditReportSurfaceRegistryHttpServer',
    'strategyReviewExportAuditReportSurfaceRegistryRuntimeRequests',
    'strategyReviewExportAuditReportSurfaceRegistryUiRendering',
    'strategyReviewExportAuditReportSurfaceRegistryDomAccess',
    'strategyReviewExportAuditReportSurfaceRegistryBackgroundJobs',
    'strategyReviewExportAuditReportSurfaceRegistryScheduledJobs',
    'strategyReviewExportAuditReportSurfaceRegistryExecution',
    'strategyReviewExportAuditReportSurfaceRegistryTradingSignals',
    'strategyReviewExportAuditReportSurfaceRegistryRecommendations',
    'strategyReviewExportAuditReportSurfaceRegistryInvestmentAdvice',
  ] as const;

  for (const key of requiredTrue) {
    if (flags[key] !== true) {
      issues.push(issue('CAPABILITY_TRUE_REQUIRED', `capabilitySummary.${key}`, `${key} must be true`));
    }
  }

  for (const key of requiredFalse) {
    if (flags[key] !== false) {
      issues.push(issue('CAPABILITY_FALSE_REQUIRED', `capabilitySummary.${key}`, `${key} must be false`));
    }
  }
}

function validateSafetySummary(
  safetySummary: unknown,
  issues: StrategyReviewExportAuditReportSurfaceRegistryValidationIssue[],
): void {
  if (!isRecord(safetySummary)) {
    issues.push(issue('INVALID_SAFETY_SUMMARY', 'safetySummary', 'safetySummary must be object'));
    return;
  }

  const requiredTrue = [
    'fixtureOnly',
    'syntheticOnly',
    'deterministic',
    'localOnly',
    'readOnly',
    'nonEndpoint',
    'nonHandler',
    'nonRuntimeRequest',
    'nonRendering',
    'nonDom',
    'nonExecutable',
    'nonPersistent',
    'nonNetworked',
    'nonAdvisory',
  ] as const;

  for (const key of requiredTrue) {
    if (safetySummary[key] !== true) {
      issues.push(issue('SAFETY_TRUE_REQUIRED', `safetySummary.${key}`, `${key} must be true`));
    }
  }
}

export function validateStrategyReviewExportAuditReportSurfaceRegistrySafety(
  input: unknown,
): StrategyReviewExportAuditReportSurfaceRegistrySafetyResult {
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

export function validateStrategyReviewExportAuditReportSurfaceRegistry(
  input: unknown,
): StrategyReviewExportAuditReportSurfaceRegistryValidationResult {
  const issues: StrategyReviewExportAuditReportSurfaceRegistryValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (input['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 52'));
  }

  if (!isValidStrategyReviewExportAuditReportSurfaceRegistryGeneratedAt(input['generatedAt'])) {
    issues.push(issue('INVALID_GENERATED_AT', 'generatedAt', 'generatedAt must be deterministic constant'));
  }

  if (typeof input['registryId'] !== 'string' || input['registryId'].trim() === '') {
    issues.push(issue('INVALID_REGISTRY_ID', 'registryId', 'registryId must be non-empty string'));
  }

  if (input['registryName'] !== 'strategy-review-export-audit-report-surface-registry') {
    issues.push(issue('INVALID_REGISTRY_NAME', 'registryName', 'registryName is invalid'));
  }

  if (!Array.isArray(input['entries']) || input['entries'].length !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES.length) {
    issues.push(issue('INVALID_ENTRIES', 'entries', 'entries must include all phase 45–51 surfaces'));
  } else {
    const ids = new Set<string>();
    const names = new Set<string>();

    input['entries'].forEach((entry, index) => {
      if (!isRecord(entry)) {
        issues.push(issue('INVALID_ENTRY_OBJECT', `entries[${index}]`, 'entry must be object'));
        return;
      }

      if (typeof entry['entryId'] !== 'string' || entry['entryId'].trim() === '') {
        issues.push(issue('INVALID_ENTRY_ID', `entries[${index}].entryId`, 'entryId must be non-empty string'));
      } else if (ids.has(entry['entryId'])) {
        issues.push(issue('DUPLICATE_ENTRY_ID', `entries[${index}].entryId`, 'entryId must be unique'));
      } else {
        ids.add(entry['entryId']);
      }

      if (!isValidStrategyReviewExportAuditReportSurfaceRegistryEntryName(entry['entryName'])) {
        issues.push(issue('INVALID_ENTRY_NAME', `entries[${index}].entryName`, 'entryName is invalid'));
      } else if (names.has(entry['entryName'])) {
        issues.push(issue('DUPLICATE_ENTRY_NAME', `entries[${index}].entryName`, 'entryName must be unique'));
      } else {
        names.add(entry['entryName']);
      }

      if (!isValidStrategyReviewExportAuditReportSurfaceRegistryEntryKind(entry['entryKind'])) {
        issues.push(issue('INVALID_ENTRY_KIND', `entries[${index}].entryKind`, 'entryKind is invalid'));
      }

      if (![45, 46, 47, 48, 49, 50, 51].includes(Number(entry['phase']))) {
        issues.push(issue('INVALID_ENTRY_PHASE', `entries[${index}].phase`, 'entry phase must be in 45..51'));
      }

      if (typeof entry['modulePath'] !== 'string' || !entry['modulePath'].startsWith('apps/dashboard/src/strategy-review-export-audit')) {
        issues.push(issue('INVALID_MODULE_PATH', `entries[${index}].modulePath`, 'modulePath must reference dashboard strategy-review source'));
      }
      if (typeof entry['docPath'] !== 'string' || !entry['docPath'].startsWith('docs/')) {
        issues.push(issue('INVALID_DOC_PATH', `entries[${index}].docPath`, 'docPath must reference docs path'));
      }
      if (typeof entry['testPath'] !== 'string' || !entry['testPath'].startsWith('tests/phase')) {
        issues.push(issue('INVALID_TEST_PATH', `entries[${index}].testPath`, 'testPath must reference phase test path'));
      }

      if (!Array.isArray(entry['sourceEntries'])) {
        issues.push(issue('INVALID_SOURCE_ENTRIES', `entries[${index}].sourceEntries`, 'sourceEntries must be array'));
      } else {
        entry['sourceEntries'].forEach((sourceEntry, sourceIndex) => {
          if (!isValidStrategyReviewExportAuditReportSurfaceRegistryEntryName(sourceEntry)) {
            issues.push(
              issue(
                'INVALID_SOURCE_ENTRY_REFERENCE',
                `entries[${index}].sourceEntries[${sourceIndex}]`,
                'sourceEntries must contain valid entry names',
              ),
            );
          }
        });
      }

      if (entry['isDerivativeLayer'] === true && entry['hasRealConsumer'] !== true) {
        issues.push(
          issue(
            'DERIVATIVE_LAYER_WITHOUT_CONSUMER',
            `entries[${index}]`,
            'derivative layers must provide a real consumer',
          ),
        );
      }

      if (entry['shouldCreateFurtherDerivativeLayer'] !== false) {
        issues.push(
          issue(
            'UNSAFE_DERIVATIVE_LAYER_POLICY',
            `entries[${index}].shouldCreateFurtherDerivativeLayer`,
            'shouldCreateFurtherDerivativeLayer must be false',
          ),
        );
      }

      if (!isRecord(entry['consumerGuidance']) || entry['consumerGuidance']['requiresRealConsumerForNewDerivatives'] !== true) {
        issues.push(
          issue(
            'INVALID_CONSUMER_GUIDANCE',
            `entries[${index}].consumerGuidance`,
            'consumer guidance must require real consumers for derivatives',
          ),
        );
      }

      validateCapabilities(entry['capabilitySummary'], issues);
      validateSafetySummary(entry['safetySummary'], issues);
    });

    for (const entryName of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES) {
      if (!names.has(entryName)) {
        issues.push(issue('MISSING_ENTRY_NAME', 'entries', `missing expected entry '${entryName}'`));
      }
    }
  }

  if (!isRecord(input['relationships'])) {
    issues.push(issue('INVALID_RELATIONSHIPS', 'relationships', 'relationships must be object'));
  } else {
    if (input['relationships']['blocksRecursiveDerivativeLayers'] !== true) {
      issues.push(
        issue(
          'INVALID_RELATIONSHIP_POLICY',
          'relationships.blocksRecursiveDerivativeLayers',
          'blocksRecursiveDerivativeLayers must be true',
        ),
      );
    }
  }

  validateCapabilities(input['capabilitySummary'], issues);
  validateSafetySummary(input['safetySummary'], issues);

  if (!isRecord(input['aggressiveSafePolicy'])) {
    issues.push(issue('INVALID_POLICY', 'aggressiveSafePolicy', 'aggressiveSafePolicy must be object'));
  } else {
    if (input['aggressiveSafePolicy']['preventsUnnecessaryDerivativeLayers'] !== true) {
      issues.push(
        issue(
          'INVALID_POLICY_DERIVATIVE_GUARD',
          'aggressiveSafePolicy.preventsUnnecessaryDerivativeLayers',
          'preventsUnnecessaryDerivativeLayers must be true',
        ),
      );
    }
    if (input['aggressiveSafePolicy']['disallowWrapperOnWrapperWithoutRealConsumer'] !== true) {
      issues.push(
        issue(
          'INVALID_POLICY_WRAPPER_GUARD',
          'aggressiveSafePolicy.disallowWrapperOnWrapperWithoutRealConsumer',
          'disallowWrapperOnWrapperWithoutRealConsumer must be true',
        ),
      );
    }
  }

  if (!isRecord(input['nextMilestone'])) {
    issues.push(issue('INVALID_NEXT_MILESTONE', 'nextMilestone', 'nextMilestone must be object'));
  } else {
    if (input['nextMilestone']['nextPhase'] !== 53) {
      issues.push(issue('INVALID_NEXT_PHASE', 'nextMilestone.nextPhase', 'nextPhase must be 53'));
    }
    if (input['nextMilestone']['implemented'] !== false) {
      issues.push(issue('INVALID_NEXT_PHASE_IMPLEMENTED_FLAG', 'nextMilestone.implemented', 'Phase 53 must remain unimplemented'));
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be object'));
  } else {
    if (input['meta']['phase'] !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE) {
      issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 52'));
    }
    if (!isValidStrategyReviewExportAuditReportSurfaceRegistryGeneratedAt(input['meta']['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant'));
    }
    if (!isValidStrategyReviewExportAuditReportSurfaceRegistrySource(input['meta']['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant'));
    }
  }

  const safetyResult = validateStrategyReviewExportAuditReportSurfaceRegistrySafety(input);
  if (!safetyResult.safe) {
    issues.push(issue('UNSAFE_REGISTRY_CONTENT', 'root', `registry contains unsafe content (${safetyResult.violations.length} violation(s))`));
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
