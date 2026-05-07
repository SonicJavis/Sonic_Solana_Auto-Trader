/**
 * Phase 31 — Wallet Cluster Fixture Models v1: deterministic fixtures.
 */

import { buildWalletClusterIntelligenceFixture } from './cluster-fixture-model-builders.js';
import type {
  WalletClusterHistoryFixture,
  WalletClusterIntelligenceFixture,
  WalletClusterIntelligenceFixtureName,
  WalletClusterQualityIndicator,
  WalletClusterRiskIndicator,
  WalletClusterSignalFixture,
} from './cluster-fixture-model-types.js';

function quality(
  code: string,
  label: string,
  level: WalletClusterQualityIndicator['level'],
  rationale: string,
): WalletClusterQualityIndicator {
  return { code, label, level, rationale };
}

function risk(
  code: string,
  label: string,
  level: WalletClusterRiskIndicator['level'],
  rationale: string,
): WalletClusterRiskIndicator {
  return { code, label, level, rationale };
}

function signal(
  signalType: WalletClusterSignalFixture['signalType'],
  intensity: WalletClusterSignalFixture['intensity'],
  pattern: WalletClusterSignalFixture['pattern'],
  notes: readonly string[],
): WalletClusterSignalFixture {
  return { signalType, intensity, pattern, notes };
}

function history(
  observedLaunchCount: number,
  averageHoldTimeBand: WalletClusterHistoryFixture['averageHoldTimeBand'],
  profitabilityBand: WalletClusterHistoryFixture['profitabilityBand'],
  dumpSpeedBand: WalletClusterHistoryFixture['dumpSpeedBand'],
  notes: readonly string[],
): WalletClusterHistoryFixture {
  return { observedLaunchCount, averageHoldTimeBand, profitabilityBand, dumpSpeedBand, notes };
}

function mustBuildFixture(
  input: Parameters<typeof buildWalletClusterIntelligenceFixture>[0],
): WalletClusterIntelligenceFixture {
  const result = buildWalletClusterIntelligenceFixture(input);
  if (!result.success || !result.fixture) {
    throw new Error(`Invalid Phase 31 fixture definition: ${input.name}`);
  }
  return result.fixture;
}

export const HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'high-quality-smart-accumulator-cluster',
  kind: 'smart-accumulator',
  profile: {
    clusterId: 'fixture_cluster_smart_acc_001',
    clusterType: 'smart_accumulators',
    displayLabel: 'High Quality Smart Accumulator Fixture Cluster',
    sizeBand: 'small',
    ageBand: 'established',
    coordinationBand: 'none',
  },
  history: history(14, 'long', 'high', 'slow', [
    'Cluster shows long-hold and high-profitability patterns in synthetic data.',
  ]),
  signals: [
    signal('leader-follower', 'moderate', 'distributed', [
      'Leader-follower signals are distributed across synthetic wallets.',
    ]),
  ],
  qualityIndicators: [
    quality('LONG_HOLD_PATTERN', 'Long hold pattern', 'high', 'Cluster exhibits consistently long hold times in synthetic data.'),
    quality('HIGH_PROFITABILITY_BAND', 'High profitability band', 'high', 'Profitability band is high across synthetic history.'),
    quality('LOW_DUMP_SPEED', 'Low dump speed', 'high', 'Dump speed is slow indicating accumulation rather than flipping.'),
  ],
  riskIndicators: [
    risk('LIMITED_SAMPLE', 'Limited sample size', 'low', 'Cluster fixture has limited synthetic wallets.'),
  ],
  safeNotes: ['High-quality smart accumulator cluster fixture.', 'Safe for offline regression coverage.'],
});

