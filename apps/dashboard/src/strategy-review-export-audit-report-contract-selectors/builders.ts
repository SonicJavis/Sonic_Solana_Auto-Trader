/**
 * Phase 49 — Strategy Review Export Audit Report API Contract Selectors v1: builders.
 */

import type { StrategyReviewExportAuditReportApiContract } from '../strategy-review-export-audit-report-contracts/types.js';
import { getStrategyReviewExportAuditReportApiContractSelectorCapabilities } from './capabilities.js';
import { stableDeterministicSelectorChecksum } from './normalization.js';
import {
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_GENERATED_AT,
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_SOURCE,
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE,
  type StrategyReviewExportAuditReportApiContractSelector,
  type StrategyReviewExportAuditReportApiContractSelectorKind,
  type StrategyReviewExportAuditReportApiContractSelectorMeta,
  type StrategyReviewExportAuditReportApiContractSelectorName,
  type StrategyReviewExportAuditReportApiContractSelectorQuery,
  type StrategyReviewExportAuditReportApiContractSelectorQueryFilter,
  type StrategyReviewExportAuditReportApiContractSelectorQueryPagination,
  type StrategyReviewExportAuditReportApiContractSelectorQuerySort,
  type StrategyReviewExportAuditReportApiContractSelectorResult,
  type StrategyReviewExportAuditReportApiContractSelectorResultMeta,
  type StrategyReviewExportAuditReportApiContractSelectorResultSafety,
  type StrategyReviewExportAuditReportApiContractSelectorSafetyEnvelope,
  type StrategyReviewExportAuditReportApiContractSelectorValidationEnvelope,
} from './types.js';

function selectorId(seed: string): string {
  return `phase49-selector-${stableDeterministicSelectorChecksum(seed).replace(':', '-')}`;
}

function queryId(seed: string): string {
  return `phase49-query-${stableDeterministicSelectorChecksum(seed).replace(':', '-')}`;
}

function resultId(seed: string): string {
  return `phase49-result-${stableDeterministicSelectorChecksum(seed).replace(':', '-')}`;
}

function buildSelectorSafetyEnvelope(): StrategyReviewExportAuditReportApiContractSelectorSafetyEnvelope {
  return {
    fixtureOnly: true,
    syntheticOnly: true,
    deterministic: true,
    localOnly: true,
    readOnly: true,
    pure: true,
    nonExecutable: true,
    nonAdvisory: true,
    noLiveData: true,
    noNetworkAccess: true,
    noPersistence: true,
    noFilesystemWrites: true,
    noDownloads: true,
    noPdfGeneration: true,
    noCsvGeneration: true,
    noHtmlGeneration: true,
    noRouteHandlers: true,
    noHttpServer: true,
    noRuntimeRequests: true,
    noUiRendering: true,
    noDomAccess: true,
    noBackgroundJobs: true,
    noScheduledJobs: true,
    noExecution: true,
    noTradingSignals: true,
    noRecommendations: true,
    noInvestmentAdvice: true,
  };
}

function buildSelectorMeta(seed: string): StrategyReviewExportAuditReportApiContractSelectorMeta {
  return {
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE,
    selectorVersion: PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_VERSION,
    generatedAt: PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_GENERATED_AT,
    deterministicSeed: seed,
    source: PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_SOURCE,
    sourceContractPhase: 48,
    sourceViewModelPhase: 47,
    sourceReportPhase: 46,
    sourceAuditPhase: 45,
    sourcePhases: [45, 46, 47, 48, 49],
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    pure: true,
    liveData: false,
    networkAccess: false,
    persistence: false,
    filesystemWrites: false,
    downloads: false,
    pdfGeneration: false,
    csvGeneration: false,
    htmlGeneration: false,
    routeHandlers: false,
    httpServer: false,
    runtimeRequests: false,
    uiRendering: false,
    domAccess: false,
    backgroundJobs: false,
    scheduledJobs: false,
    execution: false,
    tradingSignals: false,
    recommendations: false,
    investmentAdvice: false,
  };
}

