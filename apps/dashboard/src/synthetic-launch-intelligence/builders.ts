/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: builders.
 */

import { getSyntheticLaunchIntelligenceCapabilities } from './capabilities.js';
import { buildSyntheticLaunchIntelligenceApiContract } from './contracts.js';
import { stableDeterministicSyntheticLaunchIntelligenceChecksum } from './normalization.js';
import {
  PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
  PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
  PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_VERSION,
  SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE,
  type BuildSyntheticLaunchIntelligenceFixtureInput,
  type SyntheticHolderDistributionSnapshot,
  type SyntheticLaunchEvent,
  type SyntheticLaunchIntelligenceFixture,
  type SyntheticLaunchIntelligenceScenarioKind,
  type SyntheticLaunchIntelligenceScenarioName,
  type SyntheticLaunchRiskFactorSummary,
  type SyntheticPoolLiquiditySnapshot,
  type SyntheticWalletClusterIndicator,
} from './types.js';
import { buildSyntheticLaunchIntelligenceViewModel } from './view-models.js';

interface ScenarioDefinition {
  readonly fixtureKind: SyntheticLaunchIntelligenceScenarioKind;
  readonly label: string;
  readonly symbol: string;
  readonly metadataCompletenessScore: number;
  readonly liquidityUsd: number;
  readonly holderConcentrationPct: number;
  readonly creatorRiskFlags: readonly string[];
  readonly clusterIndicators: readonly string[];
  readonly velocity: 'low' | 'medium' | 'high';
  readonly rejected: boolean;
}

const SCENARIO_DEFINITIONS: Readonly<Record<SyntheticLaunchIntelligenceScenarioName, ScenarioDefinition>> = {
  'clean-launch-baseline': {
    fixtureKind: 'clean_launch',
    label: 'Clean synthetic launch baseline',
    symbol: 'SYNCLN',
    metadataCompletenessScore: 95,
    liquidityUsd: 220000,
    holderConcentrationPct: 19,
    creatorRiskFlags: [],
    clusterIndicators: [],
    velocity: 'medium',
    rejected: false,
  },
  'low-liquidity-launch': {
    fixtureKind: 'low_liquidity',
    label: 'Low-liquidity synthetic launch',
    symbol: 'SYNLIQ',
    metadataCompletenessScore: 92,
    liquidityUsd: 24000,
    holderConcentrationPct: 35,
    creatorRiskFlags: ['limited_launch_depth'],
    clusterIndicators: [],
    velocity: 'medium',
    rejected: false,
  },
  'concentrated-holder-launch': {
    fixtureKind: 'holder_concentration',
    label: 'Concentrated-holder synthetic launch',
    symbol: 'SYNHLD',
    metadataCompletenessScore: 90,
    liquidityUsd: 81000,
    holderConcentrationPct: 76,
    creatorRiskFlags: ['holder_skew_observed'],
    clusterIndicators: ['cluster-density-medium'],
    velocity: 'medium',
    rejected: false,
  },
  'suspicious-creator-history-launch': {
    fixtureKind: 'creator_history_risk',
    label: 'Suspicious-creator-history synthetic launch',
    symbol: 'SYNCRT',
    metadataCompletenessScore: 91,
    liquidityUsd: 67000,
    holderConcentrationPct: 54,
    creatorRiskFlags: ['repeat_failed_launches', 'rapid_redeployment_pattern'],
    clusterIndicators: [],
    velocity: 'medium',
    rejected: false,
  },
  'possible-bundle-cluster-launch': {
    fixtureKind: 'wallet_cluster_pattern',
    label: 'Possible bundle-cluster synthetic launch',
    symbol: 'SYNBND',
    metadataCompletenessScore: 88,
    liquidityUsd: 93000,
    holderConcentrationPct: 58,
    creatorRiskFlags: ['cluster_linkage_review_required'],
    clusterIndicators: ['cluster-density-high', 'leader-follower-pattern'],
    velocity: 'high',
    rejected: false,
  },
  'metadata-incomplete-launch': {
    fixtureKind: 'metadata_incomplete',
    label: 'Metadata-incomplete synthetic launch',
    symbol: 'SYNMET',
    metadataCompletenessScore: 42,
    liquidityUsd: 74000,
    holderConcentrationPct: 44,
    creatorRiskFlags: ['metadata_integrity_gap'],
    clusterIndicators: [],
    velocity: 'medium',
    rejected: false,
  },
  'high-velocity-early-volume-launch': {
    fixtureKind: 'early_volume_velocity',
    label: 'High-velocity early-volume synthetic launch',
    symbol: 'SYNVEL',
    metadataCompletenessScore: 86,
    liquidityUsd: 118000,
    holderConcentrationPct: 39,
    creatorRiskFlags: ['velocity_spike_review_required'],
    clusterIndicators: ['velocity-coordination-window'],
    velocity: 'high',
    rejected: false,
  },
  'safety-rejected-launch': {
    fixtureKind: 'safety_rejected',
    label: 'Safety-rejected synthetic launch',
    symbol: 'SYNREJ',
    metadataCompletenessScore: 38,
    liquidityUsd: 16000,
    holderConcentrationPct: 84,
    creatorRiskFlags: ['repeated_risk_flags', 'metadata_integrity_gap', 'cluster_linkage_review_required'],
    clusterIndicators: ['cluster-density-high', 'bundle-window-tight'],
    velocity: 'high',
    rejected: true,
  },
};

