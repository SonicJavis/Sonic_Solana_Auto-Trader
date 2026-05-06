/**
 * packages/strategy-evaluation/src/validation.ts
 *
 * Phase 16 — StrategyEvaluation validation.
 *
 * Checks all safety invariants on StrategyEvaluation outputs.
 * Returns typed SeResult — does not throw for normal validation failures.
 */

import { seOk, seErr } from './errors.js';
import type { SeResult } from './errors.js';
import type { StrategyEvaluation, StrategyEvaluationCapabilities } from './types.js';

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

function checkText(text: string, fieldName: string): SeResult<string> {
  if (containsUnsafeActionText(text))
    return seErr('UNSAFE_ACTION_TEXT_DETECTED', `${fieldName} contains unsafe action text`);
  if (containsSecretPattern(text))
    return seErr('SECRET_PATTERN_DETECTED', `${fieldName} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return seErr('URL_PATTERN_DETECTED', `${fieldName} contains URL/RPC-like pattern`);
  return seOk(text);
}

// ─── Validators ───────────────────────────────────────────────────────────────

/**
 * Validates all safety invariants on a StrategyEvaluation.
 * Returns seOk(evaluation) if valid, seErr(...) if any invariant is violated.
 */
export function validateStrategyEvaluation(evaluation: StrategyEvaluation): SeResult<StrategyEvaluation> {
  // Core safety flags
  if (evaluation.fixtureOnly !== true)
    return seErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (evaluation.liveData !== false)
    return seErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');
  if (evaluation.safeToDisplay !== true)
    return seErr('SAFE_TO_DISPLAY_REQUIRED', 'safeToDisplay must be true');
  if (evaluation.analysisOnly !== true)
    return seErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (evaluation.nonExecutable !== true)
    return seErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');

  // Check score band summary text
  const sbCheck = checkText(evaluation.scoreBandSummary.summaryText, 'scoreBandSummary.summaryText');
  if (!sbCheck.ok) return seErr(sbCheck.code, sbCheck.message);

  // Check evidence distribution summary text
  const edCheck = checkText(evaluation.evidenceDistribution.summaryText, 'evidenceDistribution.summaryText');
  if (!edCheck.ok) return seErr(edCheck.code, edCheck.message);

  // Check safety gate summary text
  const sgCheck = checkText(evaluation.safetyGateSummary.summaryText, 'safetyGateSummary.summaryText');
  if (!sgCheck.ok) return seErr(sgCheck.code, sgCheck.message);

  // Check family comparison summary texts
  for (let i = 0; i < evaluation.familyComparisons.length; i++) {
    const fc = evaluation.familyComparisons[i];
    if (!fc) continue;
    const fcCheck = checkText(fc.summaryText, `familyComparisons[${i}].summaryText`);
    if (!fcCheck.ok) return seErr(fcCheck.code, fcCheck.message);
  }

  // Check finding messages
  for (let i = 0; i < evaluation.findings.length; i++) {
    const finding = evaluation.findings[i];
    if (!finding) continue;
    const check = checkText(finding.message, `findings[${i}].message`);
    if (!check.ok) return seErr(check.code, check.message);
    if (finding.safeToDisplay !== true)
      return seErr('SAFE_TO_DISPLAY_REQUIRED', `findings[${i}].safeToDisplay must be true`);
  }

  return seOk(evaluation);
}

/**
 * Validates StrategyEvaluationCapabilities — all unsafe flags must be false.
 */
export function validateStrategyEvaluationCapabilities(
  caps: StrategyEvaluationCapabilities,
): SeResult<StrategyEvaluationCapabilities> {
  if (caps.canUseLiveData !== false)
    return seErr('LIVE_DATA_FORBIDDEN', 'canUseLiveData must be false');
  if (caps.canUseSolanaRpc !== false)
    return seErr('LIVE_DATA_FORBIDDEN', 'canUseSolanaRpc must be false');
  if (caps.canUseProviderApis !== false)
    return seErr('LIVE_DATA_FORBIDDEN', 'canUseProviderApis must be false');
  if (caps.canAccessPrivateKeys !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canAccessPrivateKeys must be false');
  if (caps.canCreateTradeIntents !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canCreateTradeIntents must be false');
  if (caps.canCreateExecutionPlans !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canCreateExecutionPlans must be false');
  if (caps.canPaperTrade !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canPaperTrade must be false');
  if (caps.canTrade !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canTrade must be false');
  if (caps.canExecute !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canExecute must be false');
  if (caps.canWriteToDatabase !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canWriteToDatabase must be false');
  if (caps.canSendTelegramAlerts !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canSendTelegramAlerts must be false');
  if (caps.canConstructTransactions !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canConstructTransactions must be false');
  if (caps.canSimulateTransactions !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canSimulateTransactions must be false');
  if (caps.canCreateOrders !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canCreateOrders must be false');
  if (caps.canCreatePositions !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canCreatePositions must be false');
  if (caps.canCalculateLivePnl !== false)
    return seErr('UNSAFE_CONTENT_DETECTED', 'canCalculateLivePnl must be false');
  if (caps.fixtureOnly !== true)
    return seErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (caps.analysisOnly !== true)
    return seErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (caps.nonExecutable !== true)
    return seErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  return seOk(caps);
}
