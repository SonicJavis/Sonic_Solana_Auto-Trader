/**
 * Phase 31 — Wallet Cluster Fixture Models v1: builders.
 */

import {
  PHASE_31_WALLET_CLUSTER_GENERATED_AT,
  PHASE_31_WALLET_CLUSTER_SOURCE,
  type WalletClusterHistoryFixture,
  type WalletClusterIntelligenceBuildInput,
  type WalletClusterIntelligenceBuildResult,
  type WalletClusterIntelligenceFixture,
  type WalletClusterIntelligenceSummary,
  type WalletClusterQualityIndicator,
  type WalletClusterRiskIndicator,
  type WalletClusterSignalFixture,
} from './cluster-fixture-model-types.js';
import { normalizeWalletClusterIntelligenceFixture } from './cluster-fixture-model-normalization.js';
import {
  validateWalletClusterIntelligenceFixture,
  validateWalletClusterIntelligenceSafety,
} from './cluster-fixture-model-validation.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function topCodes<T extends { readonly code: string }>(
  values: readonly T[],
  limit: number,
): readonly string[] {
  return values
    .map(value => value.code)
    .sort((left, right) => left.localeCompare(right))
    .slice(0, limit);
}

function getCoordinationAssessment(
  signals: readonly WalletClusterSignalFixture[],
): WalletClusterIntelligenceSummary['coordinationAssessment'] {
  const coordSignals = signals.filter(s => s.signalType === 'coordination');
  if (coordSignals.length === 0) return 'none';
  if (coordSignals.some(s => s.intensity === 'high' && s.pattern === 'synchronized')) return 'high';
  if (coordSignals.some(s => s.intensity === 'high' || s.pattern === 'clustered')) return 'suspicious';
  if (coordSignals.some(s => s.intensity === 'moderate')) return 'low';
  return 'none';
}

function getDumpRiskAssessment(
  signals: readonly WalletClusterSignalFixture[],
  history: WalletClusterHistoryFixture,
): WalletClusterIntelligenceSummary['dumpRiskAssessment'] {
  const dumpSignals = signals.filter(s => s.signalType === 'dump-pattern');
  if (dumpSignals.some(s => s.intensity === 'high')) return 'high';
  if (history.dumpSpeedBand === 'very-fast') return 'high';
  if (history.dumpSpeedBand === 'fast' || dumpSignals.some(s => s.intensity === 'moderate')) return 'moderate';
  if (dumpSignals.length === 0 && history.dumpSpeedBand === 'slow') return 'none';
  return 'low';
}

function getRiskAssessment(
  riskIndicators: readonly WalletClusterRiskIndicator[],
): WalletClusterIntelligenceSummary['riskAssessment'] {
  if (riskIndicators.length === 0) return 'low';
  if (riskIndicators.some(r => r.level === 'critical')) return 'critical';
  if (riskIndicators.some(r => r.level === 'high')) return 'high';
  if (riskIndicators.some(r => r.level === 'medium')) return 'moderate';
  return 'low';
}

function getDataCompleteness(
  fixture: Omit<WalletClusterIntelligenceFixture, 'summary'>,
): WalletClusterIntelligenceSummary['dataCompleteness'] {
  if (
    fixture.signals.length === 0 &&
    fixture.riskIndicators.length === 0 &&
    fixture.qualityIndicators.length === 0 &&
    fixture.history.observedLaunchCount === 0
  ) {
    return 'insufficient';
  }
  if (
    fixture.signals.length === 0 ||
    (fixture.riskIndicators.length === 0 && fixture.qualityIndicators.length === 0)
  ) {
    return 'partial';
  }
  return 'complete';
}

function getSignalBalance(
  riskIndicators: readonly WalletClusterRiskIndicator[],
  qualityIndicators: readonly WalletClusterQualityIndicator[],
  dataCompleteness: WalletClusterIntelligenceSummary['dataCompleteness'],
): WalletClusterIntelligenceSummary['signalBalance'] {
  if (dataCompleteness === 'insufficient') return 'insufficient-data';
  if (riskIndicators.length > qualityIndicators.length) return 'risk-dominant';
  if (qualityIndicators.length > riskIndicators.length) return 'quality-dominant';
  return 'balanced';
}

