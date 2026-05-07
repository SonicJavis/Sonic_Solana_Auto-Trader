/**
 * Phase 32 — Bundle / Manipulation Evidence Fixture Models v1: deterministic fixtures.
 */

import { buildManipulationEvidenceFixture } from './evidence-fixture-model-builders.js';
import type {
  BundlePatternFixture,
  CoordinationEvidenceFixture,
  DistributionConcentrationFixture,
  FundingPatternEvidenceFixture,
  LaunchStructureEvidenceFixture,
  LiquidityPatternEvidenceFixture,
  ManipulationEvidenceFixture,
  ManipulationEvidenceFixtureName,
  ManipulationQualityIndicator,
  ManipulationRiskIndicator,
} from './evidence-fixture-model-types.js';

function bundlePattern(
  pattern: BundlePatternFixture['pattern'],
  sameBlockBand: BundlePatternFixture['sameBlockBand'],
  bundleLikelihood: BundlePatternFixture['bundleLikelihood'],
  participationBand: BundlePatternFixture['participationBand'],
  notes: readonly string[],
): BundlePatternFixture {
  return { pattern, sameBlockBand, bundleLikelihood, participationBand, notes };
}

function launchStructure(
  launchShape: LaunchStructureEvidenceFixture['launchShape'],
  allocationBand: LaunchStructureEvidenceFixture['allocationBand'],
  buyerDiversityBand: LaunchStructureEvidenceFixture['buyerDiversityBand'],
  openingWindowBand: LaunchStructureEvidenceFixture['openingWindowBand'],
  notes: readonly string[],
): LaunchStructureEvidenceFixture {
  return { launchShape, allocationBand, buyerDiversityBand, openingWindowBand, notes };
}

function liquidityPattern(
  liquidityState: LiquidityPatternEvidenceFixture['liquidityState'],
  withdrawalPattern: LiquidityPatternEvidenceFixture['withdrawalPattern'],
  supportBand: LiquidityPatternEvidenceFixture['supportBand'],
  notes: readonly string[],
): LiquidityPatternEvidenceFixture {
  return { liquidityState, withdrawalPattern, supportBand, notes };
}

function coordination(
  coordinationType: CoordinationEvidenceFixture['coordinationType'],
  intensity: CoordinationEvidenceFixture['intensity'],
  synchronization: CoordinationEvidenceFixture['synchronization'],
  participantFreshness: CoordinationEvidenceFixture['participantFreshness'],
  notes: readonly string[],
): CoordinationEvidenceFixture {
  return { coordinationType, intensity, synchronization, participantFreshness, notes };
}

function distribution(
  concentrationType: DistributionConcentrationFixture['concentrationType'],
  concentrationBand: DistributionConcentrationFixture['concentrationBand'],
  distributionSpread: DistributionConcentrationFixture['distributionSpread'],
  suspectedCreatorLink: DistributionConcentrationFixture['suspectedCreatorLink'],
  notes: readonly string[],
): DistributionConcentrationFixture {
  return {
    concentrationType,
    concentrationBand,
    distributionSpread,
    suspectedCreatorLink,
    notes,
  };
}

function fundingPattern(
  fundingType: FundingPatternEvidenceFixture['fundingType'],
  linkageBand: FundingPatternEvidenceFixture['linkageBand'],
  freshnessBand: FundingPatternEvidenceFixture['freshnessBand'],
  provenanceClarity: FundingPatternEvidenceFixture['provenanceClarity'],
  notes: readonly string[],
): FundingPatternEvidenceFixture {
  return { fundingType, linkageBand, freshnessBand, provenanceClarity, notes };
}

function risk(
  code: string,
  label: string,
  level: ManipulationRiskIndicator['level'],
  rationale: string,
): ManipulationRiskIndicator {
  return { code, label, level, rationale };
}

function quality(
  code: string,
  label: string,
  level: ManipulationQualityIndicator['level'],
  rationale: string,
): ManipulationQualityIndicator {
  return { code, label, level, rationale };
}

function mustBuildFixture(
  input: Parameters<typeof buildManipulationEvidenceFixture>[0],
): ManipulationEvidenceFixture {
  const result = buildManipulationEvidenceFixture(input);
  if (!result.success || !result.fixture) {
    throw new Error(`Invalid Phase 32 fixture definition: ${input.name}`);
  }
  return result.fixture;
}

