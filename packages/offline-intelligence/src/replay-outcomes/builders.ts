/**
 * Phase 36 — Replay Outcome Fixture Models v1: builders.
 */

import {
  PHASE_36_REPLAY_OUTCOMES_GENERATED_AT,
  PHASE_36_REPLAY_OUTCOMES_SOURCE,
  REPLAY_OUTCOME_FIXTURE_KINDS,
  REPLAY_OUTCOME_FIXTURE_NAMES,
  type ReplayOutcomeBuildInput,
  type ReplayOutcomeBuildResult,
  type ReplayOutcomeFixture,
  type ReplayOutcomeFixtureKind,
  type ReplayOutcomeFixtureName,
  type ReplayOutcomeQualityIndicator,
  type ReplayOutcomeRiskIndicator,
  type ReplayOutcomeSummary,
  type ReplayOutcomeSyntheticObservation,
} from './types.js';
import { normalizeReplayOutcomeFixture } from './normalization.js';
import {
  validateReplayOutcomeFixture,
  validateReplayOutcomeSafety,
} from './validation.js';

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

function getOutcomeBand(
  observation: ReplayOutcomeSyntheticObservation,
): ReplayOutcomeSummary['syntheticOutcomeBand'] {
  switch (observation.outcomeCategory) {
    case 'positive':
      return 'safe-positive';
    case 'flat':
      return observation.entry.syntheticDecision === 'watchlist' ? 'watchlist' : 'safe-flat';
    case 'risk-avoided':
      return 'risk-avoided';
    case 'drawdown-contained':
      return 'contained';
    case 'skipped':
      return 'skipped';
    case 'missed-opportunity':
      return 'watchlist';
    case 'safety-no-action':
      return 'skipped';
    default:
      return 'safe-flat';
  }
}

function getObservedDirection(
  observation: ReplayOutcomeSyntheticObservation,
): ReplayOutcomeSummary['observedDirection'] {
  if (observation.outcomeCategory === 'positive' || observation.outcomeCategory === 'missed-opportunity') {
    return 'upside-observed';
  }
  if (observation.outcomeCategory === 'flat') {
    return 'flat-observed';
  }
  if (observation.outcomeCategory === 'risk-avoided' || observation.outcomeCategory === 'drawdown-contained') {
    return 'risk-avoided';
  }
  return 'no-action';
}

function buildSummary(
  name: ReplayOutcomeFixtureName,
  kind: ReplayOutcomeFixtureKind,
  input: ReplayOutcomeBuildInput,
  riskIndicators: readonly ReplayOutcomeRiskIndicator[],
  qualityIndicators: readonly ReplayOutcomeQualityIndicator[],
  safeNotes: readonly string[],
): ReplayOutcomeSummary {
  return {
    phase: 36,
    name,
    kind,
    outcomeCategory: input.observation.outcomeCategory,
    syntheticOutcomeBand: getOutcomeBand(input.observation),
    observedDirection: getObservedDirection(input.observation),
    outcomeConfidenceBand: input.observation.entry.confidenceBand,
    riskCount: riskIndicators.length,
    qualityCount: qualityIndicators.length,
    topRiskCodes: topCodes(riskIndicators, 5),
    topQualityCodes: topCodes(qualityIndicators, 5),
    sourceCount: 3,
    referencedPhase33CompositeFixtureName: input.scenarioReference.phase33CompositeFixtureName,
    referencedPhase34ReportFixtureName: input.scenarioReference.phase34ReportFixtureName,
    referencedPhase35DashboardReportFixtureName:
      input.scenarioReference.phase35DashboardReportFixtureName,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    liveData: false,
    realReplay: false,
    realBacktesting: false,
    paperTrading: false,
    liveTrading: false,
    execution: false,
    nonAdvisory: true,
    nonAccusatory: true,
    safeToDisplay: true,
    generatedAt: PHASE_36_REPLAY_OUTCOMES_GENERATED_AT,
    notes: sortStrings(safeNotes),
  };
}

export function buildReplayOutcomeFixture(
  input: ReplayOutcomeBuildInput,
): ReplayOutcomeBuildResult {
  const nameParsed = REPLAY_OUTCOME_FIXTURE_NAMES.includes(input.name as ReplayOutcomeFixtureName);
  const kindParsed = REPLAY_OUTCOME_FIXTURE_KINDS.includes(input.kind as ReplayOutcomeFixtureKind);

  if (!nameParsed || !kindParsed) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          ...(!nameParsed
            ? [
                {
                  code: 'INVALID_NAME',
                  field: 'name',
                  message: `Unsupported fixture name: ${input.name}`,
                  severity: 'error' as const,
                },
              ]
            : []),
          ...(!kindParsed
            ? [
                {
                  code: 'INVALID_KIND',
                  field: 'kind',
                  message: `Unsupported fixture kind: ${input.kind}`,
                  severity: 'error' as const,
                },
              ]
            : []),
        ],
      },
      safety: { safe: true, violations: [] },
    };
  }

  const name = input.name as ReplayOutcomeFixtureName;
  const kind = input.kind as ReplayOutcomeFixtureKind;
  const riskIndicators = [...(input.riskIndicators ?? [])].sort((left, right) =>
    left.code.localeCompare(right.code),
  );
  const qualityIndicators = [...(input.qualityIndicators ?? [])].sort((left, right) =>
    left.code.localeCompare(right.code),
  );
  const safeNotes = sortStrings(input.safeNotes);

  const summary = buildSummary(name, kind, input, riskIndicators, qualityIndicators, safeNotes);

  const fixture: ReplayOutcomeFixture = {
    name,
    kind,
    scenarioReference: {
      ...input.scenarioReference,
      notes: sortStrings(input.scenarioReference.notes),
    },
    observation: {
      ...input.observation,
      entry: {
        ...input.observation.entry,
        notes: sortStrings(input.observation.entry.notes),
      },
      exit: {
        ...input.observation.exit,
        notes: sortStrings(input.observation.exit.notes),
      },
      notes: sortStrings(input.observation.notes),
    },
    riskIndicators,
    qualityIndicators,
    summary,
    safeNotes,
    meta: {
      phase: 36,
      generatedAt: PHASE_36_REPLAY_OUTCOMES_GENERATED_AT,
      source: PHASE_36_REPLAY_OUTCOMES_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      readOnly: true,
      localOnly: true,
      inMemoryOnly: true,
      liveData: false,
      realReplay: false,
      realBacktesting: false,
      paperTrading: false,
      liveTrading: false,
      execution: false,
      externalNetwork: false,
      persistence: false,
      fileExport: false,
      nonAdvisory: true,
      nonAccusatory: true,
      notes: sortStrings(safeNotes),
    },
  };

  const normalized = normalizeReplayOutcomeFixture(fixture);
  const safety = validateReplayOutcomeSafety(normalized);

  if (!safety.safe) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'SAFETY_VIOLATION',
            field: 'root',
            message: 'Fixture failed safety validation.',
            severity: 'error',
          },
        ],
      },
      safety,
    };
  }

  const validation = validateReplayOutcomeFixture(normalized);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid ? normalized : null,
    validation,
    safety,
  };
}

export function buildReplayOutcomeSummary(
  fixture: ReplayOutcomeFixture,
): ReplayOutcomeSummary {
  return fixture.summary;
}
