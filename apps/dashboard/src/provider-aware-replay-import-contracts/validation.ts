import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NAMES } from '../historical-snapshot-ingestion-contracts/index.js';
import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES } from '../historical-snapshot-scenario-generator/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import { PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES } from '../provider-reliability-drift-audit/index.js';
import {
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE,
  type ProviderAwareReplayImportContractFixture,
  type ProviderAwareReplayImportContractSafetyResult,
  type ProviderAwareReplayImportContractValidationIssue,
  type ProviderAwareReplayImportContractValidationResult,
} from './types.js';
import {
  isValidProviderAwareReplayImportContractGeneratedAt,
  isValidProviderAwareReplayImportContractKind,
  isValidProviderAwareReplayImportContractName,
  isValidProviderAwareReplayImportContractSchemaVersion,
  isValidProviderAwareReplayImportContractSource,
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

function pushIssue(issues: ProviderAwareReplayImportContractValidationIssue[], code: string, field: string, message: string): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(text: string, fieldPath: string, issues: ProviderAwareReplayImportContractValidationIssue[]): void {
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

function scanRecursive(value: unknown, fieldPath: string, issues: ProviderAwareReplayImportContractValidationIssue[], depth = 0): void {
  if (depth > 24) return;
  if (typeof value === 'string') {
    if (!fieldPath.endsWith('fixtureId') && !fieldPath.endsWith('fixtureName')) scanUnsafeText(value, fieldPath, issues);
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
  return TIMESTAMP_PATTERN.test(value);
}

export function validateProviderAwareReplayImportContractFixture(
  fixture: ProviderAwareReplayImportContractFixture,
): ProviderAwareReplayImportContractValidationResult {
  const issues: ProviderAwareReplayImportContractValidationIssue[] = [];

  if (!isValidProviderAwareReplayImportContractName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidProviderAwareReplayImportContractKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_PHASE}.`);
  }
  if (!isValidProviderAwareReplayImportContractSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidProviderAwareReplayImportContractGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidProviderAwareReplayImportContractSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic.');
  }

  if (!isDeterministicTimestamp(fixture.manifest.generatedAt)) {
    pushIssue(issues, 'DYNAMIC_GENERATED_AT_FORBIDDEN', 'manifest.generatedAt', 'manifest.generatedAt must be deterministic.');
  }

  if (fixture.importCandidate.liveImport !== false || fixture.importCandidate.runtimeImport !== false) {
    pushIssue(issues, 'LIVE_OR_RUNTIME_IMPORT_FORBIDDEN', 'importCandidate', 'liveImport/runtimeImport must be false.');
  }

  if (fixture.gatePolicy.allowsLiveImport || fixture.gatePolicy.allowsFilesystemImport || fixture.gatePolicy.allowsRuntimeIngestion) {
    pushIssue(issues, 'UNSAFE_GATE_POLICY', 'gatePolicy', 'Gate policy cannot allow live/filesystem/runtime ingestion.');
  }

  if (
    fixture.importPlan.requiresNetwork ||
    fixture.importPlan.requiresFilesystem ||
    fixture.importPlan.requiresSecrets ||
    fixture.importPlan.disabledRuntimeImport !== true ||
    fixture.importPlan.disabledFilesystemImport !== true
  ) {
    pushIssue(issues, 'UNSAFE_IMPORT_PLAN_REQUIREMENTS', 'importPlan', 'Import plan cannot require network/filesystem/secrets.');
  }

  if (!fixture.integrityContract.checksum || !fixture.integrityContract.manifestHash || !fixture.integrityContract.sourceHash) {
    pushIssue(issues, 'MISSING_INTEGRITY_VALUES', 'integrityContract', 'Checksum/integrity values are required.');
  }

  if (
    fixture.provenanceContract.sourceScenarioRefs.length === 0 ||
    fixture.provenanceContract.sourceSnapshotRefs.length === 0 ||
    fixture.provenanceContract.sourceReliabilityRefs.length === 0 ||
    fixture.provenanceContract.sourceQualityRefs.length === 0
  ) {
    pushIssue(issues, 'MISSING_PROVENANCE_SOURCE_REFS', 'provenanceContract', 'Provenance source refs are required.');
  }

  if (
    (fixture.compatibilityContract.compatibilityStatus === 'blocked' ||
      fixture.compatibilityContract.compatibilityStatus === 'rejected') &&
    fixture.compatibilityContract.failClosed !== true
  ) {
    pushIssue(issues, 'COMPATIBILITY_MUST_FAIL_CLOSED', 'compatibilityContract.failClosed', 'Incompatible states must fail closed.');
  }

  if (fixture.rejectionContract.rejectionKind !== 'none' && fixture.rejectionContract.failClosed !== true) {
    pushIssue(issues, 'REJECTION_MUST_FAIL_CLOSED', 'rejectionContract.failClosed', 'Rejected states must fail closed.');
  }

  if (
    fixture.capabilityFlags.replayImportLiveImport !== false ||
    fixture.capabilityFlags.replayImportRuntimeImport !== false ||
    fixture.capabilityFlags.replayImportLiveIngestion !== false ||
    fixture.capabilityFlags.replayImportRuntimeIngestion !== false ||
    fixture.capabilityFlags.replayImportFilesystemImport !== false ||
    fixture.capabilityFlags.replayImportLiveNetworkAccess !== false ||
    fixture.capabilityFlags.replayImportRuntimeCollectors !== false ||
    fixture.capabilityFlags.replayImportSecretsRequired !== false ||
    fixture.capabilityFlags.replayImportApiKeyRequired !== false ||
    fixture.capabilityFlags.replayImportWriteMethods !== false ||
    fixture.capabilityFlags.replayImportWalletLogic !== false ||
    fixture.capabilityFlags.replayImportPrivateKeyHandling !== false ||
    fixture.capabilityFlags.replayImportSigning !== false ||
    fixture.capabilityFlags.replayImportTransactionSending !== false ||
    fixture.capabilityFlags.replayImportExecution !== false ||
    fixture.capabilityFlags.replayImportTradingSignals !== false ||
    fixture.capabilityFlags.replayImportRecommendations !== false ||
    fixture.capabilityFlags.replayImportInvestmentAdvice !== false ||
    fixture.capabilityFlags.replayImportRouteHandlers !== false ||
    fixture.capabilityFlags.replayImportRuntimeRequests !== false ||
    fixture.capabilityFlags.replayImportUiRendering !== false ||
    fixture.capabilityFlags.replayImportDomAccess !== false ||
    fixture.capabilityFlags.replayImportPersistence !== false ||
    fixture.capabilityFlags.replayImportFilesystemWrites !== false ||
    fixture.capabilityFlags.replayImportBackgroundJobs !== false ||
    fixture.capabilityFlags.replayImportScheduledJobs !== false ||
    fixture.capabilityFlags.replayImportRealOrders !== false ||
    fixture.capabilityFlags.replayImportRealFunds !== false ||
    fixture.capabilityFlags.replayImportRealPnL !== false ||
    fixture.capabilityFlags.replayImportProviderExpansion !== false
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
  if (JSON.stringify(fixture.sourcePhase72FixtureSnapshot) !== JSON.stringify(HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE72_SOURCE_SNAPSHOT', 'sourcePhase72FixtureSnapshot', 'Source Phase 72 names must be immutable.');
  }

  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateProviderAwareReplayImportContractSafety(
  fixture: ProviderAwareReplayImportContractFixture,
): ProviderAwareReplayImportContractSafetyResult {
  const violations: string[] = [];
  if (fixture.safety.readOnly !== true) violations.push('safety.readOnly must be true');
  if (fixture.safety.localOnly !== true) violations.push('safety.localOnly must be true');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.importCandidate.liveImport !== false) violations.push('importCandidate.liveImport must be false');
  if (fixture.importCandidate.runtimeImport !== false) violations.push('importCandidate.runtimeImport must be false');
  if (fixture.capabilityFlags.replayImportExecution !== false) violations.push('replayImportExecution must be false');
  if (fixture.capabilityFlags.replayImportWalletLogic !== false) violations.push('replayImportWalletLogic must be false');
  if (fixture.capabilityFlags.replayImportSigning !== false) violations.push('replayImportSigning must be false');
  return { safe: violations.length === 0, violations };
}

export function validateProviderAwareReplayImportContractFixtureTable(
  fixtures: readonly ProviderAwareReplayImportContractFixture[],
): ProviderAwareReplayImportContractValidationResult {
  const issues: ProviderAwareReplayImportContractValidationIssue[] = [];
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
    issues.push(...validateProviderAwareReplayImportContractFixture(fixture).issues);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 provider-aware replay import contract fixtures.');
  }

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}
