/**
 * apps/read-only-api/src/safety.ts
 *
 * Phase 20 — Local Read-Only API safety validation.
 *
 * Validates app config, response, and capability safety invariants.
 * Returns typed LroApiResult — does not throw for normal validation failures.
 *
 * Rejects:
 *   - unsafe safety flags (safeToDisplay=false, fixtureOnly=false, etc.)
 *   - unsafe capability flags set to true
 *   - unsafe action text
 *   - secret-like strings
 *   - URL/RPC-like strings
 *   - external bind hosts
 */

import { lroApiOk, lroApiErr } from './errors.js';
import type { LroApiResult } from './errors.js';
import type {
  LocalReadOnlyApiCapabilities,
  LocalReadOnlyApiConfig,
  LroApiSafetyMeta,
} from './types.js';

// ─── Forbidden patterns ───────────────────────────────────────────────────────

const FORBIDDEN_ACTION_PATTERNS: readonly string[] = [
  'buy',
  'sell',
  'enter',
  'exit trade',
  'execute',
  'snipe',
  'copy trade',
  'mirror trade',
  'auto trade',
  'live candidate',
  'limited live',
  'full auto',
  'send transaction',
  'sign transaction',
  'auto_candidate',
  'live_candidate',
  'place order',
  'open position',
];

const FORBIDDEN_SECRET_PATTERNS: readonly string[] = [
  'private_key',
  'privatekey',
  'secret_key',
  'secretkey',
  'seed phrase',
  'seed_phrase',
  'mnemonic',
  'api_key',
  'apikey',
  'password',
];

const FORBIDDEN_URL_PATTERNS: readonly string[] = [
  'wss://',
  'ws://',
  'https://api.',
  'https://rpc.',
  'mainnet-beta.solana.com',
  'helius.dev',
  'helius.xyz',
  'yellowstone',
  'geyser',
];

const FORBIDDEN_EXTERNAL_HOSTS: readonly string[] = ['0.0.0.0', '::', '::0', 'localhost'];

// ─── Text helpers ─────────────────────────────────────────────────────────────

export function containsUnsafeActionText(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_ACTION_PATTERNS.some(p => lower.includes(p.toLowerCase()));
}

export function containsSecretPattern(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_SECRET_PATTERNS.some(p => lower.includes(p.toLowerCase()));
}

export function containsUrlPattern(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_URL_PATTERNS.some(p => lower.includes(p.toLowerCase()));
}

export function isDisplaySafe(text: string): boolean {
  return (
    !containsUnsafeActionText(text) &&
    !containsSecretPattern(text) &&
    !containsUrlPattern(text)
  );
}

// ─── Capability validator ─────────────────────────────────────────────────────

type AnyCapabilities = Record<string, unknown>;

/**
 * Validates LocalReadOnlyApiCapabilities — all unsafe flags must be false.
 */
export function validateLocalReadOnlyApiCapabilities(
  caps: LocalReadOnlyApiCapabilities,
): LroApiResult<LocalReadOnlyApiCapabilities> {
  const unsafeFlags: Array<keyof LocalReadOnlyApiCapabilities> = [
    'canUseLiveData',
    'canUseSolanaRpc',
    'canUseProviderApis',
    'canAccessPrivateKeys',
    'canCreateTradeIntents',
    'canCreateExecutionPlans',
    'canPaperTrade',
    'canTrade',
    'canExecute',
    'canWriteToDatabase',
    'canSendTelegramAlerts',
    'canConstructTransactions',
    'canSimulateTransactions',
    'canCreateOrders',
    'canCreatePositions',
    'canCalculateLivePnl',
    'canMutatePriorEvidence',
    'canRenderUi',
    'canUseExternalNetwork',
  ];

  for (const flag of unsafeFlags) {
    if ((caps as unknown as AnyCapabilities)[flag] !== false) {
      return lroApiErr('UNSAFE_CAPABILITY_DETECTED', `${flag} must be false`);
    }
  }

  if (caps.canStartLocalhostServer !== true)
    return lroApiErr('INVALID_LRO_API_INPUT', 'canStartLocalhostServer must be true');
  if (caps.canServeReadOnlyContracts !== true)
    return lroApiErr('INVALID_LRO_API_INPUT', 'canServeReadOnlyContracts must be true');
  if (caps.canServeFixtureReadModels !== true)
    return lroApiErr('INVALID_LRO_API_INPUT', 'canServeFixtureReadModels must be true');
  if (caps.fixtureOnly !== true)
    return lroApiErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (caps.analysisOnly !== true)
    return lroApiErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (caps.nonExecutable !== true)
    return lroApiErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  if (caps.readOnly !== true)
    return lroApiErr('READ_ONLY_REQUIRED', 'readOnly must be true');
  if (caps.localOnly !== true)
    return lroApiErr('LOCAL_ONLY_REQUIRED', 'localOnly must be true');

  return lroApiOk(caps);
}

