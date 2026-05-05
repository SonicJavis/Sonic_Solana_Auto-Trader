import type { ReplayStepResult, ReplaySummary, ReplayVerdict } from './types.js';

function determineFinalVerdict(
  stepResults: readonly ReplayStepResult[],
  expectedOutcome: ReplayVerdict,
): ReplayVerdict {
  if (stepResults.length === 0) return 'inconclusive';

  const verdicts = stepResults.map(r => r.verdict);
  const hasFailed = verdicts.includes('failed');
  const hasDegraded = verdicts.includes('degraded');
  const hasInconclusive = verdicts.includes('inconclusive');
  const allPassed = verdicts.every(v => v === 'passed' || v === 'fixture_only');

  if (hasFailed) return 'failed';
  if (hasDegraded) return 'degraded';
  if (hasInconclusive) return 'inconclusive';
  if (allPassed) return expectedOutcome === 'passed' ? 'passed' : 'fixture_only';
  return 'fixture_only';
}

export function buildReplaySummary(
  stepResults: readonly ReplayStepResult[],
  expectedOutcome: ReplayVerdict,
): ReplaySummary {
  const totalSteps = stepResults.length;
  const passedSteps = stepResults.filter(r => r.verdict === 'passed').length;
  const failedSteps = stepResults.filter(r => r.verdict === 'failed').length;
  const degradedSteps = stepResults.filter(r => r.verdict === 'degraded').length;
  const inconclusiveSteps = stepResults.filter(r => r.verdict === 'inconclusive').length;

  const allSummaries = stepResults
    .flatMap(r => [
      r.tokenSummary,
      r.creatorSummary,
      r.walletSummary,
      r.manipulationSummary,
      r.riskSummary,
    ])
    .filter((s): s is NonNullable<typeof s> => s != null);

  const finalRiskScore =
    allSummaries.length > 0
      ? allSummaries.reduce((sum, s) => sum + s.riskScore, 0) / allSummaries.length
      : 0;

  const averageConfidence =
    allSummaries.length > 0
      ? allSummaries.reduce((sum, s) => sum + s.confidence, 0) / allSummaries.length
      : 0;

  const warnings = [...new Set(stepResults.flatMap(r => [...r.warnings]))];
  const reasons: string[] = [];
  if (failedSteps > 0) reasons.push(`${failedSteps} step(s) failed`);
  if (degradedSteps > 0) reasons.push(`${degradedSteps} step(s) degraded`);
  if (inconclusiveSteps > 0) reasons.push(`${inconclusiveSteps} step(s) inconclusive`);

  return {
    totalSteps,
    passedSteps,
    failedSteps,
    degradedSteps,
    inconclusiveSteps,
    finalVerdict: determineFinalVerdict(stepResults, expectedOutcome),
    finalRiskScore: Math.min(1, Math.max(0, finalRiskScore)),
    averageConfidence: Math.min(1, Math.max(0, averageConfidence)),
    warnings,
    reasons,
    safeToDisplay: true,
  };
}
