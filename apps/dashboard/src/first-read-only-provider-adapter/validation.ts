import { READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES } from '../read-only-provider-adapter-gate/index.js';
import { READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES } from '../read-only-solana-provider-boundary/index.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE,
  FIRST_READ_ONLY_PROVIDER_CONFIG_STATES,
  FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES,
  FIRST_READ_ONLY_PROVIDER_HEALTH_STATES,
  FIRST_READ_ONLY_PROVIDER_TRANSPORT_KINDS,
  type FirstReadOnlyProviderAdapterFixture,
  type FirstReadOnlyProviderAdapterSafetyResult,
  type FirstReadOnlyProviderAdapterValidationIssue,
  type FirstReadOnlyProviderAdapterValidationResult,
} from './types.js';
import {
  isValidFirstReadOnlyProviderAdapterGeneratedAt,
  isValidFirstReadOnlyProviderAdapterKind,
  isValidFirstReadOnlyProviderAdapterName,
  isValidFirstReadOnlyProviderAdapterSchemaVersion,
  isValidFirstReadOnlyProviderAdapterSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|rpc|socket\.)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\(|setInterval\(|setTimeout\()/;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:execute|buy|sell|trade|order|profit|pnl|recommendation|signal|investment\s+advice)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'adapterId',
  'adapterName',
  'adapterKind',
  'responseKind',
  'transportKind',
  'sourceBoundaryFixtureName',
  'sourceGateFixtureName',
  'sourceBoundaryFixtureNames',
  'sourceGateFixtureNames',
  'generatedAt',
  'source',
  'version',
  'phase',
  'deterministicSeed',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'requiredBoundaryFields',
  'categories',
  'unsupportedWriteMethods',
  'safetySummary',
]);

