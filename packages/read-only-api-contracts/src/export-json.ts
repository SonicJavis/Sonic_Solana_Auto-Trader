/**
 * packages/read-only-api-contracts/src/export-json.ts
 *
 * Phase 19 — ReadOnlyApiContractBundle JSON export.
 *
 * Returns a deterministic, JSON-safe export.
 * No undefined, no functions, no circular refs, no secrets, no Error objects.
 * Stable key ordering where practical.
 */

import type { ReadOnlyApiContractBundle, ReadOnlyApiContractExport } from './types.js';

/**
 * Exports a ReadOnlyApiContractBundle as a deterministic JSON-safe object.
 * Analysis-only — no trade signals, no action labels, no secrets.
 */
export function exportReadOnlyApiContractJson(
  bundle: ReadOnlyApiContractBundle,
): ReadOnlyApiContractExport {
  return {
    exportKind: 'read_only_api_contract_export',
    bundle: {
      bundleId: bundle.bundleId,
      endpointContracts: bundle.endpointContracts.map(ec => ({
        endpointId: ec.endpointId,
        method: ec.method,
        pathTemplate: ec.pathTemplate,
        description: ec.description,
        responseTypeName: ec.responseTypeName,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        readOnly: true as const,
        contractOnly: true as const,
      })),
      healthContract: {
        healthId: bundle.healthContract.healthId,
        status: bundle.healthContract.status,
        message: bundle.healthContract.message,
        capabilities: { ...bundle.healthContract.capabilities },
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        readOnly: true as const,
        contractOnly: true as const,
      },
      dashboardContract: {
        dashboardContractId: bundle.dashboardContract.dashboardContractId,
        severity: bundle.dashboardContract.severity,
        summaryText: bundle.dashboardContract.summaryText,
        panelsAvailable: [...bundle.dashboardContract.panelsAvailable].sort(),
        totalFindings: bundle.dashboardContract.totalFindings,
        evidenceLedgerId: bundle.dashboardContract.evidenceLedgerId,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        readOnly: true as const,
        contractOnly: true as const,
      },
      evidenceContract: {
        evidenceContractId: bundle.evidenceContract.evidenceContractId,
        evidenceLedgerId: bundle.evidenceContract.evidenceLedgerId,
        severity: bundle.evidenceContract.severity,
        summaryText: bundle.evidenceContract.summaryText,
        entryCount: bundle.evidenceContract.entryCount,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        readOnly: true as const,
        contractOnly: true as const,
      },
      safetyContract: {
        safetyContractId: bundle.safetyContract.safetyContractId,
        capabilities: { ...bundle.safetyContract.capabilities },
        lockedCapabilityNames: [...bundle.safetyContract.lockedCapabilityNames].sort(),
        safetyInvariantsSatisfied: bundle.safetyContract.safetyInvariantsSatisfied,
        summaryText: bundle.safetyContract.summaryText,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        readOnly: true as const,
        contractOnly: true as const,
      },
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
      analysisOnly: true,
      nonExecutable: true,
      readOnly: true,
      contractOnly: true,
    },
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  };
}