function fixtureId(name: SyntheticLaunchIntelligenceScenarioName): string {
  return `phase53-fixture-${stableDeterministicSyntheticLaunchIntelligenceChecksum(name).replace(':', '-')}`;
}

function buildLaunchEvents(fixtureName: SyntheticLaunchIntelligenceScenarioName): readonly SyntheticLaunchEvent[] {
  const fixturePrefix = fixtureId(fixtureName);
  const summaries = [
    'Synthetic launch detected from local fixture timeline.',
    'Synthetic pool created for deterministic review context.',
    'Synthetic initial liquidity event recorded for fixture analysis.',
    'Synthetic early volume burst marker captured for fixture scenario.',
    'Synthetic creator activity observed from fixture history.',
    'Synthetic holder distribution snapshot captured for deterministic metrics.',
    'Synthetic suspicious bundle pattern observed and tagged for review.',
    'Synthetic risk review completed; fixture-only and not actionable.',
  ] as const;

  const eventKinds = [
    'launch_detected',
    'pool_created',
    'initial_liquidity_added',
    'early_volume_burst',
    'creator_activity_observed',
    'holder_distribution_snapshot_captured',
    'suspicious_bundle_pattern_observed',
    'risk_review_completed',
  ] as const;

  return eventKinds.map((eventKind, index) => ({
    eventId: `${fixturePrefix}-event-${index + 1}`,
    eventKind,
    eventOrder: index + 1,
    syntheticTimestamp: `2026-01-09T00:${String(index).padStart(2, '0')}:00.000Z`,
    summary: summaries[index],
    source: 'synthetic_fixture_only',
    confidenceLabel: index >= 6 ? 'medium' : 'high',
    safetyNotes: ['fixture-only', 'not actionable', 'descriptive risk observed'],
  }));
}

function buildPoolSnapshots(
  fixtureName: SyntheticLaunchIntelligenceScenarioName,
  liquidityUsd: number,
): readonly SyntheticPoolLiquiditySnapshot[] {
  const fixturePrefix = fixtureId(fixtureName);
  return [
    {
      snapshotId: `${fixturePrefix}-pool-1`,
      poolFixtureId: `${fixturePrefix}-pool`,
      syntheticTimestamp: '2026-01-09T00:02:00.000Z',
      syntheticLiquidityUsd: liquidityUsd,
      syntheticLiquidityChangeUsd: liquidityUsd,
      liquidityConcentrationLabel: liquidityUsd < 30000 ? 'concentrated' : liquidityUsd < 90000 ? 'moderate' : 'balanced',
      eventKind: 'initial_liquidity',
      source: 'synthetic_fixture_only',
    },
    {
      snapshotId: `${fixturePrefix}-pool-2`,
      poolFixtureId: `${fixturePrefix}-pool`,
      syntheticTimestamp: '2026-01-09T00:06:00.000Z',
      syntheticLiquidityUsd: Math.max(10000, liquidityUsd - 5000),
      syntheticLiquidityChangeUsd: -5000,
      liquidityConcentrationLabel: liquidityUsd < 30000 ? 'concentrated' : liquidityUsd < 90000 ? 'moderate' : 'balanced',
      eventKind: 'liquidity_change',
      source: 'synthetic_fixture_only',
    },
  ];
}

function buildHolderSnapshots(
  fixtureName: SyntheticLaunchIntelligenceScenarioName,
  holderConcentrationPct: number,
): readonly SyntheticHolderDistributionSnapshot[] {
  const fixturePrefix = fixtureId(fixtureName);
  return [
    {
      snapshotId: `${fixturePrefix}-holders-1`,
      syntheticTimestamp: '2026-01-09T00:04:00.000Z',
      holderCount: holderConcentrationPct > 70 ? 58 : 133,
      topHolderConcentrationPct: holderConcentrationPct,
      hhiScore: holderConcentrationPct > 70 ? 0.39 : holderConcentrationPct > 50 ? 0.24 : 0.11,
      giniApprox: holderConcentrationPct > 70 ? 0.81 : holderConcentrationPct > 50 ? 0.67 : 0.43,
      clusterFlags:
        holderConcentrationPct > 70
          ? ['holder-concentration-high', 'requires-review']
          : holderConcentrationPct > 50
            ? ['holder-concentration-medium']
            : ['holder-concentration-low'],
      source: 'synthetic_fixture_only',
    },
  ];
}

