/**
 * packages/dashboard-read-models/src/safety-panel-model.ts
 *
 * Phase 18 — DashboardSafetyPanelModel builder.
 *
 * Summarises safety invariants and locked capabilities.
 * All unsafe capabilities are false.
 */

import { drmOk, drmErr } from './errors.js';
import type { DrmResult } from './errors.js';
import type {
  DashboardSafetyPanelModel,
  DashboardReadModelInput,
} from './types.js';
import { getDashboardReadModelCapabilities } from './capabilities.js';
import { validateDashboardReadModelInput, validateDashboardReadModelCapabilities } from './validation.js';

const LOCKED_CAPABILITY_NAMES: readonly string[] = [
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
];

/**
 * Builds a safe DashboardSafetyPanelModel.
 * All output fields are fixture-only, analysis-only, non-executable, read-only.
 */
export function buildSafetyPanelModel(
  input: DashboardReadModelInput,
): DrmResult<DashboardSafetyPanelModel> {
  const inputCheck = validateDashboardReadModelInput(input);
  if (!inputCheck.ok) return drmErr(inputCheck.code, inputCheck.message);

  const capabilities = getDashboardReadModelCapabilities();
  const capsCheck = validateDashboardReadModelCapabilities(capabilities);
  if (!capsCheck.ok) return drmErr(capsCheck.code, capsCheck.message);

  const summaryText =
    `Safety panel: all ${LOCKED_CAPABILITY_NAMES.length} unsafe capabilities are permanently false. ` +
    'fixtureOnly: true, analysisOnly: true, nonExecutable: true, readOnly: true. ' +
    'This package cannot trade, execute, access live data, handle wallets, or render UI.';

  return drmOk({
    panelId: `safety_panel_${input.inputId}`,
    panelKind: 'safety_panel',
    capabilities,
    lockedCapabilityNames: LOCKED_CAPABILITY_NAMES,
    safetyInvariantsSatisfied: true,
    summaryText,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  });
}
