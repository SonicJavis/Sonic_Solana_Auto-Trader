import type {
  LiveSmokeCertificationReport,
  LiveSmokeConfig,
  OfflineCiCertificationContract,
  SafetyCertificate,
  SmokeGuardPolicy,
  SmokePlan,
  SmokeResult,
} from './types.js';

export function buildLiveSmokeCertificationReport(input: {
  fixtureId: string;
  smokeConfig: LiveSmokeConfig;
  smokeGuardPolicy: SmokeGuardPolicy;
  smokePlan: SmokePlan;
  smokeResult: SmokeResult;
  safetyCertificate: SafetyCertificate;
  offlineCiContract: OfflineCiCertificationContract;
}): LiveSmokeCertificationReport {
  return {
    reportId: `${input.fixtureId}-certification-report`,
    configSummary: `Mode ${input.smokeConfig.mode}; live checks default ${String(input.smokeConfig.liveChecksEnabled)}.`,
    guardSummary: `Fail-closed ${String(input.smokeGuardPolicy.failClosed)} and skip-by-default ${String(input.smokeGuardPolicy.skipByDefault)}.`,
    planSummary: `Plan expects ${input.smokePlan.expectedOutcome} with ${input.smokePlan.checkKinds.length} read-only checks.`,
    resultSummary: `Result ${input.smokeResult.status} with ${input.smokeResult.reasonCodes.length} reason code(s).`,
    certificateSummary: `Certificate ${input.safetyCertificate.certificationStatus}; no-execution=${String(input.safetyCertificate.certifiedNoExecution)}.`,
    safetySummary:
      'Safety smoke certification only. Read-only, non-executing, non-advisory, and not a profitability or strategy signal.',
    offlineCiSummary: `Offline CI contract enforces networkAccess=${String(input.offlineCiContract.networkAccess)} and liveChecksRun=${String(input.offlineCiContract.liveChecksRun)}.`,
  };
}
