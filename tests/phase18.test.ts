/**
 * Phase 18 — Dashboard Read Models v1 tests.
 *
 * Covers:
 *   A. Package exports
 *   B. Capabilities — all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable/readOnly true
 *   C. getDashboardReadModelCapabilities
 *   D. buildDashboardOverviewModel
 *   E. buildReplayPanelModel
 *   F. buildStrategyPanelModel
 *   G. buildEvaluationPanelModel
 *   H. buildEvidencePanelModel
 *   I. buildSafetyPanelModel
 *   J. buildDashboardReadModelBundle
 *   K. validateDashboardReadModelBundle
 *   L. JSON export — deterministic
 *   M. Markdown export — deterministic + safety footer
 *   N. Safety invariants — liveData/fixtureOnly/safeToDisplay/analysisOnly/nonExecutable/readOnly rejection
 *   O. Validation rejects unsafe action text, private-key strings, seed-phrase strings, API keys, RPC URLs
 *   P. No trade intents, execution plans, paper trades, orders, positions, PnL
 *   Q. No live data, provider APIs, wallet/private key handling
 *   R. No transaction construction/simulation
 *   S. No UI rendering capability
 *   T. Fixtures — deterministic, fixture-only, safeToDisplay, analysisOnly, nonExecutable, readOnly
 *   U. Dependency checks — no @solana/web3.js etc in package.json
 *   V. Phase 13/14/15/16/17 regression — imports still work
 *   W. drmOk / drmErr helpers
 *   X. validateDashboardReadModelCapabilities
 *   Y. validateDashboardReadModelFinding
 *   Z. validateDashboardReadModelInput
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no trade execution, no paper trading.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  // Capabilities
  getDashboardReadModelCapabilities,
  // Errors
  drmOk,
  drmErr,
  // Builders
  buildDashboardOverviewModel,
  buildReplayPanelModel,
  buildStrategyPanelModel,
  buildEvaluationPanelModel,
  buildEvidencePanelModel,
  buildSafetyPanelModel,
  buildDashboardReadModelBundle,
  // Exports
  exportDashboardReadModelJson,
  exportDashboardReadModelMarkdown,
  // Validation
  validateDashboardReadModelFinding,
  validateDashboardReadModelInput,
  validateDashboardReadModelBundle,
  validateDashboardReadModelCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  // Fixtures
  CLEAN_DASHBOARD_READ_MODEL_FIXTURE,
  DEGRADED_DASHBOARD_READ_MODEL_FIXTURE,
  FAILED_DASHBOARD_READ_MODEL_FIXTURE,
  INCONCLUSIVE_DASHBOARD_READ_MODEL_FIXTURE,
  MIXED_DASHBOARD_READ_MODEL_FIXTURE,
  REGRESSION_DASHBOARD_READ_MODEL_FIXTURE,
  ALL_DASHBOARD_READ_MODEL_FIXTURES,
} from '@sonic/dashboard-read-models';

import type {
  DashboardReadModelBundle,
  DashboardReadModelFinding,
  DashboardReadModelInput,
  DashboardReadModelCapabilities,
} from '@sonic/dashboard-read-models';

// Phase 17 regression imports
import {
  getEvidenceLedgerCapabilities,
  CLEAN_EVIDENCE_LEDGER_FIXTURE,
  ALL_EVIDENCE_LEDGER_FIXTURES,
} from '@sonic/evidence-ledger';

// Phase 16 regression imports
import {
  getStrategyEvaluationCapabilities,
  CLEAN_STRATEGY_EVALUATION_FIXTURE,
  ALL_STRATEGY_EVALUATION_FIXTURES,
} from '@sonic/strategy-evaluation';

// Phase 15 regression imports
import {
  getStrategyIntentCapabilities,
  CLEAN_STRATEGY_INTENT_FIXTURE,
  ALL_STRATEGY_INTENT_FIXTURES,
} from '@sonic/strategy-intent';

// Phase 14 regression imports
import {
  getReplayReportingCapabilities,
  ALL_REPLAY_REPORT_FIXTURES,
} from '@sonic/replay-reporting';

// Phase 13 regression imports
import {
  getReplayLabCapabilities,
  CLEAN_TOKEN_REPLAY_SCENARIO,
  ALL_REPLAY_FIXTURES,
} from '@sonic/replay-lab';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSafeFinding(
  id: string,
  severity: DashboardReadModelFinding['severity'] = 'info',
): DashboardReadModelFinding {
  return {
    findingId: id,
    severity,
    title: 'Safe fixture finding title',
    description: 'Safe fixture finding description for analysis.',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  };
}

function makeSafeInput(id: string, findings?: DashboardReadModelFinding[]): DashboardReadModelInput {
  return {
    inputId: id,
    evidenceLedgerId: `ledger_${id}`,
    findings: findings ?? [],
    fixtureOnly: true,
    liveData: false,
  };
}

// ─── A. Package exports ───────────────────────────────────────────────────────

describe('A. Package exports', () => {
  it('getDashboardReadModelCapabilities is a function', () => {
    expect(typeof getDashboardReadModelCapabilities).toBe('function');
  });

  it('drmOk is a function', () => {
    expect(typeof drmOk).toBe('function');
  });

  it('drmErr is a function', () => {
    expect(typeof drmErr).toBe('function');
  });

  it('buildDashboardOverviewModel is a function', () => {
    expect(typeof buildDashboardOverviewModel).toBe('function');
  });

  it('buildReplayPanelModel is a function', () => {
    expect(typeof buildReplayPanelModel).toBe('function');
  });

  it('buildStrategyPanelModel is a function', () => {
    expect(typeof buildStrategyPanelModel).toBe('function');
  });

  it('buildEvaluationPanelModel is a function', () => {
    expect(typeof buildEvaluationPanelModel).toBe('function');
  });

  it('buildEvidencePanelModel is a function', () => {
    expect(typeof buildEvidencePanelModel).toBe('function');
  });

  it('buildSafetyPanelModel is a function', () => {
    expect(typeof buildSafetyPanelModel).toBe('function');
  });

  it('buildDashboardReadModelBundle is a function', () => {
    expect(typeof buildDashboardReadModelBundle).toBe('function');
  });

  it('exportDashboardReadModelJson is a function', () => {
    expect(typeof exportDashboardReadModelJson).toBe('function');
  });

  it('exportDashboardReadModelMarkdown is a function', () => {
    expect(typeof exportDashboardReadModelMarkdown).toBe('function');
  });

  it('validateDashboardReadModelFinding is a function', () => {
    expect(typeof validateDashboardReadModelFinding).toBe('function');
  });

  it('validateDashboardReadModelInput is a function', () => {
    expect(typeof validateDashboardReadModelInput).toBe('function');
  });

  it('validateDashboardReadModelBundle is a function', () => {
    expect(typeof validateDashboardReadModelBundle).toBe('function');
  });

  it('validateDashboardReadModelCapabilities is a function', () => {
    expect(typeof validateDashboardReadModelCapabilities).toBe('function');
  });

  it('containsUnsafeActionText is a function', () => {
    expect(typeof containsUnsafeActionText).toBe('function');
  });

  it('containsSecretPattern is a function', () => {
    expect(typeof containsSecretPattern).toBe('function');
  });

  it('containsUrlPattern is a function', () => {
    expect(typeof containsUrlPattern).toBe('function');
  });

  it('isDisplaySafe is a function', () => {
    expect(typeof isDisplaySafe).toBe('function');
  });

  it('ALL_DASHBOARD_READ_MODEL_FIXTURES is an array', () => {
    expect(Array.isArray(ALL_DASHBOARD_READ_MODEL_FIXTURES)).toBe(true);
  });
});

// ─── B. Capabilities ──────────────────────────────────────────────────────────

describe('B. Capabilities — all unsafe false', () => {
  const caps = getDashboardReadModelCapabilities();

  it('canUseLiveData is false', () => { expect(caps.canUseLiveData).toBe(false); });
  it('canUseSolanaRpc is false', () => { expect(caps.canUseSolanaRpc).toBe(false); });
  it('canUseProviderApis is false', () => { expect(caps.canUseProviderApis).toBe(false); });
  it('canAccessPrivateKeys is false', () => { expect(caps.canAccessPrivateKeys).toBe(false); });
  it('canCreateTradeIntents is false', () => { expect(caps.canCreateTradeIntents).toBe(false); });
  it('canCreateExecutionPlans is false', () => { expect(caps.canCreateExecutionPlans).toBe(false); });
  it('canPaperTrade is false', () => { expect(caps.canPaperTrade).toBe(false); });
  it('canTrade is false', () => { expect(caps.canTrade).toBe(false); });
  it('canExecute is false', () => { expect(caps.canExecute).toBe(false); });
  it('canWriteToDatabase is false', () => { expect(caps.canWriteToDatabase).toBe(false); });
  it('canSendTelegramAlerts is false', () => { expect(caps.canSendTelegramAlerts).toBe(false); });
  it('canConstructTransactions is false', () => { expect(caps.canConstructTransactions).toBe(false); });
  it('canSimulateTransactions is false', () => { expect(caps.canSimulateTransactions).toBe(false); });
  it('canCreateOrders is false', () => { expect(caps.canCreateOrders).toBe(false); });
  it('canCreatePositions is false', () => { expect(caps.canCreatePositions).toBe(false); });
  it('canCalculateLivePnl is false', () => { expect(caps.canCalculateLivePnl).toBe(false); });
  it('canMutatePriorEvidence is false', () => { expect(caps.canMutatePriorEvidence).toBe(false); });
  it('canRenderUi is false', () => { expect(caps.canRenderUi).toBe(false); });
  it('fixtureOnly is true', () => { expect(caps.fixtureOnly).toBe(true); });
  it('analysisOnly is true', () => { expect(caps.analysisOnly).toBe(true); });
  it('nonExecutable is true', () => { expect(caps.nonExecutable).toBe(true); });
  it('readOnly is true', () => { expect(caps.readOnly).toBe(true); });

  it('capabilities validate successfully', () => {
    const result = validateDashboardReadModelCapabilities(caps);
    expect(result.ok).toBe(true);
  });
});

// ─── C. drmOk / drmErr ────────────────────────────────────────────────────────

describe('C. drmOk / drmErr helpers', () => {
  it('drmOk wraps value with ok: true', () => {
    const r = drmOk(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(42);
  });

  it('drmErr creates error with ok: false', () => {
    const r = drmErr('LIVE_DATA_FORBIDDEN', 'test error');
    expect(r.ok).toBe(false);
    expect(r.code).toBe('LIVE_DATA_FORBIDDEN');
    expect(r.message).toBe('test error');
  });

  it('drmOk wraps string', () => {
    const r = drmOk('hello');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('hello');
  });

  it('drmErr with FIXTURE_ONLY_REQUIRED code', () => {
    const r = drmErr('FIXTURE_ONLY_REQUIRED', 'fixture only');
    expect(r.ok).toBe(false);
    expect(r.code).toBe('FIXTURE_ONLY_REQUIRED');
  });
});

// ─── D. buildDashboardOverviewModel ──────────────────────────────────────────

describe('D. buildDashboardOverviewModel', () => {
  const input = makeSafeInput('overview_test', [
    makeSafeFinding('f1', 'info'),
    makeSafeFinding('f2', 'warning'),
    makeSafeFinding('f3', 'failure'),
  ]);

  it('builds successfully', () => {
    const result = buildDashboardOverviewModel(input);
    expect(result.ok).toBe(true);
  });

  it('overview has correct totalFindings', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.totalFindings).toBe(3);
  });

  it('overview fixtureOnly is true', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('overview liveData is false', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.liveData).toBe(false);
  });

  it('overview safeToDisplay is true', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.safeToDisplay).toBe(true);
  });

  it('overview analysisOnly is true', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.analysisOnly).toBe(true);
  });

  it('overview nonExecutable is true', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.nonExecutable).toBe(true);
  });

  it('overview readOnly is true', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.readOnly).toBe(true);
  });

  it('overview severity counts are correct', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.severityCounts.info).toBe(1);
    expect(result.value.severityCounts.warning).toBe(1);
    expect(result.value.severityCounts.failure).toBe(1);
    expect(result.value.severityCounts.risk).toBe(0);
    expect(result.value.severityCounts.inconclusive).toBe(0);
  });

  it('overview panelsAvailable includes all 5 panels', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.panelsAvailable).toContain('replay_panel');
    expect(result.value.panelsAvailable).toContain('strategy_panel');
    expect(result.value.panelsAvailable).toContain('evaluation_panel');
    expect(result.value.panelsAvailable).toContain('evidence_panel');
    expect(result.value.panelsAvailable).toContain('safety_panel');
  });

  it('overview safetyStatus mentions fixture-only', () => {
    const result = buildDashboardOverviewModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.safetyStatus).toContain('fixture-only');
  });

  it('rejects liveData=true in input', () => {
    const badInput = { ...input, liveData: true as unknown as false };
    const result = buildDashboardOverviewModel(badInput);
    expect(result.ok).toBe(false);
  });

  it('rejects fixtureOnly=false in input', () => {
    const badInput = { ...input, fixtureOnly: false as unknown as true };
    const result = buildDashboardOverviewModel(badInput);
    expect(result.ok).toBe(false);
  });
});

// ─── E. buildReplayPanelModel ─────────────────────────────────────────────────

describe('E. buildReplayPanelModel', () => {
  const input = makeSafeInput('replay_test', [makeSafeFinding('r1', 'info')]);

  it('builds successfully', () => {
    const result = buildReplayPanelModel(input);
    expect(result.ok).toBe(true);
  });

  it('panelKind is replay_panel', () => {
    const result = buildReplayPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.panelKind).toBe('replay_panel');
  });

  it('fixtureOnly is true', () => {
    const result = buildReplayPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('liveData is false', () => {
    const result = buildReplayPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.liveData).toBe(false);
  });

  it('readOnly is true', () => {
    const result = buildReplayPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.readOnly).toBe(true);
  });

  it('totalFindings matches findings count', () => {
    const result = buildReplayPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.totalFindings).toBe(1);
  });

  it('summaryText mentions replay', () => {
    const result = buildReplayPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.summaryText.toLowerCase()).toContain('replay');
  });
});

// ─── F. buildStrategyPanelModel ───────────────────────────────────────────────

describe('F. buildStrategyPanelModel', () => {
  const input = makeSafeInput('strategy_test', [makeSafeFinding('s1', 'warning')]);

  it('builds successfully', () => {
    const result = buildStrategyPanelModel(input);
    expect(result.ok).toBe(true);
  });

  it('panelKind is strategy_panel', () => {
    const result = buildStrategyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.panelKind).toBe('strategy_panel');
  });

  it('fixtureOnly is true', () => {
    const result = buildStrategyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('liveData is false', () => {
    const result = buildStrategyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.liveData).toBe(false);
  });

  it('readOnly is true', () => {
    const result = buildStrategyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.readOnly).toBe(true);
  });

  it('summaryText mentions no trade intents', () => {
    const result = buildStrategyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.summaryText.toLowerCase()).toContain('no trade intents');
  });
});

// ─── G. buildEvaluationPanelModel ─────────────────────────────────────────────

describe('G. buildEvaluationPanelModel', () => {
  const input = makeSafeInput('eval_test', [makeSafeFinding('e1', 'risk')]);

  it('builds successfully', () => {
    const result = buildEvaluationPanelModel(input);
    expect(result.ok).toBe(true);
  });

  it('panelKind is evaluation_panel', () => {
    const result = buildEvaluationPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.panelKind).toBe('evaluation_panel');
  });

  it('fixtureOnly is true', () => {
    const result = buildEvaluationPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('liveData is false', () => {
    const result = buildEvaluationPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.liveData).toBe(false);
  });

  it('summaryText mentions no execution plans', () => {
    const result = buildEvaluationPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.summaryText.toLowerCase()).toContain('no execution plans');
  });
});

// ─── H. buildEvidencePanelModel ───────────────────────────────────────────────

describe('H. buildEvidencePanelModel', () => {
  const input = makeSafeInput('evidence_test', [makeSafeFinding('ev1', 'inconclusive')]);

  it('builds successfully', () => {
    const result = buildEvidencePanelModel(input);
    expect(result.ok).toBe(true);
  });

  it('panelKind is evidence_panel', () => {
    const result = buildEvidencePanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.panelKind).toBe('evidence_panel');
  });

  it('fixtureOnly is true', () => {
    const result = buildEvidencePanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('liveData is false', () => {
    const result = buildEvidencePanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.liveData).toBe(false);
  });

  it('evidenceLedgerId is set from input', () => {
    const result = buildEvidencePanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.evidenceLedgerId).toBe('ledger_evidence_test');
  });

  it('summaryText mentions prior evidence not mutated', () => {
    const result = buildEvidencePanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.summaryText.toLowerCase()).toContain('not mutated');
  });
});

// ─── I. buildSafetyPanelModel ─────────────────────────────────────────────────

describe('I. buildSafetyPanelModel', () => {
  const input = makeSafeInput('safety_test');

  it('builds successfully', () => {
    const result = buildSafetyPanelModel(input);
    expect(result.ok).toBe(true);
  });

  it('panelKind is safety_panel', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.panelKind).toBe('safety_panel');
  });

  it('safetyInvariantsSatisfied is true', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.safetyInvariantsSatisfied).toBe(true);
  });

  it('capabilities.canTrade is false', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.capabilities.canTrade).toBe(false);
  });

  it('capabilities.canRenderUi is false', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.capabilities.canRenderUi).toBe(false);
  });

  it('lockedCapabilityNames includes canTrade', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.lockedCapabilityNames).toContain('canTrade');
  });

  it('lockedCapabilityNames includes canRenderUi', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.lockedCapabilityNames).toContain('canRenderUi');
  });

  it('lockedCapabilityNames includes canUseLiveData', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.lockedCapabilityNames).toContain('canUseLiveData');
  });

  it('fixtureOnly is true', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('readOnly is true', () => {
    const result = buildSafetyPanelModel(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.readOnly).toBe(true);
  });
});

// ─── J. buildDashboardReadModelBundle ────────────────────────────────────────

describe('J. buildDashboardReadModelBundle', () => {
  const input = makeSafeInput('bundle_test', [
    makeSafeFinding('b1', 'info'),
    makeSafeFinding('b2', 'warning'),
  ]);

  it('builds successfully', () => {
    const result = buildDashboardReadModelBundle(input);
    expect(result.ok).toBe(true);
  });

  it('bundle has bundleId', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.bundleId).toBeTruthy();
  });

  it('bundle fixtureOnly is true', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.fixtureOnly).toBe(true);
  });

  it('bundle liveData is false', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.liveData).toBe(false);
  });

  it('bundle safeToDisplay is true', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.safeToDisplay).toBe(true);
  });

  it('bundle analysisOnly is true', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.analysisOnly).toBe(true);
  });

  it('bundle nonExecutable is true', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.nonExecutable).toBe(true);
  });

  it('bundle readOnly is true', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.readOnly).toBe(true);
  });

  it('bundle has overview panel', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.overview).toBeTruthy();
  });

  it('bundle has replayPanel', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.replayPanel.panelKind).toBe('replay_panel');
  });

  it('bundle has strategyPanel', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.strategyPanel.panelKind).toBe('strategy_panel');
  });

  it('bundle has evaluationPanel', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.evaluationPanel.panelKind).toBe('evaluation_panel');
  });

  it('bundle has evidencePanel', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.evidencePanel.panelKind).toBe('evidence_panel');
  });

  it('bundle has safetyPanel', () => {
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.value.safetyPanel.panelKind).toBe('safety_panel');
  });
});

// ─── K. validateDashboardReadModelBundle ──────────────────────────────────────

describe('K. validateDashboardReadModelBundle', () => {
  function makeBundle(): DashboardReadModelBundle {
    const input = makeSafeInput('val_test', [makeSafeFinding('vf1')]);
    const result = buildDashboardReadModelBundle(input);
    if (!result.ok) throw new Error(result.message);
    return result.value;
  }

  it('validates a valid bundle', () => {
    const bundle = makeBundle();
    const result = validateDashboardReadModelBundle(bundle);
    expect(result.ok).toBe(true);
  });

  it('rejects bundle with fixtureOnly=false', () => {
    const bundle = { ...makeBundle(), fixtureOnly: false as unknown as true };
    const result = validateDashboardReadModelBundle(bundle);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('rejects bundle with liveData=true', () => {
    const bundle = { ...makeBundle(), liveData: true as unknown as false };
    const result = validateDashboardReadModelBundle(bundle);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects bundle with safeToDisplay=false', () => {
    const bundle = { ...makeBundle(), safeToDisplay: false as unknown as true };
    const result = validateDashboardReadModelBundle(bundle);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SAFE_TO_DISPLAY_REQUIRED');
  });

  it('rejects bundle with analysisOnly=false', () => {
    const bundle = { ...makeBundle(), analysisOnly: false as unknown as true };
    const result = validateDashboardReadModelBundle(bundle);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('ANALYSIS_ONLY_REQUIRED');
  });

  it('rejects bundle with nonExecutable=false', () => {
    const bundle = { ...makeBundle(), nonExecutable: false as unknown as true };
    const result = validateDashboardReadModelBundle(bundle);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('NON_EXECUTABLE_REQUIRED');
  });

  it('rejects bundle with readOnly=false', () => {
    const bundle = { ...makeBundle(), readOnly: false as unknown as true };
    const result = validateDashboardReadModelBundle(bundle);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('READ_ONLY_REQUIRED');
  });
});

// ─── L. JSON export ───────────────────────────────────────────────────────────

describe('L. JSON export — deterministic', () => {
  function makeBundle() {
    const input = makeSafeInput('json_test', [makeSafeFinding('jf1')]);
    const r = buildDashboardReadModelBundle(input);
    if (!r.ok) throw new Error(r.message);
    return r.value;
  }

  it('exportDashboardReadModelJson returns an object', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(typeof exported).toBe('object');
  });

  it('export exportKind is dashboard_read_model_export', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(exported.exportKind).toBe('dashboard_read_model_export');
  });

  it('export fixtureOnly is true', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(exported.fixtureOnly).toBe(true);
  });

  it('export liveData is false', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(exported.liveData).toBe(false);
  });

  it('export safeToDisplay is true', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(exported.safeToDisplay).toBe(true);
  });

  it('export analysisOnly is true', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(exported.analysisOnly).toBe(true);
  });

  it('export nonExecutable is true', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(exported.nonExecutable).toBe(true);
  });

  it('export readOnly is true', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(exported.readOnly).toBe(true);
  });

  it('export is JSON-serializable', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    expect(() => JSON.stringify(exported)).not.toThrow();
  });

  it('export is deterministic across two calls with same input', () => {
    const b1 = makeBundle();
    const b2 = makeBundle();
    const e1 = JSON.stringify(exportDashboardReadModelJson(b1));
    const e2 = JSON.stringify(exportDashboardReadModelJson(b2));
    expect(e1).toBe(e2);
  });

  it('export bundle has panelsAvailable sorted', () => {
    const exported = exportDashboardReadModelJson(makeBundle());
    const panels = [...exported.bundle.overview.panelsAvailable];
    expect(panels).toEqual([...panels].sort());
  });
});

// ─── M. Markdown export ───────────────────────────────────────────────────────

describe('M. Markdown export — deterministic + safety footer', () => {
  function makeBundle() {
    const input = makeSafeInput('md_test', [makeSafeFinding('mf1')]);
    const r = buildDashboardReadModelBundle(input);
    if (!r.ok) throw new Error(r.message);
    return r.value;
  }

  it('exportDashboardReadModelMarkdown returns a string', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(typeof md).toBe('string');
  });

  it('markdown contains Dashboard Read Model Report heading', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('# Dashboard Read Model Report');
  });

  it('markdown contains safety footer with fixture-only', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('fixture-only');
  });

  it('markdown contains safety footer with analysis-only', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('analysis-only');
  });

  it('markdown contains safety footer with non-executable', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('non-executable');
  });

  it('markdown contains safety footer with read-only', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('read-only');
  });

  it('markdown contains SAFETY NOTICE', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('SAFETY NOTICE');
  });

  it('markdown contains Safety Flags section', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('## Safety Flags');
  });

  it('markdown contains fixtureOnly: true flag', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('fixtureOnly: true');
  });

  it('markdown contains liveData: false flag', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).toContain('liveData: false');
  });

  it('markdown is deterministic across two calls with same input', () => {
    const md1 = exportDashboardReadModelMarkdown(makeBundle());
    const md2 = exportDashboardReadModelMarkdown(makeBundle());
    expect(md1).toBe(md2);
  });

  it('markdown does not contain stack traces', () => {
    const md = exportDashboardReadModelMarkdown(makeBundle());
    expect(md).not.toContain('Error:');
    expect(md).not.toContain('at Object.');
  });
});

// ─── N. Safety invariant rejection ───────────────────────────────────────────

describe('N. Safety invariant rejection — finding validation', () => {
  it('rejects finding with fixtureOnly=false', () => {
    const f = { ...makeSafeFinding('bad_f'), fixtureOnly: false as unknown as true };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
  });

  it('rejects finding with liveData=true', () => {
    const f = { ...makeSafeFinding('bad_f'), liveData: true as unknown as false };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects finding with safeToDisplay=false', () => {
    const f = { ...makeSafeFinding('bad_f'), safeToDisplay: false as unknown as true };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SAFE_TO_DISPLAY_REQUIRED');
  });

  it('rejects finding with analysisOnly=false', () => {
    const f = { ...makeSafeFinding('bad_f'), analysisOnly: false as unknown as true };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('ANALYSIS_ONLY_REQUIRED');
  });

  it('rejects finding with nonExecutable=false', () => {
    const f = { ...makeSafeFinding('bad_f'), nonExecutable: false as unknown as true };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('NON_EXECUTABLE_REQUIRED');
  });

  it('rejects finding with readOnly=false', () => {
    const f = { ...makeSafeFinding('bad_f'), readOnly: false as unknown as true };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('READ_ONLY_REQUIRED');
  });
});

// ─── O. Unsafe text rejection ─────────────────────────────────────────────────

describe('O. Unsafe action / secret / URL text rejection', () => {
  it('containsUnsafeActionText detects buy', () => {
    expect(containsUnsafeActionText('buy this token now')).toBe(true);
  });

  it('containsUnsafeActionText detects sell', () => {
    expect(containsUnsafeActionText('sell immediately')).toBe(true);
  });

  it('containsUnsafeActionText detects execute', () => {
    expect(containsUnsafeActionText('execute the plan')).toBe(true);
  });

  it('containsUnsafeActionText detects snipe', () => {
    expect(containsUnsafeActionText('snipe the launch')).toBe(true);
  });

  it('containsUnsafeActionText is false for safe text', () => {
    expect(containsUnsafeActionText('analysis complete')).toBe(false);
  });

  it('containsSecretPattern detects private_key', () => {
    expect(containsSecretPattern('private_key=abc123')).toBe(true);
  });

  it('containsSecretPattern detects seed phrase', () => {
    expect(containsSecretPattern('seed phrase: word word word')).toBe(true);
  });

  it('containsSecretPattern detects mnemonic', () => {
    expect(containsSecretPattern('my mnemonic phrase')).toBe(true);
  });

  it('containsSecretPattern detects api_key', () => {
    expect(containsSecretPattern('api_key=xyzabc')).toBe(true);
  });

  it('containsSecretPattern is false for safe text', () => {
    expect(containsSecretPattern('fixture analysis result')).toBe(false);
  });

  it('containsUrlPattern detects wss://', () => {
    expect(containsUrlPattern('wss://mainnet.example.com')).toBe(true);
  });

  it('containsUrlPattern detects helius.dev', () => {
    expect(containsUrlPattern('https://helius.dev/api')).toBe(true);
  });

  it('containsUrlPattern detects yellowstone', () => {
    expect(containsUrlPattern('yellowstone-grpc')).toBe(true);
  });

  it('containsUrlPattern is false for safe text', () => {
    expect(containsUrlPattern('clean fixture data')).toBe(false);
  });

  it('isDisplaySafe returns true for safe text', () => {
    expect(isDisplaySafe('clean analysis finding')).toBe(true);
  });

  it('isDisplaySafe returns false for text with private_key', () => {
    expect(isDisplaySafe('private_key=secret')).toBe(false);
  });

  it('isDisplaySafe returns false for text with buy', () => {
    expect(isDisplaySafe('you should buy now')).toBe(false);
  });

  it('rejects finding with unsafe action text in title', () => {
    const f = { ...makeSafeFinding('bad'), title: 'you should buy this' };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
  });

  it('rejects finding with secret pattern in description', () => {
    const f = { ...makeSafeFinding('bad'), description: 'use private_key=abc' };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects finding with URL pattern in description', () => {
    const f = { ...makeSafeFinding('bad'), description: 'connect to wss://rpc.example.com' };
    const result = validateDashboardReadModelFinding(f);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('URL_PATTERN_DETECTED');
  });
});

// ─── P. No trade intents / execution plans / paper trades / orders / positions / PnL ─

describe('P. No trade intents, execution plans, paper trades, orders, positions, PnL', () => {
  it('capabilities.canCreateTradeIntents is false', () => {
    expect(getDashboardReadModelCapabilities().canCreateTradeIntents).toBe(false);
  });

  it('capabilities.canCreateExecutionPlans is false', () => {
    expect(getDashboardReadModelCapabilities().canCreateExecutionPlans).toBe(false);
  });

  it('capabilities.canPaperTrade is false', () => {
    expect(getDashboardReadModelCapabilities().canPaperTrade).toBe(false);
  });

  it('capabilities.canCreateOrders is false', () => {
    expect(getDashboardReadModelCapabilities().canCreateOrders).toBe(false);
  });

  it('capabilities.canCreatePositions is false', () => {
    expect(getDashboardReadModelCapabilities().canCreatePositions).toBe(false);
  });

  it('capabilities.canCalculateLivePnl is false', () => {
    expect(getDashboardReadModelCapabilities().canCalculateLivePnl).toBe(false);
  });
});

// ─── Q. No live data, provider APIs, wallet/private key handling ───────────────

describe('Q. No live data, provider APIs, wallet/private key handling', () => {
  it('capabilities.canUseLiveData is false', () => {
    expect(getDashboardReadModelCapabilities().canUseLiveData).toBe(false);
  });

  it('capabilities.canUseSolanaRpc is false', () => {
    expect(getDashboardReadModelCapabilities().canUseSolanaRpc).toBe(false);
  });

  it('capabilities.canUseProviderApis is false', () => {
    expect(getDashboardReadModelCapabilities().canUseProviderApis).toBe(false);
  });

  it('capabilities.canAccessPrivateKeys is false', () => {
    expect(getDashboardReadModelCapabilities().canAccessPrivateKeys).toBe(false);
  });
});

// ─── R. No transaction construction/simulation ─────────────────────────────────

describe('R. No transaction construction/simulation', () => {
  it('capabilities.canConstructTransactions is false', () => {
    expect(getDashboardReadModelCapabilities().canConstructTransactions).toBe(false);
  });

  it('capabilities.canSimulateTransactions is false', () => {
    expect(getDashboardReadModelCapabilities().canSimulateTransactions).toBe(false);
  });
});

// ─── S. No UI rendering capability ────────────────────────────────────────────

describe('S. No UI rendering capability', () => {
  it('capabilities.canRenderUi is false', () => {
    expect(getDashboardReadModelCapabilities().canRenderUi).toBe(false);
  });

  it('validateDashboardReadModelCapabilities rejects canRenderUi=true', () => {
    const caps: DashboardReadModelCapabilities = {
      ...getDashboardReadModelCapabilities(),
      canRenderUi: true as unknown as false,
    };
    const result = validateDashboardReadModelCapabilities(caps);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_CAPABILITY_DETECTED');
  });
});

// ─── T. Fixtures ──────────────────────────────────────────────────────────────

describe('T. Fixtures — deterministic, safe fields', () => {
  it('ALL_DASHBOARD_READ_MODEL_FIXTURES has 6 fixtures', () => {
    expect(ALL_DASHBOARD_READ_MODEL_FIXTURES.length).toBe(6);
  });

  it('CLEAN fixture fixtureId is deterministic', () => {
    expect(CLEAN_DASHBOARD_READ_MODEL_FIXTURE.fixtureId).toBe('clean_dashboard_read_model_fixture');
  });

  it('DEGRADED fixture fixtureId is deterministic', () => {
    expect(DEGRADED_DASHBOARD_READ_MODEL_FIXTURE.fixtureId).toBe('degraded_dashboard_read_model_fixture');
  });

  it('FAILED fixture fixtureId is deterministic', () => {
    expect(FAILED_DASHBOARD_READ_MODEL_FIXTURE.fixtureId).toBe('failed_dashboard_read_model_fixture');
  });

  it('INCONCLUSIVE fixture fixtureId is deterministic', () => {
    expect(INCONCLUSIVE_DASHBOARD_READ_MODEL_FIXTURE.fixtureId).toBe('inconclusive_dashboard_read_model_fixture');
  });

  it('MIXED fixture fixtureId is deterministic', () => {
    expect(MIXED_DASHBOARD_READ_MODEL_FIXTURE.fixtureId).toBe('mixed_dashboard_read_model_fixture');
  });

  it('REGRESSION fixture fixtureId is deterministic', () => {
    expect(REGRESSION_DASHBOARD_READ_MODEL_FIXTURE.fixtureId).toBe('regression_dashboard_read_model_fixture');
  });

  for (const fixture of [
    CLEAN_DASHBOARD_READ_MODEL_FIXTURE,
    DEGRADED_DASHBOARD_READ_MODEL_FIXTURE,
    FAILED_DASHBOARD_READ_MODEL_FIXTURE,
    INCONCLUSIVE_DASHBOARD_READ_MODEL_FIXTURE,
    MIXED_DASHBOARD_READ_MODEL_FIXTURE,
    REGRESSION_DASHBOARD_READ_MODEL_FIXTURE,
  ]) {
    it(`${fixture.fixtureId}: fixtureOnly is true`, () => {
      expect(fixture.fixtureOnly).toBe(true);
    });

    it(`${fixture.fixtureId}: liveData is false`, () => {
      expect(fixture.liveData).toBe(false);
    });

    it(`${fixture.fixtureId}: safeToDisplay is true`, () => {
      expect(fixture.safeToDisplay).toBe(true);
    });

    it(`${fixture.fixtureId}: analysisOnly is true`, () => {
      expect(fixture.analysisOnly).toBe(true);
    });

    it(`${fixture.fixtureId}: nonExecutable is true`, () => {
      expect(fixture.nonExecutable).toBe(true);
    });

    it(`${fixture.fixtureId}: readOnly is true`, () => {
      expect(fixture.readOnly).toBe(true);
    });

    it(`${fixture.fixtureId}: bundle validates successfully`, () => {
      const result = validateDashboardReadModelBundle(fixture.bundle);
      expect(result.ok).toBe(true);
    });
  }
});

// ─── U. Dependency checks ─────────────────────────────────────────────────────

describe('U. Dependency checks — no forbidden packages', () => {
  const pkgPath = resolve(
    process.cwd(),
    'packages/dashboard-read-models/package.json',
  );
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
  const allDeps = {
    ...((pkg['dependencies'] as Record<string, string>) ?? {}),
    ...((pkg['devDependencies'] as Record<string, string>) ?? {}),
    ...((pkg['peerDependencies'] as Record<string, string>) ?? {}),
  };

  it('does not depend on @solana/web3.js', () => {
    expect('@solana/web3.js' in allDeps).toBe(false);
  });

  it('does not depend on helius SDK', () => {
    const hasHelius = Object.keys(allDeps).some(k => k.toLowerCase().includes('helius'));
    expect(hasHelius).toBe(false);
  });

  it('does not depend on jito SDK', () => {
    const hasJito = Object.keys(allDeps).some(k => k.toLowerCase().includes('jito'));
    expect(hasJito).toBe(false);
  });

  it('does not depend on pump-related SDK', () => {
    const hasPump = Object.keys(allDeps).some(k => k.toLowerCase().includes('pump'));
    expect(hasPump).toBe(false);
  });

  it('does not depend on yellowstone', () => {
    const hasYellowstone = Object.keys(allDeps).some(k => k.toLowerCase().includes('yellowstone'));
    expect(hasYellowstone).toBe(false);
  });

  it('package name is @sonic/dashboard-read-models', () => {
    expect(pkg['name']).toBe('@sonic/dashboard-read-models');
  });
});

// ─── V. Phase 13/14/15/16/17 regression ───────────────────────────────────────

describe('V. Phase 13/14/15/16/17 regression imports still work', () => {
  it('Phase 17: getEvidenceLedgerCapabilities works', () => {
    const caps = getEvidenceLedgerCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 17: CLEAN_EVIDENCE_LEDGER_FIXTURE is defined', () => {
    expect(CLEAN_EVIDENCE_LEDGER_FIXTURE.fixtureId).toBeTruthy();
  });

  it('Phase 17: ALL_EVIDENCE_LEDGER_FIXTURES has 6 entries', () => {
    expect(ALL_EVIDENCE_LEDGER_FIXTURES.length).toBe(6);
  });

  it('Phase 16: getStrategyEvaluationCapabilities works', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 16: CLEAN_STRATEGY_EVALUATION_FIXTURE is defined', () => {
    expect(CLEAN_STRATEGY_EVALUATION_FIXTURE.fixtureId).toBeTruthy();
  });

  it('Phase 16: ALL_STRATEGY_EVALUATION_FIXTURES exists', () => {
    expect(Array.isArray(ALL_STRATEGY_EVALUATION_FIXTURES)).toBe(true);
  });

  it('Phase 15: getStrategyIntentCapabilities works', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 15: CLEAN_STRATEGY_INTENT_FIXTURE is defined', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.fixtureId).toBeTruthy();
  });

  it('Phase 15: ALL_STRATEGY_INTENT_FIXTURES exists', () => {
    expect(Array.isArray(ALL_STRATEGY_INTENT_FIXTURES)).toBe(true);
  });

  it('Phase 14: getReplayReportingCapabilities works', () => {
    const caps = getReplayReportingCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 14: ALL_REPLAY_REPORT_FIXTURES has entries', () => {
    expect(ALL_REPLAY_REPORT_FIXTURES.length).toBeGreaterThan(0);
  });

  it('Phase 13: getReplayLabCapabilities works', () => {
    const caps = getReplayLabCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 13: CLEAN_TOKEN_REPLAY_SCENARIO is defined', () => {
    expect(CLEAN_TOKEN_REPLAY_SCENARIO).toBeTruthy();
  });

  it('Phase 13: ALL_REPLAY_FIXTURES exists', () => {
    expect(Array.isArray(ALL_REPLAY_FIXTURES)).toBe(true);
  });
});

// ─── W. validateDashboardReadModelCapabilities ───────────────────────────────

describe('W. validateDashboardReadModelCapabilities — reject unsafe flags', () => {
  const safeCaps = getDashboardReadModelCapabilities();

  const unsafeFlagTests: Array<[keyof DashboardReadModelCapabilities, unknown]> = [
    ['canUseLiveData', true],
    ['canUseSolanaRpc', true],
    ['canUseProviderApis', true],
    ['canAccessPrivateKeys', true],
    ['canCreateTradeIntents', true],
    ['canCreateExecutionPlans', true],
    ['canPaperTrade', true],
    ['canTrade', true],
    ['canExecute', true],
    ['canWriteToDatabase', true],
    ['canSendTelegramAlerts', true],
    ['canConstructTransactions', true],
    ['canSimulateTransactions', true],
    ['canCreateOrders', true],
    ['canCreatePositions', true],
    ['canCalculateLivePnl', true],
    ['canMutatePriorEvidence', true],
    ['canRenderUi', true],
    ['fixtureOnly', false],
    ['analysisOnly', false],
    ['nonExecutable', false],
    ['readOnly', false],
  ];

  for (const [flag, value] of unsafeFlagTests) {
    it(`rejects when ${flag}=${String(value)}`, () => {
      const mutated = { ...safeCaps, [flag]: value };
      const result = validateDashboardReadModelCapabilities(mutated as DashboardReadModelCapabilities);
      expect(result.ok).toBe(false);
    });
  }
});
