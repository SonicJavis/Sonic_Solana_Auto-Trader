import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
} from '../first-read-only-provider-adapter/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
} from '../read-only-provider-adapter-gate/index.js';
import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
} from '../read-only-solana-provider-boundary/index.js';
import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE,
  type MultiProviderReadOnlyFoundationFixture,
  type MultiProviderReadOnlyFoundationSafetyResult,
  type MultiProviderReadOnlyFoundationValidationIssue,
  type MultiProviderReadOnlyFoundationValidationResult,
} from './types.js';
import {
  isValidMultiProviderReadOnlyFoundationGeneratedAt,
  isValidMultiProviderReadOnlyFoundationKind,
  isValidMultiProviderReadOnlyFoundationName,
  isValidMultiProviderReadOnlyFoundationSchemaVersion,
  isValidMultiProviderReadOnlyFoundationSource,
} from './normalization.js';

const ALLOWED_OBSERVED_AT = new Set(['2026-05-12T00:00:00.000Z', '2026-05-11T00:00:00.000Z']);
const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|request\(|wss?:\/\/|rpc|socket\.)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_TIMER_PATTERN = /\b(?:Date\.now\(|new Date\(|Math\.random\(|randomUUID\(|setInterval\(|setTimeout\()/;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:wallet|privateKey|secretKey|seedPhrase|mnemonic|Keypair|signTransaction|sendTransaction)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:execute|buy|sell|trade|profit|pnl|recommendation|signal|investment\s+advice)\b/i;
const FORBIDDEN_KEY_PATTERN = /\b(?:apikey|api[_-]?key|secret|providerSdk|provider[_-]?sdk)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'providerId',
  'providerName',
  'providerRegistryId',
  'normalizedProviderRecordId',
  'healthScoreId',
  'staleDataCheckId',
  'policyId',
  'cachePolicyId',
  'selectionId',
  'fallbackPolicyId',
  'conformanceId',
  'reportId',
  'viewModelId',
  'selectorId',
  'contractId',
  'generatedAt',
  'source',
  'version',
  'phase',
  'deterministicSeed',
  'sourceAdapterFixtureSnapshot',
  'sourceBoundaryFixtureSnapshot',
  'sourceGateFixtureSnapshot',
  'defaultProviderOrder',
  'fallbackProviderIds',
  'selectedProviderId',
  'primaryProviderId',
]);

function pushIssue(
  issues: MultiProviderReadOnlyFoundationValidationIssue[],
  code: string,
  field: string,
  message: string,
): void {
  issues.push({ code, field, message, severity: 'error' });
}

function scanTextForUnsafeContent(
  text: string,
  fieldPath: string,
  issues: MultiProviderReadOnlyFoundationValidationIssue[],
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
  issues: MultiProviderReadOnlyFoundationValidationIssue[],
  depth = 0,
): void {
  if (depth > 24) return;
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
      if (EXCLUDED_SCAN_FIELDS.has(key) || key.toLowerCase().endsWith('id')) continue;
      scanObjectRecursive(nested, `${fieldPath}.${key}`, issues, depth + 1);
    }
  }
}

function hasUnsafeProviderFlags(fixture: MultiProviderReadOnlyFoundationFixture): boolean {
  return fixture.providerRegistry.providerEntries.some(entry =>
    entry.readOnly !== true ||
    entry.liveDataDefault !== false ||
    entry.networkAccessDefault !== false ||
    entry.capabilityFlags.writeMethods !== false ||
    entry.capabilityFlags.walletLogic !== false ||
    entry.capabilityFlags.signing !== false ||
    entry.capabilityFlags.transactionSending !== false ||
    entry.capabilityFlags.execution !== false ||
    entry.capabilityFlags.tradingSignals !== false ||
    entry.capabilityFlags.recommendations !== false ||
    entry.capabilityFlags.investmentAdvice !== false ||
    entry.capabilityFlags.persistence !== false ||
    entry.capabilityFlags.filesystemWrites !== false ||
    entry.capabilityFlags.routeHandlers !== false ||
    entry.capabilityFlags.runtimeRequests !== false ||
    entry.capabilityFlags.uiRendering !== false ||
    entry.capabilityFlags.domAccess !== false ||
    entry.capabilityFlags.realOrders !== false ||
    entry.capabilityFlags.realFunds !== false ||
    entry.capabilityFlags.realPnL !== false ||
    entry.capabilityFlags.gateBypass !== false,
  );
}

