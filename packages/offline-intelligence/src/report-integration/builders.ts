/**
 * Phase 34 — Offline Intelligence Report Integration Models v1: builders.
 */

import {
  OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES,
  OFFLINE_INTELLIGENCE_REPORT_KINDS,
  PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT,
  PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE,
  type OfflineIntelligenceConfidenceSection,
  type OfflineIntelligenceQualitySection,
  type OfflineIntelligenceReportBuildInput,
  type OfflineIntelligenceReportBuildResult,
  type OfflineIntelligenceReportFixtureName,
  type OfflineIntelligenceReportKind,
  type OfflineIntelligenceReportModel,
  type OfflineIntelligenceReportSection,
  type OfflineIntelligenceReportSummary,
  type OfflineIntelligenceRiskSection,
  type OfflineIntelligenceSafetyBoundarySection,
  type OfflineIntelligenceSourceReferenceSection,
  type OfflineIntelligenceTypedReportSection,
} from './types.js';
import { normalizeOfflineIntelligenceReportModel } from './normalization.js';
import {
  validateOfflineIntelligenceReportModel,
  validateOfflineIntelligenceReportSafety,
} from './validation.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function buildSummarySection(report: OfflineIntelligenceReportModel): OfflineIntelligenceReportSection {
  return {
    id: 'summary',
    title: 'Composite Summary',
    kind: 'summary',
    summary: `Synthetic ${report.summary.overallRiskBand} risk / ${report.summary.overallQualityBand} quality / ${report.summary.overallConfidenceBand} confidence from ${report.summary.sourceCount} source references.`,
    notes: sortStrings(report.safeNotes),
  };
}

function buildRiskSection(report: OfflineIntelligenceReportModel): OfflineIntelligenceRiskSection {
  return {
    id: 'risk',
    title: 'Risk Summary',
    kind: 'risk',
    summary: `Synthetic risk band: ${report.summary.overallRiskBand}.`,
    overallRiskBand: report.summary.overallRiskBand,
    indicators: report.sourceCompositeFixture.riskIndicators.map(item => item.code),
    notes: sortStrings(report.sourceCompositeFixture.riskIndicators.map(item => item.rationale)),
  };
}

function buildQualitySection(report: OfflineIntelligenceReportModel): OfflineIntelligenceQualitySection {
  return {
    id: 'quality',
    title: 'Quality Summary',
    kind: 'quality',
    summary: `Synthetic quality band: ${report.summary.overallQualityBand}.`,
    overallQualityBand: report.summary.overallQualityBand,
    indicators: report.sourceCompositeFixture.qualityIndicators.map(item => item.code),
    notes: sortStrings(report.sourceCompositeFixture.qualityIndicators.map(item => item.rationale)),
  };
}

function buildConfidenceSection(
  report: OfflineIntelligenceReportModel,
): OfflineIntelligenceConfidenceSection {
  return {
    id: 'confidence',
    title: 'Confidence Summary',
    kind: 'confidence',
    summary: `Synthetic confidence band: ${report.summary.overallConfidenceBand}.`,
    overallConfidenceBand: report.summary.overallConfidenceBand,
    indicators: report.sourceCompositeFixture.confidenceIndicators.map(item => item.code),
    notes: sortStrings(report.sourceCompositeFixture.confidenceIndicators.map(item => item.rationale)),
  };
}

function buildSourceReferencesSection(
  report: OfflineIntelligenceReportModel,
): OfflineIntelligenceSourceReferenceSection {
  return {
    id: 'source-references',
    title: 'Source References',
    kind: 'source-references',
    summary: 'Synthetic Phase 33 composite source references only.',
    sourceReferences: report.sourceCompositeFixture.sourceReferences,
    notes: sortStrings(report.sourceCompositeFixture.sourceReferences.notes),
  };
}

function buildWeightingSection(report: OfflineIntelligenceReportModel): OfflineIntelligenceReportSection {
  return {
    id: 'weighting',
    title: 'Weighting Summary',
    kind: 'weighting',
    summary: `Synthetic dominant category: ${report.summary.dominantCategory}.`,
    notes: sortStrings(report.meta.sourceCompositeWeighting.notes),
  };
}

function buildSafetyBoundarySection(
  report: OfflineIntelligenceReportModel,
): OfflineIntelligenceSafetyBoundarySection {
  return {
    id: 'safety-boundary',
    title: 'Safety Boundary',
    kind: 'safety-boundary',
    summary:
      'Fixture-only, synthetic-only, deterministic, local-only, read-only, non-advisory report integration.',
    fixtureOnly: true,
    syntheticOnly: true,
    deterministic: true,
    liveData: false,
    externalNetwork: false,
    persistence: false,
    nonAdvisory: true,
    nonAccusatory: true,
    notes: sortStrings(report.safeNotes),
  };
}

export function buildOfflineIntelligenceReportSection(
  report: OfflineIntelligenceReportModel,
  kind:
    | 'summary'
    | 'risk'
    | 'quality'
    | 'confidence'
    | 'source-references'
    | 'weighting'
    | 'safety-boundary',
): OfflineIntelligenceTypedReportSection {
  switch (kind) {
    case 'summary':
      return buildSummarySection(report);
    case 'risk':
      return buildRiskSection(report);
    case 'quality':
      return buildQualitySection(report);
    case 'confidence':
      return buildConfidenceSection(report);
    case 'source-references':
      return buildSourceReferencesSection(report);
    case 'weighting':
      return buildWeightingSection(report);
    case 'safety-boundary':
      return buildSafetyBoundarySection(report);
  }
}

