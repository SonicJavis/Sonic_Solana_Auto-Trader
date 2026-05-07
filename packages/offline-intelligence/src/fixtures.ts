/**
 * Phase 33 — Offline Intelligence Composite Evidence Models v1: deterministic fixtures.
 */

import { buildOfflineCompositeEvidenceFixture } from './builders.js';
import type {
  CompositeConfidenceIndicator,
  CompositeEvidenceSourceReference,
  CompositeEvidenceWeighting,
  CompositeQualityIndicator,
  CompositeRiskIndicator,
  OfflineCompositeEvidenceFixture,
  OfflineCompositeEvidenceFixtureName,
} from './types.js';

function risk(
  code: string,
  label: string,
  level: CompositeRiskIndicator['level'],
  sourceCategory: CompositeRiskIndicator['sourceCategory'],
  rationale: string,
): CompositeRiskIndicator {
  return { code, label, level, sourceCategory, rationale };
}

function quality(
  code: string,
  label: string,
  level: CompositeQualityIndicator['level'],
  sourceCategory: CompositeQualityIndicator['sourceCategory'],
  rationale: string,
): CompositeQualityIndicator {
  return { code, label, level, sourceCategory, rationale };
}

function confidence(
  code: string,
  label: string,
  confidenceBand: CompositeConfidenceIndicator['confidenceBand'],
  evidenceCount: number,
  rationale: string,
): CompositeConfidenceIndicator {
  return { code, label, confidenceBand, evidenceCount, rationale };
}

function sourceRefs(
  creator: CompositeEvidenceSourceReference['creator'],
  walletCluster: CompositeEvidenceSourceReference['walletCluster'],
  manipulation: CompositeEvidenceSourceReference['manipulation'],
  notes: readonly string[],
): CompositeEvidenceSourceReference {
  const count = [creator, walletCluster, manipulation].filter(Boolean).length;
  return { creator, walletCluster, manipulation, sourceCount: count, notes };
}

function weighting(
  creatorWeight: CompositeEvidenceWeighting['creatorWeight'],
  walletClusterWeight: CompositeEvidenceWeighting['walletClusterWeight'],
  manipulationWeight: CompositeEvidenceWeighting['manipulationWeight'],
  dominantCategory: CompositeEvidenceWeighting['dominantCategory'],
  notes: readonly string[],
): CompositeEvidenceWeighting {
  return { creatorWeight, walletClusterWeight, manipulationWeight, dominantCategory, notes };
}

function mustBuildFixture(
  input: Parameters<typeof buildOfflineCompositeEvidenceFixture>[0],
): OfflineCompositeEvidenceFixture {
  const result = buildOfflineCompositeEvidenceFixture(input);
  if (!result.success || !result.fixture) {
    throw new Error(`Invalid Phase 33 fixture definition: ${input.name} — ${JSON.stringify(result.validation.issues)}`);
  }
  return result.fixture;
}

// 1. clean-low-risk-composite
export const CLEAN_LOW_RISK_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'clean-low-risk-composite',
  kind: 'clean-low-risk',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'credible-transparent-creator', creatorRiskLevel: 'low', credibilityBand: 'credible', notes: ['Synthetic: credible transparent creator'] },
    { walletClusterFixtureName: 'benign-low-activity-cluster', clusterRiskLevel: 'low', qualityBand: 'moderate', notes: ['Synthetic: benign low activity cluster'] },
    { manipulationEvidenceFixtureName: 'clean-organic-launch-evidence', manipulationRiskLevel: 'low', bundleRiskBand: 'none', notes: ['Synthetic: clean organic launch'] },
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [],
  qualityIndicators: [
    quality('COMP-QUAL-CREATOR-CREDIBLE', 'Creator credibility confirmed', 'high', 'creator', 'Synthetic creator fixture is credible-transparent.'),
    quality('COMP-QUAL-LAUNCH-ORGANIC', 'Organic launch structure', 'high', 'manipulation', 'Synthetic manipulation evidence shows organic launch.'),
    quality('COMP-QUAL-WALLET-BENIGN', 'Benign wallet cluster activity', 'moderate', 'wallet-cluster', 'Synthetic wallet cluster is benign and low-activity.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-ALL-THREE', 'All three evidence categories present', 'high', 3, 'Creator, wallet-cluster, and manipulation evidence all referenced.'),
  ],
  weighting: weighting('moderate', 'low', 'moderate', 'creator', ['Synthetic weighting: creator evidence slightly dominant.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation.'],
});

