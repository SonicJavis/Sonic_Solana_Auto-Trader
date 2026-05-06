/**
 * packages/dashboard-read-models/src/validation.ts
 *
 * Phase 18 — DashboardReadModel validation helpers and invariant validators.
 *
 * Returns typed DrmResult — does not throw for normal validation failures.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardReadModelFinding,
  DashboardReadModelBundle,
  DashboardReadModelCapabilities,
  DashboardReadModelInput,
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

function checkText(text: string, fieldName: string): DrmResult<string> {
  if (containsUnsafeActionText(text))
    return drmErr('UNSAFE_ACTION_TEXT_DETECTED', `${fieldName} contains unsafe action text`);
  if (containsSecretPattern(text))
    return drmErr('SECRET_PATTERN_DETECTED', `${fieldName} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return drmErr('URL_PATTERN_DETECTED', `${fieldName} contains URL/RPC-like pattern`);
  return drmOk(text);
}

// ─── Finding validator ────────────────────────────────────────────────────────

export function validateDashboardReadModelFinding(
  finding: DashboardReadModelFinding,
): DrmResult<DashboardReadModelFinding> {
  if (finding.fixtureOnly !== true)
    return drmErr('FIXTURE_ONLY_REQUIRED', 'finding.fixtureOnly must be true');
  if (finding.liveData !== false)
    return drmErr('LIVE_DATA_FORBIDDEN', 'finding.liveData must be false');
  if (finding.safeToDisplay !== true)
    return drmErr('SAFE_TO_DISPLAY_REQUIRED', 'finding.safeToDisplay must be true');
  if (finding.analysisOnly !== true)
    return drmErr('ANALYSIS_ONLY_REQUIRED', 'finding.analysisOnly must be true');
  if (finding.nonExecutable !== true)
    return drmErr('NON_EXECUTABLE_REQUIRED', 'finding.nonExecutable must be true');
  if (finding.readOnly !== true)
    return drmErr('READ_ONLY_REQUIRED', 'finding.readOnly must be true');

  const titleCheck = checkText(finding.title, 'finding.title');
  if (!titleCheck.ok) return drmErr(titleCheck.code, titleCheck.message);

  const descCheck = checkText(finding.description, 'finding.description');
  if (!descCheck.ok) return drmErr(descCheck.code, descCheck.message);

  return drmOk(finding);
}

// ─── Input validator ──────────────────────────────────────────────────────────

export function validateDashboardReadModelInput(
  input: DashboardReadModelInput,
): DrmResult<DashboardReadModelInput> {
  if (input.fixtureOnly !== true)
    return drmErr('FIXTURE_ONLY_REQUIRED', 'input.fixtureOnly must be true');
  if (input.liveData !== false)
    return drmErr('LIVE_DATA_FORBIDDEN', 'input.liveData must be false');

  if (input.findings) {
    for (let i = 0; i < input.findings.length; i++) {
      const f = input.findings[i];
      if (!f) continue;
      const check = validateDashboardReadModelFinding(f);
      if (!check.ok) return drmErr(check.code, `findings[${i}]: ${check.message}`);
    }
  }

  return drmOk(input);
}

// ─── Bundle validator ─────────────────────────────────────────────────────────

/**
 * Validates all safety invariants on a DashboardReadModelBundle.
 * Returns drmOk(bundle) if valid, drmErr(...) if any invariant is violated.
 */