export const CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'clean-organic-launch-evidence',
  kind: 'organic-launch',
  bundlePattern: bundlePattern('organic', 'none', 'none', 'medium', [
    'Synthetic same-block activity remains broad and low intensity.',
  ]),
  launchStructure: launchStructure('organic', 'broad', 'diverse', 'active', [
    'Synthetic opening flow shows broad allocation and diverse participation.',
  ]),
  liquidityPattern: liquidityPattern('stable', 'none', 'stable', [
    'Synthetic liquidity remains stable without staged withdrawal behavior.',
  ]),
  coordination: coordination('organic', 'none', 'none', 'established', [
    'Synthetic launch participants do not show coordinated timing behavior.',
  ]),
  distribution: distribution('holder-distribution', 'low', 'broad', 'none', [
    'Synthetic holdings remain broadly distributed after launch.',
  ]),
  fundingPattern: fundingPattern('diverse', 'none', 'established', 'clear-synthetic', [
    'Synthetic funding context stays diverse and bounded.',
  ]),
  riskIndicators: [],
  qualityIndicators: [
    quality('ORGANIC_PARTICIPATION', 'Organic participation context', 'high', 'Synthetic launch flow stays broad and non-concentrated.'),
    quality('STABLE_LIQUIDITY_CONTEXT', 'Stable liquidity context', 'high', 'Liquidity profile remains stable across the synthetic opening window.'),
  ],
  safeNotes: ['Clean organic launch synthetic evidence.'],
});

export const MILD_CONCENTRATION_WATCHLIST_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'mild-concentration-watchlist-evidence',
  kind: 'concentration-watchlist',
  bundlePattern: bundlePattern('watchlist-concentration', 'moderate', 'watchlist', 'medium', [
    'Synthetic same-block concentration is noticeable but not extreme.',
  ]),
  launchStructure: launchStructure('concentrated', 'mixed', 'mixed', 'active', [
    'Synthetic allocation compresses into a moderate subset of early participants.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'incremental', 'mixed', [
    'Liquidity remains present but deserves synthetic watchlist monitoring.',
  ]),
  coordination: coordination('early-buy', 'moderate', 'clustered', 'mixed', [
    'Moderate clustered synthetic timing appears in early buys.',
  ]),
  distribution: distribution('early-buys', 'moderate', 'mixed', 'possible', [
    'Synthetic early-buy distribution is narrower than a fully organic baseline.',
  ]),
  fundingPattern: fundingPattern('diverse', 'partial', 'mixed', 'bounded-synthetic', [
    'Funding provenance is mostly diverse with limited synthetic overlap.',
  ]),
  riskIndicators: [
    risk('MILD_CONCENTRATION', 'Mild concentration watchlist', 'medium', 'Synthetic concentration is elevated enough for watchlist review.'),
  ],
  qualityIndicators: [
    quality('PARTIAL_DIVERSITY_REMAINS', 'Partial diversity remains', 'moderate', 'Buyer diversity is reduced but still present in synthetic evidence.'),
  ],
  safeNotes: ['Mild concentration watchlist synthetic evidence.'],
});

export const SAME_BLOCK_BUNDLE_LIKE_CONCENTRATION_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'same-block-bundle-like-concentration-evidence',
  kind: 'bundle-like-concentration',
  bundlePattern: bundlePattern('bundle-like-concentration', 'extreme', 'high', 'large', [
    'Synthetic same-block concentration reaches extreme bundle-like density.',
  ]),
  launchStructure: launchStructure('concentrated', 'narrow', 'concentrated', 'layered', [
    'Synthetic opening flow compresses heavily into a narrow allocation band.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'incremental', 'fragile', [
    'Liquidity remains synthetic-only but appears fragile against concentrated participation.',
  ]),
  coordination: coordination('early-buy', 'high', 'tight', 'fresh', [
    'Synthetic early buys align in a tightly synchronized same-block pattern.',
  ]),
  distribution: distribution('early-buys', 'extreme', 'narrow', 'possible', [
    'Synthetic early-buyer concentration is extreme and narrow.',
  ]),
  fundingPattern: fundingPattern('same-source', 'strong', 'fresh', 'bounded-synthetic', [
    'Synthetic funding overlap reinforces bundle-like concentration context.',
  ]),
  riskIndicators: [
    risk('SAME_BLOCK_CONCENTRATION', 'Same-block concentration', 'critical', 'Synthetic same-block clustering is extreme.'),
    risk('BUNDLE_LIKE_PATTERN', 'Bundle-like pattern', 'critical', 'Synthetic launch pattern resembles bundle-like concentration.'),
    risk('EARLY_BUY_COMPRESSION', 'Early buy compression', 'high', 'Synthetic early buys compress into a narrow group.'),
  ],
  qualityIndicators: [],
  safeNotes: ['Same-block bundle-like concentration synthetic evidence.'],
});