// 2. creator-credible-wallet-benign-composite
export const CREATOR_CREDIBLE_WALLET_BENIGN_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'creator-credible-wallet-benign-composite',
  kind: 'creator-credible-wallet-benign',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'clear-disclosure-creator', creatorRiskLevel: 'low', credibilityBand: 'credible', notes: ['Synthetic: clear disclosure creator'] },
    { walletClusterFixtureName: 'high-quality-smart-accumulator-cluster', clusterRiskLevel: 'low', qualityBand: 'high', notes: ['Synthetic: smart accumulator cluster'] },
    null,
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [],
  qualityIndicators: [
    quality('COMP-QUAL-CREATOR-DISCLOSURE', 'Creator clear disclosure', 'high', 'creator', 'Synthetic creator fixture shows clear disclosure.'),
    quality('COMP-QUAL-WALLET-SMART', 'Smart accumulator quality cluster', 'high', 'wallet-cluster', 'Synthetic wallet cluster is high-quality smart accumulator.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-TWO', 'Two evidence categories present', 'moderate', 2, 'Creator and wallet-cluster evidence referenced.'),
  ],
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation.'],
});

// 3. creator-unknown-wallet-low-signal-composite
export const CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'creator-unknown-wallet-low-signal-composite',
  kind: 'creator-unknown-wallet-low-signal',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'unknown-insufficient-data-creator', creatorRiskLevel: 'unknown', credibilityBand: 'unknown', notes: ['Synthetic: unknown creator'] },
    { walletClusterFixtureName: 'low-signal-unknown-cluster', clusterRiskLevel: 'unknown', qualityBand: 'unknown', notes: ['Synthetic: low-signal unknown cluster'] },
    null,
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [],
  qualityIndicators: [],
  confidenceIndicators: [
    confidence('COMP-CONF-UNKNOWN', 'Insufficient data for confidence', 'none', 0, 'Creator and cluster have unknown signals.'),
  ],
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Insufficient data — no assessment possible.'],
});

// 4. creator-risk-wallet-risk-composite
export const CREATOR_RISK_WALLET_RISK_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'creator-risk-wallet-risk-composite',
  kind: 'creator-risk-wallet-risk',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'high-risk-creator', creatorRiskLevel: 'high', credibilityBand: 'poor', notes: ['Synthetic: high-risk creator fixture'] },
    { walletClusterFixtureName: 'high-risk-multi-signal-cluster', clusterRiskLevel: 'high', qualityBand: 'low', notes: ['Synthetic: high-risk multi-signal cluster'] },
    { manipulationEvidenceFixtureName: 'high-risk-manipulation-evidence', manipulationRiskLevel: 'high', bundleRiskBand: 'high', notes: ['Synthetic: high-risk manipulation evidence'] },
    ['Fixture-only. Synthetic composite. Non-advisory. Not accusation.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-COMPOSITE-HIGH', 'Composite multi-evidence risk', 'high', 'composite', 'All three evidence categories show elevated synthetic risk signals.'),
    risk('COMP-RISK-CREATOR-HIGH', 'Creator high-risk signals', 'high', 'creator', 'Synthetic creator fixture shows high-risk characteristics.'),
    risk('COMP-RISK-MANIP-HIGH', 'Manipulation evidence elevated risk', 'high', 'manipulation', 'Synthetic manipulation evidence shows high-risk pattern.'),
    risk('COMP-RISK-WALLET-HIGH', 'Wallet cluster high-risk signals', 'high', 'wallet-cluster', 'Synthetic wallet cluster shows high-risk multi-signal profile.'),
  ],
  qualityIndicators: [],
  confidenceIndicators: [
    confidence('COMP-CONF-ALL-THREE-RISK', 'Multi-source risk convergence', 'high', 3, 'All three evidence categories reference elevated synthetic risk.'),
  ],
  weighting: weighting('high', 'high', 'high', 'balanced', ['Synthetic: all three categories equally weighted at high risk.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation. Synthetic convergence pattern only.'],
});