function buildWalletClusters(
  fixtureName: SyntheticLaunchIntelligenceScenarioName,
  clusterIndicators: readonly string[],
): readonly SyntheticWalletClusterIndicator[] {
  const fixturePrefix = fixtureId(fixtureName);
  if (clusterIndicators.length === 0) {
    return [];
  }
  return clusterIndicators.map((indicator, index) => ({
    clusterId: `${fixturePrefix}-cluster-${index + 1}`,
    leaderPattern: `${indicator}-leader-window`,
    followerPattern: `${indicator}-follower-window`,
    timingWindowSeconds: 45 + index * 15,
    concentrationLabel: indicator.includes('high') ? 'high' : 'medium',
    source: 'synthetic_fixture_only',
  }));
}

function buildRiskFactors(
  fixtureName: SyntheticLaunchIntelligenceScenarioName,
  definition: ScenarioDefinition,
): readonly SyntheticLaunchRiskFactorSummary[] {
  const prefix = fixtureId(fixtureName);
  return [
    {
      riskFactorId: `${prefix}-risk-metadata`,
      category: 'metadata_integrity',
      severity: definition.metadataCompletenessScore < 50 ? 'high' : 'low',
      label: 'Metadata integrity review',
      description: 'Synthetic metadata integrity risk observed; requires review in fixture context.',
      evidenceReferenceIds: [`${prefix}-event-1`],
      isRejectionReason: definition.metadataCompletenessScore < 40,
      nonAdvisory: true,
      safetyNotes: ['descriptive only', 'fixture-only', 'not actionable'],
    },
    {
      riskFactorId: `${prefix}-risk-liquidity`,
      category: 'liquidity_quality',
      severity: definition.liquidityUsd < 30000 ? 'critical' : definition.liquidityUsd < 90000 ? 'medium' : 'low',
      label: 'Liquidity quality review',
      description: 'Synthetic liquidity quality profile derived from deterministic fixture values.',
      evidenceReferenceIds: [`${prefix}-pool-1`, `${prefix}-pool-2`],
      isRejectionReason: definition.liquidityUsd < 20000,
      nonAdvisory: true,
      safetyNotes: ['descriptive only', 'fixture-only', 'not actionable'],
    },
    {
      riskFactorId: `${prefix}-risk-holders`,
      category: 'holder_concentration',
      severity: definition.holderConcentrationPct > 70 ? 'high' : definition.holderConcentrationPct > 50 ? 'medium' : 'low',
      label: 'Holder concentration review',
      description: 'Synthetic holder concentration metric indicates review priority only.',
      evidenceReferenceIds: [`${prefix}-holders-1`],
      isRejectionReason: definition.holderConcentrationPct > 80,
      nonAdvisory: true,
      safetyNotes: ['descriptive only', 'fixture-only', 'not actionable'],
    },
    {
      riskFactorId: `${prefix}-risk-creator`,
      category: 'creator_history',
      severity: definition.creatorRiskFlags.length >= 2 ? 'high' : definition.creatorRiskFlags.length === 1 ? 'medium' : 'low',
      label: 'Creator history review',
      description: 'Synthetic creator history risk observed from deterministic fixture labels.',
      evidenceReferenceIds: [`${prefix}-event-5`],
      isRejectionReason: definition.rejected,
      nonAdvisory: true,
      safetyNotes: ['descriptive only', 'fixture-only', 'not actionable'],
    },
    {
      riskFactorId: `${prefix}-risk-cluster`,
      category: 'wallet_cluster_pattern',
      severity: definition.clusterIndicators.some(label => label.includes('high')) ? 'high' : definition.clusterIndicators.length > 0 ? 'medium' : 'low',
      label: 'Wallet cluster pattern review',
      description: 'Synthetic wallet cluster pattern marker captured for fixture analysis.',
      evidenceReferenceIds: definition.clusterIndicators.map((_, index) => `${prefix}-cluster-${index + 1}`),
      isRejectionReason: definition.rejected,
      nonAdvisory: true,
      safetyNotes: ['descriptive only', 'fixture-only', 'not actionable'],
    },
    {
      riskFactorId: `${prefix}-risk-velocity`,
      category: 'early_volume_velocity',
      severity: definition.velocity === 'high' ? 'high' : definition.velocity === 'medium' ? 'medium' : 'low',
      label: 'Early volume velocity review',
      description: 'Synthetic early volume velocity profile requires contextual review.',
      evidenceReferenceIds: [`${prefix}-event-4`],
      isRejectionReason: definition.rejected,
      nonAdvisory: true,
      safetyNotes: ['descriptive only', 'fixture-only', 'not actionable'],
    },
    {
      riskFactorId: `${prefix}-risk-safety`,
      category: 'safety_boundary',
      severity: definition.rejected ? 'critical' : 'low',
      label: 'Safety boundary review',
      description: 'Synthetic safety boundary status describing whether fixture is rejected.',
      evidenceReferenceIds: [`${prefix}-event-8`],
      isRejectionReason: definition.rejected,
      nonAdvisory: true,
      safetyNotes: ['descriptive only', 'fixture-only', 'not actionable'],
    },
  ];
}

