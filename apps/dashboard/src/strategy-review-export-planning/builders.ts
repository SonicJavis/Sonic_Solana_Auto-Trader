/**
 * Phase 43 — Strategy Review Report Export Planning Fixtures v1: builders.
 *
 * Deterministic, pure builders for strategy review export-planning fixtures.
 * No mutation, no timers, no randomness, no network, no filesystem, no persistence.
 */

import {
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES,
} from '../strategy-review-serialization/index.js';
import type { StrategyReviewSerializationPreviewFixture } from '../strategy-review-serialization/types.js';
import {
  areStrategyReviewExportPlanFixturesEqual,
  isValidStrategyReviewExportPlanFixtureKind,
  isValidStrategyReviewExportPlanFixtureName,
  isValidStrategyReviewExportPlanTarget,
  normalizeStrategyReviewExportPlanFixture,
  serializeStrategyReviewExportPlanFixture,
} from './normalization.js';
import {
  validateStrategyReviewExportPlanFixture,
  validateStrategyReviewExportPlanSafety,
} from './validation.js';
import {
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES,
  type StrategyReviewExportFileExtension,
  type StrategyReviewExportPlanBuildInput,
  type StrategyReviewExportPlanBuildResult,
  type StrategyReviewExportPlanDefinition,
  type StrategyReviewExportPlanFixture,
  type StrategyReviewExportPlanFixtureKind,
  type StrategyReviewExportPlanFixtureName,
  type StrategyReviewExportPlanMeta,
  type StrategyReviewExportPlanSafetyBoundary,
  type StrategyReviewExportPlanSummary,
  type StrategyReviewExportPlanTarget,
  type StrategyReviewSerializationPreviewReference,
} from './types.js';

export const EXPORT_PLAN_NAME_TO_PREVIEW: Readonly<
  Record<StrategyReviewExportPlanFixtureName, StrategyReviewSerializationPreviewFixture['name']>
> = {
  'json-export-plan-disabled': 'defensive-vs-aggressive-json-preview',
  'markdown-export-plan-disabled': 'creator-led-markdown-preview',
  'text-export-plan-disabled': 'wallet-led-text-preview',
  'metadata-export-plan-disabled': 'manipulation-avoidance-metadata-preview',
  'defensive-vs-aggressive-export-plan': 'defensive-vs-aggressive-json-preview',
  'creator-led-export-plan': 'creator-led-markdown-preview',
  'wallet-led-export-plan': 'wallet-led-text-preview',
  'manipulation-avoidance-export-plan': 'manipulation-avoidance-metadata-preview',
  'no-action-safety-export-plan': 'no-action-safety-json-preview',
  'insufficient-data-export-plan': 'insufficient-data-markdown-preview',
  'high-score-positive-export-plan': 'high-score-positive-text-preview',
  'mixed-signal-watchlist-export-plan': 'mixed-signal-watchlist-text-preview',
  'malformed-input-safe-export-plan': 'malformed-input-safe-preview',
  'dashboard-ready-export-plan': 'dashboard-ready-serialization-preview',
  'report-ready-export-plan': 'report-ready-serialization-preview',
  'safety-boundary-export-plan': 'safety-boundary-serialization-preview',
};

export const EXPORT_PLAN_NAME_TO_KIND: Readonly<
  Record<StrategyReviewExportPlanFixtureName, StrategyReviewExportPlanFixtureKind>
> = {
  'json-export-plan-disabled': 'format-disabled-export-plan',
  'markdown-export-plan-disabled': 'format-disabled-export-plan',
  'text-export-plan-disabled': 'format-disabled-export-plan',
  'metadata-export-plan-disabled': 'format-disabled-export-plan',
  'defensive-vs-aggressive-export-plan': 'comparison-export-plan',
  'creator-led-export-plan': 'creator-export-plan',
  'wallet-led-export-plan': 'wallet-export-plan',
  'manipulation-avoidance-export-plan': 'manipulation-export-plan',
  'no-action-safety-export-plan': 'safety-export-plan',
  'insufficient-data-export-plan': 'insufficient-data-export-plan',
  'high-score-positive-export-plan': 'positive-export-plan',
  'mixed-signal-watchlist-export-plan': 'watchlist-export-plan',
  'malformed-input-safe-export-plan': 'safe-export-plan',
  'dashboard-ready-export-plan': 'dashboard-ready-export-plan',
  'report-ready-export-plan': 'report-ready-export-plan',
  'safety-boundary-export-plan': 'safety-boundary-export-plan',
};

