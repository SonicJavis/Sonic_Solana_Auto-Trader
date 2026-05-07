/**
 * Phase 9 — Creator Intelligence v1: Core types.
 *
 * Re-exports creator profile and score types, and defines capabilities
 * and the top-level creator intelligence result.
 */

export type { CreatorProfile, CreatorProfileSource } from './creator-profile.js';
export type { CreatorLaunchHistorySnapshot } from './creator-history.js';
export type {
  CreatorSuccessScore,
  CreatorLaunchQualityScore,
  CreatorConsistencyScore,
  CreatorSuspiciousPatternScore,
  CreatorComponentScores,
} from './score-types.js';
export type { CreatorRiskFlag, CreatorRiskFlagEntry, CreatorRiskFlagSeverity } from './risk-flags.js';
export type { CreatorClassification } from './classifier.js';
export type {
  CreatorFixtureModelCapabilities,
  CreatorIntelligenceFixture,
  CreatorIntelligenceFixtureName,
  CreatorIntelligenceFixtureKind,
  CreatorProfileFixture,
  CreatorProjectFixture,
  CreatorNarrativeFixture,
  CreatorSocialSignalFixture,
  CreatorDisclosureSignalFixture,
  CreatorEngagementPatternFixture,
  CreatorRiskIndicator,
  CreatorCredibilityIndicator,
  CreatorIntelligenceSummary,
  CreatorIntelligenceValidationResult,
  CreatorIntelligenceValidationIssue,
  CreatorIntelligenceSafetyResult,
  CreatorIntelligenceBuildInput,
  CreatorIntelligenceBuildResult,
} from './fixture-model-types.js';

/**
 * Static capabilities of the Phase 9 creator intelligence engine.
 *
 * All unsafe capabilities are always false.
 * fixtureOnly is always true.
 *
 * This object is returned by getCreatorIntelligenceCapabilities()
 * to communicate system boundaries clearly.
 */
export interface CreatorIntelligenceCapabilities {
  /** Always false — no live data in Phase 9 */
  readonly canUseLiveData: false;
  /** Always false — no Solana RPC in Phase 9 */
  readonly canUseSolanaRpc: false;
  /** Always false — no provider APIs in Phase 9 */
  readonly canUseProviderApis: false;
  /** Always false — no wallet data in Phase 9 */
  readonly canUseWalletData: false;
  /** Always false — no trade intents in Phase 9 */
  readonly canCreateTradeIntents: false;
  /** Always false — no trading in Phase 9 */
  readonly canTrade: false;
  /** Always false — no execution in Phase 9 */
  readonly canExecute: false;
  /** Phase 30 — deterministic creator intelligence fixtures */
  readonly creatorIntelligenceFixtures: true;
  /** Phase 30 — synthetic creator profile fixtures */
  readonly syntheticCreatorProfiles: true;
  /** Phase 30 — narrative fixture models */
  readonly creatorNarrativeFixtures: true;
  /** Phase 30 — creator risk indicator fixtures */
  readonly creatorRiskIndicators: true;
  /** Phase 30 — creator credibility indicator fixtures */
  readonly creatorCredibilityIndicators: true;
  /** Phase 30 — creator fixture safety validation */
  readonly creatorFixtureSafetyValidation: true;
  /** Always false — no live creator enrichment */
  readonly creatorLiveData: false;
  /** Always false — no creator social APIs */
  readonly creatorSocialApiAccess: false;
  /** Always false — no creator scraping */
  readonly creatorScraping: false;
  /** Always false — no creator identity resolution */
  readonly creatorIdentityResolution: false;
  /** Always false — no creator investment advice */
  readonly creatorInvestmentAdvice: false;
  /** Always false — no creator trading signals */
  readonly creatorTradingSignals: false;
  /** Always false — no creator external network */
  readonly creatorExternalNetwork: false;
  /** Always false — no creator persistence */
  readonly creatorPersistence: false;
  /** Always true — fixture/local scoring only in Phase 9 */
  readonly fixtureOnly: true;
  /** Whether this capabilities object is safe to display */
  readonly safeToDisplay: true;
}

/**
 * The complete creator intelligence result for a single creator.
 *
 * Safety invariants (enforced at construction time):
 *   - actionAllowed/tradingAllowed/executionAllowed are always false
 *   - liveData is always false
 *   - fixtureOnly is always true
 *   - safeToDisplay is always true
 *   - finalScore is bounded 0–100
 *   - confidence is bounded 0–1
 *   - No secrets, no wallet data, no raw URLs
 *   - finalScore must not be described as a trading signal
 */
export interface CreatorIntelligenceResult {
  /** Creator ID of the analysed creator */
  readonly creatorId: string;
  /** The creator's identity profile */
  readonly profile: import('./creator-profile.js').CreatorProfile;
  /** The launch history snapshot used for scoring */
  readonly history: import('./creator-history.js').CreatorLaunchHistorySnapshot;
  /** Individual component scores */
  readonly componentScores: import('./score-types.js').CreatorComponentScores;
  /** Weighted composite score 0–100 */
  readonly finalScore: number;
  /**
   * Confidence in the result 0–1.
   * Degrades when data is missing or incomplete.
   */
  readonly confidence: number;
  /** Classification of the creator — never uses trade wording */
  readonly classification: import('./classifier.js').CreatorClassification;
  /** Risk flags raised by the scoring components */
  readonly riskFlags: readonly import('./risk-flags.js').CreatorRiskFlagEntry[];
  /** Safe human-readable reasons for the overall result */
  readonly reasons: readonly string[];
  /** ISO timestamp when this result was generated */
  readonly generatedAt: string;
  /** Always true — only fixture data in Phase 9 */
  readonly fixtureOnly: true;
  /** Always false — no live data in Phase 9 */
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
