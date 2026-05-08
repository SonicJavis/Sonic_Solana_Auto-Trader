/**
 * apps/dashboard/src/composite-evidence-fixtures/fixtures.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Fixtures
 *
 * 16 deterministic, synthetic, serializable composite evidence fixtures.
 * References Phase 33/34 source fixture names only.
 *
 * SAFETY: No live data. No real wallets. No real transactions. No secrets.
 *         No PII. No advice. No execution. No external network.
 */

import { buildCompositeEvidenceDashboardFixture, buildCompositeEvidenceDashboardReportFixture, buildCompositeEvidenceReportFixture } from './builders.js';
import type {
  CompositeEvidenceDashboardFixture,
  CompositeEvidenceDashboardReportFixture,
  CompositeEvidenceDashboardReportFixtureName,
  CompositeEvidenceReportFixture,
} from './types.js';
import { COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES } from './types.js';

// ─── 1. Clean low-risk dashboard fixture ─────────────────────────────────────

export const CLEAN_LOW_RISK_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'clean-low-risk-dashboard',
    kind: 'dashboard',
    title: 'Clean Low-Risk Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'clean-low-risk-composite',
    sourceCompositeFixtureKind: 'clean-low-risk',
    overallRiskBand: 'low',
    overallQualityBand: 'high',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: ['risk-low-creator', 'risk-low-wallet', 'risk-low-manipulation'],
    qualityIndicators: ['quality-high-creator', 'quality-high-wallet'],
    confidenceIndicators: ['confidence-high-all-sources'],
    safeNotes: [
      'Synthetic fixture: clean low-risk composite evidence dashboard.',
      'Phase 33 source: clean-low-risk-composite.',
    ],
  });

// ─── 2. Creator-credible wallet-benign dashboard fixture ──────────────────────

export const CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'creator-credible-wallet-benign-dashboard',
    kind: 'dashboard',
    title: 'Creator-Credible Wallet-Benign Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'creator-credible-wallet-benign-composite',
    sourceCompositeFixtureKind: 'creator-credible-wallet-benign',
    overallRiskBand: 'low',
    overallQualityBand: 'high',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: ['risk-low-creator-credible', 'risk-low-wallet-benign'],
    qualityIndicators: ['quality-high-creator', 'quality-moderate-wallet'],
    confidenceIndicators: ['confidence-high-creator', 'confidence-moderate-wallet'],
    safeNotes: [
      'Synthetic fixture: creator-credible wallet-benign composite evidence dashboard.',
      'Phase 33 source: creator-credible-wallet-benign-composite.',
    ],
  });

// ─── 3. Creator-risk wallet-risk dashboard fixture ────────────────────────────

export const CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'creator-risk-wallet-risk-dashboard',
    kind: 'dashboard',
    title: 'Creator-Risk Wallet-Risk Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'creator-risk-wallet-risk-composite',
    sourceCompositeFixtureKind: 'creator-risk-wallet-risk',
    overallRiskBand: 'high',
    overallQualityBand: 'low',
    overallConfidenceBand: 'moderate',
    sourceCount: 3,
    riskIndicators: ['risk-high-creator', 'risk-high-wallet', 'risk-moderate-manipulation'],
    qualityIndicators: ['quality-low-creator', 'quality-low-wallet'],
    confidenceIndicators: ['confidence-moderate-combined'],
    safeNotes: [
      'Synthetic fixture: creator-risk wallet-risk composite evidence dashboard.',
      'Phase 33 source: creator-risk-wallet-risk-composite.',
    ],
  });

// ─── 4. Manipulation-risk dominates dashboard fixture ────────────────────────

export const MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'manipulation-risk-dominates-dashboard',
    kind: 'dashboard',
    title: 'Manipulation-Risk Dominates Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'manipulation-risk-dominates-composite',
    sourceCompositeFixtureKind: 'manipulation-risk-dominates',
    overallRiskBand: 'elevated',
    overallQualityBand: 'moderate',
    overallConfidenceBand: 'moderate',
    sourceCount: 3,
    riskIndicators: ['risk-elevated-manipulation-dominant', 'risk-low-creator', 'risk-low-wallet'],
    qualityIndicators: ['quality-moderate-manipulation', 'quality-moderate-overall'],
    confidenceIndicators: ['confidence-moderate-manipulation'],
    safeNotes: [
      'Synthetic fixture: manipulation-risk-dominates composite evidence dashboard.',
      'Phase 33 source: manipulation-risk-dominates-composite.',
    ],
  });

