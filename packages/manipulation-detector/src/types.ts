/**
 * Phase 11 — Bundle / Manipulation Detector v1: Core types.
 *
 * Defines ManipulationDetectorCapabilities and ManipulationDetectionResult.
 * All models are local/fixture-only.
 */

import type { BundleSignal } from './bundle-signal.js';
import type { ManipulationPattern } from './manipulation-pattern.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import type { ManipulationComponentScores } from './score-types.js';
import type { ManipulationRiskFlagEntry } from './risk-flags.js';
import type { ManipulationClassification } from './classifier.js';

/**
 * Static capabilities of the Phase 11 manipulation detector engine.
 *
 * All unsafe capabilities are always false.
 * fixtureOnly is always true.
 *
 * This object is returned by getManipulationDetectorCapabilities()
 * to communicate system boundaries clearly.
 */
export interface ManipulationDetectorCapabilities {
  /** Always false — no live data in Phase 11 */
  readonly canUseLiveData: false;
  /** Always false — no Solana RPC in Phase 11 */
  readonly canUseSolanaRpc: false;
  /** Always false — no provider APIs in Phase 11 */
  readonly canUseProviderApis: false;
  /** Always false — no private key access in Phase 11 */
  readonly canAccessPrivateKeys: false;
  /** Always false — no trade intents in Phase 11 */
  readonly canCreateTradeIntents: false;
  /** Always false — no enforcement actions in Phase 11 */
  readonly canCreateEnforcementActions: false;
  /** Always false — no trading in Phase 11 */
  readonly canTrade: false;
  /** Always false — no execution in Phase 11 */
  readonly canExecute: false;
  /** Always true — fixture/local detection only in Phase 11 */
  readonly fixtureOnly: true;
  /** Whether this capabilities object is safe to display */
  readonly safeToDisplay: true;
}

/**
 * The complete manipulation detection result for a single token/cluster.
 *
 * Safety invariants (enforced at construction time):
 *   - actionAllowed/tradingAllowed/executionAllowed/enforcementAllowed are always false
 *   - liveData is always false
 *   - fixtureOnly is always true
 *   - safeToDisplay is always true
 *   - finalScore is bounded 0–100
 *   - confidence is bounded 0–1
 *   - No secrets, no private wallet data, no raw URLs, no RPC endpoints
 *   - finalScore must not be described as a trading signal
 */
export interface ManipulationDetectionResult {
  /** Unique result identifier — safe to display */
  readonly resultId: string;
  /** Public token mint identifier (synthetic fixture ID only) */
  readonly tokenMint: string;
  /** Bundle signals observed for this token */
  readonly bundleSignals: readonly BundleSignal[];
  /** Manipulation patterns detected */
  readonly patterns: readonly ManipulationPattern[];
  /** Coordinated activity snapshot */
  readonly coordinatedActivity: CoordinatedActivitySnapshot;
  /** Individual component scores */
  readonly componentScores: ManipulationComponentScores;
  /** Weighted composite score 0–100 (higher = less manipulated) */
  readonly finalScore: number;
  /**
   * Confidence in the result 0–1.
   * Degrades when data is missing or incomplete.
   */
  readonly confidence: number;
  /** Classification — never uses trade wording */
  readonly classification: ManipulationClassification;
  /** Risk flags raised by the detection components */
  readonly riskFlags: readonly ManipulationRiskFlagEntry[];
  /** Safe human-readable reasons for the overall result */
  readonly reasons: readonly string[];
  /** ISO timestamp when this result was generated */
  readonly generatedAt: string;
  /** Always true — only fixture data in Phase 11 */
  readonly fixtureOnly: true;
  /** Always false — no live data in Phase 11 */
  readonly liveData: false;
  /** Always false — no actions permitted */
  readonly actionAllowed: false;
  /** Always false — no trading permitted */
  readonly tradingAllowed: false;
  /** Always false — no execution permitted */
  readonly executionAllowed: false;
  /** Always false — no enforcement actions permitted */
  readonly enforcementAllowed: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: true;
}
