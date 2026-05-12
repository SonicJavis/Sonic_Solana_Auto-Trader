import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE,
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
  READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS,
  READ_ONLY_PROVIDER_GATE_POLICY_KINDS,
  READ_ONLY_PROVIDER_GATE_STATE_KINDS,
  type ReadOnlyProviderAdapterGateFixture,
  type ReadOnlyProviderAdapterGateSafetyResult,
  type ReadOnlyProviderAdapterGateValidationIssue,
  type ReadOnlyProviderAdapterGateValidationResult,
} from './types.js';
import {
  isValidReadOnlyProviderAdapterGateGeneratedAt,
  isValidReadOnlyProviderAdapterGateKind,
  isValidReadOnlyProviderAdapterGateName,
  isValidReadOnlyProviderAdapterGatePolicyKind,
  isValidReadOnlyProviderAdapterGateSchemaVersion,
  isValidReadOnlyProviderAdapterGateSource,
  isValidReadOnlyProviderAdapterGateStateKind,
} from './normalization.js';
import { READ_ONLY_PROVIDER_CONTRACT_NAMES } from '../read-only-provider-contracts/index.js';
import { READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES } from '../read-only-provider-adapter-mocks/index.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|socket\.|websocket)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|setInterval\(|setTimeout\()/;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair)\b/i;
const FORBIDDEN_TX_PATTERN = /\b(?:signTransaction|sendTransaction|transaction|tx\b|signature)\b/i;
const FORBIDDEN_EXECUTION_PATTERN = /\b(?:execute|buy|sell|trade|order|profit|pnl|recommendation|signal|investment advice)\b/i;
const FORBIDDEN_PROVIDER_PATTERN =
  /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|provider sdk|solana\s*rpc)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'gateId',
  'gateName',
  'gateKind',
  'candidateId',
  'candidateName',
  'candidateKind',
  'resolutionId',
  'reportId',
  'viewModelId',
  'contractId',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'source',
  'generatedAt',
  'errorCode',
  'safetyNotes',
  'notes',
  'evaluationNote',
]);

function pushIssue(
  issues: ReadOnlyProviderAdapterGateValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: ReadOnlyProviderAdapterGateValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Timer/runtime references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet references are forbidden.');
  if (FORBIDDEN_TX_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TRANSACTION_REFERENCE', fieldPath, 'Transaction references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory references are forbidden.');
  if (FORBIDDEN_PROVIDER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_PROVIDER_REFERENCE', fieldPath, 'Live provider references are forbidden.');
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: ReadOnlyProviderAdapterGateValidationIssue[],
  depth = 0,
): void {
  if (depth > 20) return;
  if (typeof value === 'string') {
    const key = fieldPath.split('.').at(-1) ?? '';
    if (!EXCLUDED_SCAN_FIELDS.has(key)) scanTextForUnsafeContent(value, fieldPath, issues);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanObjectRecursive(entry, `${fieldPath}[${index}]`, issues, depth + 1));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (!EXCLUDED_SCAN_FIELDS.has(key)) scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
    }
  }
}