// 5. manipulation-risk-dominates-composite
export const MANIPULATION_RISK_DOMINATES_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'manipulation-risk-dominates-composite',
  kind: 'manipulation-risk-dominates',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'credible-transparent-creator', creatorRiskLevel: 'low', credibilityBand: 'credible', notes: ['Synthetic: credible creator'] },
    { walletClusterFixtureName: 'benign-low-activity-cluster', clusterRiskLevel: 'low', qualityBand: 'moderate', notes: ['Synthetic: benign cluster'] },
    { manipulationEvidenceFixtureName: 'same-block-bundle-like-concentration-evidence', manipulationRiskLevel: 'critical', bundleRiskBand: 'high', notes: ['Synthetic: critical manipulation evidence'] },
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-MANIP-BUNDLE', 'Bundle-like concentration pattern', 'high', 'manipulation', 'Synthetic same-block bundle-like concentration evidence.'),
    risk('COMP-RISK-MANIP-DOMINANT', 'Manipulation evidence dominant risk', 'critical', 'manipulation', 'Synthetic manipulation evidence shows critical bundle-like concentration.'),
  ],
  qualityIndicators: [
    quality('COMP-QUAL-CREATOR-CREDIBLE', 'Creator credibility offsets manipulation signal', 'high', 'creator', 'Credible creator reduces overall composite certainty.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-ALL-THREE', 'All three evidence categories present', 'high', 3, 'Full evidence coverage but manipulation dominates.'),
  ],
  weighting: weighting('low', 'none', 'high', 'manipulation', ['Synthetic: manipulation evidence dominates.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation. Manipulation evidence domination pattern.'],
});

// 6. wallet-cluster-risk-dominates-composite
export const WALLET_CLUSTER_RISK_DOMINATES_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'wallet-cluster-risk-dominates-composite',
  kind: 'wallet-cluster-risk-dominates',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'anonymous-consistent-creator', creatorRiskLevel: 'medium', credibilityBand: 'moderate', notes: ['Synthetic: anonymous but consistent creator'] },
    { walletClusterFixtureName: 'known-rug-cluster', clusterRiskLevel: 'critical', qualityBand: 'low', notes: ['Synthetic: known-rug cluster pattern'] },
    { manipulationEvidenceFixtureName: 'mild-concentration-watchlist-evidence', manipulationRiskLevel: 'medium', bundleRiskBand: 'watchlist', notes: ['Synthetic: mild concentration watchlist'] },
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-WALLET-CRITICAL', 'Wallet cluster critical risk pattern', 'critical', 'wallet-cluster', 'Synthetic known-rug cluster pattern dominates composite risk.'),
    risk('COMP-RISK-WALLET-DOMINANT', 'Wallet cluster signals dominate composite', 'high', 'wallet-cluster', 'Synthetic wallet cluster risk is the primary composite risk signal.'),
  ],
  qualityIndicators: [],
  confidenceIndicators: [
    confidence('COMP-CONF-WALLET-DOMINANT', 'Wallet cluster dominant evidence', 'high', 3, 'Wallet cluster evidence dominates confidence signal.'),
  ],
  weighting: weighting('low', 'high', 'low', 'wallet-cluster', ['Synthetic: wallet cluster dominates.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation. Wallet cluster domination pattern.'],
});

// 7. creator-risk-dominates-composite
export const CREATOR_RISK_DOMINATES_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'creator-risk-dominates-composite',
  kind: 'creator-risk-dominates',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'coordinated-hype-creator', creatorRiskLevel: 'high', credibilityBand: 'poor', notes: ['Synthetic: coordinated-hype creator fixture'] },
    { walletClusterFixtureName: 'benign-low-activity-cluster', clusterRiskLevel: 'low', qualityBand: 'moderate', notes: ['Synthetic: benign cluster'] },
    null,
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-CREATOR-DOMINANT', 'Creator risk signals dominate composite', 'high', 'creator', 'Synthetic coordinated-hype creator pattern dominates composite.'),
    risk('COMP-RISK-CREATOR-HYPE', 'Creator coordinated hype narrative risk', 'medium', 'creator', 'Synthetic creator coordinated-hype narrative pattern detected.'),
  ],
  qualityIndicators: [
    quality('COMP-QUAL-WALLET-BENIGN', 'Benign wallet cluster offsets creator risk', 'moderate', 'wallet-cluster', 'Benign wallet cluster reduces certainty of composite risk.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-TWO-SPLIT', 'Two categories, split signals', 'moderate', 2, 'Creator risk and benign wallet cluster create split signal.'),
  ],
  weighting: weighting('high', 'low', 'none', 'creator', ['Synthetic: creator risk dominates.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation. Creator domination pattern.'],
});

