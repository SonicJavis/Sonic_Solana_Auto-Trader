/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: validation.
 */

import {
  READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
  type ReadOnlyProviderAdapterMockSafetyResult,
  type ReadOnlyProviderAdapterMockValidationIssue,
  type ReadOnlyProviderAdapterMockValidationResult,
} from './types.js';
import {
  isValidReadOnlyProviderAdapterMockGeneratedAt,
  isValidReadOnlyProviderAdapterMockKind,
  isValidReadOnlyProviderAdapterMockName,
  isValidReadOnlyProviderAdapterMockSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|RPC)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN =
  /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route|handler|server|listen\()\b/i;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)(?![\s_-]*cluster)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|execute|buy|sell|trade|order|recommendation|signal)\b|\binvestment\s+advice\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'adapterId',
  'adapterName',
  'adapterKind',
  'adapterDomain',
  'sourceProviderContractName',
  'viewModelId',
  'selectorId',
  'selectedFixtureId',
  'selectedAdapterKind',
  'selectedDomain',
  'source',
  'generatedAt',
  'sourceSyntheticLaunchFixtureName',
  'requestId',
  'resultId',
  'profileId',
  'healthProfileId',
  'contractId',
  'contractName',
  'displayTitle',
  'displaySubtitle',
  'adapterLabel',
  'domainLabel',
  'sourceProviderContractLabel',
  'statusLabel',
  'capabilitySummary',
  'disabledSummary',
  'nonAdvisorySummary',
  'safetyBadge',
  'deterministicFailureExamples',
  'message',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): ReadOnlyProviderAdapterMockValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(
  value: unknown,
  out: string[] = [],
  parentKey?: string,
): readonly string[] {
  if (typeof value === 'string') {
    if (parentKey === undefined || !EXCLUDED_SCAN_FIELDS.has(parentKey)) {
      out.push(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, out, parentKey));
  } else if (isRecord(value)) {
    Object.entries(value).forEach(([key, entry]) => collectStrings(entry, out, key));
  }
  return out;
}

