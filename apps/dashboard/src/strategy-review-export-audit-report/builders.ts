/**
 * Phase 46 — Strategy Review Export Audit Report Fixtures v1: builders.
 */

import { getStrategyReviewExportAuditReportCapabilities } from './capabilities.js';
import {
  normalizeStrategyReviewExportAuditReportFixture,
  stableDeterministicChecksum,
} from './normalization.js';
import {
  validateStrategyReviewExportAuditReportFixture,
  validateStrategyReviewExportAuditReportSafety,
} from './validation.js';
import {
  PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT,
  PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE,
  type StrategyReviewExportAuditReportBuildInput,
  type StrategyReviewExportAuditReportBuildResult,
  type StrategyReviewExportAuditReportEvidenceReference,
  type StrategyReviewExportAuditReportFixture,
  type StrategyReviewExportAuditReportSection,
} from './types.js';

function deterministicReportId(seed: string): string {
  return `strategy-review-export-audit-report-${stableDeterministicChecksum(seed).replace(':', '-')}`;
}

function buildEvidenceReferences(
  sourceAuditFixture: StrategyReviewExportAuditReportBuildInput['sourceAuditFixture'],
  reportId: string,
): readonly StrategyReviewExportAuditReportEvidenceReference[] {
  return sourceAuditFixture.auditItem.findings.map((finding, index) => ({
    evidenceReferenceId: `${reportId}-evidence-${String(index + 1).padStart(2, '0')}`,
    sourceAuditId: sourceAuditFixture.auditItem.auditItemId,
    sourceAuditFindingId: finding.findingId,
    sourceQueueFixtureName: sourceAuditFixture.auditItem.queueReference.sourceQueueFixtureName,
    summary: `${finding.category} (${finding.severity}): ${finding.description}`,
    syntheticOnly: true,
    fixtureOnly: true,
  }));
}

