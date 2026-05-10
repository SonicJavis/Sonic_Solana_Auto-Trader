/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: validation.
 */

import {
  SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE,
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES,
  type SyntheticLaunchIntelligenceSafetyResult,
  type SyntheticLaunchIntelligenceValidationIssue,
  type SyntheticLaunchIntelligenceValidationResult,
} from './types.js';
import {
  isValidSyntheticLaunchIntelligenceGeneratedAt,
  isValidSyntheticLaunchIntelligenceScenarioKind,
  isValidSyntheticLaunchIntelligenceScenarioName,
  isValidSyntheticLaunchIntelligenceSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|RPC|request)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN = /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route|handler|server|listen\()\b/i;
const FORBIDDEN_WALLET_PATTERN = /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)\b/i;
const FORBIDDEN_EXECUTION_PATTERN = /\b(?:signTransaction|sendTransaction|execute|buy|sell|trade|order|recommendation|signal|investment advice)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'tokenMintPlaceholderId',
  'symbol',
  'name',
  'source',
  'contractId',
  'contractName',
  'selectorId',
  'selectedFixtureId',
  'selectedScenarioKind',
  'deterministicSeed',
  'generatedAt',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): SyntheticLaunchIntelligenceValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, out: string[] = [], parentKey?: string): readonly string[] {
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

export function validateSyntheticLaunchIntelligenceSafety(
  input: unknown,
): SyntheticLaunchIntelligenceSafetyResult {
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
  issues: SyntheticLaunchIntelligenceValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITIES', 'capabilityFlags', 'capabilityFlags must be object'));
    return;
  }

  const requiredTrue = [
    'syntheticLaunchIntelligence',
    'syntheticLaunchIntelligenceFixtures',
    'deterministicSyntheticLaunchIntelligence',
    'localOnlySyntheticLaunchIntelligence',
    'readOnlySyntheticLaunchIntelligence',
    'fixtureDerivedSyntheticLaunchIntelligence',
    'syntheticLaunchViewModels',
    'syntheticLaunchApiContracts',
    'syntheticLaunchSelectors',
  ] as const;

  const requiredFalse = [
    'syntheticLaunchLiveData',
    'syntheticLaunchNetworkAccess',
    'syntheticLaunchProviderAdapters',
    'syntheticLaunchSolanaRpc',
    'syntheticLaunchPumpFunIntegration',
    'syntheticLaunchDexIntegration',
    'syntheticLaunchJitoIntegration',
    'syntheticLaunchPersistence',
    'syntheticLaunchFilesystemWrites',
    'syntheticLaunchDownloads',
    'syntheticLaunchRouteHandlers',
    'syntheticLaunchHttpServer',
    'syntheticLaunchRuntimeRequests',
    'syntheticLaunchUiRendering',
    'syntheticLaunchDomAccess',
    'syntheticLaunchBackgroundJobs',
    'syntheticLaunchScheduledJobs',
    'syntheticLaunchWalletLogic',
    'syntheticLaunchPrivateKeyHandling',
    'syntheticLaunchSigning',
    'syntheticLaunchTransactionSending',
    'syntheticLaunchExecution',
    'syntheticLaunchTradingSignals',
    'syntheticLaunchRecommendations',
    'syntheticLaunchInvestmentAdvice',
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

export function validateSyntheticLaunchIntelligenceFixture(
  input: unknown,
): SyntheticLaunchIntelligenceValidationResult {
  const issues: SyntheticLaunchIntelligenceValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (input['phase'] !== SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 53'));
  }

  if (!isValidSyntheticLaunchIntelligenceScenarioName(input['fixtureName'])) {
    issues.push(issue('INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid'));
  }

  if (!isValidSyntheticLaunchIntelligenceScenarioKind(input['fixtureKind'])) {
    issues.push(issue('INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid'));
  }

  if (!isValidSyntheticLaunchIntelligenceGeneratedAt(input['generatedAt'])) {
    issues.push(issue('INVALID_GENERATED_AT', 'generatedAt', 'generatedAt must be deterministic constant'));
  }

  if (typeof input['deterministicSeed'] !== 'string' || input['deterministicSeed'].trim() === '') {
    issues.push(issue('INVALID_DETERMINISTIC_SEED', 'deterministicSeed', 'deterministicSeed must be non-empty'));
  }

  if (!isRecord(input['tokenProfile'])) {
    issues.push(issue('INVALID_TOKEN_PROFILE', 'tokenProfile', 'tokenProfile must be object'));
  } else {
    const tokenProfile = input['tokenProfile'];
    if (typeof tokenProfile['tokenMintPlaceholderId'] !== 'string') {
      issues.push(issue('INVALID_TOKEN_MINT_PLACEHOLDER', 'tokenProfile.tokenMintPlaceholderId', 'tokenMintPlaceholderId must be string'));
    }
    if (tokenProfile['source'] !== 'synthetic_fixture_only') {
      issues.push(issue('INVALID_TOKEN_SOURCE', 'tokenProfile.source', 'token source must be synthetic_fixture_only'));
    }
  }

  if (!Array.isArray(input['launchEvents']) || input['launchEvents'].length < 8) {
    issues.push(issue('INVALID_LAUNCH_EVENTS', 'launchEvents', 'launchEvents must contain at least 8 events'));
  } else {
    const eventOrders = input['launchEvents']
      .map(event => (isRecord(event) ? Number(event['eventOrder']) : Number.NaN))
      .filter(Number.isFinite);
    const sortedOrders = [...eventOrders].sort((left, right) => left - right);
    if (eventOrders.length !== sortedOrders.length || eventOrders.some((value, index) => value !== sortedOrders[index])) {
      issues.push(issue('INVALID_EVENT_ORDER', 'launchEvents.eventOrder', 'launch event order must be stable and ascending'));
    }
  }

  if (!Array.isArray(input['poolLiquiditySnapshots']) || input['poolLiquiditySnapshots'].length === 0) {
    issues.push(issue('INVALID_POOL_SNAPSHOTS', 'poolLiquiditySnapshots', 'poolLiquiditySnapshots must contain entries'));
  }

  if (!isRecord(input['creatorProfile'])) {
    issues.push(issue('INVALID_CREATOR_PROFILE', 'creatorProfile', 'creatorProfile must be object'));
  }

  if (!Array.isArray(input['holderDistributionSnapshots']) || input['holderDistributionSnapshots'].length === 0) {
    issues.push(issue('INVALID_HOLDER_SNAPSHOTS', 'holderDistributionSnapshots', 'holderDistributionSnapshots must contain entries'));
  }

  if (!Array.isArray(input['walletClusterIndicators'])) {
    issues.push(issue('INVALID_CLUSTER_INDICATORS', 'walletClusterIndicators', 'walletClusterIndicators must be array'));
  }

  if (!Array.isArray(input['riskFactorSummaries']) || input['riskFactorSummaries'].length < 6) {
    issues.push(issue('INVALID_RISK_FACTORS', 'riskFactorSummaries', 'riskFactorSummaries must contain entries'));
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
    if (!isValidSyntheticLaunchIntelligenceGeneratedAt(input['meta']['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant'));
    }
    if (!isValidSyntheticLaunchIntelligenceSource(input['meta']['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant'));
    }
  }

  if (!isRecord(input['safety']) || input['safety']['nonAdvisory'] !== true) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be object with nonAdvisory true'));
  }

  if (isValidSyntheticLaunchIntelligenceScenarioName(input['fixtureName'])) {
    const expectedSet = new Set(SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES);
    if (!expectedSet.has(input['fixtureName'])) {
      issues.push(issue('INVALID_SCENARIO_NAME', 'fixtureName', 'fixtureName must be from stable scenarios'));
    }
  }

  const safetyCheck = validateSyntheticLaunchIntelligenceSafety(input);
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