export const PROFITABLE_LEADER_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'profitable-leader-cluster',
  kind: 'profitable-leader',
  profile: {
    clusterId: 'fixture_cluster_prof_leader_002',
    clusterType: 'profitable_leaders',
    displayLabel: 'Profitable Leader Fixture Cluster',
    sizeBand: 'small',
    ageBand: 'established',
    coordinationBand: 'low',
  },
  history: history(20, 'long', 'high', 'slow', [
    'Leader wallets demonstrate sustained profitability across synthetic launches.',
  ]),
  signals: [
    signal('leader-follower', 'high', 'distributed', ['Strong leader-follower relationship in synthetic cluster.']),
  ],
  qualityIndicators: [
    quality('STRONG_LEADER_SIGNAL', 'Strong leader signal', 'high', 'Cluster leader wallets show consistent synthetic profitability.'),
    quality('SUSTAINED_PROFITABILITY', 'Sustained profitability', 'high', 'Profitability band remains high across synthetic history.'),
  ],
  riskIndicators: [
    risk('FOLLOWER_DEPENDENCY', 'Follower dependency risk', 'low', 'Follower wallets may amplify leader decisions — fixture-only note.'),
  ],
  safeNotes: ['Profitable leader cluster fixture.'],
});

export const FAST_DUMP_RISK_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'fast-dump-risk-cluster',
  kind: 'fast-dumper',
  profile: {
    clusterId: 'fixture_cluster_fast_dump_003',
    clusterType: 'fast_dumpers',
    displayLabel: 'Fast Dump Risk Fixture Cluster',
    sizeBand: 'medium',
    ageBand: 'recent',
    coordinationBand: 'moderate',
  },
  history: history(8, 'very-short', 'low', 'very-fast', [
    'Very short hold times and very fast dump speeds in synthetic history.',
  ]),
  signals: [
    signal('dump-pattern', 'high', 'synchronized', ['Synchronized dump events observed across synthetic wallets.']),
    signal('coordination', 'moderate', 'clustered', ['Moderate coordination signals co-occur with dump events.']),
  ],
  qualityIndicators: [],
  riskIndicators: [
    risk('FAST_DUMP_PATTERN', 'Fast dump pattern', 'high', 'Cluster wallets demonstrate synchronized fast-dump behavior.'),
    risk('COORDINATION_WITH_DUMP', 'Coordination with dump', 'medium', 'Coordination signals cluster around dump events.'),
  ],
  safeNotes: ['Fast dump risk cluster fixture.'],
});

export const FRESH_WALLET_FARM_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'fresh-wallet-farm-cluster',
  kind: 'fresh-wallet-farm',
  profile: {
    clusterId: 'fixture_cluster_fresh_farm_004',
    clusterType: 'fresh_wallet_farm',
    displayLabel: 'Fresh Wallet Farm Fixture Cluster',
    sizeBand: 'large',
    ageBand: 'new',
    coordinationBand: 'high',
  },
  history: history(3, 'very-short', 'low', 'fast', [
    'Fresh wallets with minimal history in synthetic data.',
  ]),
  signals: [
    signal('fresh-wallet', 'high', 'clustered', ['Cluster is dominated by fresh synthetic wallet signals.']),
    signal('coordination', 'high', 'synchronized', ['Strong coordination among fresh wallets in synthetic data.']),
    signal('funding-source', 'moderate', 'clustered', ['Same-funding-source signals present in synthetic cluster.']),
  ],
  qualityIndicators: [],
  riskIndicators: [
    risk('FRESH_WALLET_FARM', 'Fresh wallet farm', 'critical', 'Large cluster of fresh wallets with strong coordination signals.'),
    risk('SAME_FUNDING_SOURCE', 'Same funding source', 'high', 'Funding-source signals indicate coordinated wallet creation.'),
  ],
  safeNotes: ['Fresh wallet farm cluster fixture.'],
});

