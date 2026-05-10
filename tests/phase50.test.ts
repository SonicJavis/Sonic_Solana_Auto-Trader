/**
 * Phase 50 — Strategy Review Export Audit Report Selector View Models v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR,
  serializeStrategyReviewExportAuditReportApiContractSelector,
} from '../apps/dashboard/src/strategy-review-export-audit-report-contract-selectors/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE,
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_GENERATED_AT,
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SOURCE,
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_SELECTOR_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_SELECTOR_VIEW_MODEL,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_SELECTOR_VIEW_MODELS,
  listStrategyReviewExportAuditReportSelectorViewModels,
  getStrategyReviewExportAuditReportSelectorViewModel,
  buildStrategyReviewExportAuditReportSelectorViewModel,
  buildStrategyReviewExportAuditReportSelectorListViewModel,
  buildStrategyReviewExportAuditReportSelectorDetailViewModel,
  buildStrategyReviewExportAuditReportSelectorSummaryViewModel,
  buildStrategyReviewExportAuditReportSelectorErrorViewModel,
  validateStrategyReviewExportAuditReportSelectorViewModel,
  validateStrategyReviewExportAuditReportSelectorViewModelSafety,
  normalizeStrategyReviewExportAuditReportSelectorViewModel,
  serializeStrategyReviewExportAuditReportSelectorViewModel,
  areStrategyReviewExportAuditReportSelectorViewModelsEqual,
  getStrategyReviewExportAuditReportSelectorViewModelCapabilities,
  isValidStrategyReviewExportAuditReportSelectorViewModelName,
  isValidStrategyReviewExportAuditReportSelectorViewModelKind,
  isValidStrategyReviewExportAuditReportSelectorViewModelGeneratedAt,
  isValidStrategyReviewExportAuditReportSelectorViewModelSource,
  stableDeterministicSelectorViewModelChecksum,
} from '../apps/dashboard/src/strategy-review-export-audit-report-selector-view-models/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE as ROOT_SELECTOR_VIEW_MODEL_PHASE,
  listStrategyReviewExportAuditReportSelectorViewModels as listRootSelectorViewModels,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_50_SRC = resolve(
  REPO_ROOT,
  'apps/dashboard/src/strategy-review-export-audit-report-selector-view-models',
);
const PHASE_50_FILES = [
  'types.ts',
  'builders.ts',
  'fixtures.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 50 — constants and capabilities', () => {
  it('exports deterministic constants', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE).toBe(50);
    expect(ROOT_SELECTOR_VIEW_MODEL_PHASE).toBe(50);
    expect(PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_GENERATED_AT).toBe(
      '2026-01-06T00:00:00.000Z',
    );
    expect(PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SOURCE).toBe(
      'phase50_strategy_review_export_audit_report_selector_view_models_v1',
    );
    expect(PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_VERSION).toBe('1.0.0');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_KINDS).toEqual([
      'list',
      'detail',
      'summary',
      'error',
    ]);
  });

  it('module and surface capabilities include required true/false flags', () => {
    const capabilities = getStrategyReviewExportAuditReportSelectorViewModelCapabilities();
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(capabilities.syntheticStrategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(capabilities.deterministicStrategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(capabilities.localOnlyStrategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(capabilities.readOnlyStrategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(capabilities.fixtureDerivedStrategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModelRuntimeRequests).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModelExecution).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModelRecommendations).toBe(false);

    const dashboardCapabilities = getDashboardUiShellCapabilities();
    expect(dashboardCapabilities.strategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(dashboardCapabilities.strategyReviewExportAuditReportSelectorViewModelRuntimeRequests).toBe(false);

    const apiCapabilities = getLocalReadOnlyApiCapabilities();
    expect(apiCapabilities.strategyReviewExportAuditReportSelectorViewModels).toBe(true);
    expect(apiCapabilities.strategyReviewExportAuditReportSelectorViewModelNetworkAccess).toBe(false);
  });
});

describe('Phase 50 — fixtures and Phase 49 linkage', () => {
  it('has exactly one selector view model per Phase 49 selector', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_SELECTOR_VIEW_MODELS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_SELECTOR_VIEW_MODELS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS.length,
    );
  });

  it('names and IDs are unique and map/list helpers are deterministic', () => {
    const names = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(model => model.viewModelName);
    const ids = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(model => model.viewModelId);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_NAMES).size).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_NAMES.length,
    );

    expect(listStrategyReviewExportAuditReportSelectorViewModels()).toEqual(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
    );
    expect(listRootSelectorViewModels()).toEqual(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS);
    expect(
      getStrategyReviewExportAuditReportSelectorViewModel(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL.viewModelName,
      ),
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL);
    expect(getStrategyReviewExportAuditReportSelectorViewModel('unknown')).toBeNull();

    for (const viewModel of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS) {
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP.get(viewModel.viewModelName)).toBe(
        viewModel,
      );
    }
  });

  it('every view model references a real Phase 49 selector and preserves source linkage arrays', () => {
    for (const viewModel of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS) {
      const selector = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.find(
        source => source.selectorName === viewModel.sourceSelectorName,
      );
      expect(selector).toBeDefined();
      expect(viewModel.sourceSelectorId).toBe(selector?.selectorId);
      expect(viewModel.sourceSelectorKind).toBe(selector?.selectorKind);
      expect([...viewModel.sourceContractIds].sort()).toEqual([...(selector?.sourceContractIds ?? [])].sort());
      expect([...viewModel.sourceViewModelIds].sort()).toEqual([...(selector?.sourceViewModelIds ?? [])].sort());
      expect([...viewModel.sourceReportIds].sort()).toEqual([...(selector?.sourceReportIds ?? [])].sort());
      expect([...viewModel.sourceAuditIds].sort()).toEqual([...(selector?.sourceAuditIds ?? [])].sort());
    }
  });
});

describe('Phase 50 — builders, panels, normalization, serialization', () => {
  it('builds deterministic list/detail/summary/error selector view models', () => {
    const listA = buildStrategyReviewExportAuditReportSelectorListViewModel({
      sourceSelector: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
    });
    const listB = buildStrategyReviewExportAuditReportSelectorListViewModel({
      sourceSelector: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
    });
    expect(listA).toEqual(listB);
    expect(listA.viewModelKind).toBe('list');

    const detailSelector = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS[0]!;
    const detail = buildStrategyReviewExportAuditReportSelectorDetailViewModel({
      sourceSelector: detailSelector,
    });
    expect(detail.viewModelKind).toBe('detail');
    expect(detail.queryPanel.queryKind).toBe('detail');

    const summary = buildStrategyReviewExportAuditReportSelectorSummaryViewModel({
      sourceSelector: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR,
    });
    expect(summary.viewModelKind).toBe('summary');
    expect(summary.resultPanel.statusCode).toBe(200);

    const errorSelector = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS[0]!;
    const error = buildStrategyReviewExportAuditReportSelectorErrorViewModel({
      sourceSelector: errorSelector,
    });
    expect(error.viewModelKind).toBe('error');
    expect([404, 422]).toContain(error.resultPanel.statusCode);
  });

  it('generic builder produces deterministic panel and metadata shapes', () => {
    const sourceSelector = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS[0]!;
    const model = buildStrategyReviewExportAuditReportSelectorViewModel({ sourceSelector });
    expect(model.queryPanel.readOnly).toBe(true);
    expect(model.queryPanel.fixtureOnly).toBe(true);
    expect(model.resultPanel.contractCount).toBeGreaterThan(0);
    expect(model.summaryCards.length).toBeGreaterThan(0);
    expect(model.detailRows.length).toBeGreaterThan(0);
    expect(model.safetyBadges.length).toBeGreaterThan(0);
    expect(model.validationBadges.length).toBeGreaterThan(0);
    expect(model.limitationItems.length).toBeGreaterThan(0);
    expect(model.nextPhaseNotes.length).toBeGreaterThan(0);
    expect(model.meta.phase).toBe(50);
    expect(model.meta.sourceSelectorPhase).toBe(49);
    expect(model.meta.sourceContractPhase).toBe(48);
    expect(model.meta.sourceViewModelPhase).toBe(47);
    expect(model.meta.sourceReportPhase).toBe(46);
    expect(model.meta.sourceAuditPhase).toBe(45);
  });

  it('normalization, serialization, equality, and guard helpers are stable', () => {
    const base = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS[0]!;
    const scrambled = {
      ...base,
      sourceContractIds: [...base.sourceContractIds].reverse(),
      sourceViewModelIds: [...base.sourceViewModelIds].reverse(),
      sourceReportIds: [...base.sourceReportIds].reverse(),
      sourceAuditIds: [...base.sourceAuditIds].reverse(),
      queryPanel: {
        ...base.queryPanel,
        filterLabels: [...base.queryPanel.filterLabels].reverse(),
      },
      summaryCards: [...base.summaryCards].reverse(),
      detailRows: [...base.detailRows].reverse(),
      safetyBadges: [...base.safetyBadges].reverse(),
      validationBadges: [...base.validationBadges].reverse(),
    };
    expect(normalizeStrategyReviewExportAuditReportSelectorViewModel(scrambled)).toEqual(
      normalizeStrategyReviewExportAuditReportSelectorViewModel(base),
    );
    expect(
      areStrategyReviewExportAuditReportSelectorViewModelsEqual(scrambled, base),
    ).toBe(true);
    expect(serializeStrategyReviewExportAuditReportSelectorViewModel(scrambled)).toBe(
      serializeStrategyReviewExportAuditReportSelectorViewModel(base),
    );
    expect(isValidStrategyReviewExportAuditReportSelectorViewModelName(base.viewModelName)).toBe(true);
    expect(isValidStrategyReviewExportAuditReportSelectorViewModelName('bad')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportSelectorViewModelKind(base.viewModelKind)).toBe(true);
    expect(isValidStrategyReviewExportAuditReportSelectorViewModelKind('bad')).toBe(false);
    expect(
      isValidStrategyReviewExportAuditReportSelectorViewModelGeneratedAt(
        PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_GENERATED_AT,
      ),
    ).toBe(true);
    expect(
      isValidStrategyReviewExportAuditReportSelectorViewModelSource(
        PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SOURCE,
      ),
    ).toBe(true);
    expect(stableDeterministicSelectorViewModelChecksum('phase50')).toBe(
      stableDeterministicSelectorViewModelChecksum('phase50'),
    );
  });
});

describe('Phase 50 — validation, safety, and source immutability', () => {
  it('all prebuilt selector view models validate and pass safety checks', () => {
    for (const model of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS) {
      expect(validateStrategyReviewExportAuditReportSelectorViewModel(model).valid).toBe(true);
      expect(validateStrategyReviewExportAuditReportSelectorViewModelSafety(model).safe).toBe(true);
    }
  });

  it('rejects structural corruption and unsafe capability flips', () => {
    const invalidPhase = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL),
      phase: 999,
    };
    expect(validateStrategyReviewExportAuditReportSelectorViewModel(invalidPhase).valid).toBe(false);

    const invalidSource = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL),
      sourceSelectorName: 'unknown-selector',
    };
    expect(validateStrategyReviewExportAuditReportSelectorViewModel(invalidSource).valid).toBe(false);

    const invalidCapabilities = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_SELECTOR_VIEW_MODEL),
      capabilityFlags: {
        ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_SELECTOR_VIEW_MODEL.capabilityFlags),
        strategyReviewExportAuditReportSelectorViewModelExecution: true,
      },
    };
    expect(validateStrategyReviewExportAuditReportSelectorViewModel(invalidCapabilities).valid).toBe(
      false,
    );
  });

  it('rejects unsafe content and does not mutate Phase 49 source selectors', () => {
    const unsafe = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL),
      unsafeText: 'https://unsafe.example privateKey signTransaction',
    };
    const safety = validateStrategyReviewExportAuditReportSelectorViewModelSafety(unsafe);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
    expect(validateStrategyReviewExportAuditReportSelectorViewModel(unsafe).valid).toBe(false);

    const before = serializeStrategyReviewExportAuditReportApiContractSelector(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
    );
    buildStrategyReviewExportAuditReportSelectorViewModel({
      sourceSelector: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
    });
    const after = serializeStrategyReviewExportAuditReportApiContractSelector(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
    );
    expect(after).toBe(before);
  });
});

describe('Phase 50 — source file structure and unsafe pattern absence', () => {
  it('all Phase 50 source files exist', () => {
    for (const file of PHASE_50_FILES) {
      const content = readFileSync(resolve(PHASE_50_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('does not use Date.now, new Date, Math.random, or timer APIs', () => {
    for (const file of PHASE_50_FILES) {
      const content = readFileSync(resolve(PHASE_50_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
    }
  });

  it('does not contain runtime network/filesystem/server/rendering implementation calls', () => {
    for (const file of PHASE_50_FILES) {
      const content = readFileSync(resolve(PHASE_50_SRC, file), 'utf-8');
      if (file !== 'validation.ts') {
        expect(content).not.toMatch(/fetch\(/);
        expect(content).not.toMatch(/writeFile\(/);
        expect(content).not.toMatch(/createWriteStream\(/);
        expect(content).not.toMatch(/document\./);
        expect(content).not.toMatch(/window\./);
        expect(content).not.toMatch(/localStorage\./);
        expect(content).not.toMatch(/indexedDB\./);
        expect(content).not.toMatch(/\bfastify\b/i);
        expect(content).not.toMatch(/\bexpress\b/i);
      }
      expect(content).not.toMatch(/listen\(/);
      expect(content).not.toMatch(/createServer\(/);
    }
  });
});