export const COORDINATED_EARLY_BUY_PATTERN_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'coordinated-early-buy-pattern-evidence',
  kind: 'coordinated-early-buy',
  bundlePattern: bundlePattern('watchlist-concentration', 'high', 'elevated', 'medium', [
    'Synthetic early-buy timing is concentrated into a short coordinated window.',
  ]),
  launchStructure: launchStructure('coordinated-early-buy', 'mixed', 'concentrated', 'bursty', [
    'Synthetic opening phase contains a bursty early-buy sequence.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'incremental', 'mixed', [
    'Liquidity stays available but reacts sharply to clustered synthetic entry pressure.',
  ]),
  coordination: coordination('early-buy', 'high', 'clustered', 'mixed', [
    'Synthetic participants align around a concentrated early-buy burst.',
  ]),
  distribution: distribution('early-buys', 'high', 'narrow', 'none', [
    'Synthetic early-buy distribution narrows during the opening window.',
  ]),
  fundingPattern: fundingPattern('diverse', 'partial', 'mixed', 'bounded-synthetic', [
    'Funding provenance is mixed without a single synthetic source dominating.',
  ]),
  riskIndicators: [
    risk('COORDINATED_EARLY_BUY', 'Coordinated early buy pattern', 'high', 'Synthetic early-buy timing is strongly coordinated.'),
    risk('OPENING_WINDOW_PRESSURE', 'Opening-window pressure', 'medium', 'Synthetic pressure clusters in the first launch window.'),
  ],
  qualityIndicators: [],
  safeNotes: ['Coordinated early buy synthetic evidence.'],
});

export const COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'coordinated-early-sell-pattern-evidence',
  kind: 'coordinated-early-sell',
  bundlePattern: bundlePattern('watchlist-concentration', 'moderate', 'watchlist', 'medium', [
    'Synthetic same-block evidence is moderate while exit timing clusters quickly.',
  ]),
  launchStructure: launchStructure('coordinated-early-sell', 'mixed', 'mixed', 'bursty', [
    'Synthetic opening flow transitions rapidly into clustered early sells.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'staged', 'fragile', [
    'Liquidity appears vulnerable once clustered synthetic exits begin.',
  ]),
  coordination: coordination('early-sell', 'high', 'tight', 'mixed', [
    'Synthetic exits align tightly across an early sell window.',
  ]),
  distribution: distribution('early-sells', 'high', 'narrow', 'possible', [
    'Synthetic early-sell activity compresses into a narrow set of participants.',
  ]),
  fundingPattern: fundingPattern('diverse', 'partial', 'mixed', 'bounded-synthetic', [
    'Funding provenance is mixed but not fully organic.',
  ]),
  riskIndicators: [
    risk('COORDINATED_EARLY_SELL', 'Coordinated early sell pattern', 'high', 'Synthetic exit timing is tightly coordinated.'),
    risk('EXIT_CLUSTERING', 'Exit clustering', 'high', 'Synthetic sells cluster during a short early window.'),
  ],
  qualityIndicators: [
    quality('LIMITED_BUNDLE_EVIDENCE', 'Limited bundle evidence', 'low', 'Synthetic sell coordination is clearer than bundle-like concentration.'),
  ],
  crossReferences: {
    walletClusterFixtureName: 'coordinated-sell-risk-cluster',
    sharedSignals: ['coordinated-exit', 'narrow-exit-window'],
    cautionNotes: ['Synthetic cross-reference only; does not attribute real activity.'],
  },
  safeNotes: ['Coordinated early sell synthetic evidence.'],
});

export const FRESH_WALLET_BURST_PATTERN_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'fresh-wallet-burst-pattern-evidence',
  kind: 'fresh-wallet-burst',
  bundlePattern: bundlePattern('watchlist-concentration', 'high', 'elevated', 'large', [
    'Synthetic same-block activity is amplified by fresh-wallet participation.',
  ]),
  launchStructure: launchStructure('coordinated-early-buy', 'mixed', 'concentrated', 'bursty', [
    'Synthetic opening flow is dominated by a burst of fresh participants.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'incremental', 'mixed', [
    'Liquidity remains present but synthetic fresh-wallet bursts create instability.',
  ]),
  coordination: coordination('early-buy', 'high', 'clustered', 'fresh', [
    'Synthetic participants are predominantly fresh and coordinated.',
  ]),
  distribution: distribution('early-buys', 'high', 'narrow', 'none', [
    'Synthetic fresh-wallet participation narrows early-buy distribution.',
  ]),
  fundingPattern: fundingPattern('fresh-wallet-burst', 'clustered', 'fresh', 'bounded-synthetic', [
    'Synthetic funding profile aligns with a fresh-wallet burst pattern.',
  ]),
  riskIndicators: [
    risk('FRESH_WALLET_BURST', 'Fresh-wallet burst pattern', 'critical', 'Synthetic participation is dominated by fresh wallets in a short window.'),
    risk('COORDINATED_FRESH_ENTRY', 'Coordinated fresh entry', 'high', 'Fresh-wallet entry timing clusters tightly in synthetic evidence.'),
  ],
  qualityIndicators: [],
  crossReferences: {
    walletClusterFixtureName: 'fresh-wallet-farm-cluster',
    sharedSignals: ['fresh-wallet-cluster', 'coordinated-entry'],
    cautionNotes: ['Synthetic cross-reference is fixture-name-only.'],
  },
  safeNotes: ['Fresh-wallet burst synthetic evidence.'],
});