export const CREATOR_LINKED_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'creator-linked-cluster',
  kind: 'creator-linked',
  profile: {
    clusterId: 'fixture_cluster_creator_link_005',
    clusterType: 'creator_linked',
    displayLabel: 'Creator Linked Fixture Cluster',
    sizeBand: 'small',
    ageBand: 'recent',
    coordinationBand: 'moderate',
  },
  history: history(6, 'short', 'low', 'fast', [
    'Creator-linked wallets show short holds and fast exits in synthetic data.',
  ]),
  signals: [
    signal('creator-link', 'high', 'clustered', ['Strong creator-link signals in synthetic cluster.']),
    signal('dump-pattern', 'moderate', 'synchronized', ['Creator-linked dump pattern in synthetic data.']),
  ],
  qualityIndicators: [],
  riskIndicators: [
    risk('CREATOR_LINKED_WALLETS', 'Creator-linked wallets', 'high', 'Cluster wallets show strong creator-link signals.'),
    risk('INSIDER_DUMP_RISK', 'Insider dump risk', 'medium', 'Creator-linked clusters carry elevated insider dump risk.'),
  ],
  safeNotes: ['Creator-linked cluster fixture.'],
});

export const SAME_FUNDING_SOURCE_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'same-funding-source-cluster',
  kind: 'same-funding-source',
  profile: {
    clusterId: 'fixture_cluster_same_funding_006',
    clusterType: 'same_funding_source',
    displayLabel: 'Same Funding Source Fixture Cluster',
    sizeBand: 'medium',
    ageBand: 'recent',
    coordinationBand: 'moderate',
  },
  history: history(5, 'short', 'low', 'moderate', [
    'Wallets with identical funding provenance in synthetic data.',
  ]),
  signals: [
    signal('funding-source', 'high', 'clustered', ['Identical funding-source patterns across synthetic wallets.']),
    signal('coordination', 'moderate', 'clustered', ['Moderate coordination co-occurring with funding-source signals.']),
  ],
  qualityIndicators: [
    quality('OBSERVABLE_PATTERN', 'Observable pattern', 'low', 'Funding-source pattern is clearly observable in synthetic data.'),
  ],
  riskIndicators: [
    risk('SAME_FUNDING_PROVENANCE', 'Same funding provenance', 'high', 'All cluster wallets share identical synthetic funding source.'),
  ],
  safeNotes: ['Same funding source cluster fixture.'],
});

export const BOT_NOISE_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'bot-noise-cluster',
  kind: 'bot-noise',
  profile: {
    clusterId: 'fixture_cluster_bot_noise_007',
    clusterType: 'bot_noise',
    displayLabel: 'Bot Noise Fixture Cluster',
    sizeBand: 'large',
    ageBand: 'recent',
    coordinationBand: 'high',
  },
  history: history(25, 'very-short', 'low', 'very-fast', [
    'High-frequency activity with very short holds in synthetic history.',
  ]),
  signals: [
    signal('bot-noise', 'high', 'synchronized', ['High-intensity bot-noise signals across synthetic cluster.']),
    signal('coordination', 'high', 'synchronized', ['Highly synchronized coordination among synthetic bot wallets.']),
  ],
  qualityIndicators: [],
  riskIndicators: [
    risk('BOT_NOISE_CLUSTER', 'Bot noise cluster', 'critical', 'Cluster exhibits high-intensity synchronized bot-noise patterns.'),
    risk('COORDINATED_HIGH_FREQUENCY', 'Coordinated high-frequency', 'high', 'High-frequency coordinated activity in synthetic data.'),
  ],
  safeNotes: ['Bot noise cluster fixture.'],
});

