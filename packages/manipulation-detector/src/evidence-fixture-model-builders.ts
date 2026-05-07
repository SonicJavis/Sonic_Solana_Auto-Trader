/**
 * Phase 32 — Bundle / Manipulation Evidence Fixture Models v1: builders.
 */

import {
  PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
  PHASE_32_MANIPULATION_EVIDENCE_SOURCE,
  type ManipulationEvidenceBuildInput,
  type ManipulationEvidenceBuildResult,
  type ManipulationEvidenceCrossReferenceInput,
  type ManipulationEvidenceCrossReferenceSummary,
  type ManipulationEvidenceFixture,
  type ManipulationEvidenceSummary,
  type ManipulationQualityIndicator,
  type ManipulationRiskIndicator,
} from './evidence-fixture-model-types.js';
import { normalizeManipulationEvidenceFixture } from './evidence-fixture-model-normalization.js';
import {
  validateManipulationEvidenceFixture,
  validateManipulationEvidenceSafety,
} from './evidence-fixture-model-validation.js';

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

function getDataCompleteness(
  fixture: Omit<ManipulationEvidenceFixture, 'summary'>,
): ManipulationEvidenceSummary['dataCompleteness'] {
  const allUnknown =
    fixture.bundlePattern.bundleLikelihood === 'unknown' &&
    fixture.launchStructure.launchShape === 'unknown' &&
    fixture.liquidityPattern.liquidityState === 'unknown' &&
    fixture.coordination.coordinationType === 'unknown' &&
    fixture.distribution.concentrationType === 'unknown' &&
    fixture.fundingPattern.fundingType === 'unknown';

  if (
    allUnknown &&
    fixture.riskIndicators.length === 0 &&
    fixture.qualityIndicators.length === 0 &&
    fixture.crossReferenceSummary.referenceStatus === 'none'
  ) {
    return 'insufficient';
  }

  if (fixture.riskIndicators.length === 0 || fixture.qualityIndicators.length === 0) {
    return 'partial';
  }

  return 'complete';
}

function getSignalBalance(
  riskIndicators: readonly ManipulationRiskIndicator[],
  qualityIndicators: readonly ManipulationQualityIndicator[],
  dataCompleteness: ManipulationEvidenceSummary['dataCompleteness'],
): ManipulationEvidenceSummary['signalBalance'] {
  if (dataCompleteness === 'insufficient') {
    return 'insufficient-data';
  }
  if (riskIndicators.length > qualityIndicators.length) {
    return 'risk-dominant';
  }
  if (qualityIndicators.length > riskIndicators.length) {
    return 'quality-dominant';
  }
  return 'balanced';
}

function getBundleRiskAssessment(
  fixture: Omit<ManipulationEvidenceFixture, 'summary'>,
): ManipulationEvidenceSummary['bundleRiskAssessment'] {
  if (fixture.bundlePattern.bundleLikelihood === 'high') return 'high';
  if (fixture.bundlePattern.bundleLikelihood === 'elevated') return 'elevated';
  if (fixture.bundlePattern.bundleLikelihood === 'watchlist') return 'watchlist';
  if (fixture.bundlePattern.bundleLikelihood === 'none') return 'none';
  return 'unknown';
}

function getCoordinationAssessment(
  fixture: Omit<ManipulationEvidenceFixture, 'summary'>,
): ManipulationEvidenceSummary['coordinationAssessment'] {
  switch (fixture.coordination.intensity) {
    case 'none':
      return 'none';
    case 'low':
      return 'low';
    case 'moderate':
      return 'watchlist';
    case 'high':
    case 'critical':
      return 'high';
    default:
      return 'unknown';
  }
}

function getLiquidityAssessment(
  fixture: Omit<ManipulationEvidenceFixture, 'summary'>,
): ManipulationEvidenceSummary['liquidityAssessment'] {
  switch (fixture.liquidityPattern.liquidityState) {
    case 'stable':
      return 'stable';
    case 'watchlist':
      return 'watchlist';
    case 'staged-pull-risk':
      return 'staged-risk';
    case 'high-risk':
      return 'high-risk';
    default:
      return 'unknown';
  }
}

