import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import {
  CROSS_PROVIDER_DATA_QUALITY_PHASE,
  type CrossProviderDataQualityFixture,
  type CrossProviderDataQualitySafetyResult,
  type CrossProviderDataQualityValidationIssue,
  type CrossProviderDataQualityValidationResult,
} from './types.js';
import {
  isValidCrossProviderDataQualityGeneratedAt,
  isValidCrossProviderDataQualityKind,
  isValidCrossProviderDataQualityName,
  isValidCrossProviderDataQualitySchemaVersion,
  isValidCrossProviderDataQualitySource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|endpoint|wss?:\/\/|providerSdk|provider[_-]?sdk)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\()/;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:execute|buy|sell|trade|order|recommendation|signal|investment\s+advice|profit|pnl)\b/i;

function pushIssue(
  issues: CrossProviderDataQualityValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(text: string, fieldPath: string, issues: CrossProviderDataQualityValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Runtime timer/random references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory references are forbidden.');
}

function scanRecursive(
  value: unknown,
  fieldPath: string,
  issues: CrossProviderDataQualityValidationIssue[],
  depth = 0,
): void {
  if (depth > 24) return;
  if (typeof value === 'string') {
    if (!fieldPath.endsWith('fixtureId') && !fieldPath.endsWith('sourceFixtureName')) {
      scanUnsafeText(value, fieldPath, issues);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanRecursive(entry, `${fieldPath}[${index}]`, issues, depth + 1));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      scanRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
    }
  }
}