export const SAME_FUNDING_SOURCE_SYNTHETIC_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'same-funding-source-synthetic-evidence',
  kind: 'same-funding-source',
  bundlePattern: bundlePattern('watchlist-concentration', 'moderate', 'elevated', 'medium', [
    'Synthetic concentration is reinforced by the same funding-source pattern.',
  ]),
  launchStructure: launchStructure('concentrated', 'mixed', 'concentrated', 'active', [
    'Synthetic launch allocation narrows around linked funding provenance.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'incremental', 'mixed', [
    'Liquidity profile remains synthetic-only but linked funding adds watchlist pressure.',
  ]),
  coordination: coordination('funding-linked', 'high', 'clustered', 'mixed', [
    'Synthetic coordination aligns with same-source funding evidence.',
  ]),
  distribution: distribution('launch-allocation', 'high', 'narrow', 'possible', [
    'Synthetic launch allocation narrows where funding provenance overlaps.',
  ]),
  fundingPattern: fundingPattern('same-source', 'strong', 'mixed', 'clear-synthetic', [
    'Synthetic funding provenance is strongly linked to a single bounded source pattern.',
  ]),
  riskIndicators: [
    risk('SAME_FUNDING_SOURCE', 'Same funding-source pattern', 'critical', 'Synthetic funding provenance is tightly linked.'),
    risk('LINKED_OPENING_FLOW', 'Linked opening flow', 'high', 'Synthetic opening activity aligns with the same funding source.'),
  ],
  qualityIndicators: [
    quality('BOUNDED_SYNTHETIC_PROVENANCE', 'Bounded synthetic provenance', 'moderate', 'Funding context remains synthetic-only and non-attributive.'),
  ],
  crossReferences: {
    walletClusterFixtureName: 'same-funding-source-cluster',
    sharedSignals: ['funding-linkage', 'opening-window-overlap'],
    cautionNotes: ['Synthetic funding labels do not imply real control or attribution.'],
  },
  safeNotes: ['Same funding source synthetic evidence.'],
});

export const STAGED_LIQUIDITY_PULL_RISK_PATTERN_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'staged-liquidity-pull-risk-pattern-evidence',
  kind: 'staged-liquidity-pull-risk',
  bundlePattern: bundlePattern('watchlist-concentration', 'moderate', 'watchlist', 'medium', [
    'Synthetic concentration is secondary to staged liquidity withdrawal risk.',
  ]),
  launchStructure: launchStructure('concentrated', 'mixed', 'mixed', 'active', [
    'Synthetic launch structure shows uneven support retention.',
  ]),
  liquidityPattern: liquidityPattern('staged-pull-risk', 'staged', 'fragile', [
    'Synthetic liquidity support is removed in staged steps.',
  ]),
  coordination: coordination('early-sell', 'moderate', 'clustered', 'mixed', [
    'Synthetic exit behavior becomes more coordinated as support thins.',
  ]),
  distribution: distribution('holder-distribution', 'high', 'mixed', 'possible', [
    'Synthetic concentration remains elevated while liquidity support decays.',
  ]),
  fundingPattern: fundingPattern('diverse', 'partial', 'mixed', 'bounded-synthetic', [
    'Synthetic funding remains mixed; staged liquidity risk is the primary concern.',
  ]),
  riskIndicators: [
    risk('STAGED_LIQUIDITY_PULL_RISK', 'Staged liquidity pull risk', 'critical', 'Synthetic liquidity support decays in staged steps.'),
    risk('FRAGILE_SUPPORT_BAND', 'Fragile support band', 'high', 'Synthetic support quality becomes fragile as staged withdrawal advances.'),
  ],
  qualityIndicators: [],
  crossReferences: {
    creatorFixtureName: 'poor-disclosure-creator',
    sharedSignals: ['support-withdrawal-watchlist'],
    cautionNotes: ['Synthetic cross-reference does not imply real creator linkage.'],
  },
  safeNotes: ['Staged liquidity pull risk synthetic evidence.'],
});