function getFundingAssessment(
  fixture: Omit<ManipulationEvidenceFixture, 'summary'>,
): ManipulationEvidenceSummary['fundingAssessment'] {
  switch (fixture.fundingPattern.fundingType) {
    case 'diverse':
      return 'diverse';
    case 'same-source':
    case 'fresh-wallet-burst':
    case 'creator-linked':
      return 'linked';
    case 'unknown':
      return 'unknown';
    default:
      return 'mixed';
  }
}

function getFalsePositiveRisk(
  fixture: Omit<ManipulationEvidenceFixture, 'summary'>,
): ManipulationEvidenceSummary['falsePositiveRisk'] {
  const qualityCodes = fixture.qualityIndicators.map(indicator => indicator.code);
  if (
    qualityCodes.includes('BOT_NOISE_FALSE_POSITIVE') ||
    qualityCodes.includes('BENIGN_HIGH_ACTIVITY_CONTEXT')
  ) {
    return 'high';
  }
  if (fixture.qualityIndicators.length >= fixture.riskIndicators.length && fixture.qualityIndicators.length > 0) {
    return 'moderate';
  }
  if (fixture.riskIndicators.length === 0) {
    return 'low';
  }
  return 'low';
}

export function buildManipulationEvidenceCrossReferenceSummary(
  input?: ManipulationEvidenceCrossReferenceInput | null,
): ManipulationEvidenceCrossReferenceSummary {
  const creatorFixtureName = input?.creatorFixtureName;
  const walletClusterFixtureName = input?.walletClusterFixtureName;
  const sharedSignals = sortStrings(input?.sharedSignals ?? []);
  const cautionNotes = sortStrings(input?.cautionNotes ?? []);

  const referenceStatus: ManipulationEvidenceCrossReferenceSummary['referenceStatus'] =
    creatorFixtureName && walletClusterFixtureName
      ? 'creator-and-wallet'
      : creatorFixtureName
        ? 'creator-only'
        : walletClusterFixtureName
          ? 'wallet-only'
          : 'none';

  return {
    ...(creatorFixtureName ? { creatorFixtureName } : {}),
    ...(walletClusterFixtureName ? { walletClusterFixtureName } : {}),
    referenceStatus,
    sharedSignals,
    cautionNotes,
    generatedAt: PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
    fixtureOnly: true,
    syntheticOnly: true,
    nonAdvisory: true,
  };
}

export function buildManipulationEvidenceSummary(
  fixture: Omit<ManipulationEvidenceFixture, 'summary'>,
): ManipulationEvidenceSummary {
  const dataCompleteness = getDataCompleteness(fixture);

  return {
    phase: 32,
    name: fixture.name,
    kind: fixture.kind,
    signalBalance: getSignalBalance(fixture.riskIndicators, fixture.qualityIndicators, dataCompleteness),
    bundleRiskAssessment: getBundleRiskAssessment(fixture),
    coordinationAssessment: getCoordinationAssessment(fixture),
    liquidityAssessment: getLiquidityAssessment(fixture),
    concentrationAssessment: fixture.distribution.concentrationBand,
    fundingAssessment: getFundingAssessment(fixture),
    falsePositiveRisk: getFalsePositiveRisk(fixture),
    dataCompleteness,
    qualityCount: fixture.qualityIndicators.length,
    riskCount: fixture.riskIndicators.length,
    topQualityCodes: topCodes(fixture.qualityIndicators, 3),
    topRiskCodes: topCodes(fixture.riskIndicators, 3),
    ...(fixture.crossReferenceSummary.creatorFixtureName
      ? { referencedCreatorFixtureName: fixture.crossReferenceSummary.creatorFixtureName }
      : {}),
    ...(fixture.crossReferenceSummary.walletClusterFixtureName
      ? { referencedWalletClusterFixtureName: fixture.crossReferenceSummary.walletClusterFixtureName }
      : {}),
    generatedAt: PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    nonAdvisory: true,
    safeToDisplay: true,
    notes: sortStrings(fixture.safeNotes),
  };
}