function buildSelectorValidationEnvelope(): StrategyReviewExportAuditReportApiContractSelectorValidationEnvelope {
  return {
    fixtureOnly: true,
    structuralValidation: 'passed',
    safetyValidation: 'passed',
    sourceContractValidation: 'passed',
    sourceViewModelValidation: 'passed',
    queryValidation: 'passed',
    resultValidation: 'passed',
    issueCount: 0,
  };
}

function buildResultSafety(): StrategyReviewExportAuditReportApiContractSelectorResultSafety {
  return {
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    pure: true,
    liveData: false,
    networkAccess: false,
    persistence: false,
    filesystemWrites: false,
    downloads: false,
    routeHandlers: false,
    httpServer: false,
    runtimeRequests: false,
    uiRendering: false,
    domAccess: false,
    execution: false,
    tradingSignals: false,
    recommendations: false,
    investmentAdvice: false,
  };
}

function buildResultMeta(
  seed: string,
  queryValueId: string,
  selectedContractCount: number,
): StrategyReviewExportAuditReportApiContractSelectorResultMeta {
  return {
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE,
    sourceContractPhase: 48,
    sourceViewModelPhase: 47,
    deterministicSeed: seed,
    queryId: queryValueId,
    selectedContractCount,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    pure: true,
  };
}

function uniqueStrings<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function toQueryFilters(
  contract: StrategyReviewExportAuditReportApiContract,
): readonly StrategyReviewExportAuditReportApiContractSelectorQueryFilter[] {
  if (contract.contractKind !== 'list') {
    return [];
  }
  return contract.filters.map(filter => ({
    field: filter.field,
    operator: 'eq',
    value: filter.value,
    fixtureOnly: true,
  }));
}

function toQueryPagination(
  contract: StrategyReviewExportAuditReportApiContract,
): StrategyReviewExportAuditReportApiContractSelectorQueryPagination | null {
  if (contract.contractKind !== 'list') {
    return null;
  }
  return {
    page: 1,
    pageSize: contract.pagination.pageSize,
    totalCount: contract.pagination.totalCount,
    pageCount: 1,
    fixtureOnly: true,
    readOnly: true,
  };
}

function toQuerySort(
  contract: StrategyReviewExportAuditReportApiContract,
): StrategyReviewExportAuditReportApiContractSelectorQuerySort | null {
  if (contract.contractKind !== 'list' || contract.sorts.length === 0) {
    return null;
  }
  const [sort] = contract.sorts;
  return sort
    ? {
        field: sort.field,
        direction: sort.direction,
        fixtureOnly: true,
      }
    : null;
}

export function buildStrategyReviewExportAuditReportApiContractSelectorQuery(input: {
  readonly selectorKind: StrategyReviewExportAuditReportApiContractSelectorKind;
  readonly contract: StrategyReviewExportAuditReportApiContract;
  readonly expectedStatusCode?: 200 | 404 | 422;
  readonly pagination?: StrategyReviewExportAuditReportApiContractSelectorQueryPagination | null;
  readonly filters?: readonly StrategyReviewExportAuditReportApiContractSelectorQueryFilter[];
  readonly sort?: StrategyReviewExportAuditReportApiContractSelectorQuerySort | null;
}): StrategyReviewExportAuditReportApiContractSelectorQuery {
  const pagination = input.pagination ?? toQueryPagination(input.contract);
  const filters = input.filters ?? toQueryFilters(input.contract);
  const sort = input.sort ?? toQuerySort(input.contract);
  const expectedStatusCode = input.expectedStatusCode ?? input.contract.statusCode;
  const seed = [
    'phase49:query',
    input.selectorKind,
    input.contract.contractName,
    String(expectedStatusCode),
    pagination ? `${pagination.page}:${pagination.pageSize}:${pagination.totalCount}` : 'no-pagination',
    filters.map(filter => `${filter.field}:${filter.value}`).join(','),
    sort ? `${sort.field}:${sort.direction}` : 'no-sort',
  ].join(':');

  return {
    queryId: queryId(seed),
    queryKind: input.selectorKind,
    readOnly: true,
    fixtureOnly: true,
    contractKind: input.contract.contractKind,
    contractName: input.contract.contractName,
    detailContractName: input.contract.contractKind === 'detail' ? input.contract.contractName : null,
    pagination,
    filters,
    sort,
    expectedStatusCode,
  };
}

