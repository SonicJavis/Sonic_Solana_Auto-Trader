/**
 * Phase 30 — Creator Intelligence Fixture Models v1: builders.
 */

import {
  PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT,
  PHASE_30_CREATOR_INTELLIGENCE_SOURCE,
  type CreatorCredibilityIndicator,
  type CreatorDisclosureSignalFixture,
  type CreatorEngagementPatternFixture,
  type CreatorIntelligenceBuildInput,
  type CreatorIntelligenceBuildResult,
  type CreatorIntelligenceFixture,
  type CreatorIntelligenceSummary,
  type CreatorRiskIndicator,
  type CreatorSocialSignalFixture,
} from './fixture-model-types.js';
import { normalizeCreatorIntelligenceFixture } from './fixture-model-normalization.js';
import { validateCreatorIntelligenceFixture, validateCreatorIntelligenceSafety } from './fixture-model-validation.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function topCodes<T extends { readonly code: string }>(values: readonly T[], limit: number): readonly string[] {
  return values.map(value => value.code).sort((left, right) => left.localeCompare(right)).slice(0, limit);
}

function getDisclosureAssessment(signals: readonly CreatorDisclosureSignalFixture[]): CreatorIntelligenceSummary['disclosureAssessment'] {
  if (signals.length === 0) return 'unknown';
  if (signals.some(signal => signal.clarity === 'poor' || signal.clarity === 'absent')) {
    return signals.some(signal => signal.clarity === 'clear') ? 'mixed' : 'poor';
  }
  return signals.some(signal => signal.clarity === 'clear') ? 'clear' : 'mixed';
}

function getEngagementAssessment(
  engagementPatterns: readonly CreatorEngagementPatternFixture[],
  socialSignals: readonly CreatorSocialSignalFixture[],
): CreatorIntelligenceSummary['engagementAssessment'] {
  const patterns = engagementPatterns.map(pattern => pattern.pattern);
  const socialPatterns = socialSignals.map(signal => signal.pattern);
  if (patterns.includes('coordinated-hype') || patterns.includes('suspicious-burst') || socialPatterns.includes('coordinated')) {
    return 'suspicious';
  }
  if (patterns.includes('consistent-low-volume') || socialPatterns.includes('low-signal')) {
    return 'low-signal';
  }
  if (socialPatterns.includes('bursty')) {
    return 'mixed';
  }
  return engagementPatterns.length === 0 && socialSignals.length === 0 ? 'unknown' : 'organic';
}

function getNarrativeAssessment(messageStyle: CreatorIntelligenceFixture['narrative']['messageStyle']): CreatorIntelligenceSummary['narrativeAssessment'] {
  if (messageStyle === 'overpromotional') return 'promotional-risk';
  if (messageStyle === 'recycled') return 'recycled';
  if (messageStyle === 'mixed') return 'mixed';
  if (messageStyle === 'unknown') return 'unknown';
  return 'balanced';
}

function getDataCompleteness(fixture: Omit<CreatorIntelligenceFixture, 'summary'>): CreatorIntelligenceSummary['dataCompleteness'] {
  if (
    fixture.profile.accountAgeBand === 'unknown' &&
    fixture.socialSignals.length === 0 &&
    fixture.disclosureSignals.length === 0 &&
    fixture.engagementPatterns.length === 0
  ) {
    return 'insufficient';
  }
  if (
    fixture.socialSignals.length === 0 ||
    fixture.disclosureSignals.length === 0 ||
    fixture.engagementPatterns.length === 0 ||
    fixture.narrative.messageStyle === 'unknown'
  ) {
    return 'partial';
  }
  return 'complete';
}

function getSignalBalance(
  riskIndicators: readonly CreatorRiskIndicator[],
  credibilityIndicators: readonly CreatorCredibilityIndicator[],
  dataCompleteness: CreatorIntelligenceSummary['dataCompleteness'],
): CreatorIntelligenceSummary['signalBalance'] {
  if (dataCompleteness === 'insufficient') return 'insufficient-data';
  if (riskIndicators.length > credibilityIndicators.length) return 'risk-dominant';
  if (credibilityIndicators.length > riskIndicators.length) return 'credibility-dominant';
  return 'balanced';
}

