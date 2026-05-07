/**
 * Phase 31 — Wallet Cluster Fixture Models v1: normalization helpers.
 */

import type {
  WalletClusterHistoryFixture,
  WalletClusterIntelligenceFixture,
  WalletClusterQualityIndicator,
  WalletClusterRiskIndicator,
  WalletClusterSignalFixture,
} from './cluster-fixture-model-types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function sortRiskIndicators(
  values: readonly WalletClusterRiskIndicator[],
): readonly WalletClusterRiskIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortQualityIndicators(
  values: readonly WalletClusterQualityIndicator[],
): readonly WalletClusterQualityIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortSignals(
  values: readonly WalletClusterSignalFixture[],
): readonly WalletClusterSignalFixture[] {
  return [...values]
    .map(signal => ({
      ...signal,
      notes: sortStrings(signal.notes),
    }))
    .sort((left, right) =>
      `${left.signalType}:${left.intensity}:${left.pattern}`.localeCompare(
        `${right.signalType}:${right.intensity}:${right.pattern}`,
      ),
    );
}

function normalizeHistory(history: WalletClusterHistoryFixture): WalletClusterHistoryFixture {
  return {
    ...history,
    notes: sortStrings(history.notes),
  };
}

export function normalizeWalletClusterIntelligenceFixture(
  fixture: WalletClusterIntelligenceFixture,
): WalletClusterIntelligenceFixture {
  return {
    ...fixture,
    signals: sortSignals(fixture.signals),
    history: normalizeHistory(fixture.history),
    riskIndicators: sortRiskIndicators(fixture.riskIndicators),
    qualityIndicators: sortQualityIndicators(fixture.qualityIndicators),
    safeNotes: sortStrings(fixture.safeNotes),
    summary: {
      ...fixture.summary,
      topQualityCodes: sortStrings(fixture.summary.topQualityCodes),
      topRiskCodes: sortStrings(fixture.summary.topRiskCodes),
      notes: sortStrings(fixture.summary.notes),
    },
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
  };
}

export function serializeWalletClusterIntelligenceFixture(
  fixture: WalletClusterIntelligenceFixture,
): string {
  return JSON.stringify(normalizeWalletClusterIntelligenceFixture(fixture));
}

export function isWalletClusterIntelligenceFixtureSerializable(value: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function areWalletClusterIntelligenceFixturesEqual(
  left: WalletClusterIntelligenceFixture,
  right: WalletClusterIntelligenceFixture,
): boolean {
  return (
    serializeWalletClusterIntelligenceFixture(left) ===
    serializeWalletClusterIntelligenceFixture(right)
  );
}