// 8. mixed-signal-watchlist-composite
export const MIXED_SIGNAL_WATCHLIST_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'mixed-signal-watchlist-composite',
  kind: 'mixed-signal-watchlist',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'balanced-mixed-signal-creator', creatorRiskLevel: 'medium', credibilityBand: 'moderate', notes: ['Synthetic: balanced mixed-signal creator'] },
    { walletClusterFixtureName: 'mixed-signal-cluster', clusterRiskLevel: 'medium', qualityBand: 'moderate', notes: ['Synthetic: mixed-signal cluster'] },
    { manipulationEvidenceFixtureName: 'mixed-signal-manipulation-evidence', manipulationRiskLevel: 'medium', bundleRiskBand: 'watchlist', notes: ['Synthetic: mixed-signal manipulation evidence'] },
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-MIXED-CREATOR', 'Creator mixed signals', 'medium', 'creator', 'Synthetic creator shows mixed credibility and risk signals.'),
    risk('COMP-RISK-MIXED-WALLET', 'Wallet cluster mixed signals', 'medium', 'wallet-cluster', 'Synthetic wallet cluster shows mixed quality and risk signals.'),
  ],
  qualityIndicators: [
    quality('COMP-QUAL-MIXED-CREATOR', 'Creator has some positive signals', 'moderate', 'creator', 'Synthetic creator has moderate quality characteristics.'),
    quality('COMP-QUAL-MIXED-WALLET', 'Wallet cluster has some benign signals', 'moderate', 'wallet-cluster', 'Synthetic wallet cluster has some benign activity.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-ALL-MIXED', 'All categories show mixed signals', 'moderate', 3, 'All three categories have medium-confidence mixed signals.'),
  ],
  weighting: weighting('moderate', 'moderate', 'moderate', 'balanced', ['Synthetic: balanced mixed signals across all categories.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation. Mixed watchlist signals.'],
});

// 9. false-positive-protected-composite
export const FALSE_POSITIVE_PROTECTED_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'false-positive-protected-composite',
  kind: 'false-positive-protected',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'credible-transparent-creator', creatorRiskLevel: 'low', credibilityBand: 'credible', notes: ['Synthetic: credible creator offsets false positive'] },
    { walletClusterFixtureName: 'bot-noise-cluster', clusterRiskLevel: 'low', qualityBand: 'low', notes: ['Synthetic: bot-noise cluster — likely false positive'] },
    { manipulationEvidenceFixtureName: 'bot-noise-false-positive-pattern-evidence', manipulationRiskLevel: 'low', bundleRiskBand: 'none', notes: ['Synthetic: bot noise false-positive evidence'] },
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-FALSE-POS-SIGNAL', 'Possible false positive risk signal', 'low', 'composite', 'Synthetic bot-noise pattern is likely a false positive given credible creator.'),
  ],
  qualityIndicators: [
    quality('COMP-QUAL-CREATOR-CREDIBLE', 'Creator credibility confirmed', 'high', 'creator', 'Credible transparent creator offsets bot-noise signals.'),
    quality('COMP-QUAL-FALSE-POS-PROTECTED', 'False positive protection active', 'high', 'composite', 'Credible creator evidence and bot-noise pattern reduce false positive composite risk.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-FP-PROTECTED', 'False positive protected confidence', 'moderate', 3, 'False positive protection applied from credible creator evidence.'),
  ],
  weighting: weighting('high', 'low', 'low', 'creator', ['Synthetic: creator evidence dominant in false-positive context.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. False positive protection — not an accusation or proof.'],
});

