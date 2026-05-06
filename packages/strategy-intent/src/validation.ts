/**
 * packages/strategy-intent/src/validation.ts
 *
 * Phase 15 — StrategyIntent validation.
 *
 * Checks all safety invariants on StrategyIntent outputs.
 * Returns typed SiResult — does not throw for normal validation failures.
 */

import { siOk, siErr } from './errors.js';
import type { SiResult } from './errors.js';
import type { StrategyIntent, StrategyIntentCapabilities } from './types.js';

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

// ─── Text validator ───────────────────────────────────────────────────────────

function checkText(text: string, fieldName: string): SiResult<string> {
  if (containsUnsafeActionText(text))
    return siErr('UNSAFE_ACTION_TEXT_DETECTED', `${fieldName} contains unsafe action text`);
  if (containsSecretPattern(text))
    return siErr('SECRET_PATTERN_DETECTED', `${fieldName} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return siErr('URL_PATTERN_DETECTED', `${fieldName} contains URL/RPC-like pattern`);
  return siOk(text);
}

// ─── Validators ───────────────────────────────────────────────────────────────

/**
 * Validates all safety invariants on a StrategyIntent.
 * Returns siOk(intent) if valid, siErr(...) if any invariant is violated.
 */
export function validateStrategyIntent(intent: StrategyIntent): SiResult<StrategyIntent> {
  // Core safety flags
  if (intent.fixtureOnly !== true)
    return siErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (intent.liveData !== false)
    return siErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');
  if (intent.safeToDisplay !== true)
    return siErr('SAFE_TO_DISPLAY_REQUIRED', 'safeToDisplay must be true');
  if (intent.analysisOnly !== true)
    return siErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (intent.nonExecutable !== true)
    return siErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');

  // Check rationale text fields
  const rationaleFields: [string, string][] = [
    [intent.rationale.summary, 'rationale.summary'],
    ...intent.rationale.evidenceNotes.map((n, i) => [n, `rationale.evidenceNotes[${i}]`] as [string, string]),
    ...intent.rationale.safetyNotes.map((n, i) => [n, `rationale.safetyNotes[${i}]`] as [string, string]),
    ...intent.rationale.limitationNotes.map((n, i) => [n, `rationale.limitationNotes[${i}]`] as [string, string]),
    ...intent.rationale.reviewNotes.map((n, i) => [n, `rationale.reviewNotes[${i}]`] as [string, string]),
  ];

  for (const [text, fieldName] of rationaleFields) {
    const check = checkText(text, fieldName);
    if (!check.ok) return siErr(check.code, check.message);
  }

  // Check finding messages
  for (let i = 0; i < intent.findings.length; i++) {
    const finding = intent.findings[i];
    if (!finding) continue;
    const check = checkText(finding.message, `findings[${i}].message`);
    if (!check.ok) return siErr(check.code, check.message);
    if (finding.safeToDisplay !== true)
      return siErr('SAFE_TO_DISPLAY_REQUIRED', `findings[${i}].safeToDisplay must be true`);
  }

  // Check safety gate reasons
  for (let i = 0; i < intent.safetyGates.length; i++) {
    const gate = intent.safetyGates[i];
    if (!gate) continue;
    const check = checkText(gate.reason, `safetyGates[${i}].reason`);
    if (!check.ok) return siErr(check.code, check.message);
    if (gate.analysisOnly !== true)
      return siErr('ANALYSIS_ONLY_REQUIRED', `safetyGates[${i}].analysisOnly must be true`);
    if (gate.nonExecutable !== true)
      return siErr('NON_EXECUTABLE_REQUIRED', `safetyGates[${i}].nonExecutable must be true`);
    if (gate.safeToDisplay !== true)
      return siErr('SAFE_TO_DISPLAY_REQUIRED', `safetyGates[${i}].safeToDisplay must be true`);
  }

  // Check rationale flags
  if (intent.rationale.safeToDisplay !== true)
    return siErr('SAFE_TO_DISPLAY_REQUIRED', 'rationale.safeToDisplay must be true');
  if (intent.rationale.analysisOnly !== true)
    return siErr('ANALYSIS_ONLY_REQUIRED', 'rationale.analysisOnly must be true');
  if (intent.rationale.nonExecutable !== true)
    return siErr('NON_EXECUTABLE_REQUIRED', 'rationale.nonExecutable must be true');

  return siOk(intent);
}

/**
 * Validates StrategyIntentCapabilities — all unsafe flags must be false.
 */
export function validateStrategyIntentCapabilities(
  caps: StrategyIntentCapabilities,
): SiResult<StrategyIntentCapabilities> {
  if (caps.canUseLiveData !== false)
    return siErr('LIVE_DATA_FORBIDDEN', 'canUseLiveData must be false');
  if (caps.canUseSolanaRpc !== false)
    return siErr('LIVE_DATA_FORBIDDEN', 'canUseSolanaRpc must be false');
  if (caps.canUseProviderApis !== false)
    return siErr('LIVE_DATA_FORBIDDEN', 'canUseProviderApis must be false');
  if (caps.canAccessPrivateKeys !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canAccessPrivateKeys must be false');
  if (caps.canCreateTradeIntents !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canCreateTradeIntents must be false');
  if (caps.canCreateExecutionPlans !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canCreateExecutionPlans must be false');
  if (caps.canPaperTrade !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canPaperTrade must be false');
  if (caps.canTrade !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canTrade must be false');
  if (caps.canExecute !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canExecute must be false');
  if (caps.canWriteToDatabase !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canWriteToDatabase must be false');
  if (caps.canSendTelegramAlerts !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canSendTelegramAlerts must be false');
  if (caps.canConstructTransactions !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canConstructTransactions must be false');
  if (caps.canSimulateTransactions !== false)
    return siErr('UNSAFE_CONTENT_DETECTED', 'canSimulateTransactions must be false');
  if (caps.fixtureOnly !== true)
    return siErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (caps.analysisOnly !== true)
    return siErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (caps.nonExecutable !== true)
    return siErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  return siOk(caps);
}
