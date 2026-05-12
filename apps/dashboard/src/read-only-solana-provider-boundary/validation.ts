import {
  READ_ONLY_SOLANA_CONFORMANCE_CHECK_KINDS,
  READ_ONLY_SOLANA_ERROR_NORMALIZATION_CATEGORIES,
  READ_ONLY_SOLANA_FIELD_MAPPING_KINDS,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_STATE_KINDS,
  type ReadOnlySolanaProviderBoundaryFixture,
  type ReadOnlySolanaProviderBoundarySafetyResult,
  type ReadOnlySolanaProviderBoundaryValidationIssue,
  type ReadOnlySolanaProviderBoundaryValidationResult,
} from './types.js';
import {
  isValidReadOnlySolanaProviderBoundaryGeneratedAt,
  isValidReadOnlySolanaProviderBoundaryKind,
  isValidReadOnlySolanaProviderBoundaryName,
  isValidReadOnlySolanaProviderBoundarySchemaVersion,
  isValidReadOnlySolanaProviderBoundarySource,
  isValidReadOnlySolanaProviderBoundaryStateKind,
} from './normalization.js';
import { READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES } from '../read-only-provider-adapter-gate/index.js';
import { READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES } from '../read-only-provider-adapter-mocks/index.js';
import { READ_ONLY_PROVIDER_CONTRACT_NAMES } from '../read-only-provider-contracts/index.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|socket\.|websocket)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|setInterval\(|setTimeout\()/;
const FORBIDDEN_WALLET_PATTERN = /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair)\b/i;
const FORBIDDEN_TX_PATTERN = /\b(?:signTransaction|sendTransaction|transaction|tx\b|signature)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:execute|buy|sell|trade|order|profit|pnl|recommendation|signal|investment\s+advice)\b/i;
const FORBIDDEN_PROVIDER_PATTERN =
  /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|provider sdk|api key|endpoint)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'boundaryId',
  'boundaryName',
  'boundaryKind',
  'mappingId',
  'ruleId',
  'stateId',
  'reportId',
  'viewModelId',
  'contractId',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'source',
  'generatedAt',
  'sourceGateFixtureName',
  'sourceProviderContractName',
  'sourceMockAdapterName',
  'sourceGateFixtureNames',
  'sourceProviderContractNames',
  'sourceMockAdapterNames',
  'sourceErrorCode',
  'normalizedErrorCode',
]);

function pushIssue(
  issues: ReadOnlySolanaProviderBoundaryValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: ReadOnlySolanaProviderBoundaryValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Timer/runtime references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet references are forbidden.');
  if (FORBIDDEN_TX_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TRANSACTION_REFERENCE', fieldPath, 'Transaction references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory references are forbidden.');
  if (FORBIDDEN_PROVIDER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_PROVIDER_REFERENCE', fieldPath, 'Unsafe provider references are forbidden.');
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: ReadOnlySolanaProviderBoundaryValidationIssue[],
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
      if (EXCLUDED_SCAN_FIELDS.has(key)) continue;
      if (key.toLowerCase().endsWith('id')) continue;
      if (key === 'fixtureIds') continue;
      scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
    }
  }
}

