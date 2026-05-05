/**
 * Phase 8 — Token Intelligence v1: Core types.
 *
 * Re-exports token profile and score types, and defines risk flags,
 * classification, capabilities, and the top-level intelligence result.
 */

export type {
  TokenProfile,
  TokenMetricSnapshot,
  TokenProfileSource,
} from './token-profile.js';

export type {
  MetadataQualityScore,
  CurveQualityScore,
  HolderConcentrationScore,
  LiquidityQualityScore,
  OrganicMomentumScore,
  TokenComponentScores,
} from './score-types.js';

export type { TokenRiskFlag, TokenRiskFlagEntry } from './risk-flags.js';

export type { TokenClassification } from './classifier.js';

/**
 * Static capabilities of the Phase 8 token intelligence engine.
 *
 * All unsafe capabilities are always false.
 * fixtureOnly is always true.
 *
 * This object can be returned by getTokenIntelligenceCapabilities()
 * to communicate system boundaries clearly.
 */
export interface TokenIntelligenceCapabilities {
  /** Always false — no live market data in Phase 8 */
  readonly canUseLiveData: false;
  /** Always false — no Solana RPC in Phase 8 */
  readonly canUseSolanaRpc: false;
  /** Always false — no provider APIs in Phase 8 */
  readonly canUseProviderApis: false;
  /** Always false — no trading in Phase 8 */
  readonly canTrade: false;
  /** Always false — no trade intents in Phase 8 */
  readonly canCreateTradeIntents: false;
  /** Always false — no execution in Phase 8 */
  readonly canExecute: false;
  /** Always true — fixture/local scoring only in Phase 8 */
  readonly fixtureOnly: true;
  /** Whether this capabilities object is safe to display */
  readonly safeToDisplay: true;
}

/**
 * The complete token intelligence result for a single token.
 *
 * Safety invariants (enforced at construction time):
 *   - actionAllowed/tradingAllowed/executionAllowed are always false
 *   - liveData is always false
 *   - fixtureOnly is always true
 *   - safeToDisplay is always true
 *   - finalScore is bounded 0–100
 *   - confidence is bounded 0–1
 *   - No secrets, no wallet data, no raw URLs
 */
export interface TokenIntelligenceResult {
  /** Token mint of the analysed token (synthetic in Phase 8) */
  readonly tokenMint: string;
  /** The token's identity/descriptive profile */
  readonly profile: import('./token-profile.js').TokenProfile;
  /** The quantitative metric snapshot used for scoring */
  readonly metrics: import('./token-profile.js').TokenMetricSnapshot;
  /** Individual component scores */
  readonly componentScores: import('./score-types.js').TokenComponentScores;
  /** Weighted composite score 0–100 */
  readonly finalScore: number;
  /**
   * Confidence in the result 0–1.
   * Degrades when data is missing or incomplete.
   */
  readonly confidence: number;
  /** Classification of the token — never uses trade wording */
  readonly classification: import('./classifier.js').TokenClassification;
  /** Risk flags raised by the scoring components */
  readonly riskFlags: readonly import('./risk-flags.js').TokenRiskFlagEntry[];
  /** Safe human-readable reasons for the overall result */
  readonly reasons: readonly string[];
  /** ISO timestamp when this result was generated */
  readonly generatedAt: string;
  /** Always true — only fixture data in Phase 8 */
  readonly fixtureOnly: true;
  /** Always false — no live data in Phase 8 */
  readonly liveData: false;
  /** Always false — no trading actions permitted */
  readonly actionAllowed: false;
  /** Always false — no trading permitted */
  readonly tradingAllowed: false;
  /** Always false — no execution permitted */
  readonly executionAllowed: false;
  /** Always true — safe to display in control-plane output */
  readonly safeToDisplay: true;
}
