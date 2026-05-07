/**
 * Phase 30 — Creator Intelligence Fixture Models v1: normalization helpers.
 */

import type {
  CreatorCredibilityIndicator,
  CreatorDisclosureSignalFixture,
  CreatorEngagementPatternFixture,
  CreatorIntelligenceFixture,
  CreatorRiskIndicator,
  CreatorSocialSignalFixture,
} from './fixture-model-types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function sortRiskIndicators(values: readonly CreatorRiskIndicator[]): readonly CreatorRiskIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortCredibilityIndicators(values: readonly CreatorCredibilityIndicator[]): readonly CreatorCredibilityIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortSocialSignals(values: readonly CreatorSocialSignalFixture[]): readonly CreatorSocialSignalFixture[] {
  return [...values]
    .map(signal => ({
      ...signal,
      notes: sortStrings(signal.notes),
    }))
    .sort((left, right) =>
      `${left.signalType}:${left.pattern}:${left.sentiment}`.localeCompare(
        `${right.signalType}:${right.pattern}:${right.sentiment}`,
      ),
    );
}

function sortDisclosureSignals(values: readonly CreatorDisclosureSignalFixture[]): readonly CreatorDisclosureSignalFixture[] {
  return [...values]
    .map(signal => ({
      ...signal,
      notes: sortStrings(signal.notes),
    }))
    .sort((left, right) => `${left.disclosureType}:${left.clarity}`.localeCompare(`${right.disclosureType}:${right.clarity}`));
}

function sortEngagementPatterns(values: readonly CreatorEngagementPatternFixture[]): readonly CreatorEngagementPatternFixture[] {
  return [...values]
    .map(pattern => ({
      ...pattern,
      evidenceTags: sortStrings(pattern.evidenceTags),
    }))
    .sort((left, right) =>
      `${left.pattern}:${left.cadence}:${left.accountDiversity}`.localeCompare(
        `${right.pattern}:${right.cadence}:${right.accountDiversity}`,
      ),
    );
}

export function normalizeCreatorIntelligenceFixture(fixture: CreatorIntelligenceFixture): CreatorIntelligenceFixture {
  return {
    ...fixture,
    narrative: {
      ...fixture.narrative,
      evidenceTags: sortStrings(fixture.narrative.evidenceTags),
    },
    socialSignals: sortSocialSignals(fixture.socialSignals),
    disclosureSignals: sortDisclosureSignals(fixture.disclosureSignals),
    engagementPatterns: sortEngagementPatterns(fixture.engagementPatterns),
    riskIndicators: sortRiskIndicators(fixture.riskIndicators),
    credibilityIndicators: sortCredibilityIndicators(fixture.credibilityIndicators),
    safeNotes: sortStrings(fixture.safeNotes),
    summary: {
      ...fixture.summary,
      topCredibilityCodes: sortStrings(fixture.summary.topCredibilityCodes),
      topRiskCodes: sortStrings(fixture.summary.topRiskCodes),
      notes: sortStrings(fixture.summary.notes),
    },
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
  };
}

export function serializeCreatorIntelligenceFixture(fixture: CreatorIntelligenceFixture): string {
  return JSON.stringify(normalizeCreatorIntelligenceFixture(fixture));
}

export function isCreatorIntelligenceFixtureSerializable(fixture: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(fixture));
    return true;
  } catch {
    return false;
  }
}

export function areCreatorIntelligenceFixturesEqual(
  left: CreatorIntelligenceFixture,
  right: CreatorIntelligenceFixture,
): boolean {
  return serializeCreatorIntelligenceFixture(left) === serializeCreatorIntelligenceFixture(right);
}
