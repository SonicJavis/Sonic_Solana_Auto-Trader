/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: validation.
 */

import {
  READ_ONLY_PROVIDER_CONTRACTS_PHASE,
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
  type ReadOnlyProviderContractSafetyResult,
  type ReadOnlyProviderContractValidationIssue,
  type ReadOnlyProviderContractValidationResult,
} from './types.js';
import {
  isValidReadOnlyProviderContractGeneratedAt,
  isValidReadOnlyProviderContractKind,
  isValidReadOnlyProviderContractName,
  isValidReadOnlyProviderContractSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|RPC)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN =
  /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route|handler|server|listen\()\b/i;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet(?! cluster))\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|execute|buy|sell|trade|order|recommendation|signal|investment advice)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'providerId',
  'providerName',
  'providerKind',
  'providerDomain',
  'contractId',
  'contractName',
  'capabilityContractId',
  'healthContractId',
  'responseId',
  'viewModelId',
  'selectorId',
  'selectedFixtureId',
  'selectedProviderKind',
  'source',
  'generatedAt',
  'domainQuery',
  'fixtureQueryId',
  'dataShape',
  'safetyNote',
  'safetyNotes',
  'deterministicFailureExamples',
  'message',
  'unsupportedLiveCapabilities',
  'supportedSyntheticDataDomains',
  // View model display fields — describe safety posture, not enable unsafe behavior
  'displayTitle',
  'displaySubtitle',
  'providerLabel',
  'domainLabel',
  'statusLabel',
  'capabilitySummary',
  'disabledSummary',
  'nonAdvisorySummary',
  'safetyBadge',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): ReadOnlyProviderContractValidationIssue {
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

export function validateReadOnlyProviderContractSafety(
  input: unknown,
): ReadOnlyProviderContractSafetyResult {
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
  issues: ReadOnlyProviderContractValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITIES', 'capabilityFlags', 'capabilityFlags must be object'));
    return;
  }

  const requiredTrue = [
    'readOnlyProviderContracts',
    'syntheticReadOnlyProviderContracts',
    'deterministicReadOnlyProviderContracts',
    'localOnlyReadOnlyProviderContracts',
    'fixtureDerivedReadOnlyProviderContracts',
    'readOnlyProviderContractViewModels',
    'readOnlyProviderApiContracts',
    'readOnlyProviderSelectors',
    'readOnlyProviderAdapterGate',
  ] as const;

  const requiredFalse = [
    'readOnlyProviderLiveData',
    'readOnlyProviderNetworkAccess',
    'readOnlyProviderAdapters',
    'readOnlyProviderSolanaRpc',
    'readOnlyProviderWebSockets',
    'readOnlyProviderGeyserYellowstone',
    'readOnlyProviderPumpFunIntegration',
    'readOnlyProviderDexIntegration',
    'readOnlyProviderJitoIntegration',
    'readOnlyProviderPersistence',
    'readOnlyProviderFilesystemWrites',
    'readOnlyProviderDownloads',
    'readOnlyProviderRouteHandlers',
    'readOnlyProviderHttpServer',
    'readOnlyProviderRuntimeRequests',
    'readOnlyProviderUiRendering',
    'readOnlyProviderDomAccess',
    'readOnlyProviderBackgroundJobs',
    'readOnlyProviderScheduledJobs',
    'readOnlyProviderWalletLogic',
    'readOnlyProviderPrivateKeyHandling',
    'readOnlyProviderSigning',
    'readOnlyProviderTransactionSending',
    'readOnlyProviderExecution',
    'readOnlyProviderTradingSignals',
    'readOnlyProviderRecommendations',
    'readOnlyProviderInvestmentAdvice',
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

export function validateReadOnlyProviderContractFixture(
  input: unknown,
): ReadOnlyProviderContractValidationResult {
  const issues: ReadOnlyProviderContractValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (input['phase'] !== READ_ONLY_PROVIDER_CONTRACTS_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 54'));
  }

  if (!isValidReadOnlyProviderContractName(input['fixtureName'])) {
    issues.push(issue('INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid'));
  }

  if (!isValidReadOnlyProviderContractKind(input['fixtureKind'])) {
    issues.push(issue('INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid'));
  }

  // Provider identity
  if (!isRecord(input['providerIdentity'])) {
    issues.push(issue('INVALID_PROVIDER_IDENTITY', 'providerIdentity', 'providerIdentity must be object'));
  } else {
    const identity = input['providerIdentity'];
    if (typeof identity['providerId'] !== 'string' || identity['providerId'].trim() === '') {
      issues.push(issue('INVALID_PROVIDER_ID', 'providerIdentity.providerId', 'providerId must be non-empty string'));
    }
    if (identity['liveNetworkAccess'] !== false) {
      issues.push(issue('INVALID_LIVE_NETWORK_ACCESS', 'providerIdentity.liveNetworkAccess', 'liveNetworkAccess must be false'));
    }
    if (identity['walletAccess'] !== false) {
      issues.push(issue('INVALID_WALLET_ACCESS', 'providerIdentity.walletAccess', 'walletAccess must be false'));
    }
    if (identity['executionAccess'] !== false) {
      issues.push(issue('INVALID_EXECUTION_ACCESS', 'providerIdentity.executionAccess', 'executionAccess must be false'));
    }
  }

  // Provider interface contract
  if (!isRecord(input['providerInterfaceContract'])) {
    issues.push(issue('INVALID_INTERFACE_CONTRACT', 'providerInterfaceContract', 'providerInterfaceContract must be object'));
  } else {
    const contract = input['providerInterfaceContract'];
    if (typeof contract['contractId'] !== 'string' || contract['contractId'].trim() === '') {
      issues.push(issue('INVALID_CONTRACT_ID', 'providerInterfaceContract.contractId', 'contractId must be non-empty string'));
    }
  }

  // Provider capability contract
  if (!isRecord(input['providerCapabilityContract'])) {
    issues.push(issue('INVALID_CAPABILITY_CONTRACT', 'providerCapabilityContract', 'providerCapabilityContract must be object'));
  } else {
    const cap = input['providerCapabilityContract'];
    if (cap['readOnlySupport'] !== true) {
      issues.push(issue('INVALID_READ_ONLY_SUPPORT', 'providerCapabilityContract.readOnlySupport', 'readOnlySupport must be true'));
    }
    if (cap['liveNetworkDisabled'] !== true) {
      issues.push(issue('INVALID_LIVE_NETWORK_DISABLED', 'providerCapabilityContract.liveNetworkDisabled', 'liveNetworkDisabled must be true'));
    }
  }

  // Provider health contract
  if (!isRecord(input['providerHealthContract'])) {
    issues.push(issue('INVALID_HEALTH_CONTRACT', 'providerHealthContract', 'providerHealthContract must be object'));
  } else {
    const health = input['providerHealthContract'];
    if (health['noActualHealthCheck'] !== true) {
      issues.push(issue('INVALID_NO_HEALTH_CHECK', 'providerHealthContract.noActualHealthCheck', 'noActualHealthCheck must be true'));
    }
    if (health['syntheticOnly'] !== true) {
      issues.push(issue('INVALID_SYNTHETIC_ONLY', 'providerHealthContract.syntheticOnly', 'syntheticOnly must be true'));
    }
  }

  // Synthetic responses
  if (!Array.isArray(input['syntheticResponses']) || input['syntheticResponses'].length === 0) {
    issues.push(issue('INVALID_SYNTHETIC_RESPONSES', 'syntheticResponses', 'syntheticResponses must contain entries'));
  }

  // View model
  if (!isRecord(input['viewModel'])) {
    issues.push(issue('INVALID_VIEW_MODEL', 'viewModel', 'viewModel must be object'));
  }

  // API contracts
  if (!isRecord(input['apiContracts'])) {
    issues.push(issue('INVALID_API_CONTRACTS', 'apiContracts', 'apiContracts must be object'));
  }

  // Selector examples
  if (!Array.isArray(input['selectorExamples']) || input['selectorExamples'].length === 0) {
    issues.push(issue('INVALID_SELECTOR_EXAMPLES', 'selectorExamples', 'selectorExamples must contain entries'));
  }

  validateCapabilityFlags(input['capabilityFlags'], issues);

  // Meta
  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be object'));
  } else {
    if (!isValidReadOnlyProviderContractGeneratedAt(input['meta']['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant'));
    }
    if (!isValidReadOnlyProviderContractSource(input['meta']['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant'));
    }
  }

  // Safety
  if (!isRecord(input['safety']) || input['safety']['nonAdvisory'] !== true) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be object with nonAdvisory true'));
  } else {
    const safety = input['safety'];
    if (safety['noLiveData'] !== true) {
      issues.push(issue('INVALID_SAFETY_NO_LIVE_DATA', 'safety.noLiveData', 'noLiveData must be true'));
    }
    if (safety['noNetworkAccess'] !== true) {
      issues.push(issue('INVALID_SAFETY_NO_NETWORK', 'safety.noNetworkAccess', 'noNetworkAccess must be true'));
    }
  }

  // Validate fixture name is in the known set
  if (isValidReadOnlyProviderContractName(input['fixtureName'])) {
    const expectedSet = new Set(READ_ONLY_PROVIDER_CONTRACT_NAMES);
    if (!expectedSet.has(input['fixtureName'])) {
      issues.push(issue('INVALID_FIXTURE_NAME_SET', 'fixtureName', 'fixtureName must be from stable provider contract names'));
    }
  }

  const safetyCheck = validateReadOnlyProviderContractSafety(input);
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