// ─── 5. Mixed-signal watchlist dashboard fixture ──────────────────────────────

export const MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'mixed-signal-watchlist-dashboard',
    kind: 'dashboard',
    title: 'Mixed-Signal Watchlist Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'mixed-signal-watchlist-composite',
    sourceCompositeFixtureKind: 'mixed-signal-watchlist',
    overallRiskBand: 'moderate',
    overallQualityBand: 'moderate',
    overallConfidenceBand: 'low',
    sourceCount: 3,
    riskIndicators: ['risk-moderate-mixed-signals', 'risk-low-creator', 'risk-moderate-wallet'],
    qualityIndicators: ['quality-moderate-mixed', 'quality-low-confidence'],
    confidenceIndicators: ['confidence-low-mixed-signals'],
    safeNotes: [
      'Synthetic fixture: mixed-signal watchlist composite evidence dashboard.',
      'Phase 33 source: mixed-signal-watchlist-composite.',
    ],
  });

// ─── 6. Insufficient-data dashboard fixture ───────────────────────────────────

export const INSUFFICIENT_DATA_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'insufficient-data-dashboard',
    kind: 'dashboard',
    title: 'Insufficient-Data Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'insufficient-data-composite',
    sourceCompositeFixtureKind: 'insufficient-data',
    overallRiskBand: 'unknown',
    overallQualityBand: 'unknown',
    overallConfidenceBand: 'none',
    sourceCount: 0,
    riskIndicators: [],
    qualityIndicators: [],
    confidenceIndicators: ['confidence-none-insufficient-data'],
    safeNotes: [
      'Synthetic fixture: insufficient-data composite evidence dashboard.',
      'Phase 33 source: insufficient-data-composite.',
    ],
  });

// ─── 7. High-risk multi-evidence dashboard fixture ────────────────────────────

export const HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'high-risk-multi-evidence-dashboard',
    kind: 'dashboard',
    title: 'High-Risk Multi-Evidence Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'high-risk-multi-evidence-composite',
    sourceCompositeFixtureKind: 'high-risk-multi-evidence',
    overallRiskBand: 'critical',
    overallQualityBand: 'low',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: [
      'risk-critical-creator',
      'risk-critical-wallet',
      'risk-critical-manipulation',
    ],
    qualityIndicators: ['quality-low-all-sources'],
    confidenceIndicators: ['confidence-high-multi-source'],
    safeNotes: [
      'Synthetic fixture: high-risk multi-evidence composite evidence dashboard.',
      'Phase 33 source: high-risk-multi-evidence-composite.',
    ],
  });

// ─── 8. Safety-boundary dashboard fixture ─────────────────────────────────────

export const SAFETY_BOUNDARY_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'safety-boundary-dashboard',
    kind: 'dashboard',
    title: 'Safety-Boundary Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'safety-boundary-composite',
    sourceCompositeFixtureKind: 'safety-boundary',
    overallRiskBand: 'unknown',
    overallQualityBand: 'unknown',
    overallConfidenceBand: 'none',
    sourceCount: 0,
    riskIndicators: ['risk-safety-boundary-enforced'],
    qualityIndicators: [],
    confidenceIndicators: [],
    safeNotes: [
      'Synthetic fixture: safety-boundary composite evidence dashboard.',
      'Safety boundary is enforced. Fixture-only, synthetic, non-executing.',
      'Phase 33 source: safety-boundary-composite.',
    ],
  });

// ─── 9. Malformed-input-safe dashboard fixture ────────────────────────────────