export function validateMultiProviderReadOnlyFoundationFixture(
  fixture: MultiProviderReadOnlyFoundationFixture,
): MultiProviderReadOnlyFoundationValidationResult {
  const issues: MultiProviderReadOnlyFoundationValidationIssue[] = [];

  if (!isValidMultiProviderReadOnlyFoundationName(fixture.fixtureName)) {
    pushIssue(issues, 'INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid.');
  }
  if (!isValidMultiProviderReadOnlyFoundationKind(fixture.fixtureKind)) {
    pushIssue(issues, 'INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid.');
  }
  if (fixture.phase !== MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE) {
    pushIssue(issues, 'INVALID_PHASE', 'phase', `phase must be ${MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE}.`);
  }
  if (!isValidMultiProviderReadOnlyFoundationSchemaVersion(fixture.schemaVersion)) {
    pushIssue(issues, 'INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion is invalid.');
  }
  if (!isValidMultiProviderReadOnlyFoundationGeneratedAt(fixture.meta.generatedAt)) {
    pushIssue(issues, 'INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant.');
  }
  if (!isValidMultiProviderReadOnlyFoundationSource(fixture.meta.source)) {
    pushIssue(issues, 'INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant.');
  }

  if (fixture.providerRegistry.providerEntries.length === 0) {
    pushIssue(issues, 'MISSING_PROVIDER_ENTRIES', 'providerRegistry.providerEntries', 'At least one provider entry is required.');
  }

  const providerIds = fixture.providerRegistry.providerEntries.map(entry => entry.providerId);
  if (new Set(providerIds).size !== providerIds.length) {
    pushIssue(issues, 'DUPLICATE_PROVIDER_ID', 'providerRegistry.providerEntries', 'Provider IDs must be unique.');
  }

  const providerNames = fixture.providerRegistry.providerEntries.map(entry => entry.providerName);
  if (new Set(providerNames).size !== providerNames.length) {
    pushIssue(issues, 'DUPLICATE_PROVIDER_NAME', 'providerRegistry.providerEntries', 'Provider names must be unique.');
  }

  for (const providerId of fixture.providerRegistry.defaultProviderOrder) {
    if (!providerIds.includes(providerId)) {
      pushIssue(issues, 'INVALID_PROVIDER_ORDER', 'providerRegistry.defaultProviderOrder', `Unknown provider in default order: ${providerId}`);
    }
  }

  const disabledSet = new Set(fixture.providerRegistry.disabledProviderEntries);
  for (const disabledProviderId of disabledSet) {
    const provider = fixture.providerRegistry.providerEntries.find(entry => entry.providerId === disabledProviderId);
    if (!provider || provider.enabledByDefault) {
      pushIssue(issues, 'INVALID_DISABLED_PROVIDER', 'providerRegistry.disabledProviderEntries', 'disabledProviderEntries must reference providers with enabledByDefault=false.');
    }
  }

  for (const entry of fixture.providerRegistry.providerEntries) {
    if (!(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES as readonly string[]).includes(entry.sourceAdapterFixtureName)) {
      pushIssue(issues, 'INVALID_SOURCE_ADAPTER_REF', 'providerRegistry.providerEntries.sourceAdapterFixtureName', 'Must reference a Phase 65 adapter fixture name.');
    }
    if (!(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES as readonly string[]).includes(entry.sourceBoundaryFixtureName)) {
      pushIssue(issues, 'INVALID_SOURCE_BOUNDARY_REF', 'providerRegistry.providerEntries.sourceBoundaryFixtureName', 'Must reference a Phase 64 boundary fixture name.');
    }
    if (!(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES as readonly string[]).includes(entry.sourceGateFixtureName)) {
      pushIssue(issues, 'INVALID_SOURCE_GATE_REF', 'providerRegistry.providerEntries.sourceGateFixtureName', 'Must reference a Phase 63 gate fixture name.');
    }

    if (entry.liveDataDefault !== false || entry.networkAccessDefault !== false) {
      pushIssue(issues, 'UNSAFE_PROVIDER_DEFAULTS', `providerRegistry.providerEntries.${entry.providerId}`, 'Provider entry defaults must disable liveData/network access.');
    }

    if (entry.enabledByDefault && hasUnsafeProviderFlags({ ...fixture, providerRegistry: { ...fixture.providerRegistry, providerEntries: [entry] } })) {
      pushIssue(issues, 'UNSAFE_ENABLED_PROVIDER', `providerRegistry.providerEntries.${entry.providerId}`, 'Enabled provider has unsafe capabilities.');
    }

    const sourceRefs = `${entry.sourceAdapterFixtureName}|${entry.sourceBoundaryFixtureName}|${entry.sourceGateFixtureName}`;
    if (FORBIDDEN_KEY_PATTERN.test(sourceRefs)) {
      pushIssue(issues, 'UNSAFE_SOURCE_REFERENCE', `providerRegistry.providerEntries.${entry.providerId}`, 'Source fixture references must not include api key/secret/provider sdk strings.');
    }
  }

  if (!ALLOWED_OBSERVED_AT.has(fixture.staleDataChecks[0]?.observedAt ?? '')) {
    pushIssue(issues, 'INVALID_STALE_TIMESTAMP', 'staleDataChecks', 'staleDataChecks must use deterministic timestamp constants.');
  }

  for (const check of fixture.staleDataChecks) {
    if (!ALLOWED_OBSERVED_AT.has(check.observedAt)) {
      pushIssue(issues, 'DYNAMIC_TIMESTAMP_FORBIDDEN', `staleDataChecks.${check.providerId}.observedAt`, 'observedAt must be one of deterministic timestamps.');
    }
    if (check.deterministicOnly !== true) {
      pushIssue(issues, 'DETERMINISTIC_ONLY_REQUIRED', `staleDataChecks.${check.providerId}.deterministicOnly`, 'deterministicOnly must be true.');
    }
  }

  if (fixture.freshnessPolicy.noLiveRefresh !== true) {
    pushIssue(issues, 'LIVE_REFRESH_FORBIDDEN', 'freshnessPolicy.noLiveRefresh', 'noLiveRefresh must be true.');
  }
  if (fixture.freshnessPolicy.failClosed !== true) {
    pushIssue(issues, 'FAIL_CLOSED_REQUIRED', 'freshnessPolicy.failClosed', 'failClosed must be true.');
  }

  if (
    fixture.cachePolicy.persistentCache !== false ||
    fixture.cachePolicy.filesystemCache !== false ||
    fixture.cachePolicy.browserCache !== false
  ) {
    pushIssue(issues, 'UNSAFE_CACHE_POLICY', 'cachePolicy', 'persistent/filesystem/browser cache must remain false.');
  }

  const selectedProvider = fixture.providerRegistry.providerEntries.find(
    entry => entry.providerId === fixture.providerSelection.selectedProviderId,
  );

  if (fixture.providerSelection.selectedProviderId !== 'none' && !selectedProvider) {
    pushIssue(issues, 'INVALID_SELECTION_PROVIDER', 'providerSelection.selectedProviderId', 'selectedProviderId must exist in registry or be "none" for fail-closed state.');
  }

  if (selectedProvider && selectedProvider.sourceGateFixtureName !== 'safe-synthetic-mock-accepted-gate') {
    pushIssue(issues, 'SELECTION_BYPASSES_GATE', 'providerSelection.selectedProviderId', 'Selection must not bypass gate-safe provider entries.');
  }

  if (fixture.providerSelection.selectedProviderId === 'none' && !fixture.providerSelection.selectionReason.includes('fail_closed')) {
    pushIssue(issues, 'FAIL_CLOSED_SELECTION_REASON_REQUIRED', 'providerSelection.selectionReason', 'Fail-closed selection must include fail_closed reason.');
  }

  for (const fallbackProviderId of fixture.providerFallback.fallbackProviderIds) {
    const fallbackEntry = fixture.providerRegistry.providerEntries.find(entry => entry.providerId === fallbackProviderId);
    if (!fallbackEntry) {
      pushIssue(issues, 'INVALID_FALLBACK_PROVIDER', 'providerFallback.fallbackProviderIds', `Fallback provider does not exist: ${fallbackProviderId}`);
      continue;
    }
    if (fallbackEntry.sourceGateFixtureName !== 'safe-synthetic-mock-accepted-gate') {
      pushIssue(issues, 'UNSAFE_FALLBACK_PROVIDER', 'providerFallback.fallbackProviderIds', 'Fallback provider must reference safe gate fixture.');
    }
    if (fallbackEntry.capabilityFlags.writeMethods !== false || fallbackEntry.capabilityFlags.execution !== false) {
      pushIssue(issues, 'UNSAFE_FALLBACK_CAPABILITY', 'providerFallback.fallbackProviderIds', 'Fallback provider must not expose unsafe write/execution capabilities.');
    }
  }

  if (hasUnsafeProviderFlags(fixture)) {
    pushIssue(issues, 'UNSAFE_PROVIDER_FLAGS', 'providerRegistry.providerEntries.capabilityFlags', 'Unsafe provider capability flags must be false.');
  }

  if (
    fixture.capabilityFlags.multiProviderLiveDataDefault !== false ||
    fixture.capabilityFlags.multiProviderNetworkAccessDefault !== false ||
    fixture.capabilityFlags.multiProviderWriteMethods !== false ||
    fixture.capabilityFlags.multiProviderWalletLogic !== false ||
    fixture.capabilityFlags.multiProviderSigning !== false ||
    fixture.capabilityFlags.multiProviderTransactionSending !== false ||
    fixture.capabilityFlags.multiProviderExecution !== false ||
    fixture.capabilityFlags.multiProviderTradingSignals !== false ||
    fixture.capabilityFlags.multiProviderRecommendations !== false ||
    fixture.capabilityFlags.multiProviderInvestmentAdvice !== false ||
    fixture.capabilityFlags.multiProviderRouteHandlers !== false ||
    fixture.capabilityFlags.multiProviderRuntimeRequests !== false ||
    fixture.capabilityFlags.multiProviderUiRendering !== false ||
    fixture.capabilityFlags.multiProviderDomAccess !== false ||
    fixture.capabilityFlags.multiProviderPersistence !== false ||
    fixture.capabilityFlags.multiProviderFilesystemWrites !== false ||
    fixture.capabilityFlags.multiProviderRealOrders !== false ||
    fixture.capabilityFlags.multiProviderRealFunds !== false ||
    fixture.capabilityFlags.multiProviderRealPnL !== false
  ) {
    pushIssue(issues, 'UNSAFE_CAPABILITY_FLAG', 'capabilityFlags', 'Unsafe capability flags must be false.');
  }

  if (
    JSON.stringify(fixture.sourceAdapterFixtureSnapshot) !== JSON.stringify(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES) ||
    JSON.stringify(fixture.sourceBoundaryFixtureSnapshot) !== JSON.stringify(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES) ||
    JSON.stringify(fixture.sourceGateFixtureSnapshot) !== JSON.stringify(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES)
  ) {
    pushIssue(issues, 'MUTATED_SOURCE_FIXTURE_SNAPSHOT', 'source*FixtureSnapshot', 'Source fixture snapshots must match immutable upstream fixture names.');
  }

  scanObjectRecursive(fixture, 'fixture', issues);

  return { valid: issues.every(issue => issue.severity !== 'error'), issues };
}