function pushIssue(
  issues: FirstReadOnlyProviderAdapterValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: FirstReadOnlyProviderAdapterValidationIssue[],
): void {
  if (FORBIDDEN_URL_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_URL_REFERENCE', fieldPath, 'Live URL references are forbidden.');
  if (FORBIDDEN_NETWORK_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_NETWORK_REFERENCE', fieldPath, 'Network references are forbidden.');
  if (FORBIDDEN_FILESYSTEM_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_FILESYSTEM_REFERENCE', fieldPath, 'Filesystem references are forbidden.');
  if (FORBIDDEN_TIMER_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_TIMER_REFERENCE', fieldPath, 'Timer/runtime references are forbidden.');
  if (FORBIDDEN_WALLET_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_WALLET_REFERENCE', fieldPath, 'Wallet/signing references are forbidden.');
  if (FORBIDDEN_EXECUTION_PATTERN.test(text)) pushIssue(issues, 'UNSAFE_EXECUTION_REFERENCE', fieldPath, 'Execution/advisory references are forbidden.');
}

function scanObjectRecursive(
  value: unknown,
  fieldPath: string,
  issues: FirstReadOnlyProviderAdapterValidationIssue[],
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
      scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
    }
  }
}

export function validateFirstReadOnlyProviderAdapterFixture(
  fixture: FirstReadOnlyProviderAdapterFixture,
): FirstReadOnlyProviderAdapterValidationResult {
  const issues: FirstReadOnlyProviderAdapterValidationIssue[] = [];

  if (!isValidFirstReadOnlyProviderAdapterName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidFirstReadOnlyProviderAdapterKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE}.`);
  }
  if (!isValidFirstReadOnlyProviderAdapterSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidFirstReadOnlyProviderAdapterGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant.');
  }
  if (!isValidFirstReadOnlyProviderAdapterSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant.');
  }

  if (!(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES as readonly string[]).includes(fixture.sourceBoundaryFixtureName)) {
    pushIssue(issues, 'MISSING_SOURCE_BOUNDARY', 'sourceBoundaryFixtureName', 'Must reference a Phase 64 boundary fixture name.');
  }
  if (!(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES as readonly string[]).includes(fixture.sourceGateFixtureName)) {
    pushIssue(issues, 'MISSING_SOURCE_GATE', 'sourceGateFixtureName', 'Must reference a Phase 63 gate fixture name.');
  }

  if (!(FIRST_READ_ONLY_PROVIDER_CONFIG_STATES as readonly string[]).includes(fixture.providerConfig.mode)) {
    pushIssue(issues, 'INVALID_CONFIG_STATE', 'providerConfig.mode', 'Invalid provider config state.');
  }
  if (fixture.providerConfig.disabledByDefault !== true) {
    pushIssue(issues, 'DEFAULT_DISABLE_REQUIRED', 'providerConfig.disabledByDefault', 'disabledByDefault must be true.');
  }
  if (fixture.providerConfig.offlineFixtureMode !== true) {
    pushIssue(issues, 'OFFLINE_MODE_REQUIRED', 'providerConfig.offlineFixtureMode', 'offlineFixtureMode must be true.');
  }
  if (fixture.providerConfig.liveSmokeEnabled !== false) {
    pushIssue(issues, 'LIVE_SMOKE_DEFAULT_FORBIDDEN', 'providerConfig.liveSmokeEnabled', 'liveSmokeEnabled must be false by default.');
  }
  if (fixture.providerConfig.networkAccessDefault !== false) {
    pushIssue(issues, 'NETWORK_ACCESS_DEFAULT_FORBIDDEN', 'providerConfig.networkAccessDefault', 'networkAccessDefault must be false.');
  }
  if (fixture.providerConfig.endpointRequiredByDefault !== false) {
    pushIssue(issues, 'ENDPOINT_REQUIRED_FORBIDDEN', 'providerConfig.endpointRequiredByDefault', 'endpointRequiredByDefault must be false.');
  }
  if (fixture.providerConfig.apiKeysRequiredByDefault !== false) {
    pushIssue(issues, 'API_KEY_REQUIRED_FORBIDDEN', 'providerConfig.apiKeysRequiredByDefault', 'apiKeysRequiredByDefault must be false.');
  }

  if (fixture.providerCapabilities.writeMethods !== false) {
    pushIssue(issues, 'WRITE_METHODS_FORBIDDEN', 'providerCapabilities.writeMethods', 'write methods must remain disabled.');
  }
  if (fixture.providerCapabilities.walletRequired !== false) {
    pushIssue(issues, 'WALLET_FORBIDDEN', 'providerCapabilities.walletRequired', 'walletRequired must be false.');
  }
  if (fixture.providerCapabilities.signingRequired !== false) {
    pushIssue(issues, 'SIGNING_FORBIDDEN', 'providerCapabilities.signingRequired', 'signingRequired must be false.');
  }
  if (fixture.providerCapabilities.transactionSending !== false) {
    pushIssue(issues, 'SENDING_FORBIDDEN', 'providerCapabilities.transactionSending', 'transactionSending must be false.');
  }

  if (!(FIRST_READ_ONLY_PROVIDER_TRANSPORT_KINDS as readonly string[]).includes(fixture.transportContract.transportKind)) {
    pushIssue(issues, 'INVALID_TRANSPORT_KIND', 'transportContract.transportKind', 'Invalid transport kind.');
  }
  if (fixture.clientContract.unsupportedWriteMethods.length < 4) {
    pushIssue(issues, 'WRITE_METHOD_BLOCKLIST_INCOMPLETE', 'clientContract.unsupportedWriteMethods', 'Unsupported write methods list must include write/sign/send/execute placeholders.');
  }
  if (fixture.clientContract.walletRequired || fixture.clientContract.signingRequired || fixture.clientContract.transactionSendingRequired || fixture.clientContract.executionRequired) {
    pushIssue(issues, 'CLIENT_READ_ONLY_CONTRACT_VIOLATION', 'clientContract', 'Client contract must remain read-only with no wallet/sign/send/execute requirement.');
  }

  if (fixture.frozenResponseFixture.endpoint !== null) {
    pushIssue(issues, 'NETWORK_ENDPOINT_FORBIDDEN', 'frozenResponseFixture.endpoint', 'endpoint must be null.');
  }
  if (fixture.frozenResponseFixture.providerSdkReference !== null) {
    pushIssue(issues, 'PROVIDER_SDK_FORBIDDEN', 'frozenResponseFixture.providerSdkReference', 'provider SDK reference must be null.');
  }
  if (fixture.frozenResponseFixture.apiKeyRequired !== false) {
    pushIssue(issues, 'API_KEY_FORBIDDEN', 'frozenResponseFixture.apiKeyRequired', 'apiKeyRequired must be false.');
  }

  if (fixture.responseMapping.requiredBoundaryFields.length !== 5) {
    pushIssue(issues, 'MISSING_REQUIRED_FIELD_MAPPING', 'responseMapping.requiredBoundaryFields', 'Required response mapping fields must be complete.');
  }
  if (!(FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES as readonly string[]).includes(fixture.errorNormalization.primaryCategory)) {
    pushIssue(issues, 'INVALID_ERROR_CATEGORY', 'errorNormalization.primaryCategory', 'Invalid error normalization category.');
  }
  if (fixture.errorNormalization.categories.length !== FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES.length) {
    pushIssue(issues, 'ERROR_CATEGORY_SET_INCOMPLETE', 'errorNormalization.categories', 'Error normalization categories must be complete.');
  }

  if (!fixture.conformanceChecks.writeCapabilityAbsence || !fixture.conformanceChecks.walletSigningSendingAbsence) {
    pushIssue(issues, 'CONFORMANCE_WRITE_WALLET_VIOLATION', 'conformanceChecks', 'Conformance must enforce no write/wallet/sign/send capabilities.');
  }

  if (!(FIRST_READ_ONLY_PROVIDER_HEALTH_STATES as readonly string[]).includes(fixture.health.healthState)) {
    pushIssue(issues, 'INVALID_HEALTH_STATE', 'health.healthState', 'Invalid health state.');
  }

  if (fixture.smokeGuard.canRun && fixture.providerConfig.liveSmokeEnabled === false) {
    pushIssue(issues, 'LIVE_SMOKE_UNSAFE_ENABLEMENT', 'smokeGuard.canRun', 'Smoke guard cannot allow live smoke when default config disables it.');
  }

  if (fixture.capabilityFlags.firstReadOnlyProviderLiveDataDefault !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderNetworkAccessDefault !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderLiveSmokeDefault !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderWriteMethods !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderWalletLogic !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderSigning !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderTransactionSending !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderExecution !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderRecommendations !== false ||
    fixture.capabilityFlags.firstReadOnlyProviderInvestmentAdvice !== false) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags', 'Unsafe capability flags must be false.');
  }

  scanObjectRecursive(fixture, 'fixture', issues);

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateFirstReadOnlyProviderAdapterSafety(
  fixture: FirstReadOnlyProviderAdapterFixture,
): FirstReadOnlyProviderAdapterSafetyResult {
  const violations: string[] = [];
  if (fixture.providerConfig.liveSmokeEnabled !== false) violations.push('providerConfig.liveSmokeEnabled must be false');
  if (fixture.providerConfig.networkAccessDefault !== false) violations.push('providerConfig.networkAccessDefault must be false');
  if (fixture.providerConfig.endpointRequiredByDefault !== false) violations.push('providerConfig.endpointRequiredByDefault must be false');
  if (fixture.providerConfig.apiKeysRequiredByDefault !== false) violations.push('providerConfig.apiKeysRequiredByDefault must be false');
  if (fixture.frozenResponseFixture.endpoint !== null) violations.push('frozenResponseFixture.endpoint must be null');
  if (fixture.frozenResponseFixture.providerSdkReference !== null) violations.push('frozenResponseFixture.providerSdkReference must be null');
  if (fixture.frozenResponseFixture.apiKeyRequired !== false) violations.push('frozenResponseFixture.apiKeyRequired must be false');
  if (fixture.providerCapabilities.writeMethods !== false) violations.push('providerCapabilities.writeMethods must be false');
  if (fixture.providerCapabilities.walletRequired !== false) violations.push('providerCapabilities.walletRequired must be false');
  if (fixture.providerCapabilities.signingRequired !== false) violations.push('providerCapabilities.signingRequired must be false');
  if (fixture.providerCapabilities.transactionSending !== false) violations.push('providerCapabilities.transactionSending must be false');
  return { safe: violations.length === 0, violations };
}

export function validateFirstReadOnlyProviderAdapterFixtureTable(
  fixtures: readonly FirstReadOnlyProviderAdapterFixture[],
): FirstReadOnlyProviderAdapterValidationResult {
  const issues: FirstReadOnlyProviderAdapterValidationIssue[] = [];
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
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 adapter fixtures.');
  }

  return { valid: issues.length === 0, issues };
}

export const FIRST_READ_ONLY_PROVIDER_ADAPTER_VALIDATION_CONSTANTS = {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS,
  FIRST_READ_ONLY_PROVIDER_CONFIG_STATES,
} as const;
