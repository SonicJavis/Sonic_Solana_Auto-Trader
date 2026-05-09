/**
 * Phase 42 — Strategy Review Serialization Preview Fixtures v1: builders.
 *
 * Deterministic, pure builders for strategy review serialization preview fixtures.
 * No mutation, no timers, no randomness, no network, no filesystem, no persistence.
 */

import {
  PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES,
  STRATEGY_REVIEW_REPORT_FIXTURE_NAMES,
} from '../strategy-review-reports/index.js';
import type {
  StrategyReviewReportFixture,
  StrategyReviewReportFixtureKind,
  StrategyReviewReportFixtureName,
} from '../strategy-review-reports/types.js';
import {
  areStrategyReviewSerializationPreviewFixturesEqual,
  isValidStrategyReviewSerializationPreviewFixtureKind,
  isValidStrategyReviewSerializationPreviewFixtureName,
  isValidStrategyReviewSerializationPreviewFormat,
  normalizeStrategyReviewSerializationPreviewFixture,
  serializeStrategyReviewSerializationPreviewFixture,
  stableDeterministicChecksum,
  stablePrettyJsonStringify,
} from './normalization.js';
import {
  validateStrategyReviewSerializationPreviewFixture,
  validateStrategyReviewSerializationSafety,
} from './validation.js';
import {
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT,
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE,
  STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES,
  type StrategyReviewReportPreviewReference,
  type StrategyReviewSerializationBuildInput,
  type StrategyReviewSerializationBuildResult,
  type StrategyReviewSerializationPreviewFixture,
  type StrategyReviewSerializationPreviewFixtureKind,
  type StrategyReviewSerializationPreviewFixtureName,
  type StrategyReviewSerializationPreviewFormat,
  type StrategyReviewSerializationPreviewMeta,
  type StrategyReviewSerializationPreviewSummary,
  type StrategyReviewSerializationSafetyBoundary,
} from './types.js';

// ─── Name → report fixture name mapping ──────────────────────────────────────

export const SERIALIZATION_NAME_TO_REPORT: Readonly<
  Record<StrategyReviewSerializationPreviewFixtureName, StrategyReviewReportFixtureName>
> = {
  'defensive-vs-aggressive-json-preview': 'defensive-vs-aggressive-review-report',
  'creator-led-markdown-preview': 'creator-led-review-report',
  'wallet-led-text-preview': 'wallet-led-review-report',
  'manipulation-avoidance-metadata-preview': 'manipulation-avoidance-review-report',
  'no-action-safety-json-preview': 'no-action-safety-review-report',
  'insufficient-data-markdown-preview': 'insufficient-data-review-report',
  'high-score-positive-text-preview': 'high-score-positive-review-report',
  'high-score-false-positive-metadata-preview': 'high-score-false-positive-review-report',
  'missed-opportunity-json-preview': 'missed-opportunity-review-report',
  'drawdown-contained-markdown-preview': 'drawdown-contained-review-report',
  'mixed-signal-watchlist-text-preview': 'mixed-signal-watchlist-review-report',
  'false-positive-protection-metadata-preview': 'false-positive-protection-review-report',
  'malformed-input-safe-preview': 'malformed-input-safe-review-report',
  'dashboard-ready-serialization-preview': 'dashboard-ready-strategy-review-report',
  'report-ready-serialization-preview': 'serialization-ready-strategy-review-report',
  'safety-boundary-serialization-preview': 'safety-boundary-strategy-review-report',
};

// ─── Name → kind mapping ──────────────────────────────────────────────────────

export const SERIALIZATION_NAME_TO_KIND: Readonly<
  Record<StrategyReviewSerializationPreviewFixtureName, StrategyReviewSerializationPreviewFixtureKind>
> = {
  'defensive-vs-aggressive-json-preview': 'json-preview',
  'creator-led-markdown-preview': 'markdown-preview',
  'wallet-led-text-preview': 'text-preview',
  'manipulation-avoidance-metadata-preview': 'metadata-preview',
  'no-action-safety-json-preview': 'json-preview',
  'insufficient-data-markdown-preview': 'markdown-preview',
  'high-score-positive-text-preview': 'text-preview',
  'high-score-false-positive-metadata-preview': 'metadata-preview',
  'missed-opportunity-json-preview': 'json-preview',
  'drawdown-contained-markdown-preview': 'markdown-preview',
  'mixed-signal-watchlist-text-preview': 'text-preview',
  'false-positive-protection-metadata-preview': 'metadata-preview',
  'malformed-input-safe-preview': 'safe-preview',
  'dashboard-ready-serialization-preview': 'dashboard-preview',
  'report-ready-serialization-preview': 'report-preview',
  'safety-boundary-serialization-preview': 'safety-boundary-preview',
};