export function buildOfflineIntelligenceReportSummary(
  report: OfflineIntelligenceReportModel,
): OfflineIntelligenceReportSummary {
  return report.summary;
}

function toDefaultTitle(name: OfflineIntelligenceReportFixtureName): string {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function buildOfflineIntelligenceReportModel(
  input: OfflineIntelligenceReportBuildInput,
): OfflineIntelligenceReportBuildResult {
  const nameParsed = OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES.includes(
    input.name as OfflineIntelligenceReportFixtureName,
  );
  const kindParsed = OFFLINE_INTELLIGENCE_REPORT_KINDS.includes(
    input.kind as OfflineIntelligenceReportKind,
  );

  if (!nameParsed || !kindParsed || !input.sourceCompositeFixture) {
    return {
      success: false,
      report: null,
      validation: {
        valid: false,
        issues: [
          ...(!nameParsed
            ? [
                {
                  code: 'INVALID_NAME',
                  field: 'name',
                  message: `Unsupported report fixture name: ${input.name}`,
                  severity: 'error' as const,
                },
              ]
            : []),
          ...(!kindParsed
            ? [
                {
                  code: 'INVALID_KIND',
                  field: 'kind',
                  message: `Unsupported report fixture kind: ${input.kind}`,
                  severity: 'error' as const,
                },
              ]
            : []),
          ...(!input.sourceCompositeFixture
            ? [
                {
                  code: 'MISSING_SOURCE_COMPOSITE_FIXTURE',
                  field: 'sourceCompositeFixture',
                  message: 'sourceCompositeFixture is required.',
                  severity: 'error' as const,
                },
              ]
            : []),
        ],
      },
      safety: { safe: true, violations: [] },
    };
  }

  const name = input.name as OfflineIntelligenceReportFixtureName;
  const kind = input.kind as OfflineIntelligenceReportKind;
  const safeNotes = sortStrings(input.safeNotes ?? [
    'Fixture-only.',
    'Synthetic-only.',
    'Non-advisory.',
    'No action output.',
  ]);

  const baseReport: OfflineIntelligenceReportModel = {
    name,
    kind,
    title: typeof input.title === 'string' && input.title.trim() !== '' ? input.title.trim() : toDefaultTitle(name),
    sourceCompositeFixture: input.sourceCompositeFixture,
    sections: [],
    summary: {
      phase: 34,
      reportName: name,
      reportKind: kind,
      sourceCompositeFixtureName: input.sourceCompositeFixture.name,
      sourceCompositeFixtureKind: input.sourceCompositeFixture.kind,
      overallRiskBand: input.sourceCompositeFixture.summary.overallRiskBand,
      overallQualityBand: input.sourceCompositeFixture.summary.overallQualityBand,
      overallConfidenceBand: input.sourceCompositeFixture.summary.overallConfidenceBand,
      sourceCount: input.sourceCompositeFixture.sourceReferences.sourceCount,
      sectionCount: 7,
      riskCount: input.sourceCompositeFixture.riskIndicators.length,
      qualityCount: input.sourceCompositeFixture.qualityIndicators.length,
      confidenceCount: input.sourceCompositeFixture.confidenceIndicators.length,
      dominantCategory: input.sourceCompositeFixture.weighting.dominantCategory,
      nonAdvisory: true,
      nonActionable: true,
      safeToDisplay: true,
      generatedAt: PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT,
      notes: safeNotes,
    },
    meta: {
      phase: 34,
      generatedAt: PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT,
      source: PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE,
      sourceCompositeFixtureName: input.sourceCompositeFixture.name,
      sourceCompositeFixtureKind: input.sourceCompositeFixture.kind,
      sourceCompositeGeneratedAt: input.sourceCompositeFixture.meta.generatedAt,
      sourceCompositeWeighting: {
        ...input.sourceCompositeFixture.weighting,
        notes: sortStrings(input.sourceCompositeFixture.weighting.notes),
      },
      sourceCompositeReferenceCount: input.sourceCompositeFixture.sourceReferences.sourceCount,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      readOnly: true,
      localOnly: true,
      liveData: false,
      externalNetwork: false,
      persistence: false,
      nonAdvisory: true,
      nonAccusatory: true,
      dashboardReportCompatible: true,
      serializationPreviewCompatible: true,
      notes: safeNotes,
    },
    safeNotes,
  };

  const sectionKinds: readonly (
    | 'summary'
    | 'risk'
    | 'quality'
    | 'confidence'
    | 'source-references'
    | 'weighting'
    | 'safety-boundary'
  )[] = ['summary', 'risk', 'quality', 'confidence', 'source-references', 'weighting', 'safety-boundary'];

  const withSections: OfflineIntelligenceReportModel = {
    ...baseReport,
    sections: sectionKinds.map(sectionKind =>
      buildOfflineIntelligenceReportSection(baseReport, sectionKind),
    ),
  };

  const normalized = normalizeOfflineIntelligenceReportModel(withSections);
  const safety = validateOfflineIntelligenceReportSafety(normalized);

  if (!safety.safe) {
    return {
      success: false,
      report: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'SAFETY_VIOLATION',
            field: 'root',
            message: 'Report failed safety validation.',
            severity: 'error',
          },
        ],
      },
      safety,
    };
  }

  const validation = validateOfflineIntelligenceReportModel(normalized);

  return {
    success: validation.valid && safety.safe,
    report: validation.valid ? normalized : null,
    validation,
    safety,
  };
}
