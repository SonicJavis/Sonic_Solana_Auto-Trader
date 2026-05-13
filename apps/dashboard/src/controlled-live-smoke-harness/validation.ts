import {
  CONTROLLED_LIVE_SMOKE_HARNESS_PHASE,
  type ControlledLiveSmokeHarnessFixture,
  type ControlledLiveSmokeHarnessSafetyResult,
  type ControlledLiveSmokeHarnessValidationIssue,
  type ControlledLiveSmokeHarnessValidationResult,
} from './types.js';
import {
  isValidControlledLiveSmokeHarnessGeneratedAt,
  isValidControlledLiveSmokeHarnessKind,
  isValidControlledLiveSmokeHarnessName,
  isValidControlledLiveSmokeHarnessSchemaVersion,
  isValidControlledLiveSmokeHarnessSource,
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

function pushIssue(issues: ControlledLiveSmokeHarnessValidationIssue[], code: string, field: string, message: string): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanUnsafeText(text: string, fieldPath: string, issues: ControlledLiveSmokeHarnessValidationIssue[]): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem/download references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Runtime timer/random references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory/profit references are forbidden.');
  if (FORBIDDEN_SECRET_PATTERN.test(text))
    pushIssue(issues, 'UNSAFE_SECRET_OR_SDK_REFERENCE', fieldPath, 'Secret/api-key/provider-sdk references are forbidden.');
}

function scanRecursive(
  value: unknown,
  fieldPath: string,
  issues: ControlledLiveSmokeHarnessValidationIssue[],
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
  return TIMESTAMP_PATTERN.test(value);
}

export function validateControlledLiveSmokeHarnessFixture(
  fixture: ControlledLiveSmokeHarnessFixture,
): ControlledLiveSmokeHarnessValidationResult {
  const issues: ControlledLiveSmokeHarnessValidationIssue[] = [];

  if (!isValidControlledLiveSmokeHarnessName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidControlledLiveSmokeHarnessKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== CONTROLLED_LIVE_SMOKE_HARNESS_PHASE) {
    pushIssue(issues, 'WRONG_PHASE', 'phase', `phase must be ${CONTROLLED_LIVE_SMOKE_HARNESS_PHASE}.`);
  }
  if (!isValidControlledLiveSmokeHarnessSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!fixture.fixtureId || typeof fixture.fixtureId !== 'string') {
    pushIssue(issues, 'MISSING_FIXTURE_ID', 'fixtureId', 'fixtureId is required.');
  }
  if (!isValidControlledLiveSmokeHarnessGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be the deterministic phase timestamp.');
  }
  if (!isValidControlledLiveSmokeHarnessSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_SOURCE', 'meta.source', 'meta.source is invalid.');
  }
  if (!isDeterministicTimestamp(fixture.resultFixture.checkedAt)) {
    pushIssue(issues, 'DYNAMIC_TIMESTAMP', 'resultFixture.checkedAt', 'checkedAt must be a deterministic ISO timestamp.');
  }
  // Safety invariants
  if (fixture.smokePlan.disabledByDefault !== true) {
    pushIssue(issues, 'SMOKE_PLAN_NOT_DISABLED', 'smokePlan.disabledByDefault', 'Smoke plan must be disabled by default.');
  }
  // Runtime validation guard: liveNetworkDefault is typed as `false` but callers may pass
  // mutated/deserialized objects where the value could differ at runtime.
  // The `as unknown` cast preserves the runtime check despite the compile-time guarantee.
  if ((fixture.smokePlan.liveNetworkDefault as unknown) !== false) {
    pushIssue(issues, 'LIVE_NETWORK_DEFAULT_TRUE', 'smokePlan.liveNetworkDefault', 'liveNetworkDefault must be false.');
  }
  if (fixture.guardContract.liveNetworkAllowedByDefault !== false) {
    pushIssue(issues, 'GUARD_LIVE_NETWORK_ALLOWED', 'guardContract.liveNetworkAllowedByDefault', 'liveNetworkAllowedByDefault must be false.');
  }
  if (fixture.guardContract.defaultDecision !== 'skipped') {
    pushIssue(issues, 'GUARD_DEFAULT_NOT_SKIPPED', 'guardContract.defaultDecision', 'defaultDecision must be skipped.');
  }
  if (fixture.manualEnablePolicy.allowsStandardCi !== false) {
    pushIssue(issues, 'POLICY_ALLOWS_CI', 'manualEnablePolicy.allowsStandardCi', 'allowsStandardCi must be false.');
  }
  if (fixture.manualEnablePolicy.allowsScheduledRuns !== false) {
    pushIssue(issues, 'POLICY_ALLOWS_SCHEDULED', 'manualEnablePolicy.allowsScheduledRuns', 'allowsScheduledRuns must be false.');
  }
  if (fixture.environmentContract.secretsRequiredInStandardCi !== false) {
    pushIssue(issues, 'SECRETS_REQUIRED_IN_CI', 'environmentContract.secretsRequiredInStandardCi', 'secretsRequiredInStandardCi must be false.');
  }
  if (fixture.resultFixture.liveNetworkUsed !== false) {
    pushIssue(issues, 'RESULT_LIVE_NETWORK_USED', 'resultFixture.liveNetworkUsed', 'liveNetworkUsed must be false.');
  }
  if (!fixture.certificationReport.safetySummary) {
    pushIssue(issues, 'MISSING_SAFETY_SUMMARY', 'certificationReport.safetySummary', 'safetySummary is required.');
  }
  // Scan for unsafe text in all fields
  scanRecursive(fixture, 'fixture', issues);

  return { valid: issues.length === 0, issues };
}

