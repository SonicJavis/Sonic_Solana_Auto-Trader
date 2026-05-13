import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../cross-provider-data-quality/index.js';
import { FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES } from '../first-read-only-provider-adapter/index.js';
import { LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES } from '../live-smoke-safety-certification/index.js';
import { MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES } from '../multi-provider-read-only-foundation/index.js';
import { PROVIDER_AWARE_REPLAY_SCENARIO_NAMES } from '../provider-aware-replay-scenarios/index.js';
import {
  PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE,
  type ProviderReliabilityDriftAuditFixture,
  type ProviderReliabilityDriftAuditSafetyResult,
  type ProviderReliabilityDriftAuditValidationIssue,
  type ProviderReliabilityDriftAuditValidationResult,
} from './types.js';
import {
  isValidProviderReliabilityDriftAuditGeneratedAt,
  isValidProviderReliabilityDriftAuditKind,
  isValidProviderReliabilityDriftAuditName,
  isValidProviderReliabilityDriftAuditSchemaVersion,
  isValidProviderReliabilityDriftAuditSource,
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
  issues: ProviderReliabilityDriftAuditValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(
  text: string,
  fieldPath: string,
  issues: ProviderReliabilityDriftAuditValidationIssue[],
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
  issues: ProviderReliabilityDriftAuditValidationIssue[],
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

export function validateProviderReliabilityDriftAuditFixture(
  fixture: ProviderReliabilityDriftAuditFixture,
): ProviderReliabilityDriftAuditValidationResult {
  const issues: ProviderReliabilityDriftAuditValidationIssue[] = [];

  if (!isValidProviderReliabilityDriftAuditName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidProviderReliabilityDriftAuditKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${PROVIDER_RELIABILITY_DRIFT_AUDIT_PHASE}.`);
  }
  if (!isValidProviderReliabilityDriftAuditSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidProviderReliabilityDriftAuditGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic.');
  }
  if (!isValidProviderReliabilityDriftAuditSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic.');
  }

  if (!isDeterministicTimestamp(fixture.telemetrySample.sampledAt)) {
    pushIssue(issues, 'DYNAMIC_TELEMETRY_TIMESTAMP_FORBIDDEN', 'telemetrySample.sampledAt', 'sampledAt must be deterministic.');
  }
  if (fixture.instabilityEvents.some(event => !isDeterministicTimestamp(event.observedAt))) {
    pushIssue(issues, 'DYNAMIC_EVENT_TIMESTAMP_FORBIDDEN', 'instabilityEvents.observedAt', 'instability event timestamps must be deterministic.');
  }

  if (fixture.telemetrySample.liveData !== false) {
    pushIssue(issues, 'LIVE_TELEMETRY_FORBIDDEN', 'telemetrySample.liveData', 'telemetrySample.liveData must be false.');
  }
  if (fixture.telemetrySample.fixtureOnly !== true) {
    pushIssue(issues, 'FIXTURE_ONLY_REQUIRED', 'telemetrySample.fixtureOnly', 'telemetrySample.fixtureOnly must be true.');
  }

  if (fixture.schemaDrift.safeToUse && fixture.driftAudit.driftSeverity === 'critical') {
    pushIssue(issues, 'CRITICAL_DRIFT_CANNOT_BE_SAFE', 'schemaDrift.safeToUse', 'Critical drift must set safeToUse to false.');
  }
  if (fixture.schemaDrift.incompatibleFields.length > 0 && fixture.schemaDrift.safeToUse) {
    pushIssue(issues, 'INCOMPATIBLE_SCHEMA_CANNOT_BE_SAFE', 'schemaDrift.safeToUse', 'Incompatible schema drift must be unsafe.');
  }

  if (fixture.driftAudit.driftKind === 'certification_drift' && fixture.certificationLinkage.failClosed !== true) {
    pushIssue(
      issues,
      'CERTIFICATION_DRIFT_MUST_FAIL_CLOSED',
      'certificationLinkage.failClosed',
      'Certification drift must fail closed.',
    );
  }
  if (fixture.certificationLinkage.certificationStatus !== 'certified_offline' && fixture.certificationLinkage.failClosed !== true) {
    pushIssue(
      issues,
      'CERTIFICATION_NON_CERTIFIED_MUST_FAIL_CLOSED',
      'certificationLinkage.failClosed',
      'Non-certified states must fail closed.',
    );
  }

  if (fixture.reliabilityScore.reasonCodes.some(reason => /authoriz|execute/i.test(reason))) {
    pushIssue(
      issues,
      'RELIABILITY_SCORE_EXECUTION_AUTH_FORBIDDEN',
      'reliabilityScore.reasonCodes',
      'Reliability score cannot authorize execution.',
    );
  }

  const caps = fixture.capabilityFlags;
  if (
    caps.providerReliabilityLiveTelemetry !== false ||
    caps.providerReliabilityLiveNetworkAccess !== false ||
    caps.providerReliabilityRuntimeMonitoring !== false ||
    caps.providerReliabilitySecretsRequired !== false ||
    caps.providerReliabilityApiKeyRequired !== false ||
    caps.providerReliabilityWriteMethods !== false ||
    caps.providerReliabilityWalletLogic !== false ||
    caps.providerReliabilityPrivateKeyHandling !== false ||
    caps.providerReliabilitySigning !== false ||
    caps.providerReliabilityTransactionSending !== false ||
    caps.providerReliabilityExecution !== false ||
    caps.providerReliabilityTradingSignals !== false ||
    caps.providerReliabilityRecommendations !== false ||
    caps.providerReliabilityInvestmentAdvice !== false ||
    caps.providerReliabilityRouteHandlers !== false ||
    caps.providerReliabilityRuntimeRequests !== false ||
    caps.providerReliabilityUiRendering !== false ||
    caps.providerReliabilityDomAccess !== false ||
    caps.providerReliabilityPersistence !== false ||
    caps.providerReliabilityFilesystemWrites !== false ||
    caps.providerReliabilityBackgroundJobs !== false ||
    caps.providerReliabilityScheduledJobs !== false ||
    caps.providerReliabilityRealOrders !== false ||
    caps.providerReliabilityRealFunds !== false ||
    caps.providerReliabilityRealPnL !== false ||
    caps.providerReliabilityAutoExecution !== false ||
    caps.providerReliabilityProviderExpansion !== false
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

  if (!fixture.sourceRefs.phase65FixtureId || !fixture.sourceRefs.phase66FixtureId || !fixture.sourceRefs.phase67FixtureId) {
    pushIssue(issues, 'MISSING_SOURCE_REFS', 'sourceRefs', 'Source references to phases 65-69 are required.');
  }

  scanRecursive(fixture, 'fixture', issues);
  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateProviderReliabilityDriftAuditSafety(
  fixture: ProviderReliabilityDriftAuditFixture,
): ProviderReliabilityDriftAuditSafetyResult {
  const violations: string[] = [];
  if (fixture.safety.readOnly !== true) violations.push('safety.readOnly must be true');
  if (fixture.safety.localOnly !== true) violations.push('safety.localOnly must be true');
  if (fixture.safety.fixtureOnly !== true) violations.push('safety.fixtureOnly must be true');
  if (fixture.telemetrySample.liveData !== false) violations.push('telemetrySample.liveData must be false');
  if (fixture.capabilityFlags.providerReliabilityExecution !== false)
    violations.push('providerReliabilityExecution must be false');
  if (fixture.schemaDrift.safeToUse && fixture.driftAudit.driftSeverity === 'critical')
    violations.push('critical drift cannot be marked safe');
  return { safe: violations.length === 0, violations };
}

export function validateProviderReliabilityDriftAuditFixtureTable(
  fixtures: readonly ProviderReliabilityDriftAuditFixture[],
): ProviderReliabilityDriftAuditValidationResult {
  const issues: ProviderReliabilityDriftAuditValidationIssue[] = [];
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
    issues.push(...validateProviderReliabilityDriftAuditFixture(fixture).issues);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 provider reliability drift audit fixtures.');
  }

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}
