/**
 * packages/replay-reporting/src/validation.ts
 *
 * Validation helpers for replay-reporting.
 *
 * Checks:
 *   - safeToDisplay=true
 *   - fixtureOnly=true where applicable
 *   - liveData=false where applicable
 *   - no unsafe action text (buy, sell, execute, etc.)
 *   - no secret-like patterns (privateKey, seedPhrase, apiKey, etc.)
 *   - no URL/RPC-like strings in unsafe positions
 *   - all unsafe capability flags are false
 */

import { rrOk, rrErr } from './errors.js';
import type { RrResult } from './errors.js';
import type { ReplayReportingCapabilities } from './types.js';

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Validators ───────────────────────────────────────────────────────────────

export function validateSafeText(text: string, fieldName: string): RrResult<string> {
  if (containsUnsafeActionText(text))
    return rrErr('UNSAFE_ACTION_TEXT_DETECTED', `${fieldName} contains unsafe action text`);
  if (containsSecretPattern(text))
    return rrErr('SECRET_PATTERN_DETECTED', `${fieldName} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return rrErr('URL_PATTERN_DETECTED', `${fieldName} contains URL/RPC-like pattern`);
  return rrOk(text);
}

export function validateCapabilities(
  caps: ReplayReportingCapabilities,
): RrResult<ReplayReportingCapabilities> {
  if (caps.canUseLiveData !== false)
    return rrErr('LIVE_DATA_FORBIDDEN', 'canUseLiveData must be false');
  if (caps.canUseSolanaRpc !== false)
    return rrErr('LIVE_DATA_FORBIDDEN', 'canUseSolanaRpc must be false');
  if (caps.canUseProviderApis !== false)
    return rrErr('LIVE_DATA_FORBIDDEN', 'canUseProviderApis must be false');
  if (caps.canAccessPrivateKeys !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canAccessPrivateKeys must be false');
  if (caps.canCreateTradeIntents !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canCreateTradeIntents must be false');
  if (caps.canCreateExecutionPlans !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canCreateExecutionPlans must be false');
  if (caps.canPaperTrade !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canPaperTrade must be false');
  if (caps.canTrade !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canTrade must be false');
  if (caps.canExecute !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canExecute must be false');
  if (caps.canWriteToDatabase !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canWriteToDatabase must be false');
  if (caps.canSendTelegramAlerts !== false)
    return rrErr('UNSAFE_CONTENT_DETECTED', 'canSendTelegramAlerts must be false');
  if (caps.fixtureOnly !== true)
    return rrErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  return rrOk(caps);
}

export function validateJsonSafe(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  path: string = 'root',
): RrResult<void> {
  if (value === undefined)
    return rrErr('EXPORT_UNSAFE', `${path} contains undefined (not JSON-safe)`);
  if (typeof value === 'function')
    return rrErr('EXPORT_UNSAFE', `${path} contains function (not JSON-safe)`);
  if (value instanceof Error)
    return rrErr('EXPORT_UNSAFE', `${path} contains Error object (not JSON-safe)`);
  if (typeof value === 'string') {
    const textCheck = validateSafeText(value, path);
    if (!textCheck.ok) return rrErr(textCheck.code, textCheck.message);
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const result = validateJsonSafe(value[i], `${path}[${i}]`);
      if (!result.ok) return result;
    }
  } else if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const result = validateJsonSafe(v, `${path}.${k}`);
      if (!result.ok) return result;
    }
  }
  return rrOk(undefined);
}
