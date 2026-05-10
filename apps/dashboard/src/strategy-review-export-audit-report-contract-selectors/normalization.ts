/**
 * Phase 49 — Strategy Review Export Audit Report API Contract Selectors v1: normalization.
 */

import { normalizeStrategyReviewExportAuditReportApiContract } from '../strategy-review-export-audit-report-contracts/index.js';
import type {
  StrategyReviewExportAuditReportApiContractSelector,
  StrategyReviewExportAuditReportApiContractSelectorKind,
  StrategyReviewExportAuditReportApiContractSelectorName,
  StrategyReviewExportAuditReportApiContractSelectorResult,
} from './types.js';
import {
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_GENERATED_AT,
  PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_KINDS,
} from './types.js';

export function stableDeterministicSelectorChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((accumulator, [key, nextValue]) => {
        accumulator[key] = sortKeysDeep(nextValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidStrategyReviewExportAuditReportApiContractSelectorName(
  value: unknown,
): value is StrategyReviewExportAuditReportApiContractSelectorName {
  if (typeof value !== 'string') {
    return false;
  }
  return (
    value === 'strategy-review-export-audit-report-list-contract-selector' ||
    value === 'strategy-review-export-audit-report-summary-contract-selector' ||
    value === 'strategy-review-export-audit-report-error-not-found-contract-selector' ||
    value === 'strategy-review-export-audit-report-error-invalid-id-contract-selector' ||
    value.startsWith('strategy-review-export-audit-report-detail-contract-selector-')
  );
}

export function isValidStrategyReviewExportAuditReportApiContractSelectorKind(
  value: unknown,
): value is StrategyReviewExportAuditReportApiContractSelectorKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportApiContractSelectorGeneratedAt(
  value: unknown,
): boolean {
  return value === PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_GENERATED_AT;
}

export function isValidStrategyReviewExportAuditReportApiContractSelectorSource(
  value: unknown,
): boolean {
  return value === PHASE_49_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_SOURCE;
}

function normalizeSelectorResult(
  result: StrategyReviewExportAuditReportApiContractSelectorResult,
): StrategyReviewExportAuditReportApiContractSelectorResult {
  return {
    ...result,
    contract: normalizeStrategyReviewExportAuditReportApiContract(result.contract),
    contracts: [...result.contracts]
      .map(contract => normalizeStrategyReviewExportAuditReportApiContract(contract))
      .sort((left, right) => left.contractName.localeCompare(right.contractName)),
  };
}

export function normalizeStrategyReviewExportAuditReportApiContractSelector(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): StrategyReviewExportAuditReportApiContractSelector {
  return {
    ...selector,
    sourceContractIds: [...selector.sourceContractIds].sort((left, right) => left.localeCompare(right)),
    sourceContractNames: [...selector.sourceContractNames].sort((left, right) => left.localeCompare(right)),
    sourceViewModelIds: [...selector.sourceViewModelIds].sort((left, right) => left.localeCompare(right)),
    sourceReportIds: [...selector.sourceReportIds].sort((left, right) => left.localeCompare(right)),
    sourceAuditIds: [...selector.sourceAuditIds].sort((left, right) => left.localeCompare(right)),
    query: {
      ...selector.query,
      filters: [...selector.query.filters].sort((left, right) => {
        const fieldOrder = left.field.localeCompare(right.field);
        return fieldOrder !== 0 ? fieldOrder : left.value.localeCompare(right.value);
      }),
      sort: selector.query.sort ? { ...selector.query.sort } : null,
    },
    result: normalizeSelectorResult(selector.result),
  };
}

export function serializeStrategyReviewExportAuditReportApiContractSelector(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): string {
  return stablePrettyJsonStringify(
    normalizeStrategyReviewExportAuditReportApiContractSelector(selector),
  );
}

export function areStrategyReviewExportAuditReportApiContractSelectorsEqual(
  left: StrategyReviewExportAuditReportApiContractSelector,
  right: StrategyReviewExportAuditReportApiContractSelector,
): boolean {
  return (
    serializeStrategyReviewExportAuditReportApiContractSelector(left) ===
    serializeStrategyReviewExportAuditReportApiContractSelector(right)
  );
}