export const EXPORT_PLAN_NAME_TO_TARGET: Readonly<
  Record<StrategyReviewExportPlanFixtureName, StrategyReviewExportPlanTarget>
> = {
  'json-export-plan-disabled': 'json',
  'markdown-export-plan-disabled': 'markdown',
  'text-export-plan-disabled': 'text',
  'metadata-export-plan-disabled': 'metadata',
  'defensive-vs-aggressive-export-plan': 'json',
  'creator-led-export-plan': 'markdown',
  'wallet-led-export-plan': 'text',
  'manipulation-avoidance-export-plan': 'metadata',
  'no-action-safety-export-plan': 'json',
  'insufficient-data-export-plan': 'markdown',
  'high-score-positive-export-plan': 'text',
  'mixed-signal-watchlist-export-plan': 'text',
  'malformed-input-safe-export-plan': 'json',
  'dashboard-ready-export-plan': 'json',
  'report-ready-export-plan': 'json',
  'safety-boundary-export-plan': 'metadata',
};

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function titleCase(value: string): string {
  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getExtension(targetFormat: StrategyReviewExportPlanTarget): StrategyReviewExportFileExtension {
  switch (targetFormat) {
    case 'json':
      return '.json';
    case 'markdown':
      return '.md';
    case 'text':
      return '.txt';
    case 'metadata':
      return '.metadata.json';
  }
}

function getMimeType(targetFormat: StrategyReviewExportPlanTarget): string {
  switch (targetFormat) {
    case 'json':
      return 'application/json';
    case 'markdown':
      return 'text/markdown';
    case 'text':
      return 'text/plain';
    case 'metadata':
      return 'application/json; profile=metadata';
  }
}

function buildPreviewReference(
  preview: StrategyReviewSerializationPreviewFixture,
): StrategyReviewSerializationPreviewReference {
  return {
    sourcePhase: 42,
    sourcePreviewFixtureName: preview.name,
    sourcePreviewFixtureKind: preview.kind,
    sourcePreviewFormat: preview.format,
    sourceReportFixtureName: preview.reportReference.sourceReportFixtureName,
    sourceReportFixtureKind: preview.reportReference.sourceReportFixtureKind,
    contentLength: preview.contentLength,
    checksum: preview.checksum,
    hasContent: preview.content !== null,
    hasMetadataPayload: preview.metadataPayload !== null,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: ['Synthetic Phase 42 serialization preview reference for Phase 43 export planning fixture.'],
  };
}

function buildSafetyBoundary(
  preview: StrategyReviewSerializationPreviewFixture,
): StrategyReviewExportPlanSafetyBoundary {
  return {
    ...preview.safetyBoundary,
    strategyReviewExportPlanningFixtures: true,
    syntheticStrategyReviewExportPlans: true,
    strategyReviewExportPlanBuilders: true,
    strategyReviewExportPlanSafetyValidation: true,
    strategyReviewSerializationPreviewReferences: true,
    strategyReviewFilesystemWrites: false,
    strategyReviewPdfGeneration: false,
    strategyReviewCsvGeneration: false,
    strategyReviewHtmlGeneration: false,
    strategyReviewExportExternalNetwork: false,
    strategyReviewExportPersistence: false,
    strategyReviewExportExecution: false,
    strategyReviewExportTradingSignals: false,
    strategyReviewExportInvestmentAdvice: false,
    notes: sortStrings([
      ...preview.safetyBoundary.notes,
      'Planning-only export fixtures. No actual file generation, filesystem writes, or downloads.',
      'No PDF, CSV, or HTML generation. No browser blob or URL APIs.',
    ]),
  };
}

function buildMeta(
  preview: StrategyReviewSerializationPreviewFixture,
  notes: readonly string[],
): StrategyReviewExportPlanMeta {
  return {
    phase: 43,
    sourcePreviewPhase: 42,
    sourceReportPhase: 41,
    sourcePhases: [40, 41, 42, 43],
    fixtureOnly: true,
    syntheticOnly: true,
    deterministic: true,
    localOnly: true,
    readOnly: true,
    inMemoryOnly: true,
    exportDisabled: true,
    generatedAt: PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT,
    source: PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE,
    sourcePreviewFixtureName: preview.name,
    sourcePreviewFormat: preview.format,
    sourceReportFixtureName: preview.reportReference.sourceReportFixtureName,
    actualFileExport: false,
    filesystemWrites: false,
    downloadSupport: false,
    pdfGeneration: false,
    csvGeneration: false,
    htmlGeneration: false,
    externalNetwork: false,
    persistence: false,
    execution: false,
    tradingSignals: false,
    investmentAdvice: false,
    notes: sortStrings(notes),
  };
}

function buildPlanSteps(
  preview: StrategyReviewSerializationPreviewFixture,
  targetFormat: StrategyReviewExportPlanTarget,
): readonly string[] {
  return sortStrings([
    `Review the synthetic Phase 42 preview fixture ${preview.name}.`,
    `Keep the planned output target limited to ${targetFormat}.`,
    'Retain all safety metadata and synthetic-only references.',
    'Leave file paths, download names, and write channels disabled.',
  ]);
}

function buildDisabledReasons(targetFormat: StrategyReviewExportPlanTarget): readonly string[] {
  return sortStrings([
    'Actual file export is disabled in Phase 43.',
    'Filesystem writes are disabled in Phase 43.',
    'Browser download support is disabled in Phase 43.',
    `${targetFormat.toUpperCase()} planning is synthetic and in-memory only.`,
    'External network access and persistence are disabled in Phase 43.',
  ]);
}

function buildExportPlan(
  preview: StrategyReviewSerializationPreviewFixture,
  targetFormat: StrategyReviewExportPlanTarget,
): StrategyReviewExportPlanDefinition {
  const extension = getExtension(targetFormat);
  return {
    targetFormat,
    exportMode: 'planning-only-disabled',
    fileName: `${preview.name}${extension}`,
    fileExtension: extension,
    mimeType: getMimeType(targetFormat),
    previewContentKind: preview.format === 'metadata' ? 'metadata-only' : 'content',
    destination: 'disabled',
    filePath: null,
    downloadName: null,
    enabled: false,
    planSteps: buildPlanSteps(preview, targetFormat),
    disabledReasons: buildDisabledReasons(targetFormat),
    notes: sortStrings([
      'This is a synthetic export plan only.',
      'No actual export, write, blob, or download behavior is implemented.',
      `Preview source checksum: ${preview.checksum}`,
    ]),
  };
}

function buildSummary(
  fixture: StrategyReviewExportPlanFixture,
): StrategyReviewExportPlanSummary {
  return {
    phase: 43,
    fixtureName: fixture.name,
    fixtureKind: fixture.kind,
    targetFormat: fixture.targetFormat,
    sourcePreviewFixtureName: fixture.previewReference.sourcePreviewFixtureName,
    sourceReportFixtureName: fixture.previewReference.sourceReportFixtureName,
    fileName: fixture.exportPlan.fileName,
    planStepCount: fixture.exportPlan.planSteps.length,
    disabledReasonCount: fixture.exportPlan.disabledReasons.length,
    hasContentPreview: fixture.previewReference.hasContent,
    hasMetadataPreview: fixture.previewReference.hasMetadataPayload,
    exportDisabled: true,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    serializable: true,
    generatedAt: PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT,
    notes: sortStrings([
      `Synthetic Phase 43 export-planning summary for ${fixture.targetFormat}.`,
      'No actual file export, filesystem writes, or browser downloads are implemented.',
    ]),
  };
}

export function buildStrategyReviewExportPlanSummary(
  fixture: StrategyReviewExportPlanFixture,
): StrategyReviewExportPlanSummary {
  return buildSummary(fixture);
}

function buildCoreFixture(
  name: StrategyReviewExportPlanFixtureName,
  kind: StrategyReviewExportPlanFixtureKind,
  targetFormat: StrategyReviewExportPlanTarget,
  preview: StrategyReviewSerializationPreviewFixture,
  input: StrategyReviewExportPlanBuildInput,
): StrategyReviewExportPlanFixture {
  const exportPlan = buildExportPlan(preview, targetFormat);
  const safeNotes = sortStrings([
    'Planning-only fixture; no export or write behavior is enabled.',
    'Synthetic Phase 42 preview reference retained for compatibility testing.',
    ...(input.safeNotes ?? []),
  ]);

  const meta = buildMeta(preview, [
    ...safeNotes,
    'Derived from Phase 42 serialization previews for deterministic export planning only.',
  ]);

  const title =
    typeof input.title === 'string' && input.title.trim() !== ''
      ? input.title.trim()
      : `${titleCase(name)} Fixture`;

  const description =
    typeof input.description === 'string' && input.description.trim() !== ''
      ? input.description.trim()
      : `Deterministic disabled export plan for ${preview.name} targeting ${targetFormat}.`;

  const baseFixture: StrategyReviewExportPlanFixture = {
    name,
    kind,
    targetFormat,
    title,
    description,
    previewReference: buildPreviewReference(preview),
    exportPlan,
    summary: {} as StrategyReviewExportPlanSummary,
    meta,
    safetyBoundary: buildSafetyBoundary(preview),
    safeNotes,
  };

  const fixture: StrategyReviewExportPlanFixture = {
    ...baseFixture,
    summary: buildSummary(baseFixture),
  };

  return normalizeStrategyReviewExportPlanFixture(fixture);
}

export function buildStrategyReviewExportPlanFixture(
  input: StrategyReviewExportPlanBuildInput,
): StrategyReviewExportPlanBuildResult {
  const fallbackName = STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES[0];
  const name = isValidStrategyReviewExportPlanFixtureName(input.name) ? input.name : fallbackName;
  const kind = isValidStrategyReviewExportPlanFixtureKind(input.kind)
    ? input.kind
    : EXPORT_PLAN_NAME_TO_KIND[name];
  const targetFormat = isValidStrategyReviewExportPlanTarget(input.targetFormat)
    ? input.targetFormat
    : EXPORT_PLAN_NAME_TO_TARGET[name];

  const sourcePreviewFixtureName = STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES.includes(
    input.sourcePreviewFixtureName,
  )
    ? input.sourcePreviewFixtureName
    : EXPORT_PLAN_NAME_TO_PREVIEW[name];

  const preview = PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES.get(sourcePreviewFixtureName);
  if (!preview) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'MISSING_SOURCE_PREVIEW',
            field: 'sourcePreviewFixtureName',
            message: `Missing Phase 42 serialization preview fixture: ${sourcePreviewFixtureName}.`,
            severity: 'error',
          },
        ],
      },
      safety: { safe: true, violations: [] },
    };
  }

  const fixture = buildCoreFixture(name, kind, targetFormat, preview, input);
  const validation = validateStrategyReviewExportPlanFixture(fixture);
  const safety = validateStrategyReviewExportPlanSafety(fixture);

  return {
    success: validation.valid && safety.safe,
    fixture,
    validation,
    safety,
  };
}

export const STRATEGY_REVIEW_EXPORT_PLAN_HELPERS = {
  normalizeStrategyReviewExportPlanFixture,
  serializeStrategyReviewExportPlanFixture,
  areStrategyReviewExportPlanFixturesEqual,
};

export function listStrategyReviewExportPlanFixtures(
  fixturesMap: ReadonlyMap<
    StrategyReviewExportPlanFixtureName,
    StrategyReviewExportPlanFixture
  >,
): readonly StrategyReviewExportPlanFixture[] {
  return [...STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES].map(name => {
    const fixture = fixturesMap.get(name);
    if (!fixture) {
      throw new Error(`Missing Phase 43 export planning fixture: ${name}`);
    }
    return fixture;
  });
}

export function getStrategyReviewExportPlanFixture(
  fixturesMap: ReadonlyMap<
    StrategyReviewExportPlanFixtureName,
    StrategyReviewExportPlanFixture
  >,
  name: StrategyReviewExportPlanFixtureName,
): StrategyReviewExportPlanFixture | undefined {
  return fixturesMap.get(name);
}
