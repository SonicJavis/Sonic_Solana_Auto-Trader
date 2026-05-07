/**
 * apps/dashboard/src/components/SafetyBanner.ts
 *
 * Phase 25 — Dashboard UI Shell — SafetyBanner Component
 *
 * Renders a static safety banner clearly marking the dashboard as:
 * local-only, read-only, fixture-backed, no live data, no execution,
 * no wallet connection, no external network.
 *
 * SAFETY: This component contains only static notice strings.
 *         No dynamic data. No live data. No side effects.
 */

import type { SafetyBannerResult, DashboardSafetyBoundary } from '../types.js';

/** Safety boundary used by all Phase 25 components. */
export const PHASE_25_SAFETY_BOUNDARY: DashboardSafetyBoundary = {
  isReadOnly: true,
  isLocalOnly: true,
  isFixtureBacked: true,
  hasLiveData: false,
  hasTradingControls: false,
  hasWalletControls: false,
  hasMutationControls: false,
  hasExternalNetwork: false,
  hasExecutionControls: false,
} as const;

/** Static safety notices displayed on the banner. */
export const SAFETY_BANNER_NOTICES: readonly string[] = [
  'LOCAL ONLY — This dashboard runs entirely on your local machine.',
  'READ-ONLY — No data is modified. No writes are performed.',
  'FIXTURE-BACKED — All data comes from static local fixtures, not live sources.',
  'NO LIVE DATA — No real-time prices, balances, or market data.',
  'NO EXECUTION — No trades, swaps, orders, or transactions are initiated.',
  'NO WALLET — No wallet connection. No private keys. No signing.',
  'NO EXTERNAL NETWORK — No HTTP requests, web socket connections, or external API calls.',
] as const;

/**
 * SafetyBanner component.
 *
 * Returns a SafetyBannerResult with all safety notices.
 * Deterministic. No side effects.
 */
export function SafetyBanner(): SafetyBannerResult {
  return {
    componentType: 'SafetyBanner',
    role: 'banner',
    ariaLabel:
      'Safety Notice: This dashboard is local-only, read-only, fixture-backed, and has no live data, execution, or wallet access.',
    notices: SAFETY_BANNER_NOTICES,
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