// ─── Name → format mapping ────────────────────────────────────────────────────

export const SERIALIZATION_NAME_TO_FORMAT: Readonly<
  Record<StrategyReviewSerializationPreviewFixtureName, StrategyReviewSerializationPreviewFormat>
> = {
  'defensive-vs-aggressive-json-preview': 'json',
  'creator-led-markdown-preview': 'markdown',
  'wallet-led-text-preview': 'text',
  'manipulation-avoidance-metadata-preview': 'metadata',
  'no-action-safety-json-preview': 'json',
  'insufficient-data-markdown-preview': 'markdown',
  'high-score-positive-text-preview': 'text',
  'high-score-false-positive-metadata-preview': 'metadata',
  'missed-opportunity-json-preview': 'json',
  'drawdown-contained-markdown-preview': 'markdown',
  'mixed-signal-watchlist-text-preview': 'text',
  'false-positive-protection-metadata-preview': 'metadata',
  'malformed-input-safe-preview': 'json',
  'dashboard-ready-serialization-preview': 'json',
  'report-ready-serialization-preview': 'json',
  'safety-boundary-serialization-preview': 'metadata',
};

// ─── Sort helper ──────────────────────────────────────────────────────────────

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

// ─── Report reference builder ─────────────────────────────────────────────────

function buildReportReference(
  report: StrategyReviewReportFixture,
): StrategyReviewReportPreviewReference {
  return {
    sourcePhase: 41,
    sourceReportFixtureName: report.name,
    sourceReportFixtureKind: report.kind,
    sectionCount: report.summary.sectionCount,
    cardCount: report.summary.cardCount,
    tableCount: report.summary.tableCount,
    rowCount: report.summary.rowCount,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: ['Synthetic Phase 41 report reference for strategy review serialization preview fixture.'],
  };
}

// ─── Safety boundary builder ──────────────────────────────────────────────────

function buildSafetyBoundary(
  report: StrategyReviewReportFixture,
): StrategyReviewSerializationSafetyBoundary {
  return {
    ...report.safetyBoundary,
    strategyReviewSerializationPreview: true,
    strategyReviewJsonPreview: true,
    strategyReviewMarkdownPreview: true,
    strategyReviewTextPreview: true,
    strategyReviewMetadataPreview: true,
    strategyReviewActualFileExport: false,
    strategyReviewDownloadSupport: false,
    strategyReviewSerializationExternalNetwork: false,
    strategyReviewSerializationPersistence: false,
    strategyReviewSerializationExecution: false,
    strategyReviewSerializationTradingSignals: false,
    strategyReviewSerializationInvestmentAdvice: false,
  };
}

// ─── Meta builder ─────────────────────────────────────────────────────────────

function buildMeta(
  report: StrategyReviewReportFixture,
  notes: readonly string[],
): StrategyReviewSerializationPreviewMeta {
  return {
    phase: 42,
    sourceReportPhase: 41,
    sourcePhases: [40, 41, 42],
    fixtureOnly: true,
    syntheticOnly: true,
    liveData: false,
    externalNetwork: false,
    deterministic: true,
    localOnly: true,
    readOnly: true,
    inMemoryOnly: true,
    generatedAt: PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT,
    source: PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE,
    sourceReportFixtureName: report.name,
    sourceReportFixtureKind: report.kind,
    notes: [...notes].sort(),
  };
}

// ─── Content builders ─────────────────────────────────────────────────────────

function buildJsonContent(report: StrategyReviewReportFixture): string {
  const payload: Record<string, unknown> = {
    name: report.name,
    kind: report.kind,
    title: report.title,
    description: report.description,
    sectionCount: report.summary.sectionCount,
    cardCount: report.summary.cardCount,
    tableCount: report.summary.tableCount,
    rowCount: report.summary.rowCount,
    generatedAt: report.meta.generatedAt,
    source: report.meta.source,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    phase: 41,
  };
  return stablePrettyJsonStringify(payload);
}

