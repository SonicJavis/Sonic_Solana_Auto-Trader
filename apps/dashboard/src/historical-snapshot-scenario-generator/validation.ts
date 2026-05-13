import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../historical-snapshot-ingestion-contracts/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import {
  HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE,
  type HistoricalSnapshotScenarioGeneratorFixture,
  type HistoricalSnapshotScenarioGeneratorSafetyResult,
  type HistoricalSnapshotScenarioGeneratorValidationIssue,
  type HistoricalSnapshotScenarioGeneratorValidationResult,
} from './types.js';
import {
  isValidHistoricalSnapshotScenarioGeneratorGeneratedAt,
  isValidHistoricalSnapshotScenarioGeneratorKind,
  isValidHistoricalSnapshotScenarioGeneratorName,
  isValidHistoricalSnapshotScenarioGeneratorSchemaVersion,
  isValidHistoricalSnapshotScenarioGeneratorSource,
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

function pushIssue(
  issues: HistoricalSnapshotScenarioGeneratorValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(
  text: string,
  fieldPath: string,
  issues: HistoricalSnapshotScenarioGeneratorValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem/download references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Runtime timer/random references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory/profit references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_SECRET_OR_SDK_REFERENCE', fieldPath, 'Secret/api-key/provider-sdk references are forbidden.');
}

function scanRecursive(
  value: unknown,
  fieldPath: string,
  issues: HistoricalSnapshotScenarioGeneratorValidationIssue[],
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

export function validateHistoricalSnapshotScenarioGeneratorFixture(
  fixture: HistoricalSnapshotScenarioGeneratorFixture,
): HistoricalSnapshotScenarioGeneratorValidationResult {
  const issues: HistoricalSnapshotScenarioGeneratorValidationIssue[] = [];

  if (!isValidHistoricalSnapshotScenarioGeneratorName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidHistoricalSnapshotScenarioGeneratorKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_PHASE}.`);
  }
  if (!isValidHistoricalSnapshotScenarioGeneratorSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidHistoricalSnapshotScenarioGeneratorGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidHistoricalSnapshotScenarioGeneratorSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic.');
  }

  if (fixture.generationPlan.liveData !== false) {
    pushIssue(issues, 'LIVE_DATA_FORBIDDEN', 'generationPlan.liveData', 'generationPlan.liveData must be false.');
  }
  if (fixture.generationPlan.requiresNetwork !== false || fixture.generationPlan.requiresFilesystem !== false) {
    pushIssue(issues, 'UNSAFE_GENERATION_PLAN_REQUIREMENTS', 'generationPlan', 'Generation plan cannot require network/filesystem.');
  }

  if (fixture.replayDescriptor.liveReplayImport !== false) {
    pushIssue(issues, 'LIVE_REPLAY_IMPORT_FORBIDDEN', 'replayDescriptor.liveReplayImport', 'liveReplayImport must be false.');
  }
  if (fixture.replayDescriptor.replayImportMode !== 'deterministic_fixture_only') {
    pushIssue(
      issues,
      'INVALID_REPLAY_IMPORT_MODE',
      'replayDescriptor.replayImportMode',
      'replay import mode must be deterministic_fixture_only.',
    );
  }

  if (fixture.scenarioDescriptor.advisory !== false) {
    pushIssue(issues, 'ADVISORY_FORBIDDEN', 'scenarioDescriptor.advisory', 'Scenario descriptor must remain non-advisory.');
  }

  if (
    fixture.lineageModel.sourceSnapshotRefs.length === 0 ||
    fixture.lineageModel.sourceManifestRefs.length === 0 ||
    fixture.lineageModel.sourceReliabilityRefs.length === 0 ||
    fixture.lineageModel.sourceReplayRefs.length === 0 ||
    fixture.lineageModel.generatedScenarioRefs.length === 0
  ) {
    pushIssue(issues, 'MISSING_LINEAGE_REFS', 'lineageModel', 'Lineage refs are required.');
  }

  if (!fixture.integrityContract.checksum || !fixture.integrityContract.sourceHash || !fixture.integrityContract.generatedScenarioHash) {
    pushIssue(issues, 'MISSING_INTEGRITY_VALUES', 'integrityContract', 'Checksum/integrity values are required.');
  }

  if (fixture.validationContract.failClosed !== true) {
    pushIssue(issues, 'VALIDATION_FAIL_CLOSED_REQUIRED', 'validationContract.failClosed', 'Validation must be fail-closed.');
  }

  if (fixture.sourceSelection.selectedSnapshotIds.length === 0) {
    pushIssue(issues, 'MISSING_SELECTED_SNAPSHOTS', 'sourceSelection.selectedSnapshotIds', 'Selected snapshot IDs are required.');
  }

  if (fixture.fixtureName.includes('stale') && fixture.rejectionContract.severity !== 'warning') {
    pushIssue(issues, 'STALE_FIXTURE_MUST_BE_WARNING', 'rejectionContract.severity', 'Stale fixture must be warning severity.');
  }
  if (fixture.fixtureName.includes('partial') && !fixture.viewModel.quarantined) {
    pushIssue(issues, 'PARTIAL_FIXTURE_MUST_BE_QUARANTINED', 'viewModel.quarantined', 'Partial fixture must be quarantined.');
  }
  if (fixture.fixtureName.includes('conflict') && fixture.rejectionContract.failClosed !== true) {
    pushIssue(issues, 'CONFLICT_FIXTURE_MUST_FAIL_CLOSED', 'rejectionContract.failClosed', 'Conflict fixture must be fail-closed.');
  }
  if (fixture.fixtureName.includes('schema-drift') && fixture.rejectionContract.rejectionKind !== 'schema_drift') {
    pushIssue(
      issues,
      'SCHEMA_DRIFT_FIXTURE_KIND_MISMATCH',
      'rejectionContract.rejectionKind',
      'Schema drift fixture must use schema_drift rejection kind.',
    );
  }
  if (fixture.fixtureName.includes('missing-critical-field') && fixture.rejectionContract.rejectionKind !== 'missing_critical_field') {
    pushIssue(
      issues,
      'MISSING_CRITICAL_FIXTURE_KIND_MISMATCH',
      'rejectionContract.rejectionKind',
      'Missing critical field fixture must use missing_critical_field rejection kind.',
    );
  }

  if (fixture.rejectionContract.failClosed && fixture.generationPlan.failClosed !== true) {
    pushIssue(
      issues,
      'FAIL_CLOSED_INCONSISTENCY',
      'generationPlan.failClosed',
      'Generation plan must be fail-closed when rejection contract is fail-closed.',
    );
  }

  if (
    fixture.capabilityFlags.snapshotScenarioLiveGeneration !== false ||
    fixture.capabilityFlags.snapshotScenarioRuntimeGeneration !== false ||
    fixture.capabilityFlags.snapshotScenarioLiveIngestion !== false ||
    fixture.capabilityFlags.snapshotScenarioRuntimeIngestion !== false ||
    fixture.capabilityFlags.snapshotScenarioLiveReplayImport !== false ||
    fixture.capabilityFlags.snapshotScenarioLiveNetworkAccess !== false ||
    fixture.capabilityFlags.snapshotScenarioRuntimeCollectors !== false ||
    fixture.capabilityFlags.snapshotScenarioSecretsRequired !== false ||
    fixture.capabilityFlags.snapshotScenarioApiKeyRequired !== false ||
    fixture.capabilityFlags.snapshotScenarioWriteMethods !== false ||
    fixture.capabilityFlags.snapshotScenarioWalletLogic !== false ||
    fixture.capabilityFlags.snapshotScenarioPrivateKeyHandling !== false ||
    fixture.capabilityFlags.snapshotScenarioSigning !== false ||
    fixture.capabilityFlags.snapshotScenarioTransactionSending !== false ||
    fixture.capabilityFlags.snapshotScenarioExecution !== false ||
    fixture.capabilityFlags.snapshotScenarioTradingSignals !== false ||
    fixture.capabilityFlags.snapshotScenarioRecommendations !== false ||
    fixture.capabilityFlags.snapshotScenarioInvestmentAdvice !== false ||
    fixture.capabilityFlags.snapshotScenarioRouteHandlers !== false ||
    fixture.capabilityFlags.snapshotScenarioRuntimeRequests !== false ||
    fixture.capabilityFlags.snapshotScenarioUiRendering !== false ||
    fixture.capabilityFlags.snapshotScenarioDomAccess !== false ||
    fixture.capabilityFlags.snapshotScenarioPersistence !== false ||
    fixture.capabilityFlags.snapshotScenarioFilesystemWrites !== false ||
    fixture.capabilityFlags.snapshotScenarioBackgroundJobs !== false ||
    fixture.capabilityFlags.snapshotScenarioScheduledJobs !== false ||
    fixture.capabilityFlags.snapshotScenarioRealOrders !== false ||
    fixture.capabilityFlags.snapshotScenarioRealFunds !== false ||
    fixture.capabilityFlags.snapshotScenarioRealPnL !== false ||
    fixture.capabilityFlags.snapshotScenarioProviderExpansion !== false
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
  if (JSON.stringify(fixture.sourcePhase70FixtureSnapshot) !== JSON.stringify(PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE70_SOURCE_SNAPSHOT', 'sourcePhase70FixtureSnapshot', 'Source Phase 70 names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase71FixtureSnapshot) !== JSON.stringify(HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE71_SOURCE_SNAPSHOT', 'sourcePhase71FixtureSnapshot', 'Source Phase 71 names must be immutable.');
  }

  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateHistoricalSnapshotScenarioGeneratorSafety(
  fixture: HistoricalSnapshotScenarioGeneratorFixture,
): HistoricalSnapshotScenarioGeneratorSafetyResult {
  const violations: string[] = [];
  if (fixture.safety.readOnly !== true) violations.push('safety.readOnly must be true');
  if (fixture.safety.localOnly !== true) violations.push('safety.localOnly must be true');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.generationPlan.liveData !== false) violations.push('generationPlan.liveData must be false');
  if (fixture.capabilityFlags.snapshotScenarioLiveGeneration !== false) violations.push('snapshotScenarioLiveGeneration must be false');
  if (fixture.capabilityFlags.snapshotScenarioRuntimeGeneration !== false)
    violations.push('snapshotScenarioRuntimeGeneration must be false');
  if (fixture.capabilityFlags.snapshotScenarioLiveIngestion !== false) violations.push('snapshotScenarioLiveIngestion must be false');
  if (fixture.capabilityFlags.snapshotScenarioRuntimeIngestion !== false)
    violations.push('snapshotScenarioRuntimeIngestion must be false');
  if (fixture.capabilityFlags.snapshotScenarioLiveReplayImport !== false)
    violations.push('snapshotScenarioLiveReplayImport must be false');
  if (fixture.capabilityFlags.snapshotScenarioLiveNetworkAccess !== false)
    violations.push('snapshotScenarioLiveNetworkAccess must be false');
  if (fixture.capabilityFlags.snapshotScenarioRuntimeCollectors !== false)
    violations.push('snapshotScenarioRuntimeCollectors must be false');
  if (fixture.capabilityFlags.snapshotScenarioSecretsRequired !== false)
    violations.push('snapshotScenarioSecretsRequired must be false');
  if (fixture.capabilityFlags.snapshotScenarioApiKeyRequired !== false)
    violations.push('snapshotScenarioApiKeyRequired must be false');
  if (fixture.capabilityFlags.snapshotScenarioWriteMethods !== false) violations.push('snapshotScenarioWriteMethods must be false');
  if (fixture.capabilityFlags.snapshotScenarioWalletLogic !== false) violations.push('snapshotScenarioWalletLogic must be false');
  if (fixture.capabilityFlags.snapshotScenarioPrivateKeyHandling !== false)
    violations.push('snapshotScenarioPrivateKeyHandling must be false');
  if (fixture.capabilityFlags.snapshotScenarioSigning !== false) violations.push('snapshotScenarioSigning must be false');
  if (fixture.capabilityFlags.snapshotScenarioTransactionSending !== false)
    violations.push('snapshotScenarioTransactionSending must be false');
  if (fixture.capabilityFlags.snapshotScenarioExecution !== false) violations.push('snapshotScenarioExecution must be false');
  if (fixture.capabilityFlags.snapshotScenarioTradingSignals !== false)
    violations.push('snapshotScenarioTradingSignals must be false');
  if (fixture.capabilityFlags.snapshotScenarioRecommendations !== false)
    violations.push('snapshotScenarioRecommendations must be false');
  if (fixture.capabilityFlags.snapshotScenarioInvestmentAdvice !== false)
    violations.push('snapshotScenarioInvestmentAdvice must be false');
  if (fixture.capabilityFlags.snapshotScenarioRouteHandlers !== false)
    violations.push('snapshotScenarioRouteHandlers must be false');
  if (fixture.capabilityFlags.snapshotScenarioRuntimeRequests !== false)
    violations.push('snapshotScenarioRuntimeRequests must be false');
  if (fixture.capabilityFlags.snapshotScenarioUiRendering !== false) violations.push('snapshotScenarioUiRendering must be false');
  if (fixture.capabilityFlags.snapshotScenarioDomAccess !== false) violations.push('snapshotScenarioDomAccess must be false');
  if (fixture.capabilityFlags.snapshotScenarioPersistence !== false) violations.push('snapshotScenarioPersistence must be false');
  if (fixture.capabilityFlags.snapshotScenarioFilesystemWrites !== false)
    violations.push('snapshotScenarioFilesystemWrites must be false');
  if (fixture.capabilityFlags.snapshotScenarioBackgroundJobs !== false)
    violations.push('snapshotScenarioBackgroundJobs must be false');
  if (fixture.capabilityFlags.snapshotScenarioScheduledJobs !== false)
    violations.push('snapshotScenarioScheduledJobs must be false');
  if (fixture.capabilityFlags.snapshotScenarioRealOrders !== false) violations.push('snapshotScenarioRealOrders must be false');
  if (fixture.capabilityFlags.snapshotScenarioRealFunds !== false) violations.push('snapshotScenarioRealFunds must be false');
  if (fixture.capabilityFlags.snapshotScenarioRealPnL !== false) violations.push('snapshotScenarioRealPnL must be false');
  if (fixture.capabilityFlags.snapshotScenarioProviderExpansion !== false)
    violations.push('snapshotScenarioProviderExpansion must be false');
  return { safe: violations.length === 0, violations };
}

export function validateHistoricalSnapshotScenarioGeneratorFixtureTable(
  fixtures: readonly HistoricalSnapshotScenarioGeneratorFixture[],
): HistoricalSnapshotScenarioGeneratorValidationResult {
  const issues: HistoricalSnapshotScenarioGeneratorValidationIssue[] = [];
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
    issues.push(...validateHistoricalSnapshotScenarioGeneratorFixture(fixture).issues);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 historical snapshot scenario generator fixtures.');
  }

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}