export function validateControlledLiveSmokeHarnessSafety(
  fixture: ControlledLiveSmokeHarnessFixture,
): ControlledLiveSmokeHarnessSafetyResult {
  const violations: string[] = [];

  if (fixture.smokePlan.disabledByDefault !== true) violations.push('smokePlan.disabledByDefault must be true');
  // Runtime validation guard: see note in validateControlledLiveSmokeHarnessFixture above.
  if ((fixture.smokePlan.liveNetworkDefault as unknown) !== false) violations.push('smokePlan.liveNetworkDefault must be false');
  if (fixture.guardContract.liveNetworkAllowedByDefault !== false) violations.push('guardContract.liveNetworkAllowedByDefault must be false');
  if (fixture.manualEnablePolicy.allowsStandardCi !== false) violations.push('manualEnablePolicy.allowsStandardCi must be false');
  if (fixture.manualEnablePolicy.allowsScheduledRuns !== false) violations.push('manualEnablePolicy.allowsScheduledRuns must be false');
  if (fixture.environmentContract.secretsRequiredInStandardCi !== false)
    violations.push('environmentContract.secretsRequiredInStandardCi must be false');
  if (fixture.resultFixture.liveNetworkUsed !== false) violations.push('resultFixture.liveNetworkUsed must be false');
  if (!fixture.safety.noLiveNetwork) violations.push('safety.noLiveNetwork must be true');
  if (!fixture.safety.noSecretsRequired) violations.push('safety.noSecretsRequired must be true');
  if (!fixture.safety.failClosed) violations.push('safety.failClosed must be true');
  if (!fixture.safety.nonAdvisory) violations.push('safety.nonAdvisory must be true');
  if (!fixture.safety.notExecutable) violations.push('safety.notExecutable must be true');

  return { safe: violations.length === 0, violations };
}

export function validateControlledLiveSmokeHarnessFixtureTable(
  fixtures: readonly ControlledLiveSmokeHarnessFixture[],
): ControlledLiveSmokeHarnessValidationResult {
  const issues: ControlledLiveSmokeHarnessValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const fixture of fixtures) {
    const result = validateControlledLiveSmokeHarnessFixture(fixture);
    issues.push(...result.issues);
    if (seenIds.has(fixture.fixtureId)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    }
    seenIds.add(fixture.fixtureId);
    if (seenNames.has(fixture.fixtureName)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    }
    seenNames.add(fixture.fixtureName);
  }
  return { valid: issues.length === 0, issues };
}
