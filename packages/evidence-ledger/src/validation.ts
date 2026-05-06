/**
 * packages/evidence-ledger/src/validation.ts
 *
 * Phase 17 — EvidenceLedger validation helpers and invariant validators.
 *
 * Returns typed ElResult — does not throw for normal validation failures.
 */

import { elOk, elErr } from './errors.js';
import type { ElResult } from './errors.js';
import type {
  EvidenceEntry,
  EvidenceLedger,
  EvidenceLedgerCapabilities,
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

// ─── Field text validator ─────────────────────────────────────────────────────

function checkText(text: string, fieldName: string): ElResult<string> {
  if (containsUnsafeActionText(text))
    return elErr('UNSAFE_ACTION_TEXT_DETECTED', `${fieldName} contains unsafe action text`);
  if (containsSecretPattern(text))
    return elErr('SECRET_PATTERN_DETECTED', `${fieldName} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return elErr('URL_PATTERN_DETECTED', `${fieldName} contains URL/RPC-like pattern`);
  return elOk(text);
}

// ─── Entry validator ──────────────────────────────────────────────────────────

export function validateEvidenceEntry(entry: EvidenceEntry): ElResult<EvidenceEntry> {
  if (entry.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'entry.fixtureOnly must be true');
  if (entry.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'entry.liveData must be false');
  if (entry.safeToDisplay !== true)
    return elErr('SAFE_TO_DISPLAY_REQUIRED', 'entry.safeToDisplay must be true');
  if (entry.analysisOnly !== true)
    return elErr('ANALYSIS_ONLY_REQUIRED', 'entry.analysisOnly must be true');
  if (entry.nonExecutable !== true)
    return elErr('NON_EXECUTABLE_REQUIRED', 'entry.nonExecutable must be true');
  if (entry.appendOnly !== true)
    return elErr('APPEND_ONLY_REQUIRED', 'entry.appendOnly must be true');

  const titleCheck = checkText(entry.title, 'entry.title');
  if (!titleCheck.ok) return elErr(titleCheck.code, titleCheck.message);

  const summaryCheck = checkText(entry.summary, 'entry.summary');
  if (!summaryCheck.ok) return elErr(summaryCheck.code, summaryCheck.message);

  for (let i = 0; i < entry.reasons.length; i++) {
    const reason = entry.reasons[i];
    if (!reason) continue;
    const reasonCheck = checkText(reason, `entry.reasons[${i}]`);
    if (!reasonCheck.ok) return elErr(reasonCheck.code, reasonCheck.message);
  }

  // Validate source reference
  if (entry.sourceRef.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'entry.sourceRef.fixtureOnly must be true');
  if (entry.sourceRef.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'entry.sourceRef.liveData must be false');

  const labelCheck = checkText(entry.sourceRef.label, 'entry.sourceRef.label');
  if (!labelCheck.ok) return elErr(labelCheck.code, labelCheck.message);

  const descCheck = checkText(entry.sourceRef.description, 'entry.sourceRef.description');
  if (!descCheck.ok) return elErr(descCheck.code, descCheck.message);

  return elOk(entry);
}

// ─── Ledger validator ─────────────────────────────────────────────────────────

/**
 * Validates all safety invariants on an EvidenceLedger.
 * Returns elOk(ledger) if valid, elErr(...) if any invariant is violated.
 */
export function validateEvidenceLedger(ledger: EvidenceLedger): ElResult<EvidenceLedger> {
  if (ledger.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (ledger.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');
  if (ledger.safeToDisplay !== true)
    return elErr('SAFE_TO_DISPLAY_REQUIRED', 'safeToDisplay must be true');
  if (ledger.analysisOnly !== true)
    return elErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (ledger.nonExecutable !== true)
    return elErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  if (ledger.appendOnly !== true)
    return elErr('APPEND_ONLY_REQUIRED', 'appendOnly must be true');

  // Validate all entries
  for (let i = 0; i < ledger.entries.length; i++) {
    const entry = ledger.entries[i];
    if (!entry) continue;
    const check = validateEvidenceEntry(entry);
    if (!check.ok) return elErr(check.code, `entries[${i}]: ${check.message}`);
  }

  // Validate all traces
  for (let i = 0; i < ledger.traces.length; i++) {
    const trace = ledger.traces[i];
    if (!trace) continue;
    if (trace.fixtureOnly !== true)
      return elErr('FIXTURE_ONLY_REQUIRED', `traces[${i}].fixtureOnly must be true`);
    if (trace.liveData !== false)
      return elErr('LIVE_DATA_FORBIDDEN', `traces[${i}].liveData must be false`);
    if (trace.safeToDisplay !== true)
      return elErr('SAFE_TO_DISPLAY_REQUIRED', `traces[${i}].safeToDisplay must be true`);
    if (trace.analysisOnly !== true)
      return elErr('ANALYSIS_ONLY_REQUIRED', `traces[${i}].analysisOnly must be true`);
    if (trace.nonExecutable !== true)
      return elErr('NON_EXECUTABLE_REQUIRED', `traces[${i}].nonExecutable must be true`);
    if (trace.appendOnly !== true)
      return elErr('APPEND_ONLY_REQUIRED', `traces[${i}].appendOnly must be true`);

    const summaryCheck = checkText(trace.summary, `traces[${i}].summary`);
    if (!summaryCheck.ok) return elErr(summaryCheck.code, summaryCheck.message);

    for (let j = 0; j < trace.entries.length; j++) {
      const entry = trace.entries[j];
      if (!entry) continue;
      const check = validateEvidenceEntry(entry);
      if (!check.ok) return elErr(check.code, `traces[${i}].entries[${j}]: ${check.message}`);
    }
  }

  // Validate integrity
  if (!ledger.integrity.valid) {
    return elErr('INTEGRITY_CHECK_FAILED', `Integrity check failed: ${ledger.integrity.summaryText}`);
  }

  return elOk(ledger);
}

// ─── Capabilities validator ───────────────────────────────────────────────────

/**
 * Validates EvidenceLedgerCapabilities — all unsafe flags must be false.
 */
export function validateEvidenceLedgerCapabilities(
  caps: EvidenceLedgerCapabilities,
): ElResult<EvidenceLedgerCapabilities> {
  if (caps.canUseLiveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'canUseLiveData must be false');
  if (caps.canUseSolanaRpc !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'canUseSolanaRpc must be false');
  if (caps.canUseProviderApis !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'canUseProviderApis must be false');
  if (caps.canAccessPrivateKeys !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canAccessPrivateKeys must be false');
  if (caps.canCreateTradeIntents !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canCreateTradeIntents must be false');
  if (caps.canCreateExecutionPlans !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canCreateExecutionPlans must be false');
  if (caps.canPaperTrade !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canPaperTrade must be false');
  if (caps.canTrade !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canTrade must be false');
  if (caps.canExecute !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canExecute must be false');
  if (caps.canWriteToDatabase !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canWriteToDatabase must be false');
  if (caps.canSendTelegramAlerts !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canSendTelegramAlerts must be false');
  if (caps.canConstructTransactions !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canConstructTransactions must be false');
  if (caps.canSimulateTransactions !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canSimulateTransactions must be false');
  if (caps.canCreateOrders !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canCreateOrders must be false');
  if (caps.canCreatePositions !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canCreatePositions must be false');
  if (caps.canCalculateLivePnl !== false)
    return elErr('UNSAFE_CONTENT_DETECTED', 'canCalculateLivePnl must be false');
  if (caps.canMutatePriorEvidence !== false)
    return elErr('MUTATION_CAPABILITY_DETECTED', 'canMutatePriorEvidence must be false');
  if (caps.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (caps.analysisOnly !== true)
    return elErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (caps.nonExecutable !== true)
    return elErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  if (caps.appendOnly !== true)
    return elErr('APPEND_ONLY_REQUIRED', 'appendOnly must be true');
  return elOk(caps);
}
