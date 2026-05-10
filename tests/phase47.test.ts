/**
 * Phase 47 — Strategy Review Export Audit Report View Models v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES,
  serializeStrategyReviewExportAuditReportFixture,
} from '../apps/dashboard/src/strategy-review-export-audit-report/index.js';
import {
  areStrategyReviewExportAuditReportViewModelsEqual,
  buildStrategyReviewExportAuditReportDetailViewModel,
  buildStrategyReviewExportAuditReportListItemViewModel,
  buildStrategyReviewExportAuditReportSummaryViewModel,
  buildStrategyReviewExportAuditReportViewModel,
  getStrategyReviewExportAuditReportViewModel,
  getStrategyReviewExportAuditReportViewModelCapabilities,
  isValidStrategyReviewExportAuditReportViewModelGeneratedAt,
  isValidStrategyReviewExportAuditReportViewModelKind,
  isValidStrategyReviewExportAuditReportViewModelName,
  isValidStrategyReviewExportAuditReportViewModelSeverity,
  isValidStrategyReviewExportAuditReportViewModelSource,
  isValidStrategyReviewExportAuditReportViewModelStatus,
  listStrategyReviewExportAuditReportViewModels,
  normalizeStrategyReviewExportAuditReportViewModel,
  PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT,
  PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE,
  serializeStrategyReviewExportAuditReportViewModel,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE,
  validateStrategyReviewExportAuditReportViewModel,
  validateStrategyReviewExportAuditReportViewModelSafety,
} from '../apps/dashboard/src/strategy-review-export-audit-report-view-models/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_47_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/strategy-review-export-audit-report-view-models');
const PHASE_47_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_47_SRC, file));

const FORBIDDEN_RUNTIME_PATTERNS: readonly RegExp[] = [
  /Date\.now\s*\(/,
  /new Date\s*\(/,
  /Math\.random\s*\(/,
  /randomUUID\s*\(/,
  /fetch\s*\(/,
  /new WebSocket\s*\(/,
  /axios\./,
  /writeFile\s*\(/,
  /createWriteStream\s*\(/,
  /setInterval\s*\(/,
  /setTimeout\s*\(/,
  /localStorage\./,
  /indexedDB\./,
  /signTransaction\s*\(/,
  /sendTransaction\s*\(/,
];

describe('Phase 47 constants and fixture-derived lists', () => {
  it('exports deterministic constants', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE).toBe(47);
    expect(PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT).toBe(
      '2026-01-03T00:00:00.000Z',
    );
    expect(PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE).toBe(
      'phase47_strategy_review_export_audit_report_view_models_v1',
    );
  });

  it('view-model names/kinds are unique and match Phase 46 count', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_KINDS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES.length,
    );
    expect(new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES).size).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES.length,
    );
    expect(new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_KINDS).size).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_KINDS.length,
    );
  });
});

describe('Phase 47 capabilities and propagation', () => {
  it('module capabilities include required true/false flags', () => {
    const capabilities = getStrategyReviewExportAuditReportViewModelCapabilities();
    expect(capabilities.strategyReviewExportAuditReportViewModels).toBe(true);
    expect(capabilities.syntheticStrategyReviewExportAuditReportViewModels).toBe(true);
    expect(capabilities.deterministicStrategyReviewExportAuditReportViewModels).toBe(true);
    expect(capabilities.localOnlyStrategyReviewExportAuditReportViewModels).toBe(true);
    expect(capabilities.readOnlyStrategyReviewExportAuditReportViewModels).toBe(true);
    expect(capabilities.fixtureDerivedStrategyReviewExportAuditReportViewModels).toBe(true);
    expect(capabilities.strategyReviewExportAuditReportViewModelLiveData).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelNetworkAccess).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelPersistence).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelFilesystemWrites).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelDownloads).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelUiRendering).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelExecution).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelRecommendations).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelTradingSignals).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportViewModelInvestmentAdvice).toBe(false);
  });

  it('dashboard and read-only-api surfaces include Phase 47 capability flags', () => {
    const dashboardCapabilities = getDashboardUiShellCapabilities();
    expect(dashboardCapabilities.strategyReviewExportAuditReportViewModels).toBe(true);
    expect(dashboardCapabilities.strategyReviewExportAuditReportViewModelUiRendering).toBe(false);

    const apiCapabilities = getLocalReadOnlyApiCapabilities();
    expect(apiCapabilities.strategyReviewExportAuditReportViewModels).toBe(true);
    expect(apiCapabilities.strategyReviewExportAuditReportViewModelNetworkAccess).toBe(false);
    expect(apiCapabilities.strategyReviewExportAuditReportViewModelExecution).toBe(false);
  });
});

describe('Phase 47 fixtures/list/map/get behavior', () => {
  it('exposes deterministic list/map/get utilities', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS).toHaveLength(
      PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP.size).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.size,
    );
    expect(listStrategyReviewExportAuditReportViewModels()).toHaveLength(
      PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES.length,
    );
    expect(getStrategyReviewExportAuditReportViewModel('unknown')).toBeNull();
  });

  it('maintains one-to-one linkage with Phase 46 source report fixtures', () => {
    for (const sourceReport of PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES) {
      const viewModel = getStrategyReviewExportAuditReportViewModel(
        `${sourceReport.reportName}-view-model`,
      );
      expect(viewModel).not.toBeNull();
      expect(viewModel?.sourceReportName).toBe(sourceReport.reportName);
      expect(viewModel?.sourceReportId).toBe(sourceReport.reportId);
      expect(viewModel?.sourceAuditId).toBe(sourceReport.sourceAuditId);
      expect(viewModel?.sourceQueueReference).toBe(sourceReport.sourceQueueReference.sourceQueueFixtureName);
    }
  });
});

describe('Phase 47 builders and shape integrity', () => {
  it('builds list/detail/summary/full view models deterministically', () => {
    const source = PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES[0]!;
    const listItem = buildStrategyReviewExportAuditReportListItemViewModel(source);
    const detail = buildStrategyReviewExportAuditReportDetailViewModel(source);
    const summary = buildStrategyReviewExportAuditReportSummaryViewModel(source);
    const fullA = buildStrategyReviewExportAuditReportViewModel({ sourceReportFixture: source });
    const fullB = buildStrategyReviewExportAuditReportViewModel({ sourceReportFixture: source });

    expect(listItem.viewModelId).toBe(detail.viewModelId);
    expect(summary.summaryCards.length).toBeGreaterThan(0);
    expect(detail.detailSections.length).toBeGreaterThan(0);
    expect(detail.evidenceItems.length).toBeGreaterThan(0);
    expect(serializeStrategyReviewExportAuditReportViewModel(fullA)).toBe(
      serializeStrategyReviewExportAuditReportViewModel(fullB),
    );
  });

  it('ensures ordered summary cards/detail sections/evidence/safety/validation badges', () => {
    for (const viewModel of listStrategyReviewExportAuditReportViewModels()) {
      expect(new Set(viewModel.summaryCards.map(card => card.order)).size).toBe(
        viewModel.summaryCards.length,
      );
      expect(new Set(viewModel.detailSections.map(section => section.order)).size).toBe(
        viewModel.detailSections.length,
      );
      expect(new Set(viewModel.evidenceItems.map(item => item.order)).size).toBe(
        viewModel.evidenceItems.length,
      );
      expect(new Set(viewModel.safetyBadges.map(badge => badge.order)).size).toBe(
        viewModel.safetyBadges.length,
      );
      expect(new Set(viewModel.validationBadges.map(badge => badge.order)).size).toBe(
        viewModel.validationBadges.length,
      );
      expect(viewModel.limitationItems.length).toBeGreaterThan(0);
    }
  });

  it('ensures every detail section evidence reference resolves to an evidence item', () => {
    for (const viewModel of listStrategyReviewExportAuditReportViewModels()) {
      const evidenceIds = new Set(viewModel.evidenceItems.map(item => item.evidenceId));
      for (const section of viewModel.detailSections) {
        for (const evidenceId of section.evidenceReferenceIds) {
          expect(evidenceIds.has(evidenceId)).toBe(true);
        }
      }
    }
  });
});

describe('Phase 47 normalization/serialization/equality/validation', () => {
  it('normalizes scrambled arrays deterministically', () => {
    const viewModel = listStrategyReviewExportAuditReportViewModels()[0]!;
    const normalized = normalizeStrategyReviewExportAuditReportViewModel({
      ...viewModel,
      summaryCards: [...viewModel.summaryCards].reverse(),
      detailSections: [...viewModel.detailSections].reverse(),
      evidenceItems: [...viewModel.evidenceItems].reverse(),
    });
    expect(normalized.summaryCards[0]?.order).toBe(1);
    expect(normalized.detailSections[0]?.order).toBe(1);
    expect(normalized.evidenceItems[0]?.order).toBe(1);
  });

  it('serializes and compares equality deterministically', () => {
    const viewModel = listStrategyReviewExportAuditReportViewModels()[1]!;
    expect(serializeStrategyReviewExportAuditReportViewModel(viewModel)).toBe(
      serializeStrategyReviewExportAuditReportViewModel(viewModel),
    );
    expect(areStrategyReviewExportAuditReportViewModelsEqual(viewModel, viewModel)).toBe(true);
    expect(
      areStrategyReviewExportAuditReportViewModelsEqual(viewModel, {
        ...viewModel,
        displayTitle: `${viewModel.displayTitle} changed`,
      }),
    ).toBe(false);
  });

  it('validates valid fixtures and rejects corrupted fixtures', () => {
    const viewModel = listStrategyReviewExportAuditReportViewModels()[0]!;
    expect(validateStrategyReviewExportAuditReportViewModel(viewModel).valid).toBe(true);

    const invalidPhase = { ...viewModel, phase: 48 };
    expect(validateStrategyReviewExportAuditReportViewModel(invalidPhase).valid).toBe(false);

    const duplicateCardOrder = {
      ...viewModel,
      summaryCards: viewModel.summaryCards.map((card, index) =>
        index === 1 ? { ...card, order: viewModel.summaryCards[0]!.order } : card,
      ),
    };
    expect(validateStrategyReviewExportAuditReportViewModel(duplicateCardOrder).valid).toBe(false);

    const orphanEvidence = {
      ...viewModel,
      detailSections: viewModel.detailSections.map((section, index) =>
        index === 0 ? { ...section, evidenceReferenceIds: ['missing-evidence-id'] } : section,
      ),
    };
    expect(validateStrategyReviewExportAuditReportViewModel(orphanEvidence).valid).toBe(false);

    const unsafeCapability = {
      ...viewModel,
      capabilityFlags: {
        ...viewModel.capabilityFlags,
        strategyReviewExportAuditReportViewModelExecution: true,
      },
    };
    expect(validateStrategyReviewExportAuditReportViewModel(unsafeCapability).valid).toBe(false);
  });

  it('safety validator rejects unsafe payloads', () => {
    const safetyResult = validateStrategyReviewExportAuditReportViewModelSafety({
      note: 'fetch(https://example.com) buy now with wallet',
    });
    expect(safetyResult.safe).toBe(false);
    expect(safetyResult.violations.length).toBeGreaterThan(0);
  });
});

describe('Phase 47 guard helpers and source immutability', () => {
  it('guard helpers accept valid values and reject invalid values', () => {
    const viewModel = listStrategyReviewExportAuditReportViewModels()[0]!;
    expect(isValidStrategyReviewExportAuditReportViewModelName(viewModel.viewModelName)).toBe(true);
    expect(isValidStrategyReviewExportAuditReportViewModelKind(viewModel.viewModelKind)).toBe(true);
    expect(isValidStrategyReviewExportAuditReportViewModelStatus(viewModel.statusLabel)).toBe(true);
    expect(isValidStrategyReviewExportAuditReportViewModelSeverity(viewModel.severityLabel)).toBe(true);
    expect(
      isValidStrategyReviewExportAuditReportViewModelGeneratedAt(
        PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT,
      ),
    ).toBe(true);
    expect(
      isValidStrategyReviewExportAuditReportViewModelSource(
        PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE,
      ),
    ).toBe(true);

    expect(isValidStrategyReviewExportAuditReportViewModelName('unknown')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportViewModelKind('unknown')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportViewModelStatus('unknown')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportViewModelSeverity('unknown')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportViewModelGeneratedAt('invalid')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportViewModelSource('invalid')).toBe(false);
  });

  it('does not mutate source Phase 46 fixtures while building view models', () => {
    const source = PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES[0]!;
    const before = serializeStrategyReviewExportAuditReportFixture(source);
    buildStrategyReviewExportAuditReportViewModel({ sourceReportFixture: source });
    const after = serializeStrategyReviewExportAuditReportFixture(source);
    expect(before).toBe(after);
  });
});

describe('Phase 47 static source safety checks', () => {
  it('phase 47 source files avoid forbidden runtime patterns', () => {
    for (const filePath of PHASE_47_FILES) {
      const content = readFileSync(filePath, 'utf8');
      for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
        expect(content).not.toMatch(pattern);
      }
    }
  });
});