export const CREATOR_LINKED_CONCENTRATION_PATTERN_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'creator-linked-concentration-pattern-evidence',
  kind: 'creator-linked-concentration',
  bundlePattern: bundlePattern('bundle-like-concentration', 'high', 'elevated', 'medium', [
    'Synthetic concentration overlaps with creator-linked signals.',
  ]),
  launchStructure: launchStructure('concentrated', 'narrow', 'concentrated', 'layered', [
    'Synthetic allocation narrows alongside creator-linked participation hints.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'incremental', 'fragile', [
    'Synthetic liquidity remains fragile when creator-linked concentration grows.',
  ]),
  coordination: coordination('creator-linked', 'high', 'clustered', 'mixed', [
    'Synthetic coordination reflects creator-linked timing overlap.',
  ]),
  distribution: distribution('launch-allocation', 'extreme', 'narrow', 'strong', [
    'Synthetic allocation and concentration both point toward creator-linked clustering.',
  ]),
  fundingPattern: fundingPattern('creator-linked', 'strong', 'mixed', 'bounded-synthetic', [
    'Synthetic funding pattern reflects creator-linked clustering rather than broad diversity.',
  ]),
  riskIndicators: [
    risk('CREATOR_LINKED_CONCENTRATION', 'Creator-linked concentration', 'critical', 'Synthetic concentration overlaps with creator-linked evidence.'),
    risk('NARROW_LAUNCH_ALLOCATION', 'Narrow launch allocation', 'high', 'Synthetic launch allocation becomes sharply concentrated.'),
  ],
  qualityIndicators: [
    quality('SYNTHETIC_REFERENCE_ONLY', 'Synthetic reference only', 'low', 'Cross-reference remains bounded to fixture names and summaries.'),
  ],
  crossReferences: {
    creatorFixtureName: 'coordinated-hype-creator',
    walletClusterFixtureName: 'creator-linked-cluster',
    sharedSignals: ['creator-linked-timing', 'narrow-allocation', 'synthetic-hype-context'],
    cautionNotes: ['Synthetic creator-link terms are fixture labels only and not identity resolution.'],
  },
  safeNotes: ['Creator-linked concentration synthetic evidence.'],
});

export const BOT_NOISE_FALSE_POSITIVE_PATTERN_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'bot-noise-false-positive-pattern-evidence',
  kind: 'bot-noise-false-positive',
  bundlePattern: bundlePattern('benign-high-activity', 'high', 'watchlist', 'large', [
    'Synthetic same-block activity is noisy but not sufficient for high-risk labeling.',
  ]),
  launchStructure: launchStructure('organic', 'mixed', 'diverse', 'bursty', [
    'Synthetic high activity appears broad despite bursty noise.',
  ]),
  liquidityPattern: liquidityPattern('stable', 'none', 'stable', [
    'Liquidity remains stable in the synthetic false-positive scenario.',
  ]),
  coordination: coordination('bot-noise', 'moderate', 'loose', 'mixed', [
    'Synthetic noise is high but does not align into tight manipulation timing.',
  ]),
  distribution: distribution('holder-distribution', 'moderate', 'broad', 'none', [
    'Synthetic distribution remains broad enough to counter pure manipulation claims.',
  ]),
  fundingPattern: fundingPattern('diverse', 'none', 'mixed', 'clear-synthetic', [
    'Synthetic funding provenance stays diverse and does not confirm coordination.',
  ]),
  riskIndicators: [
    risk('BOT_NOISE_WATCHLIST', 'Bot-noise watchlist', 'medium', 'Synthetic activity volume is noisy enough to require bounded review.'),
  ],
  qualityIndicators: [
    quality('BOT_NOISE_FALSE_POSITIVE', 'Bot-noise false-positive context', 'high', 'Synthetic activity is noisy but broad and non-confirmatory.'),
    quality('STABLE_LIQUIDITY_CONTEXT', 'Stable liquidity context', 'moderate', 'Stable liquidity reduces synthetic false-positive risk.'),
  ],
  crossReferences: {
    walletClusterFixtureName: 'bot-noise-cluster',
    sharedSignals: ['high-activity-noise', 'bounded-false-positive-context'],
    cautionNotes: ['Synthetic false-positive context prevents overstatement.'],
  },
  safeNotes: ['Bot-noise false-positive synthetic evidence.'],
});

