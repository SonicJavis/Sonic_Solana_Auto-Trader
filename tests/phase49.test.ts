/**
 * Phase 49 — Strategy Review Export Audit Report API Contract Selectors v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
} from '../apps/dashboard/src/strategy-review-export-audit-report-view-models/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
  serializeStrategyReviewExportAuditReportApiContract,
} from '../apps/dashboard/src/strategy-review-export-audit-report-contracts/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE,
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_GENERATED_AT,
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_SOURCE,
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTOR_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT_SELECTOR,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT_SELECTOR,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS,
  listStrategyReviewExportAuditReportApiContractSelectors,
  getStrategyReviewExportAuditReportApiContractSelector,
  selectStrategyReviewExportAuditReportListApiContract,
  selectStrategyReviewExportAuditReportDetailApiContract,
  selectStrategyReviewExportAuditReportSummaryApiContract,
  selectStrategyReviewExportAuditReportErrorApiContract,
  buildStrategyReviewExportAuditReportApiContractSelectorQuery,
  buildStrategyReviewExportAuditReportApiContractSelectorResult,
  buildStrategyReviewExportAuditReportApiContractSelectorFixture,
  validateStrategyReviewExportAuditReportApiContractSelector,
  validateStrategyReviewExportAuditReportApiContractSelectorResult,
  validateStrategyReviewExportAuditReportApiContractSelectorSafety,
  normalizeStrategyReviewExportAuditReportApiContractSelector,
  serializeStrategyReviewExportAuditReportApiContractSelector,
  areStrategyReviewExportAuditReportApiContractSelectorsEqual,
  getStrategyReviewExportAuditReportApiContractSelectorCapabilities,
  isValidStrategyReviewExportAuditReportApiContractSelectorName,
  isValidStrategyReviewExportAuditReportApiContractSelectorKind,
  isValidStrategyReviewExportAuditReportApiContractSelectorGeneratedAt,
  isValidStrategyReviewExportAuditReportApiContractSelectorSource,
  stableDeterministicSelectorChecksum,
} from '../apps/dashboard/src/strategy-review-export-audit-report-contract-selectors/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE as ROOT_SELECTOR_PHASE,
  listStrategyReviewExportAuditReportApiContractSelectors as listRootSelectors,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_49_SRC = resolve(
  REPO_ROOT,
  'apps/dashboard/src/strategy-review-export-audit-report-contract-selectors',
);
const PHASE_49_FILES = [
  'types.ts',
  'builders.ts',
  'fixtures.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

function cloneSelector<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 49 — constants and capabilities', () => {
  it('exports deterministic constants', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE).toBe(49);
    expect(ROOT_SELECTOR_PHASE).toBe(49);
    expect(PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_GENERATED_AT).toBe(
      '2026-01-05T00:00:00.000Z',
    );
    expect(PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_SOURCE).toBe(
      'phase49_strategy_review_export_audit_report_api_contract_selectors_v1',
    );
    expect(PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_VERSION).toBe(
      '1.0.0',
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_KINDS).toEqual([
      'list',
      'detail',
      'summary',
      'error',
    ]);
  });

  it('module capabilities include required true/false flags', () => {
    const capabilities = getStrategyReviewExportAuditReportApiContractSelectorCapabilities();
    expect(capabilities.strategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(capabilities.syntheticStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(capabilities.deterministicStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(capabilities.localOnlyStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(capabilities.readOnlyStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(capabilities.fixtureDerivedStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(capabilities.pureStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(capabilities.strategyReviewExportAuditReportApiContractSelectorNetworkAccess).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportApiContractSelectorExecution).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportApiContractSelectorRecommendations).toBe(false);
  });

  it('dashboard and read-only-api surfaces include Phase 49 capability flags', () => {
    const dashboardCapabilities = getDashboardUiShellCapabilities();
    expect(dashboardCapabilities.strategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(dashboardCapabilities.pureStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(dashboardCapabilities.strategyReviewExportAuditReportApiContractSelectorRuntimeRequests).toBe(false);

    const apiCapabilities = getLocalReadOnlyApiCapabilities();
    expect(apiCapabilities.strategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(apiCapabilities.pureStrategyReviewExportAuditReportApiContractSelectors).toBe(true);
    expect(apiCapabilities.strategyReviewExportAuditReportApiContractSelectorNetworkAccess).toBe(false);
  });
});

describe('Phase 49 — selector fixtures and linkage', () => {
  it('has one selector per Phase 48 contract', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS.length,
    );
  });

  it('detail selector count matches Phase 47 view-model count', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length,
    );
  });

  it('selector names and IDs are unique', () => {
    const names = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.map(selector => selector.selectorName);
    const ids = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.map(selector => selector.selectorId);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_NAMES).size).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_NAMES.length,
    );
  });

  it('selector map covers every selector', () => {
    for (const selector of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS) {
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_MAP.get(selector.selectorName)).toBe(
        selector,
      );
    }
  });

  it('every selector references a real Phase 48 contract', () => {
    for (const selector of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS) {
      for (const contractName of selector.sourceContractNames) {
        expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP.has(contractName)).toBe(true);
      }
    }
  });

  it('every detail selector references exactly one detail contract and one view model', () => {
    for (const selector of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS) {
      expect(selector.selectorKind).toBe('detail');
      expect(selector.sourceContractIds).toHaveLength(1);
      expect(selector.sourceViewModelIds).toHaveLength(1);
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTOR_MAP.get(selector.sourceViewModelIds[0]!)).toBe(selector);
    }
  });
});

describe('Phase 49 — selector helpers', () => {
  it('list/get helpers expose deterministic selector fixtures', () => {
    expect(listStrategyReviewExportAuditReportApiContractSelectors()).toEqual(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS,
    );
    expect(listRootSelectors()).toEqual(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS);
    expect(
      getStrategyReviewExportAuditReportApiContractSelector(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR.selectorName,
      ),
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR);
    expect(getStrategyReviewExportAuditReportApiContractSelector('unknown')).toBeNull();
  });

  it('select helpers return deterministic Phase 48 contracts', () => {
    expect(selectStrategyReviewExportAuditReportListApiContract()).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    expect(selectStrategyReviewExportAuditReportSummaryApiContract()).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
    );
    expect(selectStrategyReviewExportAuditReportErrorApiContract()).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
    );
    expect(selectStrategyReviewExportAuditReportErrorApiContract('invalid-id')).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
    );

    const detailContract = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS[0]!;
    expect(selectStrategyReviewExportAuditReportDetailApiContract(detailContract.data.viewModelId)).toBe(
      detailContract,
    );
    expect(selectStrategyReviewExportAuditReportDetailApiContract('')).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
    );
    expect(selectStrategyReviewExportAuditReportDetailApiContract('missing-view-model')).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
    );
  });
});

describe('Phase 49 — queries, results, builders, normalization', () => {
  it('builds deterministic list query/result/selector fixtures', () => {
    const queryA = buildStrategyReviewExportAuditReportApiContractSelectorQuery({
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    });
    const queryB = buildStrategyReviewExportAuditReportApiContractSelectorQuery({
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    });
    expect(queryA).toEqual(queryB);
    expect(queryA.pagination?.totalCount).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length);
    expect(queryA.filters.length).toBeGreaterThan(0);
    expect(queryA.sort?.field).toBe('viewModelName');

    const resultA = buildStrategyReviewExportAuditReportApiContractSelectorResult({
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
      queryId: queryA.queryId,
    });
    const resultB = buildStrategyReviewExportAuditReportApiContractSelectorResult({
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
      queryId: queryA.queryId,
    });
    expect(resultA).toEqual(resultB);
    expect(resultA.contract).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT);
    expect(resultA.meta.selectedContractCount).toBe(1);

    const selectorA = buildStrategyReviewExportAuditReportApiContractSelectorFixture({
      selectorName: 'strategy-review-export-audit-report-list-contract-selector',
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
      query: queryA,
      result: resultA,
    });
    const selectorB = buildStrategyReviewExportAuditReportApiContractSelectorFixture({
      selectorName: 'strategy-review-export-audit-report-list-contract-selector',
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
      query: queryB,
      result: resultB,
    });
    expect(serializeStrategyReviewExportAuditReportApiContractSelector(selectorA)).toBe(
      serializeStrategyReviewExportAuditReportApiContractSelector(selectorB),
    );
  });

  it('detail, summary, and error selector fixtures expose expected query/result structure', () => {
    const detailSelector = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS[0]!;
    expect(detailSelector.query.detailContractName).toBe(detailSelector.query.contractName);
    expect(detailSelector.query.pagination).toBeNull();
    expect(detailSelector.result.statusCode).toBe(200);
    expect(detailSelector.result.contract.contractKind).toBe('detail');
    expect(detailSelector.result.contract.data.limitationItems.length).toBeGreaterThan(0);
    expect(detailSelector.result.contract.data.nextPhaseNotes.length).toBeGreaterThan(0);

    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR.result.contract.contractKind).toBe(
      'summary',
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT_SELECTOR.result.statusCode).toBe(
      404,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT_SELECTOR.result.statusCode).toBe(
      422,
    );
  });

  it('normalizes scrambled selector data and supports equality helpers', () => {
    const detailSelector = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS[0]!;
    const scrambled = {
      ...detailSelector,
      sourceContractIds: [...detailSelector.sourceContractIds].reverse(),
      sourceContractNames: [...detailSelector.sourceContractNames].reverse(),
      sourceViewModelIds: [...detailSelector.sourceViewModelIds].reverse(),
      sourceReportIds: [...detailSelector.sourceReportIds].reverse(),
      sourceAuditIds: [...detailSelector.sourceAuditIds].reverse(),
      query: {
        ...detailSelector.query,
        filters: [...detailSelector.query.filters].reverse(),
      },
    };
    expect(normalizeStrategyReviewExportAuditReportApiContractSelector(scrambled)).toEqual(
      normalizeStrategyReviewExportAuditReportApiContractSelector(detailSelector),
    );
    expect(
      areStrategyReviewExportAuditReportApiContractSelectorsEqual(scrambled, detailSelector),
    ).toBe(true);
  });

  it('exports stable helper guards and checksum utilities', () => {
    expect(
      isValidStrategyReviewExportAuditReportApiContractSelectorName(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR.selectorName,
      ),
    ).toBe(true);
    expect(isValidStrategyReviewExportAuditReportApiContractSelectorName('bad-selector')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportApiContractSelectorKind('detail')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportApiContractSelectorKind('bad')).toBe(false);
    expect(
      isValidStrategyReviewExportAuditReportApiContractSelectorGeneratedAt(
        PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_GENERATED_AT,
      ),
    ).toBe(true);
    expect(
      isValidStrategyReviewExportAuditReportApiContractSelectorSource(
        PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_SOURCE,
      ),
    ).toBe(true);
    expect(stableDeterministicSelectorChecksum('phase49')).toBe(
      stableDeterministicSelectorChecksum('phase49'),
    );
  });
});

describe('Phase 49 — validation and safety', () => {
  it('all prebuilt selectors and selector results validate successfully', () => {
    for (const selector of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS) {
      expect(validateStrategyReviewExportAuditReportApiContractSelector(selector).valid).toBe(true);
      expect(validateStrategyReviewExportAuditReportApiContractSelectorResult(selector.result).valid).toBe(
        true,
      );
      expect(validateStrategyReviewExportAuditReportApiContractSelectorSafety(selector).safe).toBe(true);
    }
  });

  it('rejects corrupted selector fields and unsafe capability flips', () => {
    const invalidPhase = {
      ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR),
      phase: 999,
    };
    expect(validateStrategyReviewExportAuditReportApiContractSelector(invalidPhase).valid).toBe(false);

    const invalidQuery = {
      ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR),
      query: {
        ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR.query),
        queryKind: 'error',
      },
    };
    expect(validateStrategyReviewExportAuditReportApiContractSelector(invalidQuery).valid).toBe(false);

    const invalidSources = {
      ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS[0]!),
      sourceViewModelIds: ['unknown-view-model'],
    };
    expect(validateStrategyReviewExportAuditReportApiContractSelector(invalidSources).valid).toBe(false);

    const invalidCapabilities = {
      ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR),
      capabilityFlags: {
        ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR.capabilityFlags),
        strategyReviewExportAuditReportApiContractSelectorExecution: true,
      },
    };
    expect(validateStrategyReviewExportAuditReportApiContractSelector(invalidCapabilities).valid).toBe(
      false,
    );
  });

  it('rejects corrupted selector results and safety violations', () => {
    const invalidResult = {
      ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT_SELECTOR.result),
      contracts: [],
    };
    expect(validateStrategyReviewExportAuditReportApiContractSelectorResult(invalidResult).valid).toBe(
      false,
    );

    const unsafe = {
      ...cloneSelector(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR),
      unsafeText: 'https://unsafe.example sendTransaction privateKey',
    };
    const safety = validateStrategyReviewExportAuditReportApiContractSelectorSafety(unsafe);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
  });
});

describe('Phase 49 — source immutability and file structure', () => {
  it('does not mutate Phase 48 source contracts when building selectors', () => {
    const before = serializeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    buildStrategyReviewExportAuditReportApiContractSelectorQuery({
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    });
    buildStrategyReviewExportAuditReportApiContractSelectorResult({
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    });
    buildStrategyReviewExportAuditReportApiContractSelectorFixture({
      selectorName: 'strategy-review-export-audit-report-list-contract-selector',
      selectorKind: 'list',
      contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    });
    const after = serializeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    expect(after).toBe(before);
  });

  it('all Phase 49 source files exist', () => {
    for (const file of PHASE_49_FILES) {
      const content = readFileSync(resolve(PHASE_49_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('does not use Date.now, new Date, Math.random, or timer APIs', () => {
    for (const file of PHASE_49_FILES) {
      const content = readFileSync(resolve(PHASE_49_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
    }
  });

  it('does not contain runtime network, filesystem, or server implementation calls', () => {
    for (const file of PHASE_49_FILES) {
      const content = readFileSync(resolve(PHASE_49_SRC, file), 'utf-8');
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