export function buildWalletClusterIntelligenceSummary(
  fixture: Omit<WalletClusterIntelligenceFixture, 'summary'>,
): WalletClusterIntelligenceSummary {
  const dataCompleteness = getDataCompleteness(fixture);

  return {
    phase: 31,
    name: fixture.name,
    kind: fixture.kind,
    clusterId: fixture.profile.clusterId,
    signalBalance: getSignalBalance(fixture.riskIndicators, fixture.qualityIndicators, dataCompleteness),
    riskAssessment: getRiskAssessment(fixture.riskIndicators),
    coordinationAssessment: getCoordinationAssessment(fixture.signals),
    dumpRiskAssessment: getDumpRiskAssessment(fixture.signals, fixture.history),
    dataCompleteness,
    qualityCount: fixture.qualityIndicators.length,
    riskCount: fixture.riskIndicators.length,
    topQualityCodes: topCodes(fixture.qualityIndicators, 3),
    topRiskCodes: topCodes(fixture.riskIndicators, 3),
    generatedAt: PHASE_31_WALLET_CLUSTER_GENERATED_AT,
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    nonAdvisory: true,
    safeToDisplay: true,
    notes: sortStrings(fixture.safeNotes),
  };
}

export function buildWalletClusterIntelligenceFixture(
  input: WalletClusterIntelligenceBuildInput,
): WalletClusterIntelligenceBuildResult {
  const safeNotes = sortStrings([
    'Deterministic synthetic data.',
    'Local-only and non-advisory.',
    'Wallet cluster fixture only.',
    ...(input.safeNotes ?? []),
  ]);

  const draftFixture: WalletClusterIntelligenceFixture = {
    name: input.name as WalletClusterIntelligenceFixture['name'],
    kind: input.kind as WalletClusterIntelligenceFixture['kind'],
    profile: { ...input.profile },
    signals: (input.signals ?? []).map(signal => ({
      ...signal,
      notes: sortStrings(signal.notes),
    })),
    history: {
      ...input.history,
      notes: sortStrings(input.history.notes),
    },
    riskIndicators: [...(input.riskIndicators ?? [])],
    qualityIndicators: [...(input.qualityIndicators ?? [])],
    safeNotes,
    meta: {
      phase: 31,
      generatedAt: PHASE_31_WALLET_CLUSTER_GENERATED_AT,
      source: PHASE_31_WALLET_CLUSTER_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      liveData: false,
      externalNetwork: false,
      persistence: false,
      deterministic: true,
      readOnly: true,
      nonAdvisory: true,
      notes: safeNotes,
    },
    summary: {} as WalletClusterIntelligenceSummary,
  };

  const normalizedWithoutSummary = normalizeWalletClusterIntelligenceFixture({
    ...draftFixture,
    summary: {
      phase: 31,
      name: draftFixture.name,
      kind: draftFixture.kind,
      clusterId: draftFixture.profile.clusterId,
      signalBalance: 'insufficient-data',
      riskAssessment: 'unknown',
      coordinationAssessment: 'unknown',
      dumpRiskAssessment: 'none',
      dataCompleteness: 'insufficient',
      qualityCount: 0,
      riskCount: 0,
      topQualityCodes: [],
      topRiskCodes: [],
      generatedAt: PHASE_31_WALLET_CLUSTER_GENERATED_AT,
      fixtureOnly: true,
      liveData: false,
      externalNetwork: false,
      nonAdvisory: true,
      safeToDisplay: true,
      notes: safeNotes,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { summary: _placeholderSummary, ...fixtureWithoutSummary } = normalizedWithoutSummary;

  const fixture = normalizeWalletClusterIntelligenceFixture({
    ...fixtureWithoutSummary,
    summary: buildWalletClusterIntelligenceSummary(fixtureWithoutSummary),
  });

  const validation = validateWalletClusterIntelligenceFixture(fixture);
  const safety = validateWalletClusterIntelligenceSafety(fixture);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}
