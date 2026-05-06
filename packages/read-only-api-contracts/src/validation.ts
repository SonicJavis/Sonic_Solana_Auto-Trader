/**
 * packages/read-only-api-contracts/src/validation.ts
 *
 * Phase 19 — ReadOnlyApiContract validation helpers and invariant validators.
 *
 * Returns typed RoacResult — does not throw for normal validation failures.
 */

import { roacOk, roacErr } from './errors.js';
import type { RoacResult } from './errors.js';
import type {
  ReadOnlyApiCapabilities,
  ReadOnlyApiContractBundle,
  ReadOnlyApiHealthContract,
  ReadOnlyDashboardContract,
  ReadOnlyEvidenceContract,
  ReadOnlySafetyContract,
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

const FORBIDDEN_SERVER_PATTERNS: readonly string[] = [
  'http listener',
  'open port',
  'start server',
  'runtime handler',
  'api router',
  'http.createserver',
  'listen(',
  'createserver(',
  'fastify(',
  'hono(',
  'express(',
];

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

export function containsServerPattern(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_SERVER_PATTERNS.some(p => lower.includes(p.toLowerCase()));
}

export function isDisplaySafe(text: string): boolean {
  return (
    !containsUnsafeActionText(text) &&
    !containsSecretPattern(text) &&
    !containsUrlPattern(text) &&
    !containsServerPattern(text)
  );
}

// ─── Field text checker ───────────────────────────────────────────────────────

function checkText(text: string, fieldName: string): RoacResult<string> {
  if (containsUnsafeActionText(text))
    return roacErr('UNSAFE_ACTION_TEXT_DETECTED', `${fieldName} contains unsafe action text`);
  if (containsSecretPattern(text))
    return roacErr('SECRET_PATTERN_DETECTED', `${fieldName} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return roacErr('URL_PATTERN_DETECTED', `${fieldName} contains URL/RPC-like pattern`);
  if (containsServerPattern(text))
    return roacErr(
      'HTTP_SERVER_FORBIDDEN',
      `${fieldName} contains HTTP server/listener/router pattern`,
    );
  return roacOk(text);
}

// ─── Capabilities validator ───────────────────────────────────────────────────

/**
 * Validates ReadOnlyApiCapabilities — all unsafe flags must be false.
 */
export function validateReadOnlyApiCapabilities(
  caps: ReadOnlyApiCapabilities,
): RoacResult<ReadOnlyApiCapabilities> {
  if (caps.canUseLiveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'canUseLiveData must be false');
  if (caps.canUseSolanaRpc !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'canUseSolanaRpc must be false');
  if (caps.canUseProviderApis !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'canUseProviderApis must be false');
  if (caps.canAccessPrivateKeys !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canAccessPrivateKeys must be false');
  if (caps.canCreateTradeIntents !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canCreateTradeIntents must be false');
  if (caps.canCreateExecutionPlans !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canCreateExecutionPlans must be false');
  if (caps.canPaperTrade !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canPaperTrade must be false');
  if (caps.canTrade !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canTrade must be false');
  if (caps.canExecute !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canExecute must be false');
  if (caps.canWriteToDatabase !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canWriteToDatabase must be false');
  if (caps.canSendTelegramAlerts !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canSendTelegramAlerts must be false');
  if (caps.canConstructTransactions !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canConstructTransactions must be false');
  if (caps.canSimulateTransactions !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canSimulateTransactions must be false');
  if (caps.canCreateOrders !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canCreateOrders must be false');
  if (caps.canCreatePositions !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canCreatePositions must be false');
  if (caps.canCalculateLivePnl !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canCalculateLivePnl must be false');
  if (caps.canMutatePriorEvidence !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canMutatePriorEvidence must be false');
  if (caps.canRenderUi !== false)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'canRenderUi must be false');
  if (caps.canStartHttpServer !== false)
    return roacErr('HTTP_SERVER_FORBIDDEN', 'canStartHttpServer must be false');
  if (caps.canOpenNetworkPort !== false)
    return roacErr('NETWORK_PORT_FORBIDDEN', 'canOpenNetworkPort must be false');
  if (caps.canUseApiFramework !== false)
    return roacErr('API_FRAMEWORK_FORBIDDEN', 'canUseApiFramework must be false');
  if (caps.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (caps.analysisOnly !== true)
    return roacErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (caps.nonExecutable !== true)
    return roacErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  if (caps.readOnly !== true)
    return roacErr('READ_ONLY_REQUIRED', 'readOnly must be true');
  if (caps.contractOnly !== true)
    return roacErr('CONTRACT_ONLY_REQUIRED', 'contractOnly must be true');
  return roacOk(caps);
}

// ─── Health contract validator ────────────────────────────────────────────────

export function validateReadOnlyApiHealthContract(
  health: ReadOnlyApiHealthContract,
): RoacResult<ReadOnlyApiHealthContract> {
  if (health.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'health.fixtureOnly must be true');
  if (health.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'health.liveData must be false');
  if (health.safeToDisplay !== true)
    return roacErr('SAFE_TO_DISPLAY_REQUIRED', 'health.safeToDisplay must be true');
  if (health.analysisOnly !== true)
    return roacErr('ANALYSIS_ONLY_REQUIRED', 'health.analysisOnly must be true');
  if (health.nonExecutable !== true)
    return roacErr('NON_EXECUTABLE_REQUIRED', 'health.nonExecutable must be true');
  if (health.readOnly !== true)
    return roacErr('READ_ONLY_REQUIRED', 'health.readOnly must be true');
  if (health.contractOnly !== true)
    return roacErr('CONTRACT_ONLY_REQUIRED', 'health.contractOnly must be true');

  const capsCheck = validateReadOnlyApiCapabilities(health.capabilities);
  if (!capsCheck.ok)
    return roacErr(capsCheck.code, `health.capabilities: ${capsCheck.message}`);

  const msgCheck = checkText(health.message, 'health.message');
  if (!msgCheck.ok) return roacErr(msgCheck.code, msgCheck.message);

  return roacOk(health);
}

// ─── Dashboard contract validator ─────────────────────────────────────────────

export function validateReadOnlyDashboardContract(
  dashboard: ReadOnlyDashboardContract,
): RoacResult<ReadOnlyDashboardContract> {
  if (dashboard.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'dashboard.fixtureOnly must be true');
  if (dashboard.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'dashboard.liveData must be false');
  if (dashboard.safeToDisplay !== true)
    return roacErr('SAFE_TO_DISPLAY_REQUIRED', 'dashboard.safeToDisplay must be true');
  if (dashboard.analysisOnly !== true)
    return roacErr('ANALYSIS_ONLY_REQUIRED', 'dashboard.analysisOnly must be true');
  if (dashboard.nonExecutable !== true)
    return roacErr('NON_EXECUTABLE_REQUIRED', 'dashboard.nonExecutable must be true');
  if (dashboard.readOnly !== true)
    return roacErr('READ_ONLY_REQUIRED', 'dashboard.readOnly must be true');
  if (dashboard.contractOnly !== true)
    return roacErr('CONTRACT_ONLY_REQUIRED', 'dashboard.contractOnly must be true');

  const textCheck = checkText(dashboard.summaryText, 'dashboard.summaryText');
  if (!textCheck.ok) return roacErr(textCheck.code, textCheck.message);

  return roacOk(dashboard);
}

// ─── Evidence contract validator ──────────────────────────────────────────────

export function validateReadOnlyEvidenceContract(
  evidence: ReadOnlyEvidenceContract,
): RoacResult<ReadOnlyEvidenceContract> {
  if (evidence.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'evidence.fixtureOnly must be true');
  if (evidence.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'evidence.liveData must be false');
  if (evidence.safeToDisplay !== true)
    return roacErr('SAFE_TO_DISPLAY_REQUIRED', 'evidence.safeToDisplay must be true');
  if (evidence.analysisOnly !== true)
    return roacErr('ANALYSIS_ONLY_REQUIRED', 'evidence.analysisOnly must be true');
  if (evidence.nonExecutable !== true)
    return roacErr('NON_EXECUTABLE_REQUIRED', 'evidence.nonExecutable must be true');
  if (evidence.readOnly !== true)
    return roacErr('READ_ONLY_REQUIRED', 'evidence.readOnly must be true');
  if (evidence.contractOnly !== true)
    return roacErr('CONTRACT_ONLY_REQUIRED', 'evidence.contractOnly must be true');

  const textCheck = checkText(evidence.summaryText, 'evidence.summaryText');
  if (!textCheck.ok) return roacErr(textCheck.code, textCheck.message);

  return roacOk(evidence);
}

// ─── Safety contract validator ────────────────────────────────────────────────

export function validateReadOnlySafetyContract(
  safety: ReadOnlySafetyContract,
): RoacResult<ReadOnlySafetyContract> {
  if (safety.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'safety.fixtureOnly must be true');
  if (safety.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'safety.liveData must be false');
  if (safety.safeToDisplay !== true)
    return roacErr('SAFE_TO_DISPLAY_REQUIRED', 'safety.safeToDisplay must be true');
  if (safety.analysisOnly !== true)
    return roacErr('ANALYSIS_ONLY_REQUIRED', 'safety.analysisOnly must be true');
  if (safety.nonExecutable !== true)
    return roacErr('NON_EXECUTABLE_REQUIRED', 'safety.nonExecutable must be true');
  if (safety.readOnly !== true)
    return roacErr('READ_ONLY_REQUIRED', 'safety.readOnly must be true');
  if (safety.contractOnly !== true)
    return roacErr('CONTRACT_ONLY_REQUIRED', 'safety.contractOnly must be true');
  if (!safety.safetyInvariantsSatisfied)
    return roacErr('UNSAFE_CAPABILITY_DETECTED', 'safety.safetyInvariantsSatisfied must be true');

  const capsCheck = validateReadOnlyApiCapabilities(safety.capabilities);
  if (!capsCheck.ok)
    return roacErr(capsCheck.code, `safety.capabilities: ${capsCheck.message}`);

  return roacOk(safety);
}

// ─── Bundle validator ─────────────────────────────────────────────────────────

/**
 * Validates all safety invariants on a ReadOnlyApiContractBundle.
 * Returns roacOk(bundle) if valid, roacErr(...) if any invariant is violated.
 */
export function validateReadOnlyApiContractBundle(
  bundle: ReadOnlyApiContractBundle,
): RoacResult<ReadOnlyApiContractBundle> {
  if (bundle.fixtureOnly !== true)
    return roacErr('FIXTURE_ONLY_REQUIRED', 'bundle.fixtureOnly must be true');
  if (bundle.liveData !== false)
    return roacErr('LIVE_DATA_FORBIDDEN', 'bundle.liveData must be false');
  if (bundle.safeToDisplay !== true)
    return roacErr('SAFE_TO_DISPLAY_REQUIRED', 'bundle.safeToDisplay must be true');
  if (bundle.analysisOnly !== true)
    return roacErr('ANALYSIS_ONLY_REQUIRED', 'bundle.analysisOnly must be true');
  if (bundle.nonExecutable !== true)
    return roacErr('NON_EXECUTABLE_REQUIRED', 'bundle.nonExecutable must be true');
  if (bundle.readOnly !== true)
    return roacErr('READ_ONLY_REQUIRED', 'bundle.readOnly must be true');
  if (bundle.contractOnly !== true)
    return roacErr('CONTRACT_ONLY_REQUIRED', 'bundle.contractOnly must be true');

  // Validate each endpoint contract
  for (let i = 0; i < bundle.endpointContracts.length; i++) {
    const ec = bundle.endpointContracts[i];
    if (!ec) continue;
    if (ec.fixtureOnly !== true)
      return roacErr('FIXTURE_ONLY_REQUIRED', `endpointContracts[${i}].fixtureOnly must be true`);
    if (ec.liveData !== false)
      return roacErr('LIVE_DATA_FORBIDDEN', `endpointContracts[${i}].liveData must be false`);
    if (ec.contractOnly !== true)
      return roacErr(
        'CONTRACT_ONLY_REQUIRED',
        `endpointContracts[${i}].contractOnly must be true`,
      );
  }

  // Validate health contract
  const healthCheck = validateReadOnlyApiHealthContract(bundle.healthContract);
  if (!healthCheck.ok)
    return roacErr(healthCheck.code, `healthContract: ${healthCheck.message}`);

  // Validate dashboard contract
  const dashCheck = validateReadOnlyDashboardContract(bundle.dashboardContract);
  if (!dashCheck.ok)
    return roacErr(dashCheck.code, `dashboardContract: ${dashCheck.message}`);

  // Validate evidence contract
  const evidenceCheck = validateReadOnlyEvidenceContract(bundle.evidenceContract);
  if (!evidenceCheck.ok)
    return roacErr(evidenceCheck.code, `evidenceContract: ${evidenceCheck.message}`);

  // Validate safety contract
  const safetyCheck = validateReadOnlySafetyContract(bundle.safetyContract);
  if (!safetyCheck.ok)
    return roacErr(safetyCheck.code, `safetyContract: ${safetyCheck.message}`);

  return roacOk(bundle);
}