export function validateReadOnlySolanaProviderBoundaryFixture(
  fixture: ReadOnlySolanaProviderBoundaryFixture,
): ReadOnlySolanaProviderBoundaryValidationResult {
  const issues: ReadOnlySolanaProviderBoundaryValidationIssue[] = [];

  if (!isValidReadOnlySolanaProviderBoundaryName(fixture.fixtureName)) pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  if (!isValidReadOnlySolanaProviderBoundaryKind(fixture.fixtureKind)) pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  if (fixture.phase !== READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE) pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE}.`);
  if (!isValidReadOnlySolanaProviderBoundarySchemaVersion(fixture.schemaVersion)) pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  if (!isValidReadOnlySolanaProviderBoundaryGeneratedAt(fixture.meta.generatedAt)) pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant.');
  if (!isValidReadOnlySolanaProviderBoundarySource(fixture.meta.source)) pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant.');

  if (!(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES as readonly string[]).includes(fixture.sourceGateFixtureName)) {
    pushIssue(issues, 'MISSING_SOURCE_GATE', 'sourceGateFixtureName', 'Must reference a Phase 63 gate fixture name.');
  }
  if (!(READ_ONLY_PROVIDER_CONTRACT_NAMES as readonly string[]).includes(fixture.sourceProviderContractName)) {
    pushIssue(issues, 'MISSING_SOURCE_CONTRACT', 'sourceProviderContractName', 'Must reference a Phase 54 provider contract name.');
  }
  if (!(READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES as readonly string[]).includes(fixture.sourceMockAdapterName)) {
    pushIssue(issues, 'MISSING_SOURCE_MOCK', 'sourceMockAdapterName', 'Must reference a Phase 55 provider mock name.');
  }

  if (!isValidReadOnlySolanaProviderBoundaryStateKind(fixture.boundaryState.stateKind)) {
    pushIssue(issues, 'INVALID_BOUNDARY_STATE', 'boundaryState.stateKind', 'Invalid boundary state kind.');
  }
  if (fixture.boundaryState.notLive !== true || fixture.boundaryState.gateAware !== true) {
    pushIssue(issues, 'INVALID_BOUNDARY_LIVE_STATE', 'boundaryState', 'Boundary must remain not-live and gate-aware.');
  }
  if (
    fixture.futureRealResponsePlaceholder.futureOnly !== true ||
    fixture.futureRealResponsePlaceholder.liveData !== false
  ) {
    pushIssue(issues, 'INVALID_FUTURE_PLACEHOLDER_STATE', 'futureRealResponsePlaceholder', 'Future placeholder must remain future-only and not-live.');
  }
  if (fixture.futureRealResponsePlaceholder.networkEndpoint !== null) pushIssue(issues, 'NETWORK_ENDPOINT_FORBIDDEN', 'futureRealResponsePlaceholder.networkEndpoint', 'networkEndpoint must be null.');
  if (fixture.futureRealResponsePlaceholder.providerSdk !== null) pushIssue(issues, 'PROVIDER_SDK_FORBIDDEN', 'futureRealResponsePlaceholder.providerSdk', 'providerSdk must be null.');
  if (fixture.futureRealResponsePlaceholder.apiKeyRequired !== false) pushIssue(issues, 'API_KEY_FORBIDDEN', 'futureRealResponsePlaceholder.apiKeyRequired', 'apiKeyRequired must be false.');
  if (fixture.futureRealResponsePlaceholder.writeCapability !== false) pushIssue(issues, 'WRITE_CAPABILITY_FORBIDDEN', 'futureRealResponsePlaceholder.writeCapability', 'writeCapability must be false.');
  if (fixture.futureRealResponsePlaceholder.walletRequired !== false) pushIssue(issues, 'WALLET_FORBIDDEN', 'futureRealResponsePlaceholder.walletRequired', 'walletRequired must be false.');
  if (fixture.futureRealResponsePlaceholder.signingRequired !== false) pushIssue(issues, 'SIGNING_FORBIDDEN', 'futureRealResponsePlaceholder.signingRequired', 'signingRequired must be false.');
  if (fixture.futureRealResponsePlaceholder.transactionSendingRequired !== false) pushIssue(issues, 'SENDING_FORBIDDEN', 'futureRealResponsePlaceholder.transactionSendingRequired', 'transactionSendingRequired must be false.');

  if (fixture.mockResponseShape.endpoint !== null) pushIssue(issues, 'MOCK_ENDPOINT_FORBIDDEN', 'mockResponseShape.endpoint', 'mock endpoint must be null.');
  if (fixture.mockResponseShape.livePayload !== false) pushIssue(issues, 'MOCK_LIVE_PAYLOAD_FORBIDDEN', 'mockResponseShape.livePayload', 'mock live payload must be false.');
  if (fixture.mockResponseShape.rpcPayload !== false) pushIssue(issues, 'MOCK_RPC_PAYLOAD_FORBIDDEN', 'mockResponseShape.rpcPayload', 'mock rpc payload must be false.');

  if (fixture.fieldMappings.length !== READ_ONLY_SOLANA_FIELD_MAPPING_KINDS.length) {
    pushIssue(issues, 'INVALID_FIELD_MAPPING_COUNT', 'fieldMappings', 'All required field mappings must be present.');
  }
  for (const kind of READ_ONLY_SOLANA_FIELD_MAPPING_KINDS) {
    if (!fixture.fieldMappings.some(mapping => mapping.mappingKind === kind)) {
      pushIssue(issues, 'MISSING_FIELD_MAPPING_KIND', 'fieldMappings', `Missing field mapping kind: ${kind}`);
    }
  }
  const unmappedRequired = fixture.fieldMappings.filter(
    mapping => mapping.required && mapping.coverageStatus !== 'covered',
  );
  if (unmappedRequired.length !== fixture.mockToRealMapping.unmappedRequiredFields.length) {
    pushIssue(issues, 'UNMAPPED_REQUIRED_FIELD_MISMATCH', 'mockToRealMapping', 'Unmapped required fields must match summary.');
  }

  if (fixture.errorNormalizationRules.length !== READ_ONLY_SOLANA_ERROR_NORMALIZATION_CATEGORIES.length) {
    pushIssue(issues, 'INVALID_ERROR_RULE_COUNT', 'errorNormalizationRules', 'All required error normalization categories must be present.');
  }
  for (const category of READ_ONLY_SOLANA_ERROR_NORMALIZATION_CATEGORIES) {
    if (!fixture.errorNormalizationRules.some(rule => rule.category === category)) {
      pushIssue(issues, 'MISSING_ERROR_RULE_CATEGORY', 'errorNormalizationRules', `Missing error normalization category: ${category}`);
    }
  }

  if (fixture.conformanceChecks.length !== READ_ONLY_SOLANA_CONFORMANCE_CHECK_KINDS.length) {
    pushIssue(issues, 'INVALID_CONFORMANCE_CHECK_COUNT', 'conformanceChecks', 'All required conformance checks must be present.');
  }
  for (const checkKind of READ_ONLY_SOLANA_CONFORMANCE_CHECK_KINDS) {
    if (!fixture.conformanceChecks.some(check => check.checkKind === checkKind)) {
      pushIssue(issues, 'MISSING_CONFORMANCE_CHECK', 'conformanceChecks', `Missing conformance check kind: ${checkKind}`);
    }
  }

  const negativeCapabilityKeys = [
    'readOnlySolanaBoundaryLiveData',
    'readOnlySolanaBoundaryNetworkAccess',
    'readOnlySolanaBoundaryRealProviders',
    'readOnlySolanaBoundaryProviderAdapters',
    'readOnlySolanaBoundaryProviderSdk',
    'readOnlySolanaBoundaryApiKeys',
    'readOnlySolanaBoundarySolanaRpc',
    'readOnlySolanaBoundaryWebSocketAccess',
    'readOnlySolanaBoundaryGeyserYellowstone',
    'readOnlySolanaBoundaryPumpFunIntegration',
    'readOnlySolanaBoundaryDexIntegration',
    'readOnlySolanaBoundaryJitoIntegration',
    'readOnlySolanaBoundaryPersistence',
    'readOnlySolanaBoundaryFilesystemWrites',
    'readOnlySolanaBoundaryDownloads',
    'readOnlySolanaBoundaryRouteHandlers',
    'readOnlySolanaBoundaryHttpServer',
    'readOnlySolanaBoundaryRuntimeRequests',
    'readOnlySolanaBoundaryUiRendering',
    'readOnlySolanaBoundaryDomAccess',
    'readOnlySolanaBoundaryBackgroundJobs',
    'readOnlySolanaBoundaryScheduledJobs',
    'readOnlySolanaBoundaryWalletLogic',
    'readOnlySolanaBoundaryPrivateKeyHandling',
    'readOnlySolanaBoundarySigning',
    'readOnlySolanaBoundaryTransactionSending',
    'readOnlySolanaBoundaryExecution',
    'readOnlySolanaBoundaryTradingSignals',
    'readOnlySolanaBoundaryRecommendations',
    'readOnlySolanaBoundaryInvestmentAdvice',
    'readOnlySolanaBoundaryLiveExecution',
    'readOnlySolanaBoundaryStrategySelection',
    'readOnlySolanaBoundaryRealOrders',
    'readOnlySolanaBoundaryRealFunds',
    'readOnlySolanaBoundaryRealPnL',
    'readOnlySolanaBoundaryWriteCapabilities',
  ] as const;
  for (const key of negativeCapabilityKeys) {
    if (fixture.capabilityFlags[key] !== false) {
      pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', `capabilityFlags.${key}`, `${key} must be false.`);
    }
  }

  scanObjectRecursive(fixture, 'fixture', issues);
  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateReadOnlySolanaProviderBoundarySafety(
  fixture: ReadOnlySolanaProviderBoundaryFixture,
): ReadOnlySolanaProviderBoundarySafetyResult {
  const violations: string[] = [];
  if (fixture.capabilityFlags.readOnlySolanaBoundaryLiveData !== false)
    violations.push('readOnlySolanaBoundaryLiveData must be false');
  if (fixture.capabilityFlags.readOnlySolanaBoundaryNetworkAccess !== false)
    violations.push('readOnlySolanaBoundaryNetworkAccess must be false');
  if (fixture.capabilityFlags.readOnlySolanaBoundaryExecution !== false)
    violations.push('readOnlySolanaBoundaryExecution must be false');
  if (fixture.capabilityFlags.readOnlySolanaBoundaryWalletLogic !== false)
    violations.push('readOnlySolanaBoundaryWalletLogic must be false');
  if (fixture.capabilityFlags.readOnlySolanaBoundarySigning !== false)
    violations.push('readOnlySolanaBoundarySigning must be false');
  if (fixture.capabilityFlags.readOnlySolanaBoundaryTransactionSending !== false)
    violations.push('readOnlySolanaBoundaryTransactionSending must be false');
  if (fixture.capabilityFlags.readOnlySolanaBoundaryRecommendations !== false)
    violations.push('readOnlySolanaBoundaryRecommendations must be false');
  if (fixture.futureRealResponsePlaceholder.networkEndpoint !== null)
    violations.push('futureRealResponsePlaceholder.networkEndpoint must be null');
  if (fixture.futureRealResponsePlaceholder.providerSdk !== null)
    violations.push('futureRealResponsePlaceholder.providerSdk must be null');
  return { safe: violations.length === 0, violations };
}

export function validateReadOnlySolanaProviderBoundaryFixtureTable(
  fixtures: readonly ReadOnlySolanaProviderBoundaryFixture[],
): ReadOnlySolanaProviderBoundaryValidationResult {
  const issues: ReadOnlySolanaProviderBoundaryValidationIssue[] = [];
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
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 boundary fixtures.');
  }
  return { valid: issues.length === 0, issues };
}

export const READ_ONLY_SOLANA_PROVIDER_BOUNDARY_VALIDATION_CONSTANTS = {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_STATE_KINDS,
} as const;