export const MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE: CompositeEvidenceDashboardFixture =
  buildCompositeEvidenceDashboardFixture({
    name: 'malformed-input-safe-dashboard',
    kind: 'dashboard',
    title: 'Malformed-Input-Safe Composite Evidence Dashboard',
    sourceCompositeFixtureName: 'malformed-input-safe-composite',
    sourceCompositeFixtureKind: 'malformed-safe',
    overallRiskBand: 'unknown',
    overallQualityBand: 'unknown',
    overallConfidenceBand: 'none',
    sourceCount: 0,
    riskIndicators: [],
    qualityIndicators: [],
    confidenceIndicators: [],
    safeNotes: [
      'Synthetic fixture: malformed-input-safe composite evidence dashboard.',
      'Phase 33 source: malformed-input-safe-composite.',
    ],
  });

// ─── 10. Clean low-risk report fixture ────────────────────────────────────────

export const CLEAN_LOW_RISK_REPORT_FIXTURE: CompositeEvidenceReportFixture =
  buildCompositeEvidenceReportFixture({
    name: 'clean-low-risk-report',
    kind: 'report',
    title: 'Clean Low-Risk Composite Evidence Report',
    sourceCompositeFixtureName: 'clean-low-risk-composite',
    sourceCompositeFixtureKind: 'clean-low-risk',
    sourceReportFixtureName: 'clean-low-risk-intelligence-report',
    sourceReportFixtureKind: 'clean-low-risk',
    overallRiskBand: 'low',
    overallQualityBand: 'high',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: ['risk-low-creator', 'risk-low-wallet', 'risk-low-manipulation'],
    qualityIndicators: ['quality-high-creator', 'quality-high-wallet'],
    confidenceIndicators: ['confidence-high-all-sources'],
    safeNotes: [
      'Synthetic fixture: clean low-risk composite evidence report.',
      'Phase 33 source: clean-low-risk-composite.',
      'Phase 34 source: clean-low-risk-intelligence-report.',
    ],
  });

// ─── 11. Mixed-signal watchlist report fixture ────────────────────────────────

export const MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE: CompositeEvidenceReportFixture =
  buildCompositeEvidenceReportFixture({
    name: 'mixed-signal-watchlist-report',
    kind: 'report',
    title: 'Mixed-Signal Watchlist Composite Evidence Report',
    sourceCompositeFixtureName: 'mixed-signal-watchlist-composite',
    sourceCompositeFixtureKind: 'mixed-signal-watchlist',
    sourceReportFixtureName: 'mixed-signal-watchlist-intelligence-report',
    sourceReportFixtureKind: 'mixed-signal-watchlist',
    overallRiskBand: 'moderate',
    overallQualityBand: 'moderate',
    overallConfidenceBand: 'low',
    sourceCount: 3,
    riskIndicators: ['risk-moderate-mixed-signals'],
    qualityIndicators: ['quality-moderate-mixed'],
    confidenceIndicators: ['confidence-low-mixed-signals'],
    safeNotes: [
      'Synthetic fixture: mixed-signal watchlist composite evidence report.',
      'Phase 33 source: mixed-signal-watchlist-composite.',
      'Phase 34 source: mixed-signal-watchlist-intelligence-report.',
    ],
  });

// ─── 12. High-risk multi-evidence report fixture ──────────────────────────────

export const HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE: CompositeEvidenceReportFixture =
  buildCompositeEvidenceReportFixture({
    name: 'high-risk-multi-evidence-report',
    kind: 'report',
    title: 'High-Risk Multi-Evidence Composite Evidence Report',
    sourceCompositeFixtureName: 'high-risk-multi-evidence-composite',
    sourceCompositeFixtureKind: 'high-risk-multi-evidence',
    sourceReportFixtureName: 'high-risk-multi-evidence-intelligence-report',
    sourceReportFixtureKind: 'high-risk-multi-evidence',
    overallRiskBand: 'critical',
    overallQualityBand: 'low',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: ['risk-critical-creator', 'risk-critical-wallet', 'risk-critical-manipulation'],
    qualityIndicators: ['quality-low-all-sources'],
    confidenceIndicators: ['confidence-high-multi-source'],
    safeNotes: [
      'Synthetic fixture: high-risk multi-evidence composite evidence report.',
      'Phase 33 source: high-risk-multi-evidence-composite.',
      'Phase 34 source: high-risk-multi-evidence-intelligence-report.',
    ],
  });