export function validateMultiProviderReadOnlyFoundationSafety(
  fixture: MultiProviderReadOnlyFoundationFixture,
): MultiProviderReadOnlyFoundationSafetyResult {
  const violations: string[] = [];

  if (fixture.providerRegistry.providerEntries.some(entry => entry.liveDataDefault !== false)) {
    violations.push('provider entries must keep liveDataDefault=false');
  }
  if (fixture.providerRegistry.providerEntries.some(entry => entry.networkAccessDefault !== false)) {
    violations.push('provider entries must keep networkAccessDefault=false');
  }
  if (fixture.providerRegistry.providerEntries.some(entry => entry.capabilityFlags.writeMethods !== false)) {
    violations.push('provider entries must keep writeMethods=false');
  }
  if (fixture.cachePolicy.persistentCache !== false) violations.push('cachePolicy.persistentCache must be false');
  if (fixture.cachePolicy.filesystemCache !== false) violations.push('cachePolicy.filesystemCache must be false');
  if (fixture.cachePolicy.browserCache !== false) violations.push('cachePolicy.browserCache must be false');
  if (fixture.providerSelection.noLiveCall !== true) violations.push('providerSelection.noLiveCall must be true');
  if (fixture.providerFallback.unsafeFallbackBlocked !== true) violations.push('providerFallback.unsafeFallbackBlocked must be true');

  return { safe: violations.length === 0, violations };
}

export function validateMultiProviderReadOnlyFoundationFixtureTable(
  fixtures: readonly MultiProviderReadOnlyFoundationFixture[],
): MultiProviderReadOnlyFoundationValidationResult {
  const issues: MultiProviderReadOnlyFoundationValidationIssue[] = [];
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
  }

  if (fixtures.length < 8) {
    pushIssue(issues, 'FIXTURE_COUNT_TOO_LOW', 'fixtures', 'Expected at least 8 multi-provider fixtures.');
  }

  return { valid: issues.length === 0, issues };
}