export const KNOWN_RUG_CLUSTER_FIXTURE_MODEL = mustBuildFixture({
  name: 'known-rug-cluster',
  kind: 'known-rug',
  profile: {
    clusterId: 'fixture_cluster_known_rug_008',
    clusterType: 'known_rug_cluster',
    displayLabel: 'Known Rug Fixture Cluster',
    sizeBand: 'small',
    ageBand: 'new',
    coordinationBand: 'high',
  },
  history: history(4, 'very-short', 'low', 'very-fast', [
    'Extreme dump speed and minimal hold across synthetic launches.',
  ]),
  signals: [
    signal('dump-pattern', 'high', 'synchronized', ['Extreme synchronized dump signals in synthetic cluster.']),
    signal('coordination', 'high', 'synchronized', ['All synthetic wallets coordinate precisely at dump timing.']),
    signal('creator-link', 'high', 'clustered', ['Creator-link signals cluster with dump events.']),
    signal('fresh-wallet', 'high', 'clustered', ['Fresh wallets deployed for rug-pattern in synthetic data.']),
  ],
  qualityIndicators: [],
  riskIndicators: [
    risk('KNOWN_RUG_PATTERN', 'Known rug pattern', 'critical', 'Cluster matches all synthetic rug-pattern indicators.'),
    risk('EXTREME_DUMP_SPEED', 'Extreme dump speed', 'critical', 'Dump speed is very-fast across all synthetic wallets.'),
    risk('CREATOR_LINK_AND_DUMP', 'Creator link with dump', 'high', 'Creator-linked signals correlate with dump timing.'),
  ],
  safeNotes: ['Known rug cluster fixture model.'],
});

export const LOW_SIGNAL_UNKNOWN_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'low-signal-unknown-cluster',
  kind: 'unknown',
  profile: {
    clusterId: 'fixture_cluster_unknown_009',
    clusterType: 'unknown_fixture',
    displayLabel: 'Low Signal Unknown Fixture Cluster',
    sizeBand: 'unknown',
    ageBand: 'unknown',
    coordinationBand: 'unknown',
  },
  history: history(0, 'unknown', 'unknown', 'unknown', [
    'No synthetic history available for this cluster.',
  ]),
  signals: [],
  qualityIndicators: [],
  riskIndicators: [
    risk('INSUFFICIENT_DATA', 'Insufficient data', 'medium', 'No synthetic signals available for meaningful assessment.'),
  ],
  safeNotes: ['Low-signal unknown cluster fixture.'],
});

export const COORDINATED_SELL_RISK_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'coordinated-sell-risk-cluster',
  kind: 'coordinated-sell-risk',
  profile: {
    clusterId: 'fixture_cluster_coord_sell_010',
    clusterType: 'smart_accumulators',
    displayLabel: 'Coordinated Sell Risk Fixture Cluster',
    sizeBand: 'medium',
    ageBand: 'established',
    coordinationBand: 'high',
  },
  history: history(10, 'medium', 'moderate', 'fast', [
    'Established wallets with coordinated sell events in synthetic history.',
  ]),
  signals: [
    signal('coordination', 'high', 'synchronized', ['Synchronized sell coordination signals in synthetic data.']),
    signal('dump-pattern', 'moderate', 'synchronized', ['Moderate dump signals co-occurring with coordination.']),
  ],
  qualityIndicators: [
    quality('ESTABLISHED_CLUSTER', 'Established cluster', 'moderate', 'Cluster has established synthetic history despite coordination risk.'),
  ],
  riskIndicators: [
    risk('COORDINATED_SELL_RISK', 'Coordinated sell risk', 'high', 'High-intensity synchronized sell coordination in synthetic data.'),
    risk('DUMP_CO_OCCURRENCE', 'Dump co-occurrence', 'medium', 'Dump signals co-occur with coordination events.'),
  ],
  safeNotes: ['Coordinated sell risk cluster fixture.'],
});

