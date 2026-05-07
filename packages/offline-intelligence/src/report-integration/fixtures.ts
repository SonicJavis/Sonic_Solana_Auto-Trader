/**
 * Phase 34 — Offline Intelligence Report Integration Models v1: deterministic fixtures.
 */

import { getOfflineCompositeEvidenceFixture } from '../fixtures.js';
import type { OfflineCompositeEvidenceFixtureName } from '../types.js';
import { buildOfflineIntelligenceReportModel } from './builders.js';
import type {
  OfflineIntelligenceReportFixture,
  OfflineIntelligenceReportFixtureName,
  OfflineIntelligenceReportKind,
} from './types.js';

interface FixtureMapping {
  readonly name: OfflineIntelligenceReportFixtureName;
  readonly kind: OfflineIntelligenceReportKind;
  readonly sourceCompositeFixtureName: OfflineCompositeEvidenceFixtureName;
  readonly description: string;
}

const PHASE_34_FIXTURE_MAPPINGS: readonly FixtureMapping[] = [
  {
    name: 'clean-low-risk-intelligence-report',
    kind: 'clean-low-risk',
    sourceCompositeFixtureName: 'clean-low-risk-composite',
    description: 'Synthetic clean low-risk offline intelligence report fixture.',
  },
  {
    name: 'creator-credible-wallet-benign-intelligence-report',
    kind: 'creator-credible-wallet-benign',
    sourceCompositeFixtureName: 'creator-credible-wallet-benign-composite',
    description: 'Synthetic creator-credible wallet-benign report fixture.',
  },
  {
    name: 'creator-unknown-wallet-low-signal-intelligence-report',
    kind: 'creator-unknown-wallet-low-signal',
    sourceCompositeFixtureName: 'creator-unknown-wallet-low-signal-composite',
    description: 'Synthetic creator-unknown wallet-low-signal report fixture.',
  },
  {
    name: 'creator-risk-wallet-risk-intelligence-report',
    kind: 'creator-risk-wallet-risk',
    sourceCompositeFixtureName: 'creator-risk-wallet-risk-composite',
    description: 'Synthetic creator-risk wallet-risk report fixture.',
  },
  {
    name: 'manipulation-risk-dominates-intelligence-report',
    kind: 'manipulation-risk-dominates',
    sourceCompositeFixtureName: 'manipulation-risk-dominates-composite',
    description: 'Synthetic manipulation-risk-dominates report fixture.',
  },
  {
    name: 'wallet-cluster-risk-dominates-intelligence-report',
    kind: 'wallet-cluster-risk-dominates',
    sourceCompositeFixtureName: 'wallet-cluster-risk-dominates-composite',
    description: 'Synthetic wallet-cluster-risk-dominates report fixture.',
  },
  {
    name: 'creator-risk-dominates-intelligence-report',
    kind: 'creator-risk-dominates',
    sourceCompositeFixtureName: 'creator-risk-dominates-composite',
    description: 'Synthetic creator-risk-dominates report fixture.',
  },
  {
    name: 'mixed-signal-watchlist-intelligence-report',
    kind: 'mixed-signal-watchlist',
    sourceCompositeFixtureName: 'mixed-signal-watchlist-composite',
    description: 'Synthetic mixed-signal watchlist report fixture.',
  },
  {
    name: 'false-positive-protected-intelligence-report',
    kind: 'false-positive-protected',
    sourceCompositeFixtureName: 'false-positive-protected-composite',
    description: 'Synthetic false-positive-protected report fixture.',
  },
  {
    name: 'insufficient-data-intelligence-report',
    kind: 'insufficient-data',
    sourceCompositeFixtureName: 'insufficient-data-composite',
    description: 'Synthetic insufficient-data report fixture.',
  },
  {
    name: 'high-risk-multi-evidence-intelligence-report',
    kind: 'high-risk-multi-evidence',
    sourceCompositeFixtureName: 'high-risk-multi-evidence-composite',
    description: 'Synthetic high-risk multi-evidence report fixture.',
  },
  {
    name: 'safety-boundary-intelligence-report',
    kind: 'safety-boundary',
    sourceCompositeFixtureName: 'safety-boundary-composite',
    description: 'Synthetic safety-boundary report fixture.',
  },
  {
    name: 'malformed-input-safe-intelligence-report',
    kind: 'malformed-input-safe',
    sourceCompositeFixtureName: 'malformed-input-safe-composite',
    description: 'Synthetic malformed-input-safe report fixture.',
  },
  {
    name: 'no-action-non-advisory-intelligence-report',
    kind: 'no-action-non-advisory',
    sourceCompositeFixtureName: 'no-action-non-advisory-composite',
    description: 'Synthetic no-action non-advisory report fixture.',
  },
  {
    name: 'dashboard-ready-intelligence-report',
    kind: 'dashboard-ready',
    sourceCompositeFixtureName: 'dashboard-ready-composite',
    description: 'Synthetic dashboard-ready intelligence report fixture.',
  },
  {
    name: 'serialization-preview-ready-intelligence-report',
    kind: 'serialization-preview-ready',
    sourceCompositeFixtureName: 'report-ready-composite',
    description: 'Synthetic serialization-preview-ready report fixture.',
  },
] as const;

