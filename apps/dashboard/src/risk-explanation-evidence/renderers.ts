/**
 * Phase 59 — Risk Explanation and Evidence Models v1: deterministic renderers.
 */

import { RISK_EXPLANATION_TEMPLATE_MAP } from './explanation-templates.js';

export function renderRiskExplanationTemplate(
  templateId: string,
  values: Readonly<Record<string, string | number>>,
): string {
  const template = RISK_EXPLANATION_TEMPLATE_MAP.get(templateId);
  if (!template) {
    return '';
  }

  let output = template.template;
  for (const variable of template.variables) {
    const value = values[variable];
    output = output.replaceAll(`{${variable}}`, String(value ?? ''));
  }
  return output;
}
