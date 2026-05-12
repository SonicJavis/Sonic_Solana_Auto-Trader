import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../synthetic-event-stream-lifecycle/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../synthetic-event-stream-replay-harness/index.js';
import {
  PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE,
  type ProviderAwareReplayScenarioFixture,
  type ProviderAwareReplayScenarioSafetyResult,
  type ProviderAwareReplayScenarioValidationIssue,
  type ProviderAwareReplayScenarioValidationResult,
} from './types.js';
import {
  isValidProviderAwareReplayScenarioGeneratedAt,
  isValidProviderAwareReplayScenarioKind,
  isValidProviderAwareReplayScenarioName,
  isValidProviderAwareReplayScenarioSchemaVersion,
  isValidProviderAwareReplayScenarioSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|endpoint|providerSdk|provider[_-]?sdk)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB|download)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\()/;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:execute|buy|sell|trade|order|recommendation|signal|investment\s+advice|profit|pnl)\b/i;
const FORBIDDEN_INGESTION_PATTERN = /\b(?:runtime\s+ingestion|live\s+ingestion|apiKey|secret)\b/i;

function pushIssue(
  issues: ProviderAwareReplayScenarioValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(
  text: string,
  fieldPath: string,
  issues: ProviderAwareReplayScenarioValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem/download references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Runtime timer/random references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory references are forbidden.');
  if (FORBIDDEN_INGESTION_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_INGESTION_OR_SECRET_REFERENCE', fieldPath, 'Runtime ingestion or secret references are forbidden.');
}

function scanRecursive(
  value: unknown,
  fieldPath: string,
  issues: ProviderAwareReplayScenarioValidationIssue[],
  depth = 0,
): void {
  if (depth > 24) return;
  if (typeof value === 'string') {
    if (!fieldPath.endsWith('fixtureId') && !fieldPath.endsWith('sourceQualityFixtureName')) {
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

export function validateProviderAwareReplayScenarioFixture(
  fixture: ProviderAwareReplayScenarioFixture,
): ProviderAwareReplayScenarioValidationResult {
  const issues: ProviderAwareReplayScenarioValidationIssue[] = [];

  if (!isValidProviderAwareReplayScenarioName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidProviderAwareReplayScenarioKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE}.`);
  }
  if (!isValidProviderAwareReplayScenarioSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidProviderAwareReplayScenarioGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidProviderAwareReplayScenarioSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic.');
  }
  if (!CROSS_PROVIDER_DATA_QUALITY_NAMES.includes(fixture.importModel.sourceQualityFixtureName)) {
    pushIssue(issues, 'INVALID_PHASE67_SOURCE_REF', 'importModel.sourceQualityFixtureName', 'Invalid Phase 67 source fixture reference.');
  }
  if (!SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES.includes(fixture.importModel.replayFixtureName)) {
    pushIssue(issues, 'INVALID_PHASE57_SOURCE_REF', 'importModel.replayFixtureName', 'Invalid Phase 57 replay fixture reference.');
  }
  if (!SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES.includes(fixture.importModel.lifecycleFixtureName)) {
    pushIssue(issues, 'INVALID_PHASE56_SOURCE_REF', 'importModel.lifecycleFixtureName', 'Invalid Phase 56 lifecycle fixture reference.');
  }
  if (fixture.importModel.liveData !== false) {
    pushIssue(issues, 'IMPORT_MODEL_LIVE_DATA_FORBIDDEN', 'importModel.liveData', 'import model liveData must be false.');
  }
  if (fixture.generatedScenario.providerProvenanceRefs.length === 0) {
    pushIssue(issues, 'SCENARIO_PROVENANCE_REQUIRED', 'generatedScenario.providerProvenanceRefs', 'Generated scenario requires provenance mappings.');
  }
  if (fixture.parityCheck.expectedSnapshotIds.length === 0) {
    pushIssue(issues, 'PARITY_EXPECTED_SNAPSHOTS_REQUIRED', 'parityCheck.expectedSnapshotIds', 'Parity check requires expected snapshots.');
  }
  if (
    fixture.parityCheck.mismatches.some(mismatch => mismatch.severity === 'critical') &&
    fixture.parityCheck.failClosed !== true
  ) {
    pushIssue(issues, 'PARITY_CRITICAL_MUST_FAIL_CLOSED', 'parityCheck.failClosed', 'Critical mismatches must be fail-closed.');
  }
  if (fixture.regenerationContract.filesystemWrites !== false) {
    pushIssue(issues, 'REGENERATION_FILESYSTEM_WRITES_FORBIDDEN', 'regenerationContract.filesystemWrites', 'filesystemWrites must be false.');
  }
  if (fixture.regenerationContract.downloads !== false) {
    pushIssue(issues, 'REGENERATION_DOWNLOADS_FORBIDDEN', 'regenerationContract.downloads', 'downloads must be false.');
  }
  if (fixture.lifecyclePreview.deterministicSequence.some((sequence, index) => sequence !== index + 1)) {
    pushIssue(issues, 'INVALID_LIFECYCLE_CAUSAL_ORDER', 'lifecyclePreview.deterministicSequence', 'Lifecycle preview sequence must be strictly incremental.');
  }
  if (fixture.replayExpectation.expectedStepCount <= 0) {
    pushIssue(issues, 'INVALID_EXPECTED_STEP_COUNT', 'replayExpectation.expectedStepCount', 'Expected step count must be > 0.');
  }

  const caps = fixture.capabilityFlags;
  if (
    caps.providerAwareReplayLiveData !== false ||
    caps.providerAwareReplayNetworkAccess !== false ||
    caps.providerAwareReplayRuntimeIngestion !== false ||
    caps.providerAwareReplayFilesystemWrites !== false ||
    caps.providerAwareReplayDownloads !== false ||
    caps.providerAwareReplayPersistence !== false ||
    caps.providerAwareReplayWalletLogic !== false ||
    caps.providerAwareReplayPrivateKeyHandling !== false ||
    caps.providerAwareReplaySigning !== false ||
    caps.providerAwareReplayTransactionSending !== false ||
    caps.providerAwareReplayExecution !== false ||
    caps.providerAwareReplayTradingSignals !== false ||
    caps.providerAwareReplayRecommendations !== false ||
    caps.providerAwareReplayInvestmentAdvice !== false ||
    caps.providerAwareReplayRouteHandlers !== false ||
    caps.providerAwareReplayRuntimeRequests !== false ||
    caps.providerAwareReplayUiRendering !== false ||
    caps.providerAwareReplayDomAccess !== false ||
    caps.providerAwareReplayBackgroundJobs !== false ||
    caps.providerAwareReplayScheduledJobs !== false ||
    caps.providerAwareReplayRealOrders !== false ||
    caps.providerAwareReplayRealFunds !== false ||
    caps.providerAwareReplayRealPnL !== false ||
    caps.providerAwareReplayLiveStrategySelection !== false ||
    caps.providerAwareReplayAutoExecution !== false
  ) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags', 'Unsafe capability flags must be false.');
  }

  if (JSON.stringify(fixture.sourcePhase67FixtureSnapshot) !== JSON.stringify(CROSS_PROVIDER_DATA_QUALITY_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE67_SOURCE_SNAPSHOT', 'sourcePhase67FixtureSnapshot', 'Source Phase 67 snapshot names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase57ReplayFixtureSnapshot) !== JSON.stringify(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE57_SOURCE_SNAPSHOT', 'sourcePhase57ReplayFixtureSnapshot', 'Source Phase 57 snapshot names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase56LifecycleFixtureSnapshot) !== JSON.stringify(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE56_SOURCE_SNAPSHOT', 'sourcePhase56LifecycleFixtureSnapshot', 'Source Phase 56 snapshot names must be immutable.');
  }

  scanRecursive(fixture, 'fixture', issues);
  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateProviderAwareReplayScenarioSafety(
  fixture: ProviderAwareReplayScenarioFixture,
): ProviderAwareReplayScenarioSafetyResult {
  const violations: string[] = [];
  if (fixture.safety.readOnly !== true) violations.push('safety.readOnly must be true');
  if (fixture.safety.localOnly !== true) violations.push('safety.localOnly must be true');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.importModel.liveData !== false) violations.push('importModel.liveData must be false');
  if (fixture.regenerationContract.filesystemWrites !== false) violations.push('regenerationContract.filesystemWrites must be false');
  if (fixture.regenerationContract.downloads !== false) violations.push('regenerationContract.downloads must be false');
  return { safe: violations.length === 0, violations };
}

export function validateProviderAwareReplayScenarioFixtureTable(
  fixtures: readonly ProviderAwareReplayScenarioFixture[],
): ProviderAwareReplayScenarioValidationResult {
  const issues: ProviderAwareReplayScenarioValidationIssue[] = [];
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
    issues.push(...validateProviderAwareReplayScenarioFixture(fixture).issues);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 provider-aware replay scenario fixtures.');
  }

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}
