import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import {
  LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE,
  type LiveSmokeSafetyCertificationFixture,
  type LiveSmokeSafetyCertificationSafetyResult,
  type LiveSmokeSafetyCertificationValidationIssue,
  type LiveSmokeSafetyCertificationValidationResult,
} from './types.js';
import {
  isValidLiveSmokeSafetyCertificationGeneratedAt,
  isValidLiveSmokeSafetyCertificationKind,
  isValidLiveSmokeSafetyCertificationName,
  isValidLiveSmokeSafetyCertificationSchemaVersion,
  isValidLiveSmokeSafetyCertificationSource,
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
  issues: LiveSmokeSafetyCertificationValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(
  text: string,
  fieldPath: string,
  issues: LiveSmokeSafetyCertificationValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem/download references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Runtime timer/random references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_SECRET_OR_SDK_REFERENCE', fieldPath, 'Secret/api-key/provider-sdk references are forbidden.');
}

function scanRecursive(
  value: unknown,
  fieldPath: string,
  issues: LiveSmokeSafetyCertificationValidationIssue[],
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

export function validateLiveSmokeSafetyCertificationFixture(
  fixture: LiveSmokeSafetyCertificationFixture,
): LiveSmokeSafetyCertificationValidationResult {
  const issues: LiveSmokeSafetyCertificationValidationIssue[] = [];

  if (!isValidLiveSmokeSafetyCertificationName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidLiveSmokeSafetyCertificationKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${LIVE_SMOKE_SAFETY_CERTIFICATION_PHASE}.`);
  }
  if (!isValidLiveSmokeSafetyCertificationSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidLiveSmokeSafetyCertificationGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidLiveSmokeSafetyCertificationSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic.');
  }

  if (fixture.smokeConfig.liveChecksEnabled !== false) {
    pushIssue(issues, 'LIVE_CHECKS_ENABLED_FORBIDDEN', 'smokeConfig.liveChecksEnabled', 'liveChecksEnabled must be false by default.');
  }
  if (fixture.smokeConfig.standardCi && fixture.networkIsolationPolicy.standardCiNetworkAccess !== false) {
    pushIssue(issues, 'STANDARD_CI_NETWORK_FORBIDDEN', 'networkIsolationPolicy.standardCiNetworkAccess', 'standard CI network access must be false.');
  }
  if (fixture.networkIsolationPolicy.manualSmokeNetworkAccessAllowed !== false) {
    pushIssue(
      issues,
      'MANUAL_NETWORK_ACCESS_FORBIDDEN_PHASE69',
      'networkIsolationPolicy.manualSmokeNetworkAccessAllowed',
      'manual smoke network access must remain false in Phase 69.',
    );
  }
  if (fixture.networkIsolationPolicy.apiKeyRequired !== false) {
    pushIssue(issues, 'API_KEY_REQUIRED_FORBIDDEN', 'networkIsolationPolicy.apiKeyRequired', 'api key requirement must be false.');
  }
  if (fixture.smokePlan.disabledByDefault !== true) {
    pushIssue(issues, 'SMOKE_PLAN_DISABLED_REQUIRED', 'smokePlan.disabledByDefault', 'smoke plan must be disabled by default.');
  }

  if (fixture.providerEligibility.unsafeCapabilitiesDetected) {
    pushIssue(
      issues,
      'UNSAFE_PROVIDER_CAPABILITY_DETECTED',
      'providerEligibility.unsafeCapabilitiesDetected',
      'unsafe provider capability must be blocked.',
    );
  }
  if (fixture.readOnlyChecks.some(check => check.writeMethodDetected !== false)) {
    pushIssue(issues, 'WRITE_METHOD_DETECTED', 'readOnlyChecks', 'read-only checks cannot allow write methods.');
  }
  if (!fixture.safetyCertificate.certifiedNoExecution) {
    pushIssue(issues, 'CERTIFICATE_NO_EXECUTION_REQUIRED', 'safetyCertificate.certifiedNoExecution', 'certificate must confirm no execution.');
  }
  if (fixture.safetyCertificate.certificationStatus === 'certified_offline' && fixture.smokeResult.status === 'certification_failed') {
    pushIssue(issues, 'CERTIFICATION_STATUS_MISMATCH', 'safetyCertificate.certificationStatus', 'certification status mismatches failed result.');
  }
  if (fixture.offlineCiContract.liveChecksRun !== false) {
    pushIssue(issues, 'OFFLINE_CONTRACT_LIVE_CHECKS_FORBIDDEN', 'offlineCiContract.liveChecksRun', 'offline CI contract cannot run live checks.');
  }
  if (fixture.offlineCiContract.networkAccess !== false) {
    pushIssue(issues, 'OFFLINE_CONTRACT_NETWORK_FORBIDDEN', 'offlineCiContract.networkAccess', 'offline CI contract cannot allow network access.');
  }

  const caps = fixture.capabilityFlags;
  if (
    caps.liveSmokeStandardCiNetworkAccess !== false ||
    caps.liveSmokeDefaultNetworkAccess !== false ||
    caps.liveSmokeSecretsRequired !== false ||
    caps.liveSmokeApiKeyRequired !== false ||
    caps.liveSmokeWriteMethods !== false ||
    caps.liveSmokeWalletLogic !== false ||
    caps.liveSmokePrivateKeyHandling !== false ||
    caps.liveSmokeSigning !== false ||
    caps.liveSmokeTransactionSending !== false ||
    caps.liveSmokeExecution !== false ||
    caps.liveSmokeTradingSignals !== false ||
    caps.liveSmokeRecommendations !== false ||
    caps.liveSmokeInvestmentAdvice !== false ||
    caps.liveSmokeRouteHandlers !== false ||
    caps.liveSmokeRuntimeRequests !== false ||
    caps.liveSmokeUiRendering !== false ||
    caps.liveSmokeDomAccess !== false ||
    caps.liveSmokePersistence !== false ||
    caps.liveSmokeFilesystemWrites !== false ||
    caps.liveSmokeBackgroundJobs !== false ||
    caps.liveSmokeScheduledJobs !== false ||
    caps.liveSmokeRealOrders !== false ||
    caps.liveSmokeRealFunds !== false ||
    caps.liveSmokeRealPnL !== false ||
    caps.liveSmokeAutoExecution !== false ||
    caps.liveSmokeProviderExpansion !== false ||
    caps.liveSmokeLiveReconciliation !== false ||
    caps.liveSmokeLiveReplayImport !== false
  ) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags', 'Unsafe capability flags must be false.');
  }

  if (JSON.stringify(fixture.sourcePhase65FixtureSnapshot) !== JSON.stringify(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE65_SOURCE_SNAPSHOT', 'sourcePhase65FixtureSnapshot', 'Source Phase 65 snapshot names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase66FixtureSnapshot) !== JSON.stringify(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE66_SOURCE_SNAPSHOT', 'sourcePhase66FixtureSnapshot', 'Source Phase 66 snapshot names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase67FixtureSnapshot) !== JSON.stringify(CROSS_PROVIDER_DATA_QUALITY_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE67_SOURCE_SNAPSHOT', 'sourcePhase67FixtureSnapshot', 'Source Phase 67 snapshot names must be immutable.');
  }
  if (JSON.stringify(fixture.sourcePhase68FixtureSnapshot) !== JSON.stringify(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES)) {
    pushIssue(issues, 'MUTATED_PHASE68_SOURCE_SNAPSHOT', 'sourcePhase68FixtureSnapshot', 'Source Phase 68 snapshot names must be immutable.');
  }

  scanRecursive(fixture, 'fixture', issues);
  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateLiveSmokeSafetyCertificationSafety(
  fixture: LiveSmokeSafetyCertificationFixture,
): LiveSmokeSafetyCertificationSafetyResult {
  const violations: string[] = [];
  if (fixture.safety.readOnly !== true) violations.push('safety.readOnly must be true');
  if (fixture.safety.localOnly !== true) violations.push('safety.localOnly must be true');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.networkIsolationPolicy.standardCiNetworkAccess !== false)
    violations.push('networkIsolationPolicy.standardCiNetworkAccess must be false');
  if (fixture.networkIsolationPolicy.apiKeyRequired !== false)
    violations.push('networkIsolationPolicy.apiKeyRequired must be false');
  if (!fixture.safetyCertificate.certifiedNoExecution) violations.push('safetyCertificate.certifiedNoExecution must be true');
  return { safe: violations.length === 0, violations };
}

export function validateLiveSmokeSafetyCertificationFixtureTable(
  fixtures: readonly LiveSmokeSafetyCertificationFixture[],
): LiveSmokeSafetyCertificationValidationResult {
  const issues: LiveSmokeSafetyCertificationValidationIssue[] = [];
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
    issues.push(...validateLiveSmokeSafetyCertificationFixture(fixture).issues);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 live smoke safety certification fixtures.');
  }

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}