export const MIXED_SIGNAL_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'mixed-signal-cluster',
  kind: 'mixed-signal',
  profile: {
    clusterId: 'fixture_cluster_mixed_011',
    clusterType: 'smart_accumulators',
    displayLabel: 'Mixed Signal Fixture Cluster',
    sizeBand: 'small',
    ageBand: 'established',
    coordinationBand: 'low',
  },
  history: history(12, 'medium', 'moderate', 'moderate', [
    'Mixed quality and risk indicators coexist in synthetic cluster.',
  ]),
  signals: [
    signal('leader-follower', 'moderate', 'distributed', ['Moderate leader-follower signals in synthetic data.']),
    signal('coordination', 'low', 'sporadic', ['Low sporadic coordination signals present.']),
  ],
  qualityIndicators: [
    quality('REASONABLE_HOLD_TIME', 'Reasonable hold time', 'moderate', 'Hold times are reasonable but not exceptional.'),
    quality('MODERATE_PROFITABILITY', 'Moderate profitability', 'moderate', 'Profitability band is moderate in synthetic history.'),
  ],
  riskIndicators: [
    risk('PARTIAL_COORDINATION', 'Partial coordination', 'medium', 'Low-level coordination signals are present but not dominant.'),
  ],
  safeNotes: ['Mixed-signal cluster fixture.'],
});

export const SAFETY_BOUNDARY_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'safety-boundary-cluster',
  kind: 'safety-boundary',
  profile: {
    clusterId: 'fixture_cluster_boundary_012',
    clusterType: 'smart_accumulators',
    displayLabel: 'Safety Boundary Fixture Cluster',
    sizeBand: 'small',
    ageBand: 'established',
    coordinationBand: 'none',
  },
  history: history(8, 'long', 'high', 'slow', [
    'Fixture explicitly designed to reinforce Phase 31 safety boundaries.',
  ]),
  signals: [
    signal('leader-follower', 'low', 'distributed', ['Synthetic safety-boundary signals stay non-advisory and local-only.']),
  ],
  qualityIndicators: [
    quality('BOUNDARY_CLARITY', 'Boundary clarity', 'high', 'Fixture explicitly enforces local-only synthetic scope.'),
    quality('READ_ONLY_SCOPE', 'Read-only scope', 'high', 'Fixture metadata remains read-only and deterministic.'),
  ],
  riskIndicators: [],
  safeNotes: ['Safety-boundary cluster fixture.', 'Safe for offline regression coverage.'],
});

export const HIGH_RISK_MULTI_SIGNAL_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'high-risk-multi-signal-cluster',
  kind: 'high-risk-multi',
  profile: {
    clusterId: 'fixture_cluster_high_risk_013',
    clusterType: 'known_rug_cluster',
    displayLabel: 'High Risk Multi-Signal Fixture Cluster',
    sizeBand: 'medium',
    ageBand: 'new',
    coordinationBand: 'high',
  },
  history: history(6, 'very-short', 'low', 'very-fast', [
    'Multiple overlapping risk signals in synthetic high-risk cluster.',
  ]),
  signals: [
    signal('dump-pattern', 'high', 'synchronized', ['Extreme synchronized dump signals.']),
    signal('coordination', 'high', 'synchronized', ['Highly synchronized coordination across synthetic wallets.']),
    signal('fresh-wallet', 'high', 'clustered', ['Fresh wallets deployed across all synthetic cluster members.']),
    signal('funding-source', 'high', 'clustered', ['Same funding source across all synthetic wallets.']),
    signal('creator-link', 'moderate', 'clustered', ['Creator-link signals present.']),
  ],
  qualityIndicators: [],
  riskIndicators: [
    risk('MULTI_SIGNAL_RISK_STACK', 'Multi-signal risk stack', 'critical', 'Multiple synthetic risk indicators cluster together.'),
    risk('EXTREME_COORDINATION', 'Extreme coordination', 'critical', 'Coordination and dump signals are both at maximum intensity.'),
    risk('FRESH_WALLET_DEPLOYMENT', 'Fresh wallet deployment', 'high', 'All cluster members are fresh synthetic wallets.'),
  ],
  safeNotes: ['High-risk multi-signal cluster fixture.'],
});