export const BENIGN_HIGH_ACTIVITY_LAUNCH_PATTERN_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'benign-high-activity-launch-pattern-evidence',
  kind: 'benign-high-activity',
  bundlePattern: bundlePattern('benign-high-activity', 'moderate', 'watchlist', 'large', [
    'Synthetic activity is high but broadly distributed across participants.',
  ]),
  launchStructure: launchStructure('organic', 'broad', 'diverse', 'bursty', [
    'Synthetic launch is active and bursty without concentrated allocation.',
  ]),
  liquidityPattern: liquidityPattern('stable', 'none', 'stable', [
    'Synthetic liquidity support remains intact during high activity.',
  ]),
  coordination: coordination('organic', 'low', 'loose', 'mixed', [
    'Synthetic timing overlap stays low despite elevated volume.',
  ]),
  distribution: distribution('holder-distribution', 'low', 'broad', 'none', [
    'Synthetic distribution stays broad in a high-activity launch.',
  ]),
  fundingPattern: fundingPattern('diverse', 'none', 'mixed', 'clear-synthetic', [
    'Synthetic funding provenance remains diverse in the high-activity case.',
  ]),
  riskIndicators: [],
  qualityIndicators: [
    quality('BENIGN_HIGH_ACTIVITY_CONTEXT', 'Benign high-activity context', 'high', 'Synthetic activity is elevated but remains broadly distributed.'),
    quality('DIVERSE_FUNDING_CONTEXT', 'Diverse funding context', 'high', 'Funding diversity lowers synthetic manipulation concern.'),
  ],
  safeNotes: ['Benign high-activity launch synthetic evidence.'],
});

export const HIGH_RISK_MANIPULATION_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'high-risk-manipulation-evidence',
  kind: 'high-risk-manipulation',
  bundlePattern: bundlePattern('bundle-like-concentration', 'extreme', 'high', 'large', [
    'Synthetic evidence stacks same-block and bundle-like concentration at maximum intensity.',
  ]),
  launchStructure: launchStructure('coordinated-early-buy', 'narrow', 'concentrated', 'layered', [
    'Synthetic opening flow is layered, narrow, and heavily concentrated.',
  ]),
  liquidityPattern: liquidityPattern('high-risk', 'abrupt', 'fragile', [
    'Synthetic liquidity support breaks abruptly after concentrated activity.',
  ]),
  coordination: coordination('early-sell', 'critical', 'tight', 'fresh', [
    'Synthetic entries and exits both align into a critical coordinated pattern.',
  ]),
  distribution: distribution('early-sells', 'extreme', 'narrow', 'strong', [
    'Synthetic distribution compresses into an extreme early-sell concentration.',
  ]),
  fundingPattern: fundingPattern('same-source', 'strong', 'fresh', 'bounded-synthetic', [
    'Synthetic funding linkage is strong and fresh across the risk stack.',
  ]),
  riskIndicators: [
    risk('MULTI_SIGNAL_MANIPULATION_STACK', 'Multi-signal manipulation stack', 'critical', 'Synthetic evidence aligns multiple high-risk signals at once.'),
    risk('EXTREME_COORDINATION', 'Extreme coordination', 'critical', 'Synthetic timing is tightly coordinated across entries and exits.'),
    risk('ABRUPT_SUPPORT_DECAY', 'Abrupt support decay', 'high', 'Synthetic liquidity support fails abruptly after concentration.'),
  ],
  qualityIndicators: [],
  crossReferences: {
    creatorFixtureName: 'high-risk-creator',
    walletClusterFixtureName: 'high-risk-multi-signal-cluster',
    sharedSignals: ['multi-signal-risk-stack', 'concentrated-opening-flow', 'fragile-support'],
    cautionNotes: ['Synthetic high-risk fixture remains non-advisory and non-accusatory.'],
  },
  safeNotes: ['High-risk manipulation synthetic evidence.'],
});