export function validateReadOnlyProviderAdapterGateFixture(
  fixture: ReadOnlyProviderAdapterGateFixture,
): ReadOnlyProviderAdapterGateValidationResult {
  const issues: ReadOnlyProviderAdapterGateValidationIssue[] = [];

  if (!isValidReadOnlyProviderAdapterGateName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidReadOnlyProviderAdapterGateKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE) pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE}.`);
  if (!isValidReadOnlyProviderAdapterGateSchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidReadOnlyProviderAdapterGateGeneratedAt(fixture.meta.generatedAt)) pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant.');
  if (!isValidReadOnlyProviderAdapterGateSource(fixture.meta.source)) pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant.');

  if (fixture.sourceProviderContractName && !(READ_ONLY_PROVIDER_CONTRACT_NAMES as readonly string[]).includes(fixture.sourceProviderContractName)) {
    pushIssue(issues, 'MISSING_SOURCE_CONTRACT', 'sourceProviderContractName', 'Must reference a Phase 54 provider contract name.');
  }

  if (fixture.sourceProviderMockName && !(READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES as readonly string[]).includes(fixture.sourceProviderMockName)) {
    pushIssue(issues, 'MISSING_SOURCE_MOCK', 'sourceProviderMockName', 'Must reference a Phase 55 provider mock name.');
  }

  for (const policy of fixture.gatePolicies) {
    if (!isValidReadOnlyProviderAdapterGatePolicyKind(policy.policyKind)) {
      pushIssue(issues, 'INVALID_POLICY_KIND', 'gatePolicies.policyKind', 'Invalid gate policy kind.');
    }
  }

  if (!isValidReadOnlyProviderAdapterGateStateKind(fixture.gateState.stateKind)) {
    pushIssue(issues, 'INVALID_GATE_STATE', 'gateState.stateKind', 'Invalid gate state kind.');
  }

  if (fixture.gateState.closedByDefault !== true || fixture.gateState.failClosed !== true) {
    pushIssue(issues, 'INVALID_FAIL_CLOSED_STATE', 'gateState', 'Gate state must remain fail-closed and closed-by-default.');
  }

  if (fixture.providerCandidate.liveProvider !== false) pushIssue(issues, 'LIVE_PROVIDER_FORBIDDEN', 'providerCandidate.liveProvider', 'liveProvider must be false.');
  if (fixture.providerCandidate.networkEndpoint !== null) pushIssue(issues, 'NETWORK_ENDPOINT_FORBIDDEN', 'providerCandidate.networkEndpoint', 'networkEndpoint must be null.');
  if (fixture.providerCandidate.providerSdk !== null) pushIssue(issues, 'PROVIDER_SDK_FORBIDDEN', 'providerCandidate.providerSdk', 'providerSdk must be null.');
  if (fixture.providerCandidate.providerClientReference !== null) pushIssue(issues, 'PROVIDER_CLIENT_FORBIDDEN', 'providerCandidate.providerClientReference', 'providerClientReference must be null.');

  if (fixture.providerCandidate.requestedCapabilities.walletCapability) pushIssue(issues, 'UNSAFE_WALLET_CAPABILITY', 'providerCandidate.requestedCapabilities.walletCapability', 'wallet capability must be false.');
  if (fixture.providerCandidate.requestedCapabilities.signingCapability) pushIssue(issues, 'UNSAFE_SIGNING_CAPABILITY', 'providerCandidate.requestedCapabilities.signingCapability', 'signing capability must be false.');
  if (fixture.providerCandidate.requestedCapabilities.transactionSendingCapability) pushIssue(issues, 'UNSAFE_SENDING_CAPABILITY', 'providerCandidate.requestedCapabilities.transactionSendingCapability', 'transaction sending capability must be false.');

  const requiredPolicyKinds = new Set(READ_ONLY_PROVIDER_GATE_POLICY_KINDS);
  if (fixture.gatePolicies.length !== READ_ONLY_PROVIDER_GATE_POLICY_KINDS.length) {
    pushIssue(issues, 'INVALID_POLICY_COUNT', 'gatePolicies', 'All required policy kinds must be present.');
  }
  for (const policyKind of requiredPolicyKinds) {
    if (!fixture.gatePolicies.some(policy => policy.policyKind === policyKind)) {
      pushIssue(issues, 'MISSING_POLICY_KIND', 'gatePolicies', `Missing policy kind: ${policyKind}`);
    }
  }

  const requiredStates = new Set(READ_ONLY_PROVIDER_GATE_STATE_KINDS);
  if (!requiredStates.has(fixture.resolutionResult.resolvedState)) {
    pushIssue(issues, 'INVALID_RESOLVED_STATE', 'resolutionResult.resolvedState', 'Invalid resolution state kind.');
  }

  if (fixture.resolutionResult.failClosed !== true) pushIssue(issues, 'INVALID_RESOLUTION_FAIL_CLOSED', 'resolutionResult.failClosed', 'resolutionResult.failClosed must be true.');
  if (fixture.resolutionResult.manualUnlockRequired !== true) pushIssue(issues, 'INVALID_MANUAL_UNLOCK', 'resolutionResult.manualUnlockRequired', 'manualUnlockRequired must be true.');
  if (fixture.resolutionResult.futurePhaseOnly !== true) pushIssue(issues, 'INVALID_FUTURE_PHASE_ONLY', 'resolutionResult.futurePhaseOnly', 'futurePhaseOnly must be true.');

  if (!fixture.capabilityChecks.every(check => typeof check.pass === 'boolean')) {
    pushIssue(issues, 'INVALID_CAPABILITY_CHECKS', 'capabilityChecks', 'Capability checks must include boolean pass values.');
  }
  if (!fixture.compatibilityChecks.every(check => typeof check.pass === 'boolean')) {
    pushIssue(issues, 'INVALID_COMPATIBILITY_CHECKS', 'compatibilityChecks', 'Compatibility checks must include boolean pass values.');
  }

  if (fixture.capabilityFlags.readOnlyProviderGateNetworkAccess !== false) pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.readOnlyProviderGateNetworkAccess', 'readOnlyProviderGateNetworkAccess must be false.');
  if (fixture.capabilityFlags.readOnlyProviderGateRealProviders !== false) pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.readOnlyProviderGateRealProviders', 'readOnlyProviderGateRealProviders must be false.');
  if (fixture.capabilityFlags.readOnlyProviderGateExecution !== false) pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.readOnlyProviderGateExecution', 'readOnlyProviderGateExecution must be false.');
  if (fixture.capabilityFlags.readOnlyProviderGateRecommendations !== false) pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags.readOnlyProviderGateRecommendations', 'readOnlyProviderGateRecommendations must be false.');

  if (
    fixture.safety.fixtureOnly !== true ||
    fixture.safety.localOnly !== true ||
    fixture.safety.readOnly !== true ||
    fixture.safety.failClosed !== true ||
    fixture.safety.noLiveData !== true ||
    fixture.safety.noNetworkAccess !== true ||
    fixture.safety.nonAdvisory !== true ||
    fixture.safety.notExecutable !== true
  ) {
    pushIssue(issues, 'INVALID_SAFETY_FIELDS', 'safety', 'Safety fields must remain true for this gate-only phase.');
  }

  scanObjectRecursive(fixture, 'fixture', issues);

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateReadOnlyProviderAdapterGateSafety(
  fixture: ReadOnlyProviderAdapterGateFixture,
): ReadOnlyProviderAdapterGateSafetyResult {
  const violations: string[] = [];

  if (fixture.capabilityFlags.readOnlyProviderGateLiveData !== false)
    violations.push('readOnlyProviderGateLiveData must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateNetworkAccess !== false)
    violations.push('readOnlyProviderGateNetworkAccess must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateRealProviders !== false)
    violations.push('readOnlyProviderGateRealProviders must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateProviderAdapters !== false)
    violations.push('readOnlyProviderGateProviderAdapters must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateExecution !== false)
    violations.push('readOnlyProviderGateExecution must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateWalletLogic !== false)
    violations.push('readOnlyProviderGateWalletLogic must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateSigning !== false)
    violations.push('readOnlyProviderGateSigning must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateTransactionSending !== false)
    violations.push('readOnlyProviderGateTransactionSending must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateRecommendations !== false)
    violations.push('readOnlyProviderGateRecommendations must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateTradingSignals !== false)
    violations.push('readOnlyProviderGateTradingSignals must be false');
  if (fixture.capabilityFlags.readOnlyProviderGateInvestmentAdvice !== false)
    violations.push('readOnlyProviderGateInvestmentAdvice must be false');

  if (fixture.providerCandidate.networkEndpoint !== null)
    violations.push('providerCandidate.networkEndpoint must be null');
  if (fixture.providerCandidate.providerSdk !== null)
    violations.push('providerCandidate.providerSdk must be null');
  if (fixture.providerCandidate.providerClientReference !== null)
    violations.push('providerCandidate.providerClientReference must be null');

  if (fixture.safety.failClosed !== true) violations.push('safety.failClosed must be true');

  return { safe: violations.length === 0, violations };
}

export function validateReadOnlyProviderAdapterGateFixtureTable(
  fixtures: readonly ReadOnlyProviderAdapterGateFixture[],
): ReadOnlyProviderAdapterGateValidationResult {
  const issues: ReadOnlyProviderAdapterGateValidationIssue[] = [];

  const ids = new Set<string>();
  const names = new Set<string>();
  for (const fixture of fixtures) {
    if (ids.has(fixture.fixtureId)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_ID', 'fixtureId', `Duplicate fixtureId: ${fixture.fixtureId}`);
    }
    if (names.has(fixture.fixtureName)) {
      pushIssue(issues, 'DUPLICATE_FIXTURE_NAME', 'fixtureName', `Duplicate fixtureName: ${fixture.fixtureName}`);
    }
    ids.add(fixture.fixtureId);
    names.add(fixture.fixtureName);
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 gate fixtures.');
  }

  return { valid: issues.length === 0, issues };
}

export const READ_ONLY_PROVIDER_ADAPTER_GATE_VALIDATION_CONSTANTS = {
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
  READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS,
  READ_ONLY_PROVIDER_GATE_POLICY_KINDS,
  READ_ONLY_PROVIDER_GATE_STATE_KINDS,
} as const;