function buildMarkdownContent(report: StrategyReviewReportFixture): string {
  const titleStr = report.title.replace(/\b\w/g, ch => ch.toUpperCase());
  const lines: string[] = [
    `# ${titleStr}`,
    '',
    `- Report Name: ${report.name}`,
    `- Report Kind: ${report.kind}`,
    `- Section Count: ${report.summary.sectionCount}`,
    `- Card Count: ${report.summary.cardCount}`,
    `- Table Count: ${report.summary.tableCount}`,
    `- Row Count: ${report.summary.rowCount}`,
    `- Generated At: ${report.meta.generatedAt}`,
    `- Source: ${report.meta.source}`,
    '',
    '## Safety Boundary',
    '',
    '- File export disabled',
    '- Download support disabled',
    '- Real scoring and ranking disabled',
    '- Execution and signals disabled',
    '- Advisory outputs disabled',
    '- Synthetic-only, local-only, deterministic',
    '',
    '## Sections',
    '',
    ...report.sections.flatMap(section => [
      `### ${section.title}`,
      '',
      ...section.cards.map(card => `- **${card.title}**: ${card.value}`),
      '',
    ]),
    '_Phase 41 synthetic strategy review report fixture — preview only._',
    '',
  ];
  return lines.join('\n');
}

function buildTextContent(report: StrategyReviewReportFixture): string {
  const lines: string[] = [
    `STRATEGY REVIEW REPORT: ${report.name.toUpperCase()}`,
    `Kind: ${report.kind}`,
    `Title: ${report.title}`,
    `Description: ${report.description}`,
    `Sections: ${report.summary.sectionCount}`,
    `Cards: ${report.summary.cardCount}`,
    `Tables: ${report.summary.tableCount}`,
    `Rows: ${report.summary.rowCount}`,
    `Generated At: ${report.meta.generatedAt}`,
    `Source: ${report.meta.source}`,
    '',
    'SAFETY BOUNDARY:',
    '  File export and download support disabled.',
    '  Real scoring, ranking, and execution disabled.',
    '  Advisory outputs disabled.',
    '  Synthetic-only, local-only, deterministic.',
    '',
    'SECTIONS:',
    ...report.sections.flatMap(section => [
      `  [${section.sectionId}] ${section.title}`,
      ...section.cards.map(card => `    ${card.title}: ${card.value}`),
    ]),
    '',
    'Phase 41 synthetic strategy review report fixture — preview only.',
  ];
  return lines.join('\n');
}

function buildMetadataPayload(
  report: StrategyReviewReportFixture,
): Record<string, unknown> {
  return {
    phase: 41,
    fixtureName: report.name,
    fixtureKind: report.kind,
    title: report.title,
    sectionCount: report.summary.sectionCount,
    cardCount: report.summary.cardCount,
    tableCount: report.summary.tableCount,
    rowCount: report.summary.rowCount,
    generatedAt: report.meta.generatedAt,
    source: report.meta.source,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    nonAdvisory: true,
    serializable: true,
  };
}

// ─── Summary builder ──────────────────────────────────────────────────────────

function buildSummary(
  fixture: Omit<StrategyReviewSerializationPreviewFixture, 'summary'>,
): StrategyReviewSerializationPreviewSummary {
  return {
    phase: 42,
    fixtureName: fixture.name,
    fixtureKind: fixture.kind,
    format: fixture.format,
    contentLength: fixture.contentLength,
    checksum: fixture.checksum,
    hasContent: fixture.content !== null,
    hasMetadataPayload: fixture.metadataPayload !== null,
    sourceReportFixtureName: fixture.reportReference.sourceReportFixtureName,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    serializable: true,
    nonAdvisory: true,
    generatedAt: PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT,
    notes: [
      'Synthetic strategy review serialization preview summary.',
      'No export or download behavior, and no scoring or execution behavior.',
    ],
  };
}

export function buildStrategyReviewSerializationSummary(
  fixture: StrategyReviewSerializationPreviewFixture,
): StrategyReviewSerializationPreviewSummary {
  return buildSummary(fixture);
}

// ─── Core fixture builder ─────────────────────────────────────────────────────

