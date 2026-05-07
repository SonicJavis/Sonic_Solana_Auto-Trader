/**
 * Phase 32 — Bundle / Manipulation Evidence Fixture Models v1: normalization helpers.
 */

import type {
  ManipulationEvidenceCrossReferenceSummary,
  ManipulationEvidenceFixture,
  ManipulationQualityIndicator,
  ManipulationRiskIndicator,
} from './evidence-fixture-model-types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function sortRiskIndicators(
  values: readonly ManipulationRiskIndicator[],
): readonly ManipulationRiskIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortQualityIndicators(
  values: readonly ManipulationQualityIndicator[],
): readonly ManipulationQualityIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function normalizeCrossReferenceSummary(
  summary: ManipulationEvidenceCrossReferenceSummary,
): ManipulationEvidenceCrossReferenceSummary {
  return {
    ...summary,
    sharedSignals: sortStrings(summary.sharedSignals),
    cautionNotes: sortStrings(summary.cautionNotes),
  };
}

export function normalizeManipulationEvidenceFixture(
  fixture: ManipulationEvidenceFixture,
): ManipulationEvidenceFixture {
  return {
    ...fixture,
    bundlePattern: {
      ...fixture.bundlePattern,
      notes: sortStrings(fixture.bundlePattern.notes),
    },
    launchStructure: {
      ...fixture.launchStructure,
      notes: sortStrings(fixture.launchStructure.notes),
    },
    liquidityPattern: {
      ...fixture.liquidityPattern,
      notes: sortStrings(fixture.liquidityPattern.notes),
    },
    coordination: {
      ...fixture.coordination,
      notes: sortStrings(fixture.coordination.notes),
    },
    distribution: {
      ...fixture.distribution,
      notes: sortStrings(fixture.distribution.notes),
    },
    fundingPattern: {
      ...fixture.fundingPattern,
      notes: sortStrings(fixture.fundingPattern.notes),
    },
    riskIndicators: sortRiskIndicators(fixture.riskIndicators),
    qualityIndicators: sortQualityIndicators(fixture.qualityIndicators),
    summary: {
      ...fixture.summary,
      topQualityCodes: sortStrings(fixture.summary.topQualityCodes),
      topRiskCodes: sortStrings(fixture.summary.topRiskCodes),
      notes: sortStrings(fixture.summary.notes),
    },
    crossReferenceSummary: normalizeCrossReferenceSummary(fixture.crossReferenceSummary),
    safeNotes: sortStrings(fixture.safeNotes),
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
  };
}

export function serializeManipulationEvidenceFixture(
  fixture: ManipulationEvidenceFixture,
): string {
  return JSON.stringify(normalizeManipulationEvidenceFixture(fixture));
}

export function isManipulationEvidenceFixtureSerializable(value: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function areManipulationEvidenceFixturesEqual(
  left: ManipulationEvidenceFixture,
  right: ManipulationEvidenceFixture,
): boolean {
  return serializeManipulationEvidenceFixture(left) === serializeManipulationEvidenceFixture(right);
}