// ─── Config validator ─────────────────────────────────────────────────────────

/**
 * Validates a LocalReadOnlyApiConfig safety invariants.
 */
export function validateLocalReadOnlyApiConfig(
  config: LocalReadOnlyApiConfig,
): LroApiResult<LocalReadOnlyApiConfig> {
  if (FORBIDDEN_EXTERNAL_HOSTS.includes(config.host)) {
    return lroApiErr('EXTERNAL_BIND_FORBIDDEN', `Host '${config.host}' is forbidden.`);
  }
  if (config.host !== '127.0.0.1') {
    return lroApiErr(
      'EXTERNAL_BIND_FORBIDDEN',
      `Host '${config.host}' is not allowed. Only 127.0.0.1 is allowed.`,
    );
  }
  if (config.port < 1024 || config.port > 65535) {
    return lroApiErr('UNSAFE_PORT_REJECTED', `Port ${config.port} is not in allowed range.`);
  }
  if (config.fixtureOnly !== true)
    return lroApiErr('FIXTURE_ONLY_REQUIRED', 'config.fixtureOnly must be true');
  if (config.readOnly !== true)
    return lroApiErr('READ_ONLY_REQUIRED', 'config.readOnly must be true');
  if (config.localOnly !== true)
    return lroApiErr('LOCAL_ONLY_REQUIRED', 'config.localOnly must be true');

  return lroApiOk(config);
}

// ─── Safety meta validator ────────────────────────────────────────────────────

/**
 * Validates LroApiSafetyMeta — all safety fields must be set correctly.
 */
export function validateLroApiSafetyMeta(
  meta: LroApiSafetyMeta,
): LroApiResult<LroApiSafetyMeta> {
  if (meta.fixtureOnly !== true)
    return lroApiErr('FIXTURE_ONLY_REQUIRED', 'meta.fixtureOnly must be true');
  if (meta.liveData !== false)
    return lroApiErr('LIVE_DATA_FORBIDDEN', 'meta.liveData must be false');
  if (meta.safeToDisplay !== true)
    return lroApiErr('SAFE_TO_DISPLAY_REQUIRED', 'meta.safeToDisplay must be true');
  if (meta.analysisOnly !== true)
    return lroApiErr('ANALYSIS_ONLY_REQUIRED', 'meta.analysisOnly must be true');
  if (meta.nonExecutable !== true)
    return lroApiErr('NON_EXECUTABLE_REQUIRED', 'meta.nonExecutable must be true');
  if (meta.readOnly !== true)
    return lroApiErr('READ_ONLY_REQUIRED', 'meta.readOnly must be true');
  if (meta.localOnly !== true)
    return lroApiErr('LOCAL_ONLY_REQUIRED', 'meta.localOnly must be true');

  return lroApiOk(meta);
}

// ─── Generic safety validator ─────────────────────────────────────────────────

/**
 * Validates app config/response/capabilities safety invariants.
 * Accepts LocalReadOnlyApiConfig | LocalReadOnlyApiCapabilities | LroApiSafetyMeta.
 */
export function validateLocalReadOnlyApiSafety(
  value: LocalReadOnlyApiConfig | LocalReadOnlyApiCapabilities | LroApiSafetyMeta,
): LroApiResult<
  LocalReadOnlyApiConfig | LocalReadOnlyApiCapabilities | LroApiSafetyMeta
> {
  // Distinguish by shape
  if ('host' in value) {
    return validateLocalReadOnlyApiConfig(value as LocalReadOnlyApiConfig);
  }
  if ('canStartLocalhostServer' in value) {
    return validateLocalReadOnlyApiCapabilities(value as LocalReadOnlyApiCapabilities);
  }
  return validateLroApiSafetyMeta(value as LroApiSafetyMeta);
}
