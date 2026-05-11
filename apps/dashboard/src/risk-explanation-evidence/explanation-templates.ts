/**
 * Phase 59 — Risk Explanation and Evidence Models v1: explanation templates.
 */

import type { RiskExplanationTemplate } from './types.js';

export const RISK_EXPLANATION_TEMPLATES: readonly RiskExplanationTemplate[] = [
  {
    templateId: 'phase59-template-summary',
    templateKind: 'summary_template',
    variables: ['riskBand'],
    template:
      'Observed risk classification {riskBand} derived from synthetic evidence. This output is non-actionable and not a signal.',
    fixedOrder: 1,
    allowedWordingOnly: true,
  },
  {
    templateId: 'phase59-template-assessment',
    templateKind: 'assessment_template',
    variables: ['factorCount'],
    template:
      'Assessment derived from {factorCount} risk factors linked to lifecycle events and replay snapshots as source reference evidence.',
    fixedOrder: 2,
    allowedWordingOnly: true,
  },
  {
    templateId: 'phase59-template-factor',
    templateKind: 'factor_template',
    variables: ['factorKind', 'confidenceLabel'],
    template:
      'Risk factor {factorKind} is derived from observed evidence with confidence label {confidenceLabel}. This is non-actionable and requires review.',
    fixedOrder: 3,
    allowedWordingOnly: true,
  },
  {
    templateId: 'phase59-template-confidence',
    templateKind: 'confidence_template',
    variables: ['label'],
    template:
      'Confidence summary derived from fixture evidence: {label}.',
    fixedOrder: 4,
    allowedWordingOnly: true,
  },
  {
    templateId: 'phase59-template-limitation',
    templateKind: 'limitation_template',
    variables: [],
    template:
      'Limitations: synthetic fixture coverage only; no live market or execution context is included.',
    fixedOrder: 5,
    allowedWordingOnly: true,
  },
  {
    templateId: 'phase59-template-safety',
    templateKind: 'safety_template',
    variables: [],
    template:
      'Safety note: explanation output is non-advisory, non-networked, read-only, and not a signal.',
    fixedOrder: 6,
    allowedWordingOnly: true,
  },
] as const;

export const RISK_EXPLANATION_TEMPLATE_MAP: ReadonlyMap<string, RiskExplanationTemplate> =
  new Map(RISK_EXPLANATION_TEMPLATES.map(template => [template.templateId, template]));