export const BENIGN_LOW_ACTIVITY_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'benign-low-activity-cluster',
  kind: 'benign-low-activity',
  profile: {
    clusterId: 'fixture_cluster_benign_014',
    clusterType: 'smart_accumulators',
    displayLabel: 'Benign Low Activity Fixture Cluster',
    sizeBand: 'tiny',
    ageBand: 'established',
    coordinationBand: 'none',
  },
  history: history(3, 'medium', 'moderate', 'slow', [
    'Low-activity benign cluster with no synthetic risk signals.',
  ]),
  signals: [],
  qualityIndicators: [
    quality('LOW_RISK_PROFILE', 'Low risk profile', 'moderate', 'No synthetic risk signals present in this cluster.'),
  ],
  riskIndicators: [
    risk('LOW_SAMPLE_SIZE', 'Low sample size', 'low', 'Tiny cluster with limited synthetic history.'),
  ],
  safeNotes: ['Benign low-activity cluster fixture.'],
});

export const MALFORMED_INPUT_SAFE_CLUSTER_FIXTURE = mustBuildFixture({
  name: 'malformed-input-safe-cluster',
  kind: 'malformed-safe',
  profile: {
    clusterId: 'fixture_cluster_safe_015',
    clusterType: 'unknown_fixture',
    displayLabel: 'Malformed Input Safe Fixture Cluster',
    sizeBand: 'unknown',
    ageBand: 'unknown',
    coordinationBand: 'unknown',
  },
  history: history(0, 'unknown', 'unknown', 'unknown', [
    'Sanitized placeholder history for malformed-input-safe coverage.',
  ]),
  signals: [],
  qualityIndicators: [],
  riskIndicators: [
    risk('INPUT_SANITIZED', 'Input sanitized', 'medium', 'Fixture demonstrates deterministic sanitized fallback output.'),
  ],
  safeNotes: ['Malformed-input-safe cluster fixture.'],
});

export const PHASE_31_WALLET_CLUSTER_FIXTURES = new Map<
  WalletClusterIntelligenceFixtureName,
  WalletClusterIntelligenceFixture
>([
  ['high-quality-smart-accumulator-cluster', HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE],
  ['profitable-leader-cluster', PROFITABLE_LEADER_CLUSTER_FIXTURE],
  ['fast-dump-risk-cluster', FAST_DUMP_RISK_CLUSTER_FIXTURE],
  ['fresh-wallet-farm-cluster', FRESH_WALLET_FARM_CLUSTER_FIXTURE],
  ['creator-linked-cluster', CREATOR_LINKED_CLUSTER_FIXTURE],
  ['same-funding-source-cluster', SAME_FUNDING_SOURCE_CLUSTER_FIXTURE],
  ['bot-noise-cluster', BOT_NOISE_CLUSTER_FIXTURE],
  ['known-rug-cluster', KNOWN_RUG_CLUSTER_FIXTURE_MODEL],
  ['low-signal-unknown-cluster', LOW_SIGNAL_UNKNOWN_CLUSTER_FIXTURE],
  ['coordinated-sell-risk-cluster', COORDINATED_SELL_RISK_CLUSTER_FIXTURE],
  ['mixed-signal-cluster', MIXED_SIGNAL_CLUSTER_FIXTURE],
  ['safety-boundary-cluster', SAFETY_BOUNDARY_CLUSTER_FIXTURE],
  ['high-risk-multi-signal-cluster', HIGH_RISK_MULTI_SIGNAL_CLUSTER_FIXTURE],
  ['benign-low-activity-cluster', BENIGN_LOW_ACTIVITY_CLUSTER_FIXTURE],
  ['malformed-input-safe-cluster', MALFORMED_INPUT_SAFE_CLUSTER_FIXTURE],
]);

export function listWalletClusterIntelligenceFixtures(): readonly WalletClusterIntelligenceFixtureName[] {
  return [...PHASE_31_WALLET_CLUSTER_FIXTURES.keys()].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function getWalletClusterIntelligenceFixture(
  name: WalletClusterIntelligenceFixtureName,
): WalletClusterIntelligenceFixture | undefined {
  return PHASE_31_WALLET_CLUSTER_FIXTURES.get(name);
}