export const MIXED_SIGNAL_MANIPULATION_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'mixed-signal-manipulation-evidence',
  kind: 'mixed-signal',
  bundlePattern: bundlePattern('watchlist-concentration', 'moderate', 'watchlist', 'medium', [
    'Synthetic bundle-like concentration is present but not decisive.',
  ]),
  launchStructure: launchStructure('concentrated', 'mixed', 'mixed', 'active', [
    'Synthetic launch structure contains both broad and concentrated segments.',
  ]),
  liquidityPattern: liquidityPattern('watchlist', 'incremental', 'mixed', [
    'Synthetic liquidity support remains mixed rather than clearly fragile or stable.',
  ]),
  coordination: coordination('early-buy', 'moderate', 'clustered', 'mixed', [
    'Synthetic coordination is present but not overwhelming.',
  ]),
  distribution: distribution('holder-distribution', 'moderate', 'mixed', 'possible', [
    'Synthetic concentration and distribution send mixed signals.',
  ]),
  fundingPattern: fundingPattern('diverse', 'partial', 'mixed', 'bounded-synthetic', [
    'Synthetic funding context is partially linked but not conclusive.',
  ]),
  riskIndicators: [
    risk('PARTIAL_COORDINATION', 'Partial coordination', 'medium', 'Synthetic coordination is noticeable but not extreme.'),
  ],
  qualityIndicators: [
    quality('PARTIAL_DIVERSITY_CONTEXT', 'Partial diversity context', 'moderate', 'Synthetic participant diversity prevents a one-sided interpretation.'),
  ],
  crossReferences: {
    creatorFixtureName: 'balanced-mixed-signal-creator',
    walletClusterFixtureName: 'mixed-signal-cluster',
    sharedSignals: ['mixed-signal-balance', 'partial-coordination'],
    cautionNotes: ['Synthetic mixed-signal evidence is suitable for regression-only analysis.'],
  },
  safeNotes: ['Mixed-signal manipulation synthetic evidence.'],
});

export const MALFORMED_INPUT_SAFE_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'malformed-input-safe-evidence',
  kind: 'malformed-safe',
  bundlePattern: bundlePattern('unknown', 'unknown', 'unknown', 'unknown', [
    'Synthetic malformed-safe fixture keeps unsupported details bounded to unknown values.',
  ]),
  launchStructure: launchStructure('unknown', 'unknown', 'unknown', 'unknown', [
    'Malformed-safe synthetic launch structure degrades to unknown without throwing.',
  ]),
  liquidityPattern: liquidityPattern('unknown', 'unknown', 'unknown', [
    'Malformed-safe synthetic liquidity pattern remains serializable and bounded.',
  ]),
  coordination: coordination('unknown', 'unknown', 'unknown', 'unknown', [
    'Malformed-safe synthetic coordination remains unknown and non-accusatory.',
  ]),
  distribution: distribution('unknown', 'unknown', 'unknown', 'unknown', [
    'Malformed-safe synthetic concentration context stays unknown.',
  ]),
  fundingPattern: fundingPattern('unknown', 'unknown', 'unknown', 'unknown', [
    'Malformed-safe synthetic funding context remains unknown.',
  ]),
  riskIndicators: [
    risk('MALFORMED_INPUT_BOUNDED', 'Malformed input bounded', 'low', 'Synthetic malformed input is safely bounded into unknown categories.'),
  ],
  qualityIndicators: [
    quality('SAFE_DEGRADATION', 'Safe degradation', 'high', 'Synthetic malformed handling stays deterministic and serializable.'),
  ],
  safeNotes: ['Malformed input safe synthetic evidence.'],
});

export const SAFETY_BOUNDARY_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'safety-boundary-evidence',
  kind: 'safety-boundary',
  bundlePattern: bundlePattern('organic', 'none', 'none', 'small', [
    'Synthetic boundary fixture avoids overstating bundle-like activity.',
  ]),
  launchStructure: launchStructure('organic', 'broad', 'diverse', 'calm', [
    'Synthetic boundary fixture reinforces broad and bounded launch context.',
  ]),
  liquidityPattern: liquidityPattern('stable', 'none', 'stable', [
    'Synthetic boundary fixture keeps liquidity context stable and read-only.',
  ]),
  coordination: coordination('organic', 'none', 'none', 'established', [
    'Synthetic boundary fixture avoids coordination claims beyond bounded context.',
  ]),
  distribution: distribution('holder-distribution', 'low', 'broad', 'none', [
    'Synthetic boundary fixture preserves broad distribution language.',
  ]),
  fundingPattern: fundingPattern('diverse', 'none', 'established', 'clear-synthetic', [
    'Synthetic boundary fixture preserves non-attributive funding wording.',
  ]),
  riskIndicators: [],
  qualityIndicators: [
    quality('BOUNDARY_COMPLIANCE', 'Boundary compliance', 'high', 'Synthetic evidence remains local-only, deterministic, and non-accusatory.'),
    quality('READ_ONLY_SCOPE', 'Read-only scope', 'high', 'Synthetic evidence does not imply live inspection or execution.'),
  ],
  safeNotes: ['Safety boundary synthetic evidence.'],
});

