import type { ReplayStepResult, ReplayStep, ReplayVerdict } from './types.js';

function deriveStepVerdict(step: ReplayStep): ReplayVerdict {
  if (
    !step.tokenFixtureRef &&
    !step.creatorFixtureRef &&
    !step.walletFixtureRef &&
    !step.manipulationFixtureRef &&
    !step.riskFixtureRef
  ) {
    return 'inconclusive';
  }
  if (step.manipulationFixtureRef && step.manipulationFixtureRef.includes('reject')) return 'failed';
  if (step.creatorFixtureRef && step.creatorFixtureRef.includes('risky')) return 'degraded';
  if (step.walletFixtureRef && step.walletFixtureRef.includes('risk')) return 'degraded';
  // Multi-ref aggregate steps with mixed warning signals → degraded
  const allRefs = [
    step.tokenFixtureRef,
    step.creatorFixtureRef,
    step.walletFixtureRef,
    step.manipulationFixtureRef,
    step.riskFixtureRef,
  ].filter(Boolean);
  const warnCount = allRefs.filter(r => r?.includes('warn')).length;
  if (warnCount >= 2) return 'degraded';
  return 'fixture_only';
}

function deriveRiskScore(step: ReplayStep): number {
  if (step.manipulationFixtureRef && step.manipulationFixtureRef.includes('reject')) return 0.9;
  if (step.creatorFixtureRef && step.creatorFixtureRef.includes('risky')) return 0.75;
  if (step.walletFixtureRef && step.walletFixtureRef.includes('risk')) return 0.65;
  if (!step.tokenFixtureRef && !step.creatorFixtureRef) return 0.5;
  return 0.2;
}

function deriveConfidence(step: ReplayStep): number {
  const refs = [
    step.tokenFixtureRef,
    step.creatorFixtureRef,
    step.walletFixtureRef,
    step.manipulationFixtureRef,
    step.riskFixtureRef,
  ].filter(Boolean);
  if (refs.length === 0) return 0.3;
  if (refs.length >= 3) return 0.85;
  return 0.6;
}

export function buildReplayStepResult(step: ReplayStep): ReplayStepResult {
  const riskScore = deriveRiskScore(step);
  const confidence = deriveConfidence(step);
  const verdict = deriveStepVerdict(step);

  const warnings: string[] = [];
  if (verdict === 'inconclusive') warnings.push('missing_fixture_data');
  if (verdict === 'failed') warnings.push('manipulation_detected');
  if (verdict === 'degraded') warnings.push('elevated_risk_flags');

  const baseSummary = {
    riskScore,
    confidence,
    flags: [] as string[],
    classification: 'fixture_only',
  };

  return {
    stepId: step.stepId,
    sequence: step.sequence,
    ...(step.tokenFixtureRef !== undefined
      ? { tokenSummary: { ...baseSummary, riskScore: riskScore * 0.9 } }
      : {}),
    ...(step.creatorFixtureRef !== undefined
      ? {
          creatorSummary: {
            ...baseSummary,
            flags: step.creatorFixtureRef.includes('risky') ? ['elevated_risk'] : [],
          },
        }
      : {}),
    ...(step.walletFixtureRef !== undefined
      ? {
          walletSummary: {
            ...baseSummary,
            flags: step.walletFixtureRef.includes('risk') ? ['cluster_risk'] : [],
          },
        }
      : {}),
    ...(step.manipulationFixtureRef !== undefined
      ? {
          manipulationSummary: {
            ...baseSummary,
            flags: step.manipulationFixtureRef.includes('reject') ? ['bundle_detected'] : [],
            riskScore: step.manipulationFixtureRef.includes('reject') ? 0.9 : 0.2,
          },
        }
      : {}),
    ...(step.riskFixtureRef !== undefined ? { riskSummary: { ...baseSummary } } : {}),
    verdict,
    warnings,
    safeToDisplay: true,
  };
}