function buildCoreFixture(
  name: StrategyReviewSerializationPreviewFixtureName,
  kind: StrategyReviewSerializationPreviewFixtureKind,
  format: StrategyReviewSerializationPreviewFormat,
  report: StrategyReviewReportFixture,
  input: StrategyReviewSerializationBuildInput,
): StrategyReviewSerializationPreviewFixture {
  const title =
    typeof input.title === 'string' && input.title.trim() !== ''
      ? input.title.trim()
      : `${name.replace(/-/g, ' ')} serialization preview`
          .replace(/\b\w/g, ch => ch.toUpperCase());

  const description =
    typeof input.description === 'string' && input.description.trim() !== ''
      ? input.description.trim()
      : `Phase 42 synthetic serialization preview fixture (${format}) for ${report.name}.`;

  let content: string | null = null;
  let metadataPayload: Record<string, unknown> | null = null;

  switch (format) {
    case 'json':
      content = buildJsonContent(report);
      break;
    case 'markdown':
      content = buildMarkdownContent(report);
      break;
    case 'text':
      content = buildTextContent(report);
      break;
    case 'metadata':
      metadataPayload = buildMetadataPayload(report);
      break;
  }

  const rawContent = content ?? JSON.stringify(metadataPayload ?? {});
  const checksum = stableDeterministicChecksum(rawContent);
  const contentLength = rawContent.length;

  const reportReference = buildReportReference(report);
  const safetyBoundary = buildSafetyBoundary(report);
  const meta = buildMeta(report, [
    'Phase 42 strategy review serialization preview fixture metadata.',
    'Synthetic-only and deterministic.',
  ]);

  const withoutSummary = {
    name,
    kind,
    format,
    title,
    description,
    reportReference,
    content,
    metadataPayload,
    contentLength,
    checksum,
    meta,
    safetyBoundary,
    safeNotes: sortStrings([
      ...(input.safeNotes ?? []),
      'Synthetic fixture only.',
      'Local-only read-only fixture data.',
      'No export or download behavior.',
      'No real scoring, ranking, or execution behavior.',
    ]),
  };

  const summary = buildSummary(withoutSummary);

  const fixture: StrategyReviewSerializationPreviewFixture = {
    ...withoutSummary,
    summary,
  };

  return normalizeStrategyReviewSerializationPreviewFixture(fixture);
}

// ─── Public builder ───────────────────────────────────────────────────────────

export function buildStrategyReviewSerializationPreviewFixture(
  input: StrategyReviewSerializationBuildInput,
): StrategyReviewSerializationBuildResult {
  const fallbackName = STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES[0];
  const name = isValidStrategyReviewSerializationPreviewFixtureName(input.name)
    ? input.name
    : fallbackName;
  const kind = isValidStrategyReviewSerializationPreviewFixtureKind(input.kind)
    ? input.kind
    : SERIALIZATION_NAME_TO_KIND[name];
  const format = isValidStrategyReviewSerializationPreviewFormat(input.format)
    ? input.format
    : SERIALIZATION_NAME_TO_FORMAT[name];

  const sourceReportName: StrategyReviewReportFixtureName =
    STRATEGY_REVIEW_REPORT_FIXTURE_NAMES.includes(
      input.sourceReportFixtureName as StrategyReviewReportFixtureName,
    )
      ? input.sourceReportFixtureName
      : SERIALIZATION_NAME_TO_REPORT[name];

  const report = PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES.get(sourceReportName);

  if (!report) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'MISSING_SOURCE_REPORT',
            field: 'sourceReportFixtureName',
            message: `Could not resolve source report fixture: ${sourceReportName}.`,
            severity: 'error',
          },
        ],
      },
      safety: { safe: false, violations: ['Source report fixture missing.'] },
    };
  }

  const fixture = buildCoreFixture(name, kind, format, report, input);
  const validation = validateStrategyReviewSerializationPreviewFixture(fixture);
  const safety = validateStrategyReviewSerializationSafety(fixture);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}

// ─── Re-export for convenience ────────────────────────────────────────────────

export {
  normalizeStrategyReviewSerializationPreviewFixture,
  serializeStrategyReviewSerializationPreviewFixture,
  areStrategyReviewSerializationPreviewFixturesEqual,
};

// ─── List/get helpers ─────────────────────────────────────────────────────────

export function listStrategyReviewSerializationPreviewFixtures(
  fixturesMap: ReadonlyMap<
    StrategyReviewSerializationPreviewFixtureName,
    StrategyReviewSerializationPreviewFixture
  >,
): readonly StrategyReviewSerializationPreviewFixture[] {
  return [...STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES].map(n => {
    const f = fixturesMap.get(n);
    if (!f) throw new Error(`Missing Phase 42 fixture: ${n}`);
    return f;
  });
}

export function getStrategyReviewSerializationPreviewFixture(
  fixturesMap: ReadonlyMap<
    StrategyReviewSerializationPreviewFixtureName,
    StrategyReviewSerializationPreviewFixture
  >,
  name: StrategyReviewSerializationPreviewFixtureName,
): StrategyReviewSerializationPreviewFixture | undefined {
  return fixturesMap.get(name);
}

// ─── Typed report kind helper ─────────────────────────────────────────────────

export type { StrategyReviewReportFixtureKind };