function buildSections(
  sourceAuditFixture: StrategyReviewExportAuditReportBuildInput['sourceAuditFixture'],
  evidenceReferences: readonly StrategyReviewExportAuditReportEvidenceReference[],
): readonly StrategyReviewExportAuditReportSection[] {
  const evidenceReferenceIds = evidenceReferences.map(reference => reference.evidenceReferenceId);

  return [
    {
      sectionId: 'overview',
      sectionTitle: 'Overview',
      sectionKind: 'overview',
      order: 1,
      summary: 'Deterministic synthetic report overview derived from Phase 45 export audit fixture.',
      items: [
        `Source audit fixture: ${sourceAuditFixture.name}`,
        `Report state mirrors source audit state: ${sourceAuditFixture.auditItem.state}`,
        'Fixture-only, local-only, read-only report model.',
      ],
      evidenceReferenceIds,
      safetyNotes: ['No real report generation.', 'No downloads.', 'No filesystem writes.'],
    },
    {
      sectionId: 'source-audit-reference',
      sectionTitle: 'Source Audit Reference',
      sectionKind: 'source-audit-reference',
      order: 2,
      summary: 'Single-source linkage to one Phase 45 export audit fixture.',
      items: [
        `Source audit id: ${sourceAuditFixture.auditItem.auditItemId}`,
        `Source audit name: ${sourceAuditFixture.name}`,
        `Source audit kind: ${sourceAuditFixture.kind}`,
      ],
      evidenceReferenceIds,
      safetyNotes: ['Derived strictly from one Phase 45 fixture.'],
    },
    {
      sectionId: 'queue-reference',
      sectionTitle: 'Queue Reference',
      sectionKind: 'queue-reference',
      order: 3,
      summary: 'Stable queue metadata inherited from Phase 44 queue reference in Phase 45 fixture.',
      items: [
        `Source queue fixture: ${sourceAuditFixture.auditItem.queueReference.sourceQueueFixtureName}`,
        `Queue state: ${sourceAuditFixture.auditItem.queueReference.sourceQueueState}`,
        `Queue priority: ${sourceAuditFixture.auditItem.queueReference.sourceQueuePriority}`,
      ],
      evidenceReferenceIds,
      safetyNotes: ['Queue workers are not implemented.', 'No queue processing behavior exists.'],
    },
    {
      sectionId: 'findings-summary',
      sectionTitle: 'Findings Summary',
      sectionKind: 'findings-summary',
      order: 4,
      summary: 'Synthetic finding summaries copied from source audit fixture findings.',
      items: sourceAuditFixture.auditItem.findings.map(
        finding => `${finding.findingId}: ${finding.severity} ${finding.category}`,
      ),
      evidenceReferenceIds,
      safetyNotes: ['Findings are synthetic fixture records only.'],
    },
    {
      sectionId: 'severity-summary',
      sectionTitle: 'Severity Summary',
      sectionKind: 'severity-summary',
      order: 5,
      summary: 'Report severity is a deterministic mirror of source audit severity.',
      items: [`Report severity: ${sourceAuditFixture.auditItem.severity}`],
      evidenceReferenceIds,
      safetyNotes: ['No recommendation, ranking, or trade decision output.'],
    },
    {
      sectionId: 'validation-summary',
      sectionTitle: 'Validation Summary',
      sectionKind: 'validation-summary',
      order: 6,
      summary: 'Structural and safety validation notes for deterministic fixture report shape.',
      items: [
        'Structure validated for required report fields.',
        'Source references validated against Phase 45 fixture fields.',
        'Safety capabilities validated as read-only and non-executable.',
      ],
      evidenceReferenceIds,
      safetyNotes: ['Validation is fixture-shape validation only.'],
    },
    {
      sectionId: 'safety-constraints',
      sectionTitle: 'Safety Constraints',
      sectionKind: 'safety-constraints',
      order: 7,
      summary: 'Explicit safety boundaries maintained for Phase 46 report fixtures.',
      items: [
        'No live data and no external network access.',
        'No report downloads and no PDF/CSV/HTML generation.',
        'No persistence and no filesystem writes.',
        'No trading signals, recommendations, or investment advice.',
      ],
      evidenceReferenceIds,
      safetyNotes: ['All unsafe capability flags remain false.'],
    },
    {
      sectionId: 'evidence-references',
      sectionTitle: 'Evidence References',
      sectionKind: 'evidence-references',
      order: 8,
      summary: 'Evidence references map report sections to source audit findings.',
      items: evidenceReferences.map(reference => reference.evidenceReferenceId),
      evidenceReferenceIds,
      safetyNotes: ['No external evidence retrieval.'],
    },
    {
      sectionId: 'limitations',
      sectionTitle: 'Limitations',
      sectionKind: 'limitations',
      order: 9,
      summary: 'Report fixtures are synthetic and intentionally non-operational.',
      items: [
        'Not a real report export or generated report file.',
        'Not a browser download artifact.',
        'Not sourced from live audit systems.',
      ],
      evidenceReferenceIds,
      safetyNotes: ['All limitations are deterministic static text.'],
    },
    {
      sectionId: 'future-readiness',
      sectionTitle: 'Future Readiness',
      sectionKind: 'future-readiness',
      order: 10,
      summary: 'Provides stable report-shaped fixtures for future phase consumers.',
      items: [
        'Supports future local dashboard/API read paths.',
        'Maintains deterministic fixture IDs and section ordering.',
        'Does not unlock any unsafe runtime capabilities.',
      ],
      evidenceReferenceIds,
      safetyNotes: ['Future phase consumption remains read-only.'],
    },
  ];
}

