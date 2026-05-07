/**
 * Phase 33 — Offline Intelligence Composite Evidence Models v1: normalization helpers.
 */

import type {
  CompositeConfidenceIndicator,
  CompositeEvidenceSourceReference,
  CompositeEvidenceWeighting,
  CompositeQualityIndicator,
  CompositeRiskIndicator,
  OfflineCompositeEvidenceFixture,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function sortRiskIndicators(
  values: readonly CompositeRiskIndicator[],
): readonly CompositeRiskIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortQualityIndicators(
  values: readonly CompositeQualityIndicator[],
): readonly CompositeQualityIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortConfidenceIndicators(
  values: readonly CompositeConfidenceIndicator[],
): readonly CompositeConfidenceIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function normalizeSourceReference(
  ref: CompositeEvidenceSourceReference,
): CompositeEvidenceSourceReference {
  return {
    ...ref,
    creator: ref.creator
      ? { ...ref.creator, notes: sortStrings(ref.creator.notes) }
      : ref.creator,
    walletCluster: ref.walletCluster
      ? { ...ref.walletCluster, notes: sortStrings(ref.walletCluster.notes) }
      : ref.walletCluster,
    manipulation: ref.manipulation
      ? { ...ref.manipulation, notes: sortStrings(ref.manipulation.notes) }
      : ref.manipulation,
    notes: sortStrings(ref.notes),
  };
}

function normalizeWeighting(
  weighting: CompositeEvidenceWeighting,
): CompositeEvidenceWeighting {
  return {
    ...weighting,
    notes: sortStrings(weighting.notes),
  };
}

export function normalizeOfflineCompositeEvidenceFixture(
  fixture: OfflineCompositeEvidenceFixture,
): OfflineCompositeEvidenceFixture {
  return {
    ...fixture,
    sourceReferences: normalizeSourceReference(fixture.sourceReferences),
    riskIndicators: sortRiskIndicators(fixture.riskIndicators),
    qualityIndicators: sortQualityIndicators(fixture.qualityIndicators),
    confidenceIndicators: sortConfidenceIndicators(fixture.confidenceIndicators),
    weighting: normalizeWeighting(fixture.weighting),
    summary: {
      ...fixture.summary,
      topRiskCodes: sortStrings(fixture.summary.topRiskCodes),
      topQualityCodes: sortStrings(fixture.summary.topQualityCodes),
      notes: sortStrings(fixture.summary.notes),
    },
    safeNotes: sortStrings(fixture.safeNotes),
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
  };
}

export function serializeOfflineCompositeEvidenceFixture(
  fixture: OfflineCompositeEvidenceFixture,
): string {
  return JSON.stringify(normalizeOfflineCompositeEvidenceFixture(fixture));
}

export function isOfflineCompositeEvidenceFixtureSerializable(value: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function areOfflineCompositeEvidenceFixturesEqual(
  left: OfflineCompositeEvidenceFixture,
  right: OfflineCompositeEvidenceFixture,
): boolean {
  return (
    serializeOfflineCompositeEvidenceFixture(left) ===
    serializeOfflineCompositeEvidenceFixture(right)
  );
}