export function buildStrategyReviewExportAuditReportApiContractSelectorResult(input: {
  readonly selectorKind: StrategyReviewExportAuditReportApiContractSelectorKind;
  readonly contract: StrategyReviewExportAuditReportApiContract;
  readonly contracts?: readonly StrategyReviewExportAuditReportApiContract[];
  readonly matched?: boolean;
  readonly queryId?: string;
}): StrategyReviewExportAuditReportApiContractSelectorResult {
  const contracts = input.contracts ?? [input.contract];
  const matched = input.matched ?? true;
  const queryValueId = input.queryId ?? `derived:${input.contract.contractName}`;
  const seed = [
    'phase49:result',
    input.selectorKind,
    input.contract.contractName,
    String(input.contract.statusCode),
    matched ? 'matched' : 'unmatched',
    contracts.map(contract => contract.contractId).join(','),
  ].join(':');

  return {
    resultId: resultId(seed),
    resultKind: input.selectorKind,
    matched,
    statusCode: input.contract.statusCode,
    contract: input.contract,
    contracts: [...contracts],
    meta: buildResultMeta(seed, queryValueId, contracts.length),
    safety: buildResultSafety(),
  };
}

export function buildStrategyReviewExportAuditReportApiContractSelectorFixture(input: {
  readonly selectorName: StrategyReviewExportAuditReportApiContractSelectorName;
  readonly selectorKind: StrategyReviewExportAuditReportApiContractSelectorKind;
  readonly contract: StrategyReviewExportAuditReportApiContract;
  readonly contracts?: readonly StrategyReviewExportAuditReportApiContract[];
  readonly query?: StrategyReviewExportAuditReportApiContractSelectorQuery;
  readonly result?: StrategyReviewExportAuditReportApiContractSelectorResult;
}): StrategyReviewExportAuditReportApiContractSelector {
  const contracts = input.contracts ?? [input.contract];
  const query = input.query ??
    buildStrategyReviewExportAuditReportApiContractSelectorQuery({
      selectorKind: input.selectorKind,
      contract: input.contract,
    });
  const result = input.result ??
    buildStrategyReviewExportAuditReportApiContractSelectorResult({
      selectorKind: input.selectorKind,
      contract: input.contract,
      contracts,
      queryId: query.queryId,
    });
  const seed = [
    'phase49:selector',
    input.selectorName,
    input.selectorKind,
    query.queryId,
    result.resultId,
    contracts.map(contract => contract.contractId).join(','),
  ].join(':');

  return {
    selectorId: selectorId(seed),
    selectorName: input.selectorName,
    selectorKind: input.selectorKind,
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_PHASE,
    sourceContractIds: uniqueStrings(contracts.map(contract => contract.contractId)),
    sourceContractNames: uniqueStrings(contracts.map(contract => contract.contractName)),
    sourceViewModelIds: uniqueStrings(contracts.flatMap(contract => [...contract.sourceViewModelIds])),
    sourceReportIds: uniqueStrings(contracts.flatMap(contract => [...contract.sourceReportIds])),
    sourceAuditIds: uniqueStrings(contracts.flatMap(contract => [...contract.sourceAuditIds])),
    query,
    result,
    meta: buildSelectorMeta(seed),
    safety: buildSelectorSafetyEnvelope(),
    validation: buildSelectorValidationEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportApiContractSelectorCapabilities(),
  };
}