export function buildStrategyReviewExportAuditReportFixture(
  input: StrategyReviewExportAuditReportBuildInput,
): StrategyReviewExportAuditReportBuildResult {
  const sourceAuditFixture = input.sourceAuditFixture;
  const deterministicSeed =
    `phase46:${sourceAuditFixture.name}:${sourceAuditFixture.kind}:${sourceAuditFixture.auditItem.auditItemId}`;
  const reportId = deterministicReportId(deterministicSeed);
  const reportName = `${sourceAuditFixture.name}-report` as const;
  const reportKind = `${sourceAuditFixture.kind}-report` as const;
  const evidenceReferences = buildEvidenceReferences(sourceAuditFixture, reportId);
  const sections = buildSections(sourceAuditFixture, evidenceReferences);
  const bySeverity = {
    info: 0,
    warning: 0,
    error: 0,
    critical: 0,
  };

  for (const finding of sourceAuditFixture.auditItem.findings) {
    bySeverity[finding.severity] += 1;
  }

  const capabilities = getStrategyReviewExportAuditReportCapabilities();
  const fixture: StrategyReviewExportAuditReportFixture = {
    reportId,
    reportName,
    reportKind,
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE,
    sourceAuditId: sourceAuditFixture.auditItem.auditItemId,
    sourceAuditName: sourceAuditFixture.name,
    sourceAuditKind: sourceAuditFixture.kind,
    sourceQueueReference: {
      sourcePhase: sourceAuditFixture.auditItem.queueReference.sourcePhase,
      sourceQueueFixtureName: sourceAuditFixture.auditItem.queueReference.sourceQueueFixtureName,
      sourceQueueFixtureKind: sourceAuditFixture.auditItem.queueReference.sourceQueueFixtureKind,
      sourceQueueState: sourceAuditFixture.auditItem.queueReference.sourceQueueState,
      sourceQueuePriority: sourceAuditFixture.auditItem.queueReference.sourceQueuePriority,
    },
    reportState: sourceAuditFixture.auditItem.state,
    reportSeverity: sourceAuditFixture.auditItem.severity,
    generatedAt: PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT,
    deterministicSeed,
    title: `${sourceAuditFixture.title} — Synthetic Export Audit Report`,
    subtitle: 'Deterministic synthetic strategy review export audit report fixture (Phase 46)',
    summary:
      'Synthetic, read-only report projection over Phase 45 export audit fixture data with no report generation or downloads.',
    executiveSummary:
      'This fixture exists for deterministic local consumption only. It does not represent a real report, export, or advisory output.',
    sections,
    findingsOverview: {
      totalFindings: sourceAuditFixture.auditItem.findings.length,
      findingIds: sourceAuditFixture.auditItem.findings.map(finding => finding.findingId),
      bySeverity,
    },
    queueReferenceOverview: {
      sourceQueueFixtureName: sourceAuditFixture.auditItem.queueReference.sourceQueueFixtureName,
      sourceQueueState: sourceAuditFixture.auditItem.queueReference.sourceQueueState,
      sourceQueuePriority: sourceAuditFixture.auditItem.queueReference.sourceQueuePriority,
      notes: [
        'Queue reference is inherited from Phase 45 fixture linkage.',
        'No queue workers or scheduling behavior is implemented.',
      ],
    },
    safetyReview: {
      blockedBySafetyBoundary: sourceAuditFixture.auditItem.state === 'audit-blocked',
      safetyNotes: [
        'No live data access.',
        'No report file generation.',
        'No persistence or filesystem writes.',
        'No network, wallet, signing, or execution behavior.',
      ],
    },
    validationReview: {
      status: 'passed',
      notes: [
        {
          noteId: 'phase46-structural-validation',
          noteKind: 'structural',
          status: 'passed',
          message: 'Report fixture structure is deterministic and complete.',
        },
        {
          noteId: 'phase46-source-reference-validation',
          noteKind: 'source-reference',
          status: 'passed',
          message: 'Source audit and queue references are linked to Phase 45/44 fixtures.',
        },
        {
          noteId: 'phase46-safety-validation',
          noteKind: 'safety',
          status: 'passed',
          message: 'Unsafe capabilities remain disabled and non-executable.',
        },
      ],
    },
    evidenceReferences,
    limitations: [
      'Synthetic fixture-only report data; not a real report artifact.',
      'No report downloads, PDF/CSV/HTML generation, or filesystem output.',
      'No persistence, background jobs, queue workers, or scheduled jobs.',
      'No recommendations, trading signals, or investment advice.',
    ],
    nextPhaseNotes: [
      'Future phases may consume this deterministic report-shaped fixture data through local read paths.',
      'Future phases must preserve non-executable and non-advisory safety boundaries.',
    ],
    capabilityFlags: capabilities,
    meta: {
      phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE,
      sourceAuditPhase: 45,
      sourceQueuePhase: 44,
      sourcePhases: [44, 45, 46],
      generatedAt: PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT,
      source: PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      localOnly: true,
      readOnly: true,
      inMemoryOnly: true,
      liveData: false,
      persistence: false,
      filesystemWrites: false,
      networkAccess: false,
      execution: false,
      recommendations: false,
      tradingSignals: false,
      investmentAdvice: false,
      notes: [
        'Phase 46 report fixture metadata.',
        'Derived strictly from Phase 45 strategy-review-export-audit fixtures.',
      ],
    },
    safety: {
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      localOnly: true,
      readOnly: true,
      inMemoryOnly: true,
      reportGenerationDisabled: true,
      reportDownloadsDisabled: true,
      reportFilesystemWritesDisabled: true,
      reportPersistenceDisabled: true,
      reportBackgroundJobsDisabled: true,
      reportScheduledJobsDisabled: true,
      reportNetworkAccessDisabled: true,
      reportExecutionDisabled: true,
      reportRecommendationsDisabled: true,
      reportTradingSignalsDisabled: true,
      reportInvestmentAdviceDisabled: true,
    },
  };

  const normalizedFixture = normalizeStrategyReviewExportAuditReportFixture(fixture);
  const validation = validateStrategyReviewExportAuditReportFixture(normalizedFixture);
  const safety = validateStrategyReviewExportAuditReportSafety(normalizedFixture);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? normalizedFixture : null,
    validation,
    safety,
  };
}
