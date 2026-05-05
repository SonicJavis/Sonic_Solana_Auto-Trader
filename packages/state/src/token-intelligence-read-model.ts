/**
 * Phase 8 — Token Intelligence static read model for state/system layer.
 *
 * Provides a static, read-only status summary of the Phase 8 Token Intelligence
 * layer, suitable for inclusion in /system output.
 *
 * Safety invariants:
 *   - No live data access
 *   - No provider API calls
 *   - No Solana RPC
 *   - No trade actions
 *   - No execution
 *   - All forbidden capabilities explicitly stated as 'forbidden'
 *
 * This module does NOT import from @sonic/token-intelligence to avoid
 * potential circular dependency concerns. It exposes a static summary only.
 */

/**
 * Static Phase 8 Token Intelligence status summary.
 * Safe to include in /system output.
 */
export interface TokenIntelligenceStatusSnapshot {
  /** Overall status of the Token Intelligence layer */
  readonly status: 'local_model_ready';
  /** Whether fixture scoring is available */
  readonly fixtureScoring: 'available';
  /** Live data is always forbidden */
  readonly liveData: 'forbidden';
  /** Provider APIs are always forbidden */
  readonly providerApis: 'forbidden';
  /** Solana RPC is always forbidden */
  readonly solanaRpc: 'forbidden';
  /** Trade actions are always forbidden */
  readonly tradeActions: 'forbidden';
  /** Execution is always forbidden */
  readonly execution: 'forbidden';
  /** Whether this snapshot is safe to display */
  readonly safeToDisplay: true;
}

/**
 * Static Phase 8 Token Intelligence status constant.
 * Safe to display in Telegram /system output or any control-plane UI.
 */
export const PHASE_8_TOKEN_INTELLIGENCE_STATUS: TokenIntelligenceStatusSnapshot = {
  status: 'local_model_ready',
  fixtureScoring: 'available',
  liveData: 'forbidden',
  providerApis: 'forbidden',
  solanaRpc: 'forbidden',
  tradeActions: 'forbidden',
  execution: 'forbidden',
  safeToDisplay: true,
} as const;

/**
 * Build a TokenIntelligenceStatusSnapshot.
 * Always returns the static Phase 8 status.
 */
export function buildTokenIntelligenceStatusSnapshot(): TokenIntelligenceStatusSnapshot {
  return PHASE_8_TOKEN_INTELLIGENCE_STATUS;
}
