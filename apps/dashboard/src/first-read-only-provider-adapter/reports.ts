import type { FirstReadOnlyProviderAdapterReport } from './types.js';

export function buildFirstReadOnlyProviderAdapterReport(input: {
  fixtureId: string;
  configState: string;
  conformancePass: boolean;
  smokeStatus: string;
  healthState: string;
  transportKind: string;
}): FirstReadOnlyProviderAdapterReport {
  return {
    reportId: `${input.fixtureId}-report`,
    configState: input.configState as FirstReadOnlyProviderAdapterReport['configState'],
    capabilitySummary: 'Read-only account read shape is supported; write/sign/send are disabled.',
    gateCompatibility: 'Phase 63 gate compatibility is required and enforced.',
    boundaryCompatibility: 'Phase 64 boundary conformance is required and enforced.',
    transportSummary: `Transport kind: ${input.transportKind}.`,
    healthSummary: `Health state: ${input.healthState}.`,
    conformanceSummary: input.conformancePass
      ? 'Conformance checks pass for deterministic fixture mode.'
      : 'Conformance checks failed for deterministic fixture mode.',
    smokeGuardSummary: `Smoke guard status: ${input.smokeStatus}.`,
    safetySummary:
      'No wallet, no signing, no sending, no execution, no recommendations, and no investment advice.',
  };
}