// ─── 13. Safety-boundary report fixture ───────────────────────────────────────

export const CE_SAFETY_BOUNDARY_REPORT_FIXTURE: CompositeEvidenceReportFixture =
  buildCompositeEvidenceReportFixture({
    name: 'safety-boundary-report',
    kind: 'report',
    title: 'Safety-Boundary Composite Evidence Report',
    sourceCompositeFixtureName: 'safety-boundary-composite',
    sourceCompositeFixtureKind: 'safety-boundary',
    sourceReportFixtureName: 'safety-boundary-intelligence-report',
    sourceReportFixtureKind: 'safety-boundary',
    overallRiskBand: 'unknown',
    overallQualityBand: 'unknown',
    overallConfidenceBand: 'none',
    sourceCount: 0,
    riskIndicators: ['risk-safety-boundary-enforced'],
    qualityIndicators: [],
    confidenceIndicators: [],
    safeNotes: [
      'Synthetic fixture: safety-boundary composite evidence report.',
      'Safety boundary is enforced. Fixture-only, synthetic, non-executing.',
      'Phase 33 source: safety-boundary-composite.',
      'Phase 34 source: safety-boundary-intelligence-report.',
    ],
  });

// ─── 14. Dashboard-ready combined fixture ─────────────────────────────────────

export const DASHBOARD_READY_COMBINED_FIXTURE: CompositeEvidenceDashboardReportFixture =
  buildCompositeEvidenceDashboardReportFixture({
    name: 'dashboard-ready-combined',
    kind: 'combined',
    title: 'Dashboard-Ready Combined Composite Evidence Fixture',
    description:
      'Phase 35 combined dashboard/report fixture prepared for future dashboard replay workflows.',
    sourceCompositeFixtureName: 'dashboard-ready-composite',
    sourceCompositeFixtureKind: 'dashboard-ready',
    sourceReportFixtureName: 'dashboard-ready-intelligence-report',
    sourceReportFixtureKind: 'dashboard-ready',
    overallRiskBand: 'low',
    overallQualityBand: 'high',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: ['risk-low-dashboard-ready'],
    qualityIndicators: ['quality-high-dashboard-ready'],
    confidenceIndicators: ['confidence-high-dashboard-ready'],
    safeNotes: [
      'Synthetic fixture: dashboard-ready combined composite evidence fixture.',
      'Phase 33 source: dashboard-ready-composite.',
      'Phase 34 source: dashboard-ready-intelligence-report.',
    ],
  });

// ─── 15. Report-ready combined fixture ────────────────────────────────────────

export const REPORT_READY_COMBINED_FIXTURE: CompositeEvidenceDashboardReportFixture =
  buildCompositeEvidenceDashboardReportFixture({
    name: 'report-ready-combined',
    kind: 'combined',
    title: 'Report-Ready Combined Composite Evidence Fixture',
    description:
      'Phase 35 combined dashboard/report fixture prepared for future report replay workflows.',
    sourceCompositeFixtureName: 'report-ready-composite',
    sourceCompositeFixtureKind: 'report-ready',
    sourceReportFixtureName: 'serialization-preview-ready-intelligence-report',
    sourceReportFixtureKind: 'serialization-preview-ready',
    overallRiskBand: 'low',
    overallQualityBand: 'high',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: ['risk-low-report-ready'],
    qualityIndicators: ['quality-high-report-ready'],
    confidenceIndicators: ['confidence-high-report-ready'],
    safeNotes: [
      'Synthetic fixture: report-ready combined composite evidence fixture.',
      'Phase 33 source: report-ready-composite.',
      'Phase 34 source: serialization-preview-ready-intelligence-report.',
    ],
  });

// ─── 16. Serialization-preview-ready combined fixture ─────────────────────────