// 10. insufficient-data-composite
export const INSUFFICIENT_DATA_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'insufficient-data-composite',
  kind: 'insufficient-data',
  sourceReferences: sourceRefs(
    null,
    null,
    { manipulationEvidenceFixtureName: 'unknown-insufficient-data-evidence', manipulationRiskLevel: 'unknown', bundleRiskBand: 'unknown', notes: ['Synthetic: insufficient manipulation data'] },
    ['Fixture-only. Synthetic composite. Insufficient data.'],
  ),
  riskIndicators: [],
  qualityIndicators: [],
  confidenceIndicators: [
    confidence('COMP-CONF-INSUFFICIENT', 'Insufficient evidence for assessment', 'none', 0, 'Only one source referenced with unknown risk levels.'),
  ],
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Insufficient data — no composite assessment possible.'],
});

// 11. high-risk-multi-evidence-composite
export const HIGH_RISK_MULTI_EVIDENCE_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'high-risk-multi-evidence-composite',
  kind: 'high-risk-multi-evidence',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'high-risk-creator', creatorRiskLevel: 'high', credibilityBand: 'poor', notes: ['Synthetic: high-risk creator'] },
    { walletClusterFixtureName: 'fresh-wallet-farm-cluster', clusterRiskLevel: 'high', qualityBand: 'low', notes: ['Synthetic: fresh wallet farm cluster'] },
    { manipulationEvidenceFixtureName: 'fresh-wallet-burst-pattern-evidence', manipulationRiskLevel: 'high', bundleRiskBand: 'elevated', notes: ['Synthetic: fresh wallet burst manipulation evidence'] },
    ['Fixture-only. Synthetic composite. Non-advisory.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-MULTI-CONVERGENCE', 'Multi-evidence risk convergence', 'critical', 'composite', 'All three evidence categories converge on high-risk synthetic signals.'),
    risk('COMP-RISK-MULTI-CREATOR', 'Creator high-risk profile', 'high', 'creator', 'Synthetic high-risk creator evidence.'),
    risk('COMP-RISK-MULTI-MANIP', 'Fresh wallet burst manipulation evidence', 'high', 'manipulation', 'Synthetic fresh wallet burst pattern detected.'),
    risk('COMP-RISK-MULTI-WALLET', 'Fresh wallet farm cluster risk', 'high', 'wallet-cluster', 'Synthetic fresh wallet farm cluster detected.'),
  ],
  qualityIndicators: [],
  confidenceIndicators: [
    confidence('COMP-CONF-MULTI-HIGH', 'Multi-evidence high risk confidence', 'high', 3, 'All three categories converge on high-risk synthetic signals.'),
  ],
  weighting: weighting('high', 'high', 'high', 'balanced', ['Synthetic: all three categories equally high risk weighted.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Not proof. Not accusation. Multi-evidence synthetic convergence.'],
});

// 12. safety-boundary-composite
export const SAFETY_BOUNDARY_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'safety-boundary-composite',
  kind: 'safety-boundary',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'safety-boundary-creator', creatorRiskLevel: 'unknown', credibilityBand: 'unknown', notes: ['Synthetic: safety boundary creator fixture'] },
    { walletClusterFixtureName: 'safety-boundary-cluster', clusterRiskLevel: 'unknown', qualityBand: 'unknown', notes: ['Synthetic: safety boundary cluster fixture'] },
    { manipulationEvidenceFixtureName: 'safety-boundary-evidence', manipulationRiskLevel: 'unknown', bundleRiskBand: 'unknown', notes: ['Synthetic: safety boundary manipulation evidence fixture'] },
    ['Fixture-only. Synthetic safety boundary composite. Non-advisory.'],
  ),
  riskIndicators: [],
  qualityIndicators: [],
  confidenceIndicators: [
    confidence('COMP-CONF-SAFETY-BOUNDARY', 'Safety boundary confidence level', 'none', 0, 'Safety boundary fixture — unknown risk and quality levels.'),
  ],
  weighting: weighting('none', 'none', 'none', 'none', ['Synthetic: safety boundary — no weighting applied.']),
  safeNotes: ['Fixture-only. Synthetic safety boundary. Non-advisory. Not proof. Not accusation.'],
});