export function validateReadOnlyProviderAdapterMockSafety(
  input: unknown,
): ReadOnlyProviderAdapterMockSafetyResult {
  const strings = collectStrings(input);
  const violations: string[] = [];

  for (const value of strings) {
    if (FORBIDDEN_URL_PATTERN.test(value)) {
      violations.push(`Detected live URL reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_NETWORK_PATTERN.test(value)) {
      violations.push(`Detected network runtime reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_FILESYSTEM_PATTERN.test(value)) {
      violations.push(`Detected filesystem reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_RUNTIME_PATTERN.test(value)) {
      violations.push(`Detected route/runtime reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_WALLET_PATTERN.test(value)) {
      violations.push(`Detected wallet reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_EXECUTION_PATTERN.test(value)) {
      violations.push(`Detected execution/advisory reference: "${value.slice(0, 80)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

function validateCapabilityFlags(
  flags: unknown,
  issues: ReadOnlyProviderAdapterMockValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITIES', 'capabilityFlags', 'capabilityFlags must be object'));
    return;
  }

  const requiredTrue = [
    'readOnlyProviderAdapterMocks',
    'syntheticReadOnlyProviderAdapterMocks',
    'deterministicReadOnlyProviderAdapterMocks',
    'localOnlyReadOnlyProviderAdapterMocks',
    'fixtureDerivedReadOnlyProviderAdapterMocks',
    'pureReadOnlyProviderAdapterMocks',
    'readOnlyProviderAdapterMockViewModels',
    'readOnlyProviderAdapterMockApiContracts',
    'readOnlyProviderAdapterMockSelectors',
  ] as const;

  const requiredFalse = [
    'readOnlyProviderAdapterMockLiveData',
    'readOnlyProviderAdapterMockNetworkAccess',
    'readOnlyProviderAdapterMockRealAdapters',
    'readOnlyProviderAdapterMockSolanaRpc',
    'readOnlyProviderAdapterMockWebSocketAccess',
    'readOnlyProviderAdapterMockGeyserYellowstone',
    'readOnlyProviderAdapterMockPumpFunIntegration',
    'readOnlyProviderAdapterMockDexIntegration',
    'readOnlyProviderAdapterMockJitoIntegration',
    'readOnlyProviderAdapterMockPersistence',
    'readOnlyProviderAdapterMockFilesystemWrites',
    'readOnlyProviderAdapterMockDownloads',
    'readOnlyProviderAdapterMockRouteHandlers',
    'readOnlyProviderAdapterMockHttpServer',
    'readOnlyProviderAdapterMockRuntimeRequests',
    'readOnlyProviderAdapterMockUiRendering',
    'readOnlyProviderAdapterMockDomAccess',
    'readOnlyProviderAdapterMockBackgroundJobs',
    'readOnlyProviderAdapterMockScheduledJobs',
    'readOnlyProviderAdapterMockWalletLogic',
    'readOnlyProviderAdapterMockPrivateKeyHandling',
    'readOnlyProviderAdapterMockSigning',
    'readOnlyProviderAdapterMockTransactionSending',
    'readOnlyProviderAdapterMockExecution',
    'readOnlyProviderAdapterMockTradingSignals',
    'readOnlyProviderAdapterMockRecommendations',
    'readOnlyProviderAdapterMockInvestmentAdvice',
  ] as const;

  for (const key of requiredTrue) {
    if (flags[key] !== true) {
      issues.push(issue('CAPABILITY_TRUE_REQUIRED', `capabilityFlags.${key}`, `${key} must be true`));
    }
  }

  for (const key of requiredFalse) {
    if (flags[key] !== false) {
      issues.push(issue('CAPABILITY_FALSE_REQUIRED', `capabilityFlags.${key}`, `${key} must be false`));
    }
  }
}

export function validateReadOnlyProviderAdapterMockFixture(
  input: unknown,
): ReadOnlyProviderAdapterMockValidationResult {
  const issues: ReadOnlyProviderAdapterMockValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (input['phase'] !== READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 55'));
  }

  if (!isValidReadOnlyProviderAdapterMockName(input['fixtureName'])) {
    issues.push(issue('INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid'));
  }

  if (!isValidReadOnlyProviderAdapterMockKind(input['fixtureKind'])) {
    issues.push(issue('INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid'));
  }

  if (!isRecord(input['adapterIdentity'])) {
    issues.push(issue('INVALID_ADAPTER_IDENTITY', 'adapterIdentity', 'adapterIdentity must be object'));
  } else {
    const identity = input['adapterIdentity'];
    if (identity['liveNetworkAccess'] !== false) {
      issues.push(issue('INVALID_LIVE_NETWORK_ACCESS', 'adapterIdentity.liveNetworkAccess', 'liveNetworkAccess must be false'));
    }
    if (identity['walletAccess'] !== false) {
      issues.push(issue('INVALID_WALLET_ACCESS', 'adapterIdentity.walletAccess', 'walletAccess must be false'));
    }
    if (identity['executionAccess'] !== false) {
      issues.push(issue('INVALID_EXECUTION_ACCESS', 'adapterIdentity.executionAccess', 'executionAccess must be false'));
    }
    if (!READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS.includes(identity['adapterDomain'] as never)) {
      issues.push(issue('INVALID_ADAPTER_DOMAIN', 'adapterIdentity.adapterDomain', 'adapterDomain must be stable mock domain'));
    }
  }

  if (!isRecord(input['adapterCapabilityProfile'])) {
    issues.push(issue('INVALID_ADAPTER_CAPABILITY_PROFILE', 'adapterCapabilityProfile', 'adapterCapabilityProfile must be object'));
  }

  if (!isRecord(input['adapterHealthProfile'])) {
    issues.push(issue('INVALID_ADAPTER_HEALTH_PROFILE', 'adapterHealthProfile', 'adapterHealthProfile must be object'));
  } else {
    const health = input['adapterHealthProfile'];
    if (health['noActualHealthCheck'] !== true) {
      issues.push(issue('INVALID_NO_HEALTH_CHECK', 'adapterHealthProfile.noActualHealthCheck', 'noActualHealthCheck must be true'));
    }
    if (health['syntheticOnly'] !== true) {
      issues.push(issue('INVALID_SYNTHETIC_ONLY', 'adapterHealthProfile.syntheticOnly', 'syntheticOnly must be true'));
    }
  }

  if (!isRecord(input['mockRequest'])) {
    issues.push(issue('INVALID_MOCK_REQUEST', 'mockRequest', 'mockRequest must be object'));
  } else {
    const request = input['mockRequest'];
    if (request['fixtureOnly'] !== true || request['readOnly'] !== true) {
      issues.push(issue('INVALID_MOCK_REQUEST_FLAGS', 'mockRequest', 'mockRequest must be fixture-only and read-only'));
    }
    if (request['unsafeLiveRequested'] !== false) {
      issues.push(issue('INVALID_MOCK_REQUEST_UNSAFE', 'mockRequest.unsafeLiveRequested', 'unsafeLiveRequested must be false'));
    }
  }

  if (!isRecord(input['mockResult'])) {
    issues.push(issue('INVALID_MOCK_RESULT', 'mockResult', 'mockResult must be object'));
  }

  if (!isRecord(input['viewModel'])) {
    issues.push(issue('INVALID_VIEW_MODEL', 'viewModel', 'viewModel must be object'));
  }

  if (!isRecord(input['apiContracts'])) {
    issues.push(issue('INVALID_API_CONTRACTS', 'apiContracts', 'apiContracts must be object'));
  }

  if (!Array.isArray(input['selectorExamples']) || input['selectorExamples'].length === 0) {
    issues.push(issue('INVALID_SELECTOR_EXAMPLES', 'selectorExamples', 'selectorExamples must contain entries'));
  }

  validateCapabilityFlags(input['capabilityFlags'], issues);

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be object'));
  } else {
    const meta = input['meta'];
    if (!isValidReadOnlyProviderAdapterMockGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant'));
    }
    if (!isValidReadOnlyProviderAdapterMockSource(meta['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant'));
    }
    if (meta['seed'] !== 'phase55-deterministic-seed-v1') {
      issues.push(issue('INVALID_META_SEED', 'meta.seed', 'meta.seed must be deterministic constant'));
    }
  }

  if (!isRecord(input['safety'])) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be object'));
  } else {
    const safety = input['safety'];
    if (safety['nonAdvisory'] !== true) {
      issues.push(issue('INVALID_SAFETY_NON_ADVISORY', 'safety.nonAdvisory', 'nonAdvisory must be true'));
    }
    if (safety['noLiveData'] !== true || safety['noNetworkAccess'] !== true) {
      issues.push(issue('INVALID_SAFETY_NO_LIVE_DATA', 'safety', 'safety noLiveData/noNetworkAccess must be true'));
    }
  }

  if (
    typeof input['sourceProviderContractName'] !== 'string' ||
    !input['sourceProviderContractName'].toString().endsWith('-contract')
  ) {
    issues.push(issue('INVALID_PROVIDER_CONTRACT_REFERENCE', 'sourceProviderContractName', 'sourceProviderContractName must reference stable Phase 54 contract name'));
  }

  if (isValidReadOnlyProviderAdapterMockName(input['fixtureName'])) {
    const expectedSet = new Set(READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES);
    if (!expectedSet.has(input['fixtureName'])) {
      issues.push(issue('INVALID_FIXTURE_NAME_SET', 'fixtureName', 'fixtureName must be from stable adapter mock names'));
    }
  }

  const safetyCheck = validateReadOnlyProviderAdapterMockSafety(input);
  if (!safetyCheck.safe) {
    issues.push(
      issue(
        'UNSAFE_FIXTURE_CONTENT',
        'root',
        `fixture contains unsafe content (${safetyCheck.violations.length} violation(s))`,
      ),
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