export function validateDashboardReadModelBundle(
  bundle: DashboardReadModelBundle,
): DrmResult<DashboardReadModelBundle> {
  if (bundle.fixtureOnly !== true)
    return drmErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (bundle.liveData !== false)
    return drmErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');
  if (bundle.safeToDisplay !== true)
    return drmErr('SAFE_TO_DISPLAY_REQUIRED', 'safeToDisplay must be true');
  if (bundle.analysisOnly !== true)
    return drmErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (bundle.nonExecutable !== true)
    return drmErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  if (bundle.readOnly !== true)
    return drmErr('READ_ONLY_REQUIRED', 'readOnly must be true');

  // Validate capabilities via safety panel
  const caps = bundle.safetyPanel.capabilities;
  const capsCheck = validateDashboardReadModelCapabilities(caps);
  if (!capsCheck.ok) return drmErr(capsCheck.code, `safetyPanel.capabilities: ${capsCheck.message}`);

  if (!bundle.safetyPanel.safetyInvariantsSatisfied)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'safetyPanel.safetyInvariantsSatisfied must be true');

  // Validate all panels have correct safety flags
  const panels = [
    { name: 'overview', obj: bundle.overview },
    { name: 'replayPanel', obj: bundle.replayPanel },
    { name: 'strategyPanel', obj: bundle.strategyPanel },
    { name: 'evaluationPanel', obj: bundle.evaluationPanel },
    { name: 'evidencePanel', obj: bundle.evidencePanel },
    { name: 'safetyPanel', obj: bundle.safetyPanel },
  ] as const;

  for (const { name, obj } of panels) {
    if (obj.fixtureOnly !== true)
      return drmErr('FIXTURE_ONLY_REQUIRED', `${name}.fixtureOnly must be true`);
    if (obj.liveData !== false)
      return drmErr('LIVE_DATA_FORBIDDEN', `${name}.liveData must be false`);
    if (obj.safeToDisplay !== true)
      return drmErr('SAFE_TO_DISPLAY_REQUIRED', `${name}.safeToDisplay must be true`);
    if (obj.analysisOnly !== true)
      return drmErr('ANALYSIS_ONLY_REQUIRED', `${name}.analysisOnly must be true`);
    if (obj.nonExecutable !== true)
      return drmErr('NON_EXECUTABLE_REQUIRED', `${name}.nonExecutable must be true`);
    if (obj.readOnly !== true)
      return drmErr('READ_ONLY_REQUIRED', `${name}.readOnly must be true`);
  }

  // Validate all findings in each panel
  const panelFindings: Array<{ name: string; findings: readonly DashboardReadModelFinding[] }> = [
    { name: 'replayPanel', findings: bundle.replayPanel.findings },
    { name: 'strategyPanel', findings: bundle.strategyPanel.findings },
    { name: 'evaluationPanel', findings: bundle.evaluationPanel.findings },
    { name: 'evidencePanel', findings: bundle.evidencePanel.findings },
  ];

  for (const { name, findings } of panelFindings) {
    for (let i = 0; i < findings.length; i++) {
      const f = findings[i];
      if (!f) continue;
      const check = validateDashboardReadModelFinding(f);
      if (!check.ok)
        return drmErr(check.code, `${name}.findings[${i}]: ${check.message}`);
    }
  }

  return drmOk(bundle);
}

// ─── Capabilities validator ───────────────────────────────────────────────────

/**
 * Validates DashboardReadModelCapabilities — all unsafe flags must be false.
 */
export function validateDashboardReadModelCapabilities(
  caps: DashboardReadModelCapabilities,
): DrmResult<DashboardReadModelCapabilities> {
  if (caps.canUseLiveData !== false)
    return drmErr('LIVE_DATA_FORBIDDEN', 'canUseLiveData must be false');
  if (caps.canUseSolanaRpc !== false)
    return drmErr('LIVE_DATA_FORBIDDEN', 'canUseSolanaRpc must be false');
  if (caps.canUseProviderApis !== false)
    return drmErr('LIVE_DATA_FORBIDDEN', 'canUseProviderApis must be false');
  if (caps.canAccessPrivateKeys !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canAccessPrivateKeys must be false');
  if (caps.canCreateTradeIntents !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canCreateTradeIntents must be false');
  if (caps.canCreateExecutionPlans !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canCreateExecutionPlans must be false');
  if (caps.canPaperTrade !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canPaperTrade must be false');
  if (caps.canTrade !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canTrade must be false');
  if (caps.canExecute !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canExecute must be false');
  if (caps.canWriteToDatabase !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canWriteToDatabase must be false');
  if (caps.canSendTelegramAlerts !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canSendTelegramAlerts must be false');
  if (caps.canConstructTransactions !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canConstructTransactions must be false');
  if (caps.canSimulateTransactions !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canSimulateTransactions must be false');
  if (caps.canCreateOrders !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canCreateOrders must be false');
  if (caps.canCreatePositions !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canCreatePositions must be false');
  if (caps.canCalculateLivePnl !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canCalculateLivePnl must be false');
  if (caps.canMutatePriorEvidence !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canMutatePriorEvidence must be false');
  if (caps.canRenderUi !== false)
    return drmErr('UNSAFE_CAPABILITY_DETECTED', 'canRenderUi must be false');
  if (caps.fixtureOnly !== true)
    return drmErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');
  if (caps.analysisOnly !== true)
    return drmErr('ANALYSIS_ONLY_REQUIRED', 'analysisOnly must be true');
  if (caps.nonExecutable !== true)
    return drmErr('NON_EXECUTABLE_REQUIRED', 'nonExecutable must be true');
  if (caps.readOnly !== true)
    return drmErr('READ_ONLY_REQUIRED', 'readOnly must be true');
  return drmOk(caps);
}