// 13. malformed-input-safe-composite
export const MALFORMED_INPUT_SAFE_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'malformed-input-safe-composite',
  kind: 'malformed-safe',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'malformed-input-safe-creator', creatorRiskLevel: 'unknown', credibilityBand: 'unknown', notes: ['Synthetic: malformed-safe creator'] },
    null,
    null,
    ['Fixture-only. Synthetic malformed-input-safe composite. Non-advisory.'],
  ),
  riskIndicators: [],
  qualityIndicators: [],
  confidenceIndicators: [
    confidence('COMP-CONF-MALFORMED', 'Malformed input — no confidence', 'none', 0, 'Malformed input safe fixture — no valid evidence signals.'),
  ],
  safeNotes: ['Fixture-only. Synthetic malformed-input safe. Non-advisory. Not proof. Not accusation.'],
});

// 14. no-action-non-advisory-composite
export const NO_ACTION_NON_ADVISORY_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'no-action-non-advisory-composite',
  kind: 'no-action-non-advisory',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'benign-low-signal-creator', creatorRiskLevel: 'low', credibilityBand: 'moderate', notes: ['Synthetic: benign low signal creator'] },
    { walletClusterFixtureName: 'benign-low-activity-cluster', clusterRiskLevel: 'low', qualityBand: 'moderate', notes: ['Synthetic: benign low activity cluster'] },
    null,
    ['Fixture-only. Synthetic no-action non-advisory composite.'],
  ),
  riskIndicators: [],
  qualityIndicators: [
    quality('COMP-QUAL-NON-ADVISORY', 'No action — non-advisory fixture', 'moderate', 'composite', 'This fixture explicitly represents a no-action, non-advisory composite result.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-NON-ADVISORY', 'Non-advisory confidence indicator', 'low', 2, 'Low confidence non-advisory composite.'),
  ],
  safeNotes: ['Fixture-only. Synthetic. No action required. Non-advisory. Not proof. Not accusation.'],
});

// 15. report-ready-composite
export const REPORT_READY_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'report-ready-composite',
  kind: 'report-ready',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'anonymous-consistent-creator', creatorRiskLevel: 'medium', credibilityBand: 'moderate', notes: ['Synthetic: anonymous consistent creator'] },
    { walletClusterFixtureName: 'profitable-leader-cluster', clusterRiskLevel: 'medium', qualityBand: 'high', notes: ['Synthetic: profitable leader cluster'] },
    { manipulationEvidenceFixtureName: 'benign-high-activity-launch-pattern-evidence', manipulationRiskLevel: 'low', bundleRiskBand: 'none', notes: ['Synthetic: benign high activity launch evidence'] },
    ['Fixture-only. Synthetic report-ready composite.'],
  ),
  riskIndicators: [
    risk('COMP-RISK-REPORT-ANON', 'Anonymous creator risk signal', 'low', 'creator', 'Synthetic anonymous creator reduces credibility confidence.'),
  ],
  qualityIndicators: [
    quality('COMP-QUAL-REPORT-BENIGN', 'Benign high-activity launch', 'high', 'manipulation', 'Synthetic benign high-activity launch evidence.'),
    quality('COMP-QUAL-REPORT-WALLET', 'Profitable leader cluster quality', 'high', 'wallet-cluster', 'Synthetic profitable leader cluster shows high quality.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-REPORT-READY', 'Report-ready evidence confidence', 'high', 3, 'All three categories support a balanced report-ready composite.'),
  ],
  weighting: weighting('low', 'high', 'moderate', 'wallet-cluster', ['Synthetic: wallet cluster dominant in report-ready composite.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Report-ready composite for offline intelligence reports.'],
});