export const SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE: CompositeEvidenceDashboardReportFixture =
  buildCompositeEvidenceDashboardReportFixture({
    name: 'serialization-preview-ready-combined',
    kind: 'combined',
    title: 'Serialization-Preview-Ready Combined Composite Evidence Fixture',
    description:
      'Phase 35 combined dashboard/report fixture ready for serialization-preview inspection and replay.',
    sourceCompositeFixtureName: 'dashboard-ready-composite',
    sourceCompositeFixtureKind: 'dashboard-ready',
    sourceReportFixtureName: 'serialization-preview-ready-intelligence-report',
    sourceReportFixtureKind: 'serialization-preview-ready',
    overallRiskBand: 'low',
    overallQualityBand: 'high',
    overallConfidenceBand: 'high',
    sourceCount: 3,
    riskIndicators: ['risk-low-serialization-preview'],
    qualityIndicators: ['quality-high-serialization-preview'],
    confidenceIndicators: ['confidence-high-serialization-preview'],
    safeNotes: [
      'Synthetic fixture: serialization-preview-ready combined composite evidence fixture.',
      'Phase 33 source: dashboard-ready-composite.',
      'Phase 34 source: serialization-preview-ready-intelligence-report.',
    ],
  });

// ─── All fixtures ─────────────────────────────────────────────────────────────

export const PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES: readonly CompositeEvidenceDashboardFixture[] =
  [
    CLEAN_LOW_RISK_DASHBOARD_FIXTURE,
    CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE,
    CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE,
    MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE,
    MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE,
    INSUFFICIENT_DATA_DASHBOARD_FIXTURE,
    HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE,
    SAFETY_BOUNDARY_DASHBOARD_FIXTURE,
    MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE,
  ];

export const PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES: readonly CompositeEvidenceReportFixture[] =
  [
    CLEAN_LOW_RISK_REPORT_FIXTURE,
    MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE,
    HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE,
    CE_SAFETY_BOUNDARY_REPORT_FIXTURE,
  ];

export const PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES: readonly CompositeEvidenceDashboardReportFixture[] =
  [
    DASHBOARD_READY_COMBINED_FIXTURE,
    REPORT_READY_COMBINED_FIXTURE,
    SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE,
  ];

// ─── List/get helpers ─────────────────────────────────────────────────────────

type AnyFixture =
  | CompositeEvidenceDashboardFixture
  | CompositeEvidenceReportFixture
  | CompositeEvidenceDashboardReportFixture;

const ALL_NAMED_FIXTURES: ReadonlyMap<
  CompositeEvidenceDashboardReportFixtureName,
  AnyFixture
> = new Map<CompositeEvidenceDashboardReportFixtureName, AnyFixture>([
  ['clean-low-risk-dashboard', CLEAN_LOW_RISK_DASHBOARD_FIXTURE],
  ['creator-credible-wallet-benign-dashboard', CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE],
  ['creator-risk-wallet-risk-dashboard', CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE],
  ['manipulation-risk-dominates-dashboard', MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE],
  ['mixed-signal-watchlist-dashboard', MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE],
  ['insufficient-data-dashboard', INSUFFICIENT_DATA_DASHBOARD_FIXTURE],
  ['high-risk-multi-evidence-dashboard', HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE],
  ['safety-boundary-dashboard', SAFETY_BOUNDARY_DASHBOARD_FIXTURE],
  ['malformed-input-safe-dashboard', MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE],
  ['clean-low-risk-report', CLEAN_LOW_RISK_REPORT_FIXTURE],
  ['mixed-signal-watchlist-report', MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE],
  ['high-risk-multi-evidence-report', HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE],
  ['safety-boundary-report', CE_SAFETY_BOUNDARY_REPORT_FIXTURE],
  ['dashboard-ready-combined', DASHBOARD_READY_COMBINED_FIXTURE],
  ['report-ready-combined', REPORT_READY_COMBINED_FIXTURE],
  ['serialization-preview-ready-combined', SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE],
]);

export function listCompositeEvidenceDashboardReportFixtures(): readonly CompositeEvidenceDashboardReportFixtureName[] {
  return [...COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES];
}

export function getCompositeEvidenceDashboardReportFixture(
  name: CompositeEvidenceDashboardReportFixtureName,
): AnyFixture | null {
  return ALL_NAMED_FIXTURES.get(name) ?? null;
}
