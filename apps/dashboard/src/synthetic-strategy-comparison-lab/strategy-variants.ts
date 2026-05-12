import type { SyntheticStrategyVariant, SyntheticStrategyVariantId } from './types.js';
import { SYNTHETIC_STRATEGY_VARIANT_IDS } from './types.js';

const VARIANT_DESCRIPTIONS: Readonly<Record<SyntheticStrategyVariantId, string>> = {
  conservative_safety_first:
    'Hypothetical comparison profile that emphasizes safety preservation and rejection sensitivity under synthetic fixtures.',
  liquidity_sensitive:
    'Hypothetical comparison profile that emphasizes liquidity-condition sensitivity under synthetic fixtures.',
  latency_sensitive:
    'Hypothetical comparison profile that emphasizes latency-condition sensitivity under synthetic fixtures.',
  evidence_weighted:
    'Hypothetical comparison profile that emphasizes evidence-confidence weighting under synthetic fixtures.',
};

export function buildSyntheticStrategyVariant(variantId: SyntheticStrategyVariantId): SyntheticStrategyVariant {
  return {
    variantId,
    variantKind: 'synthetic_hypothetical_variant',
    variantName: variantId,
    description: VARIANT_DESCRIPTIONS[variantId],
    syntheticOnly: true,
    hypotheticalOnly: true,
    executable: false,
    emitsSignals: false,
    advisory: false,
    selectionPolicy: null,
  };
}

export function buildSyntheticStrategyVariants(): readonly SyntheticStrategyVariant[] {
  return SYNTHETIC_STRATEGY_VARIANT_IDS.map(buildSyntheticStrategyVariant);
}
