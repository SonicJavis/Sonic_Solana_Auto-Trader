import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import {
  HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE,
  type HistoricalSnapshotIngestionContractFixture,
  type HistoricalSnapshotIngestionContractSafetyResult,
  type HistoricalSnapshotIngestionContractValidationIssue,
  type HistoricalSnapshotIngestionContractValidationResult,
} from './types.js';
import {
  isValidHistoricalSnapshotIngestionContractGeneratedAt,
  isValidHistoricalSnapshotIngestionContractKind,
  isValidHistoricalSnapshotIngestionContractName,
  isValidHistoricalSnapshotIngestionContractSchemaVersion,
  isValidHistoricalSnapshotIngestionContractSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|endpoint|providersdk|provider[_-]?sdk)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB|download)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\()/;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:execute|buy|sell|trade|order|recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_SECRET_PATTERN = /\b(?:apiKey|secret|token-drainer|drainer|postinstall)\b/i;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function pushIssue(
  issues: HistoricalSnapshotIngestionContractValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(
  text: string,
  fieldPath: string,
  issues: HistoricalSnapshotIngestionContractValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem/download references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Runtime timer/random references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_SECRET_OR_SDK_REFERENCE', fieldPath, 'Secret/api-key/provider-sdk references are forbidden.');
}

function scanRecursive(
  value: unknown,
  fieldPath: string,
  issues: HistoricalSnapshotIngestionContractValidationIssue[],
  depth = 0,
): void {
  if (depth > 24) return;
  if (typeof value === 'string') {
    if (!fieldPath.endsWith('fixtureId') && !fieldPath.endsWith('fixtureName')) {
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

function isDeterministicTimestamp(value: string): boolean {
  return TIMESTAMP_PATTERN.test(value) && !/now|dynamic|runtime/i.test(value);
}

export function validateHistoricalSnapshotIngestionContractFixture(
  fixture: HistoricalSnapshotIngestionContractFixture,
): HistoricalSnapshotIngestionContractValidationResult {
  const issues: HistoricalSnapshotIngestionContractValidationIssue[] = [];

  if (!isValidHistoricalSnapshotIngestionContractName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidHistoricalSnapshotIngestionContractKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${HISTORICAL_SNAPSHOT_INGESTION_CONTRACTS_PHASE}.`);
  }
  if (!isValidHistoricalSnapshotIngestionContractSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidHistoricalSnapshotIngestionContractGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidHistoricalSnapshotIngestionContractSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic.');
  }

  if (!isDeterministicTimestamp(fixture.manifest.capturedAt)) {
    pushIssue(issues, 'DYNAMIC_CAPTURED_AT_FORBIDDEN', 'manifest.capturedAt', 'capturedAt must be deterministic.');
  }

  if (fixture.manifest.liveData !== false) {
    pushIssue(issues, 'LIVE_DATA_FORBIDDEN', 'manifest.liveData', 'manifest.liveData must be false.');
  }

  if (fixture.importPlan.requiresNetwork || fixture.importPlan.requiresFilesystem || fixture.importPlan.requiresSecrets) {
    pushIssue(issues, 'UNSAFE_IMPORT_PLAN_REQUIREMENTS', 'importPlan', 'Import plan cannot require network/filesystem/secrets.');
  }

  if (fixture.schemaContract.criticalFields.length > 0 && fixture.schemaContract.failClosedOnCriticalDrift !== true) {
    pushIssue(
      issues,
      'CRITICAL_DRIFT_MUST_FAIL_CLOSED',
      'schemaContract.failClosedOnCriticalDrift',
      'Critical drift handling must be fail-closed.',
    );
  }

  if (fixture.freshnessContract.stale && fixture.rejectionContract.severity === 'warning' && fixture.rejectionContract.failClosed) {
    pushIssue(issues, 'STALE_WARNING_CONTRADICTION', 'rejectionContract', 'Stale warning cannot be marked fail-closed.');
  }

  if (fixture.fixtureName === 'partial-provider-snapshot-quarantined' && fixture.rejectionContract.failClosed !== true) {
    pushIssue(issues, 'PARTIAL_SNAPSHOT_MUST_BE_QUARANTINED', 'rejectionContract.failClosed', 'Partial snapshots must be quarantined.');
  }

  if (!fixture.integrityContract.checksum || !fixture.integrityContract.manifestHash || !fixture.integrityContract.sourceHash) {
    pushIssue(issues, 'MISSING_INTEGRITY_VALUES', 'integrityContract', 'Checksum/integrity values are required.');
  }

  if (fixture.provenanceContract.sourceFixtureRefs.length === 0) {
    pushIssue(issues, 'MISSING_PROVENANCE_SOURCE_REFS', 'provenanceContract.sourceFixtureRefs', 'Provenance source refs are required.');
  }

  if (
    fixture.capabilityFlags.historicalSnapshotLiveIngestion !== false ||
    fixture.capabilityFlags.historicalSnapshotRuntimeIngestion !== false ||
    fixture.capabilityFlags.historicalSnapshotLiveNetworkAccess !== false ||
    fixture.capabilityFlags.historicalSnapshotRuntimeCollectors !== false ||
    fixture.capabilityFlags.historicalSnapshotSecretsRequired !== false ||
    fixture.capabilityFlags.historicalSnapshotWriteMethods !== false ||
    fixture.capabilityFlags.historicalSnapshotWalletLogic !== false ||
    fixture.capabilityFlags.historicalSnapshotPrivateKeyHandling !== false ||
    fixture.capabilityFlags.historicalSnapshotSigning !== false ||
    fixture.capabilityFlags.historicalSnapshotTransactionSending !== false ||
    fixture.capabilityFlags.historicalSnapshotExecution !== false ||
    fixture.capabilityFlags.historicalSnapshotTradingSignals !== false ||
    fixture.capabilityFlags.historicalSnapshotRecommendations !== false ||
    fixture.capabilityFlags.historicalSnapshotInvestmentAdvice !== false ||
    fixture.capabilityFlags.historicalSnapshotRouteHandlers !== false ||
    fixture.capabilityFlags.historicalSnapshotRuntimeRequests !== false ||
    fixture.capabilityFlags.historicalSnapshotUiRendering !== false ||
    fixture.capabilityFlags.historicalSnapshotDomAccess !== false ||
    fixture.capabilityFlags.historicalSnapshotPersistence !== false ||
    fixture.capabilityFlags.historicalSnapshotFilesystemWrites !== false ||
    fixture.capabilityFlags.historicalSnapshotBackgroundJobs !== false ||
    fixture.capabilityFlags.historicalSnapshotScheduledJobs !== false ||
    fixture.capabilityFlags.historicalSnapshotRealOrders !== false ||
    fixture.capabilityFlags.historicalSnapshotRealFunds !== false ||
    fixture.capabilityFlags.historicalSnapshotRealPnL !== false ||
    fixture.capabilityFlags.historicalSnapshotProviderExpansion !== false
  ) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags', 'Unsafe capability flags must be false.');
  }

  if (JSON.stringify(fixture.sourcePhase65FixtureSnapshot) !== JSON.stringify(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE65_SOURCE_SNAPSHOT', 'sourcePhase65FixtureSnapshot', 'Source Phase 65 names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase66FixtureSnapshot) !== JSON.stringify(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE66_SOURCE_SNAPSHOT', 'sourcePhase66FixtureSnapshot', 'Source Phase 66 names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase67FixtureSnapshot) !== JSON.stringify(CROSS_PROVIDER_DATA_QUALITY_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE67_SOURCE_SNAPSHOT', 'sourcePhase67FixtureSnapshot', 'Source Phase 67 names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase68FixtureSnapshot) !== JSON.stringify(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE68_SOURCE_SNAPSHOT', 'sourcePhase68FixtureSnapshot', 'Source Phase 68 names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase69FixtureSnapshot) !== JSON.stringify(LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE69_SOURCE_SNAPSHOT', 'sourcePhase69FixtureSnapshot', 'Source Phase 69 names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase70FixtureSnapshot) !== JSON.stringify(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE70_SOURCE_SNAPSHOT', 'sourcePhase70FixtureSnapshot', 'Source Phase 70 names must be immutable.');
  }

  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateHistoricalSnapshotIngestionContractSafety(
  fixture: HistoricalSnapshotIngestionContractFixture,
): HistoricalSnapshotIngestionContractSafetyResult {
  const violations: string[] = [];
  if (fixture.safety.readOnly !== true) violations.push('safety.readOnly must be true');
  if (fixture.safety.localOnly !== true) violations.push('safety.localOnly must be true');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.manifest.liveData !== false) violations.push('manifest.liveData must be false');
  if (fixture.capabilityFlags.historicalSnapshotExecution !== false)
    violations.push('historicalSnapshotExecution must be false');
  return { safe: violations.length === 0, violations };
}

export function validateHistoricalSnapshotIngestionContractFixtureTable(
  fixtures: readonly HistoricalSnapshotIngestionContractFixture[],
): HistoricalSnapshotIngestionContractValidationResult {
  const issues: HistoricalSnapshotIngestionContractValidationIssue[] = [];
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
    issues.push(...validateHistoricalSnapshotIngestionContractFixture(fixture).issues);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 historical snapshot ingestion contract fixtures.');
  }

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}