function mustBuildFixture(mapping: FixtureMapping): OfflineIntelligenceReportFixture {
  const sourceCompositeFixture = getOfflineCompositeEvidenceFixture(mapping.sourceCompositeFixtureName);
  if (!sourceCompositeFixture) {
    throw new Error(`Missing Phase 33 source composite fixture: ${mapping.sourceCompositeFixtureName}`);
  }

  const built = buildOfflineIntelligenceReportModel({
    name: mapping.name,
    kind: mapping.kind,
    sourceCompositeFixture,
    safeNotes: [
      'Fixture-only.',
      'Synthetic-only.',
      'Non-advisory.',
      'Offline integration model.',
    ],
  });

  if (!built.success || !built.report) {
    throw new Error(
      `Invalid Phase 34 fixture definition: ${mapping.name} — ${JSON.stringify(
        built.validation.issues,
      )}`,
    );
  }

  return {
    name: mapping.name,
    description: mapping.description,
    report: built.report,
  };
}

export const CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[0],
);
export const CREATOR_CREDIBLE_WALLET_BENIGN_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[1],
);
export const CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[2],
);
export const CREATOR_RISK_WALLET_RISK_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[3],
);
export const MANIPULATION_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[4],
);
export const WALLET_CLUSTER_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[5],
);
export const CREATOR_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[6],
);
export const MIXED_SIGNAL_WATCHLIST_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[7],
);
export const FALSE_POSITIVE_PROTECTED_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[8],
);
export const INSUFFICIENT_DATA_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[9],
);
export const HIGH_RISK_MULTI_EVIDENCE_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[10],
);
export const SAFETY_BOUNDARY_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[11],
);
export const MALFORMED_INPUT_SAFE_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[12],
);
export const NO_ACTION_NON_ADVISORY_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[13],
);
export const DASHBOARD_READY_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[14],
);
export const SERIALIZATION_PREVIEW_READY_INTELLIGENCE_REPORT_FIXTURE = mustBuildFixture(
  PHASE_34_FIXTURE_MAPPINGS[15],
);

export const PHASE_34_OFFLINE_INTELLIGENCE_REPORT_FIXTURES = new Map<
  OfflineIntelligenceReportFixtureName,
  OfflineIntelligenceReportFixture
>([
  ['clean-low-risk-intelligence-report', CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE],
  [
    'creator-credible-wallet-benign-intelligence-report',
    CREATOR_CREDIBLE_WALLET_BENIGN_INTELLIGENCE_REPORT_FIXTURE,
  ],
  [
    'creator-unknown-wallet-low-signal-intelligence-report',
    CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_INTELLIGENCE_REPORT_FIXTURE,
  ],
  ['creator-risk-wallet-risk-intelligence-report', CREATOR_RISK_WALLET_RISK_INTELLIGENCE_REPORT_FIXTURE],
  ['manipulation-risk-dominates-intelligence-report', MANIPULATION_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE],
  ['wallet-cluster-risk-dominates-intelligence-report', WALLET_CLUSTER_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE],
  ['creator-risk-dominates-intelligence-report', CREATOR_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE],
  ['mixed-signal-watchlist-intelligence-report', MIXED_SIGNAL_WATCHLIST_INTELLIGENCE_REPORT_FIXTURE],
  ['false-positive-protected-intelligence-report', FALSE_POSITIVE_PROTECTED_INTELLIGENCE_REPORT_FIXTURE],
  ['insufficient-data-intelligence-report', INSUFFICIENT_DATA_INTELLIGENCE_REPORT_FIXTURE],
  ['high-risk-multi-evidence-intelligence-report', HIGH_RISK_MULTI_EVIDENCE_INTELLIGENCE_REPORT_FIXTURE],
  ['safety-boundary-intelligence-report', SAFETY_BOUNDARY_INTELLIGENCE_REPORT_FIXTURE],
  ['malformed-input-safe-intelligence-report', MALFORMED_INPUT_SAFE_INTELLIGENCE_REPORT_FIXTURE],
  ['no-action-non-advisory-intelligence-report', NO_ACTION_NON_ADVISORY_INTELLIGENCE_REPORT_FIXTURE],
  ['dashboard-ready-intelligence-report', DASHBOARD_READY_INTELLIGENCE_REPORT_FIXTURE],
  ['serialization-preview-ready-intelligence-report', SERIALIZATION_PREVIEW_READY_INTELLIGENCE_REPORT_FIXTURE],
]);

export function listOfflineIntelligenceReportFixtures(): readonly OfflineIntelligenceReportFixtureName[] {
  return [...PHASE_34_OFFLINE_INTELLIGENCE_REPORT_FIXTURES.keys()];
}

export function getOfflineIntelligenceReportFixture(
  name: OfflineIntelligenceReportFixtureName,
): OfflineIntelligenceReportFixture | undefined {
  return PHASE_34_OFFLINE_INTELLIGENCE_REPORT_FIXTURES.get(name);
}
