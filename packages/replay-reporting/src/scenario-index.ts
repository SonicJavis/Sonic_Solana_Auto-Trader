/**
 * packages/replay-reporting/src/scenario-index.ts
 *
 * buildScenarioIndex — indexes a set of ReplayScenario objects into a
 * deterministic, safe ReplayScenarioIndex.
 *
 * Rules:
 *   - rejects liveData=true
 *   - rejects fixtureOnly=false where present
 *   - rejects unsafe text in scenario fields
 *   - deterministic output (sorted by scenarioId)
 */

import type { ReplayScenario, ReplayVerdict, ReplayStepType } from '@sonic/replay-lab';
import type { ReplayScenarioIndex, ReplayScenarioIndexEntry } from './types.js';
import { rrOk, rrErr } from './errors.js';
import type { RrResult } from './errors.js';
import { containsUnsafeActionText, containsSecretPattern } from './validation.js';

const ALL_VERDICTS: readonly ReplayVerdict[] = [
  'passed',
  'failed',
  'degraded',
  'inconclusive',
  'fixture_only',
];

function emptyVerdictCounts(): Record<ReplayVerdict, number> {
  return { passed: 0, failed: 0, degraded: 0, inconclusive: 0, fixture_only: 0 };
}

export function buildScenarioIndex(
  scenarios: readonly ReplayScenario[],
): RrResult<ReplayScenarioIndex> {
  if (!Array.isArray(scenarios) || scenarios.length === 0) {
    return rrErr('INVALID_SCENARIO_INDEX_INPUT', 'scenarios must be a non-empty array');
  }

  // Validate each scenario
  for (const s of scenarios) {
    if (s.liveData !== false)
      return rrErr('LIVE_DATA_FORBIDDEN', `scenario ${s.scenarioId}: liveData must be false`);
    if (s.fixtureOnly !== true)
      return rrErr(
        'FIXTURE_ONLY_REQUIRED',
        `scenario ${s.scenarioId}: fixtureOnly must be true`,
      );
    if (containsUnsafeActionText(s.displayName))
      return rrErr(
        'UNSAFE_ACTION_TEXT_DETECTED',
        `scenario ${s.scenarioId}: displayName contains unsafe action text`,
      );
    if (containsUnsafeActionText(s.description))
      return rrErr(
        'UNSAFE_ACTION_TEXT_DETECTED',
        `scenario ${s.scenarioId}: description contains unsafe action text`,
      );
    if (containsSecretPattern(s.displayName) || containsSecretPattern(s.description))
      return rrErr(
        'SECRET_PATTERN_DETECTED',
        `scenario ${s.scenarioId}: contains secret-like pattern`,
      );
  }

  // Sort deterministically by scenarioId
  const sorted = [...scenarios].sort((a, b) => a.scenarioId.localeCompare(b.scenarioId));

  const verdictCounts = emptyVerdictCounts();
  let totalStepCount = 0;
  const uniqueStepTypeSet = new Set<ReplayStepType>();

  const entries: ReplayScenarioIndexEntry[] = sorted.map(s => {
    (verdictCounts as Record<string, number>)[s.expectedOutcome] =
      ((verdictCounts as Record<string, number>)[s.expectedOutcome] ?? 0) + 1;
    totalStepCount += s.steps.length;

    const stepTypes: ReplayStepType[] = [];
    for (const step of s.steps) {
      uniqueStepTypeSet.add(step.stepType);
      if (!stepTypes.includes(step.stepType)) stepTypes.push(step.stepType);
    }

    return {
      scenarioId: s.scenarioId,
      displayName: s.displayName,
      description: s.description,
      expectedOutcome: s.expectedOutcome,
      stepCount: s.steps.length,
      stepTypes,
      fixtureOnly: true,
      liveData: false,
    };
  });

  // Ensure all expected verdict keys are present
  for (const v of ALL_VERDICTS) {
    if (verdictCounts[v] === undefined) verdictCounts[v] = 0;
  }

  const uniqueStepTypes = [...uniqueStepTypeSet].sort() as ReplayStepType[];

  const index: ReplayScenarioIndex = {
    scenarioCount: sorted.length,
    scenarioIds: sorted.map(s => s.scenarioId),
    entries,
    verdictCounts,
    totalStepCount,
    uniqueStepTypes,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  return rrOk(index);
}