// 16. dashboard-ready-composite
export const DASHBOARD_READY_COMPOSITE_FIXTURE = mustBuildFixture({
  name: 'dashboard-ready-composite',
  kind: 'dashboard-ready',
  sourceReferences: sourceRefs(
    { creatorFixtureName: 'credible-transparent-creator', creatorRiskLevel: 'low', credibilityBand: 'credible', notes: ['Synthetic: credible creator for dashboard'] },
    { walletClusterFixtureName: 'high-quality-smart-accumulator-cluster', clusterRiskLevel: 'low', qualityBand: 'high', notes: ['Synthetic: high quality smart accumulator for dashboard'] },
    { manipulationEvidenceFixtureName: 'clean-organic-launch-evidence', manipulationRiskLevel: 'low', bundleRiskBand: 'none', notes: ['Synthetic: clean organic launch for dashboard'] },
    ['Fixture-only. Synthetic dashboard-ready composite.'],
  ),
  riskIndicators: [],
  qualityIndicators: [
    quality('COMP-QUAL-DASHBOARD-CREATOR', 'Dashboard-ready creator quality', 'high', 'creator', 'Credible transparent creator ready for synthetic dashboard display.'),
    quality('COMP-QUAL-DASHBOARD-LAUNCH', 'Dashboard-ready launch quality', 'high', 'manipulation', 'Clean organic launch evidence for dashboard display.'),
    quality('COMP-QUAL-DASHBOARD-WALLET', 'Dashboard-ready wallet quality', 'high', 'wallet-cluster', 'High-quality smart accumulator cluster for dashboard display.'),
  ],
  confidenceIndicators: [
    confidence('COMP-CONF-DASHBOARD-READY', 'Dashboard-ready confidence', 'high', 3, 'All three evidence categories are dashboard-ready with high confidence.'),
  ],
  weighting: weighting('moderate', 'moderate', 'moderate', 'balanced', ['Synthetic: balanced weighting for dashboard display.']),
  safeNotes: ['Fixture-only. Synthetic. Non-advisory. Dashboard-ready composite for future offline dashboard integration.'],
});

// Map and list helpers
export const PHASE_33_COMPOSITE_EVIDENCE_FIXTURES = new Map<
  OfflineCompositeEvidenceFixtureName,
  OfflineCompositeEvidenceFixture
>([
  ['clean-low-risk-composite', CLEAN_LOW_RISK_COMPOSITE_FIXTURE],
  ['creator-credible-wallet-benign-composite', CREATOR_CREDIBLE_WALLET_BENIGN_COMPOSITE_FIXTURE],
  ['creator-unknown-wallet-low-signal-composite', CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_COMPOSITE_FIXTURE],
  ['creator-risk-wallet-risk-composite', CREATOR_RISK_WALLET_RISK_COMPOSITE_FIXTURE],
  ['manipulation-risk-dominates-composite', MANIPULATION_RISK_DOMINATES_COMPOSITE_FIXTURE],
  ['wallet-cluster-risk-dominates-composite', WALLET_CLUSTER_RISK_DOMINATES_COMPOSITE_FIXTURE],
  ['creator-risk-dominates-composite', CREATOR_RISK_DOMINATES_COMPOSITE_FIXTURE],
  ['mixed-signal-watchlist-composite', MIXED_SIGNAL_WATCHLIST_COMPOSITE_FIXTURE],
  ['false-positive-protected-composite', FALSE_POSITIVE_PROTECTED_COMPOSITE_FIXTURE],
  ['insufficient-data-composite', INSUFFICIENT_DATA_COMPOSITE_FIXTURE],
  ['high-risk-multi-evidence-composite', HIGH_RISK_MULTI_EVIDENCE_COMPOSITE_FIXTURE],
  ['safety-boundary-composite', SAFETY_BOUNDARY_COMPOSITE_FIXTURE],
  ['malformed-input-safe-composite', MALFORMED_INPUT_SAFE_COMPOSITE_FIXTURE],
  ['no-action-non-advisory-composite', NO_ACTION_NON_ADVISORY_COMPOSITE_FIXTURE],
  ['report-ready-composite', REPORT_READY_COMPOSITE_FIXTURE],
  ['dashboard-ready-composite', DASHBOARD_READY_COMPOSITE_FIXTURE],
]);

export function listOfflineCompositeEvidenceFixtures(): readonly OfflineCompositeEvidenceFixtureName[] {
  return [...PHASE_33_COMPOSITE_EVIDENCE_FIXTURES.keys()];
}

export function getOfflineCompositeEvidenceFixture(
  name: OfflineCompositeEvidenceFixtureName,
): OfflineCompositeEvidenceFixture | undefined {
  return PHASE_33_COMPOSITE_EVIDENCE_FIXTURES.get(name);
}