export const UNKNOWN_INSUFFICIENT_DATA_EVIDENCE_FIXTURE = mustBuildFixture({
  name: 'unknown-insufficient-data-evidence',
  kind: 'unknown-insufficient-data',
  bundlePattern: bundlePattern('unknown', 'unknown', 'unknown', 'unknown', [
    'Synthetic insufficient-data fixture intentionally avoids directional claims.',
  ]),
  launchStructure: launchStructure('unknown', 'unknown', 'unknown', 'unknown', [
    'Synthetic launch structure remains unknown when data is insufficient.',
  ]),
  liquidityPattern: liquidityPattern('unknown', 'unknown', 'unknown', [
    'Synthetic liquidity pattern remains unknown under insufficient data.',
  ]),
  coordination: coordination('unknown', 'unknown', 'unknown', 'unknown', [
    'Synthetic coordination pattern remains unknown under insufficient data.',
  ]),
  distribution: distribution('unknown', 'unknown', 'unknown', 'unknown', [
    'Synthetic concentration pattern remains unknown under insufficient data.',
  ]),
  fundingPattern: fundingPattern('unknown', 'unknown', 'unknown', 'unknown', [
    'Synthetic funding pattern remains unknown under insufficient data.',
  ]),
  riskIndicators: [],
  qualityIndicators: [],
  safeNotes: ['Unknown insufficient-data synthetic evidence.'],
});

export const PHASE_32_MANIPULATION_EVIDENCE_FIXTURES = new Map<
  ManipulationEvidenceFixtureName,
  ManipulationEvidenceFixture
>([
  [CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.name, CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE],
  [MILD_CONCENTRATION_WATCHLIST_EVIDENCE_FIXTURE.name, MILD_CONCENTRATION_WATCHLIST_EVIDENCE_FIXTURE],
  [SAME_BLOCK_BUNDLE_LIKE_CONCENTRATION_EVIDENCE_FIXTURE.name, SAME_BLOCK_BUNDLE_LIKE_CONCENTRATION_EVIDENCE_FIXTURE],
  [COORDINATED_EARLY_BUY_PATTERN_EVIDENCE_FIXTURE.name, COORDINATED_EARLY_BUY_PATTERN_EVIDENCE_FIXTURE],
  [COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE.name, COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE],
  [FRESH_WALLET_BURST_PATTERN_EVIDENCE_FIXTURE.name, FRESH_WALLET_BURST_PATTERN_EVIDENCE_FIXTURE],
  [SAME_FUNDING_SOURCE_SYNTHETIC_EVIDENCE_FIXTURE.name, SAME_FUNDING_SOURCE_SYNTHETIC_EVIDENCE_FIXTURE],
  [STAGED_LIQUIDITY_PULL_RISK_PATTERN_EVIDENCE_FIXTURE.name, STAGED_LIQUIDITY_PULL_RISK_PATTERN_EVIDENCE_FIXTURE],
  [CREATOR_LINKED_CONCENTRATION_PATTERN_EVIDENCE_FIXTURE.name, CREATOR_LINKED_CONCENTRATION_PATTERN_EVIDENCE_FIXTURE],
  [BOT_NOISE_FALSE_POSITIVE_PATTERN_EVIDENCE_FIXTURE.name, BOT_NOISE_FALSE_POSITIVE_PATTERN_EVIDENCE_FIXTURE],
  [BENIGN_HIGH_ACTIVITY_LAUNCH_PATTERN_EVIDENCE_FIXTURE.name, BENIGN_HIGH_ACTIVITY_LAUNCH_PATTERN_EVIDENCE_FIXTURE],
  [HIGH_RISK_MANIPULATION_EVIDENCE_FIXTURE.name, HIGH_RISK_MANIPULATION_EVIDENCE_FIXTURE],
  [MIXED_SIGNAL_MANIPULATION_EVIDENCE_FIXTURE.name, MIXED_SIGNAL_MANIPULATION_EVIDENCE_FIXTURE],
  [MALFORMED_INPUT_SAFE_EVIDENCE_FIXTURE.name, MALFORMED_INPUT_SAFE_EVIDENCE_FIXTURE],
  [SAFETY_BOUNDARY_EVIDENCE_FIXTURE.name, SAFETY_BOUNDARY_EVIDENCE_FIXTURE],
  [UNKNOWN_INSUFFICIENT_DATA_EVIDENCE_FIXTURE.name, UNKNOWN_INSUFFICIENT_DATA_EVIDENCE_FIXTURE],
]);

export function listManipulationEvidenceFixtures(): readonly ManipulationEvidenceFixtureName[] {
  return [...PHASE_32_MANIPULATION_EVIDENCE_FIXTURES.keys()].sort((left, right) => left.localeCompare(right));
}

export function getManipulationEvidenceFixture(
  name: ManipulationEvidenceFixtureName,
): ManipulationEvidenceFixture | undefined {
  return PHASE_32_MANIPULATION_EVIDENCE_FIXTURES.get(name);
}