export function buildCreatorIntelligenceSummary(fixture: Omit<CreatorIntelligenceFixture, 'summary'>): CreatorIntelligenceSummary {
  const dataCompleteness = getDataCompleteness(fixture);

  return {
    phase: 30,
    name: fixture.name,
    kind: fixture.kind,
    creatorId: fixture.profile.creatorId,
    projectId: fixture.project.projectId,
    signalBalance: getSignalBalance(fixture.riskIndicators, fixture.credibilityIndicators, dataCompleteness),
    disclosureAssessment: getDisclosureAssessment(fixture.disclosureSignals),
    engagementAssessment: getEngagementAssessment(fixture.engagementPatterns, fixture.socialSignals),
    narrativeAssessment: getNarrativeAssessment(fixture.narrative.messageStyle),
    dataCompleteness,
    credibilityCount: fixture.credibilityIndicators.length,
    riskCount: fixture.riskIndicators.length,
    topCredibilityCodes: topCodes(fixture.credibilityIndicators, 3),
    topRiskCodes: topCodes(fixture.riskIndicators, 3),
    generatedAt: fixture.meta.generatedAt,
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    nonAdvisory: true,
    safeToDisplay: true,
    notes: sortStrings(fixture.safeNotes),
  };
}

export function buildCreatorIntelligenceFixture(input: CreatorIntelligenceBuildInput): CreatorIntelligenceBuildResult {
  const safeNotes = sortStrings([
    'Creator intelligence fixture only.',
    'Deterministic synthetic data.',
    'Local-only and non-advisory.',
    ...(input.safeNotes ?? []),
  ]);

  const draftFixture: CreatorIntelligenceFixture = {
    name: input.name as CreatorIntelligenceFixture['name'],
    kind: input.kind as CreatorIntelligenceFixture['kind'],
    profile: { ...input.profile },
    project: { ...input.project },
    narrative: {
      ...input.narrative,
      evidenceTags: sortStrings(input.narrative.evidenceTags),
    },
    socialSignals: (input.socialSignals ?? []).map(signal => ({
      ...signal,
      notes: sortStrings(signal.notes),
    })),
    disclosureSignals: (input.disclosureSignals ?? []).map(signal => ({
      ...signal,
      notes: sortStrings(signal.notes),
    })),
    engagementPatterns: (input.engagementPatterns ?? []).map(pattern => ({
      ...pattern,
      evidenceTags: sortStrings(pattern.evidenceTags),
    })),
    riskIndicators: [...(input.riskIndicators ?? [])],
    credibilityIndicators: [...(input.credibilityIndicators ?? [])],
    safeNotes,
    meta: {
      phase: 30,
      generatedAt: PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT,
      source: PHASE_30_CREATOR_INTELLIGENCE_SOURCE,
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
    summary: {} as CreatorIntelligenceSummary,
  };

  const normalizedWithoutSummary = normalizeCreatorIntelligenceFixture({
    ...draftFixture,
    summary: {
      phase: 30,
      name: draftFixture.name,
      kind: draftFixture.kind,
      creatorId: draftFixture.profile.creatorId,
      projectId: draftFixture.project.projectId,
      signalBalance: 'insufficient-data',
      disclosureAssessment: 'unknown',
      engagementAssessment: 'unknown',
      narrativeAssessment: 'unknown',
      dataCompleteness: 'insufficient',
      credibilityCount: 0,
      riskCount: 0,
      topCredibilityCodes: [],
      topRiskCodes: [],
      generatedAt: PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT,
      fixtureOnly: true,
      liveData: false,
      externalNetwork: false,
      nonAdvisory: true,
      safeToDisplay: true,
      notes: safeNotes,
    },
  });

  const {
    summary: _placeholderSummary,
    ...fixtureWithoutSummary
  } = normalizedWithoutSummary;

  const fixture = normalizeCreatorIntelligenceFixture({
    ...fixtureWithoutSummary,
    summary: buildCreatorIntelligenceSummary(fixtureWithoutSummary),
  });

  const validation = validateCreatorIntelligenceFixture(fixture);
  const safety = validateCreatorIntelligenceSafety(fixture);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}
