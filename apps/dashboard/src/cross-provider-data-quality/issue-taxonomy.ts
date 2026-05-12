import {
  DATA_QUALITY_CONFIDENCE_LABELS,
  DATA_QUALITY_ISSUE_KINDS,
  DATA_QUALITY_SEVERITIES,
  MISMATCH_CATEGORIES,
  PROVIDER_TRUST_LABELS,
  RECONCILIATION_STATUS_LABELS,
  type CrossProviderDataQualityFixture,
} from './types.js';

export function buildIssueTaxonomy(): CrossProviderDataQualityFixture['issueTaxonomy'] {
  return {
    issueKinds: DATA_QUALITY_ISSUE_KINDS,
    severities: DATA_QUALITY_SEVERITIES,
    confidenceLabels: DATA_QUALITY_CONFIDENCE_LABELS,
    providerTrustLabels: PROVIDER_TRUST_LABELS,
    mismatchCategories: MISMATCH_CATEGORIES,
    reconciliationStatuses: RECONCILIATION_STATUS_LABELS,
  };
}