export function buildSyntheticLaunchIntelligenceFixture(
  input: BuildSyntheticLaunchIntelligenceFixtureInput,
): SyntheticLaunchIntelligenceFixture {
  const definition = SCENARIO_DEFINITIONS[input.fixtureName];
  const deterministicSeed = `phase53:${input.fixtureName}:${definition.fixtureKind}`;
  const generatedAt = PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT;
  const id = fixtureId(input.fixtureName);

  const fixtureBase = {
    fixtureId: id,
    fixtureName: input.fixtureName,
    fixtureKind: definition.fixtureKind,
    phase: SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE,
    scenarioLabel: definition.label,
    generatedAt,
    deterministicSeed,
    tokenProfile: {
      tokenMintPlaceholderId: `synthetic-mint-${input.fixtureName}`,
      symbol: definition.symbol,
      name: `Synthetic ${definition.symbol} Launch`,
      decimals: 6,
      syntheticSupply: 1000000000,
      launchTimestamp: '2026-01-09T00:00:00.000Z',
      metadataCompletenessScore: definition.metadataCompletenessScore,
      hasName: true,
      hasSymbol: true,
      hasDescription: definition.metadataCompletenessScore >= 60,
      hasImage: definition.metadataCompletenessScore >= 70,
      hasSocialLinks: definition.metadataCompletenessScore >= 80,
      source: 'synthetic_fixture_only' as const,
    },
    launchEvents: buildLaunchEvents(input.fixtureName),
    poolLiquiditySnapshots: buildPoolSnapshots(input.fixtureName, definition.liquidityUsd),
    creatorProfile: {
      creatorFixtureId: `synthetic-creator-${input.fixtureName}`,
      launchHistoryCount: definition.creatorRiskFlags.length > 0 ? 7 : 2,
      reputationLabels:
        definition.creatorRiskFlags.length > 1
          ? ['synthetic-review-required', 'synthetic-history-risk']
          : ['synthetic-monitored'],
      riskFlags: [...definition.creatorRiskFlags],
      source: 'synthetic_fixture_only' as const,
    },
    holderDistributionSnapshots: buildHolderSnapshots(input.fixtureName, definition.holderConcentrationPct),
    walletClusterIndicators: buildWalletClusters(input.fixtureName, definition.clusterIndicators),
    riskFactorSummaries: buildRiskFactors(input.fixtureName, definition),
    riskReview: {
      reviewId: `phase53-review-${id}`,
      reviewStatus: definition.rejected ? 'rejected_for_fixture_display' : 'approved_for_fixture_display',
      rejectionReasons: definition.rejected
        ? ['Synthetic rejection reason: multiple critical risk factors observed.']
        : [],
      safetyNotes: ['Synthetic review only', 'Not actionable', 'Descriptive risk observed'],
      nonAdvisory: true,
      notActionable: true,
    },
    capabilityFlags: getSyntheticLaunchIntelligenceCapabilities(),
    meta: {
      generatedAt,
      source: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
      version: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_VERSION,
      deterministicSeed,
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      liveData: false,
      networkAccess: false,
      persistence: false,
      execution: false,
    },
    safety: {
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      localOnly: true,
      readOnly: true,
      nonExecutable: true,
      nonAdvisory: true,
      notActionable: true,
    },
  } as const;

  const fixtureWithoutDerived = fixtureBase as unknown as SyntheticLaunchIntelligenceFixture;
  const viewModel = buildSyntheticLaunchIntelligenceViewModel(fixtureWithoutDerived);
  const withViewModel = {
    ...fixtureBase,
    viewModel,
  } as unknown as SyntheticLaunchIntelligenceFixture;
  const apiContracts = buildSyntheticLaunchIntelligenceApiContract(withViewModel);

  return {
    ...withViewModel,
    apiContracts,
    selectorExamples: [
      {
        selectorId: `phase53-selector-${id}-id`,
        selectedFixtureId: id,
        selectedScenarioKind: definition.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
      {
        selectorId: `phase53-selector-${id}-kind`,
        selectedFixtureId: id,
        selectedScenarioKind: definition.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
    ],
  };
}
