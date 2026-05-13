import type {
  ManualConfirmDryRunControlStatus,
  ManualConfirmDryRunGateStatus,
  ManualConfirmDryRunPreflightStatus,
  ManualConfirmDryRunScorecard,
} from './types.js';

export function buildManualConfirmDryRunScorecard(input: {
  scorecardId: string;
  score: number;
  maxScore: number;
  gateStatus: ManualConfirmDryRunGateStatus;
  preflightStatus: ManualConfirmDryRunPreflightStatus;
  controlStatus: ManualConfirmDryRunControlStatus;
}): ManualConfirmDryRunScorecard {
  return input;
}