export function buildManipulationEvidenceFixture(
  input: ManipulationEvidenceBuildInput,
): ManipulationEvidenceBuildResult {
  const safeNotes = sortStrings([
    'Deterministic synthetic evidence only.',
    'Fixture-only local offline analysis support.',
    'Non-advisory and non-accusatory synthetic evidence.',
    ...(input.safeNotes ?? []),
  ]);

  const crossReferenceSummary = buildManipulationEvidenceCrossReferenceSummary(input.crossReferences);

  const draftFixture: ManipulationEvidenceFixture = {
    name: input.name as ManipulationEvidenceFixture['name'],
    kind: input.kind as ManipulationEvidenceFixture['kind'],
    bundlePattern: {
      ...input.bundlePattern,
      notes: sortStrings(input.bundlePattern.notes),
    },
    launchStructure: {
      ...input.launchStructure,
      notes: sortStrings(input.launchStructure.notes),
    },
    liquidityPattern: {
      ...input.liquidityPattern,
      notes: sortStrings(input.liquidityPattern.notes),
    },
    coordination: {
      ...input.coordination,
      notes: sortStrings(input.coordination.notes),
    },
    distribution: {
      ...input.distribution,
      notes: sortStrings(input.distribution.notes),
    },
    fundingPattern: {
      ...input.fundingPattern,
      notes: sortStrings(input.fundingPattern.notes),
    },
    riskIndicators: [...(input.riskIndicators ?? [])],
    qualityIndicators: [...(input.qualityIndicators ?? [])],
    crossReferenceSummary,
    summary: {} as ManipulationEvidenceSummary,
    safeNotes,
    meta: {
      phase: 32,
      generatedAt: PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
      source: PHASE_32_MANIPULATION_EVIDENCE_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      liveData: false,
      externalNetwork: false,
      persistence: false,
      deterministic: true,
      readOnly: true,
      nonAdvisory: true,
      nonAccusatory: true,
      notes: safeNotes,
    },
  };

  const normalizedWithoutSummary = normalizeManipulationEvidenceFixture({
    ...draftFixture,
    summary: {
      phase: 32,
      name: draftFixture.name,
      kind: draftFixture.kind,
      signalBalance: 'insufficient-data',
      bundleRiskAssessment: 'unknown',
      coordinationAssessment: 'unknown',
      liquidityAssessment: 'unknown',
      concentrationAssessment: 'unknown',
      fundingAssessment: 'unknown',
      falsePositiveRisk: 'unknown',
      dataCompleteness: 'insufficient',
      qualityCount: 0,
      riskCount: 0,
      topQualityCodes: [],
      topRiskCodes: [],
      ...(crossReferenceSummary.creatorFixtureName
        ? { referencedCreatorFixtureName: crossReferenceSummary.creatorFixtureName }
        : {}),
      ...(crossReferenceSummary.walletClusterFixtureName
        ? { referencedWalletClusterFixtureName: crossReferenceSummary.walletClusterFixtureName }
        : {}),
      generatedAt: PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
      fixtureOnly: true,
      liveData: false,
      externalNetwork: false,
      nonAdvisory: true,
      safeToDisplay: true,
      notes: safeNotes,
    },
  });

  const fixtureWithoutSummary = {
    name: normalizedWithoutSummary.name,
    kind: normalizedWithoutSummary.kind,
    bundlePattern: normalizedWithoutSummary.bundlePattern,
    launchStructure: normalizedWithoutSummary.launchStructure,
    liquidityPattern: normalizedWithoutSummary.liquidityPattern,
    coordination: normalizedWithoutSummary.coordination,
    distribution: normalizedWithoutSummary.distribution,
    fundingPattern: normalizedWithoutSummary.fundingPattern,
    riskIndicators: normalizedWithoutSummary.riskIndicators,
    qualityIndicators: normalizedWithoutSummary.qualityIndicators,
    crossReferenceSummary: normalizedWithoutSummary.crossReferenceSummary,
    safeNotes: normalizedWithoutSummary.safeNotes,
    meta: normalizedWithoutSummary.meta,
  } satisfies Omit<ManipulationEvidenceFixture, 'summary'>;

  const fixture = normalizeManipulationEvidenceFixture({
    ...fixtureWithoutSummary,
    summary: buildManipulationEvidenceSummary(fixtureWithoutSummary),
  });

  const validation = validateManipulationEvidenceFixture(fixture);
  const safety = validateManipulationEvidenceSafety(fixture);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}