export function validateCrossProviderDataQualityFixture(
  fixture: CrossProviderDataQualityFixture,
): CrossProviderDataQualityValidationResult {
  const issues: CrossProviderDataQualityValidationIssue[] = [];

  if (!isValidCrossProviderDataQualityName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidCrossProviderDataQualityKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== CROSS_PROVIDER_DATA_QUALITY_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${CROSS_PROVIDER_DATA_QUALITY_PHASE}.`);
  }
  if (!isValidCrossProviderDataQualitySchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidCrossProviderDataQualityGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidCrossProviderDataQualitySource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic.');
  }
  if (fixture.confidenceScore.score < 0 || fixture.confidenceScore.score > 100) {
    pushIssue(issues, 'INVALID_CONFIDENCE_SCORE_RANGE', 'confidenceScore.score', 'Confidence score must be 0-100.');
  }
  if (fixture.confidenceScore.label !== fixture.reconciliationResult.confidenceLabel) {
    pushIssue(
      issues,
      'CONFIDENCE_LABEL_MISMATCH',
      'reconciliationResult.confidenceLabel',
      'Confidence labels must match.',
    );
  }
  if (fixture.mismatchReports.some(report => report.sourceRefs.length === 0)) {
    pushIssue(issues, 'MISMATCH_REPORT_SOURCE_REFS_REQUIRED', 'mismatchReports', 'Mismatch reports require source refs.');
  }
  if (fixture.provenanceRecords.length === 0) {
    pushIssue(issues, 'RECONCILIATION_REQUIRES_PROVENANCE', 'provenanceRecords', 'Provenance is required.');
  }
  if (fixture.enrichmentContract.liveData !== false) {
    pushIssue(issues, 'ENRICHMENT_LIVE_DATA_FORBIDDEN', 'enrichmentContract.liveData', 'liveData must be false.');
  }
  if (fixture.enrichmentContract.readOnly !== true) {
    pushIssue(issues, 'ENRICHMENT_READ_ONLY_REQUIRED', 'enrichmentContract.readOnly', 'readOnly must be true.');
  }
  if (fixture.reconciliationResult.failClosed && fixture.reconciliationResult.unresolvedFieldPaths.length === 0) {
    pushIssue(
      issues,
      'FAIL_CLOSED_NEEDS_UNRESOLVED_FIELDS',
      'reconciliationResult.unresolvedFieldPaths',
      'Fail-closed requires unresolved critical conflicts.',
    );
  }
  if (!fixture.reconciliationResult.failClosed && fixture.reconciliationResult.selectedProviderId === 'none') {
    pushIssue(
      issues,
      'INVALID_SELECTED_PROVIDER',
      'reconciliationResult.selectedProviderId',
      'Non-fail-closed fixtures must select a provider.',
    );
  }
  if (!MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES.includes(fixture.sourcePhase66FixtureName)) {
    pushIssue(issues, 'INVALID_PHASE66_SOURCE_REF', 'sourcePhase66FixtureName', 'Invalid Phase 66 source reference.');
  }
  if (JSON.stringify(fixture.sourcePhase66FixtureSnapshot) !== JSON.stringify(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)) {
    pushIssue(
      issues,
      'MUTATED_SOURCE_FIXTURE_SNAPSHOT',
      'sourcePhase66FixtureSnapshot',
      'Source snapshot must match immutable Phase 66 names.',
    );
  }

  const caps = fixture.capabilityFlags;
  if (
    caps.crossProviderLiveData !== false ||
    caps.crossProviderNetworkAccess !== false ||
    caps.crossProviderWriteMethods !== false ||
    caps.crossProviderWalletLogic !== false ||
    caps.crossProviderPrivateKeyHandling !== false ||
    caps.crossProviderSigning !== false ||
    caps.crossProviderTransactionSending !== false ||
    caps.crossProviderExecution !== false ||
    caps.crossProviderTradingSignals !== false ||
    caps.crossProviderRecommendations !== false ||
    caps.crossProviderInvestmentAdvice !== false ||
    caps.crossProviderRouteHandlers !== false ||
    caps.crossProviderRuntimeRequests !== false ||
    caps.crossProviderUiRendering !== false ||
    caps.crossProviderDomAccess !== false ||
    caps.crossProviderPersistence !== false ||
    caps.crossProviderFilesystemWrites !== false ||
    caps.crossProviderBackgroundJobs !== false ||
    caps.crossProviderScheduledJobs !== false ||
    caps.crossProviderRealOrders !== false ||
    caps.crossProviderRealFunds !== false ||
    caps.crossProviderRealPnL !== false ||
    caps.crossProviderLiveReconciliation !== false ||
    caps.crossProviderAutoExecution !== false
  ) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags', 'Unsafe capability flags must be false.');
  }

  scanRecursive(fixture, 'fixture', issues);
  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateCrossProviderDataQualitySafety(
  fixture: CrossProviderDataQualityFixture,
): CrossProviderDataQualitySafetyResult {
  const violations: string[] = [];
  if (fixture.safety.readOnly !== true) violations.push('safety.readOnly must be true');
  if (fixture.safety.localOnly !== true) violations.push('safety.localOnly must be true');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.enrichmentContract.liveData !== false) violations.push('enrichmentContract.liveData must be false');
  if (fixture.enrichmentContract.readOnly !== true) violations.push('enrichmentContract.readOnly must be true');
  if (fixture.reconciliationPolicy.noLiveFallback !== true) violations.push('reconciliationPolicy.noLiveFallback must be true');
  if (fixture.reconciliationPolicy.noLiveRefresh !== true) violations.push('reconciliationPolicy.noLiveRefresh must be true');
  return { safe: violations.length === 0, violations };
}

export function validateCrossProviderDataQualityFixtureTable(
  fixtures: readonly CrossProviderDataQualityFixture[],
): CrossProviderDataQualityValidationResult {
  const issues: CrossProviderDataQualityValidationIssue[] = [];
  const fixtureIds = new Set<string>();
  const fixtureNames = new Set<string>();

  for (const fixture of fixtures) {
    if (fixtureIds.has(fixture.fixtureId)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    }
    if (fixtureNames.has(fixture.fixtureName)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    }
    fixtureIds.add(fixture.fixtureId);
    fixtureNames.add(fixture.fixtureName);
    issues.push(...validateCrossProviderDataQualityFixture(fixture).issues);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 cross-provider data-quality fixtures.');
  }
  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}
