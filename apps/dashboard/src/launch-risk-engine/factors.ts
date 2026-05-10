/**
 * Phase 58 — Launch Risk Engine v1: factor definitions.
 *
 * Deterministic, rule-based risk factor weights and definitions.
 * Non-advisory, synthetic, local-only.
 */

import type { LaunchRiskFactorKind } from './types.js';

export interface LaunchRiskFactorDefinition {
  readonly factorKind: LaunchRiskFactorKind;
  readonly weight: number;
  readonly description: string;
  readonly reasonCodePrefix: string;
}

export const LAUNCH_RISK_FACTOR_DEFINITIONS: Readonly<
  Record<LaunchRiskFactorKind, LaunchRiskFactorDefinition>
> = {
  metadata_completeness_risk: {
    factorKind: 'metadata_completeness_risk',
    weight: 0.08,
    description:
      'Observed completeness of on-chain metadata fields. Incomplete metadata is a risk indicator, not a trading signal.',
    reasonCodePrefix: 'METADATA_COMPLETENESS',
  },
  mint_authority_risk: {
    factorKind: 'mint_authority_risk',
    weight: 0.10,
    description:
      'Observed mint authority state derived from lifecycle events. Non-revoked mint authority increases observed risk.',
    reasonCodePrefix: 'MINT_AUTHORITY',
  },
  freeze_authority_risk: {
    factorKind: 'freeze_authority_risk',
    weight: 0.10,
    description:
      'Observed freeze authority state. Retained freeze authority increases observed risk classification.',
    reasonCodePrefix: 'FREEZE_AUTHORITY',
  },
  thin_liquidity_risk: {
    factorKind: 'thin_liquidity_risk',
    weight: 0.12,
    description:
      'Derived liquidity depth classification from lifecycle liquidity events. Thin liquidity is a risk factor.',
    reasonCodePrefix: 'THIN_LIQUIDITY',
  },
  liquidity_volatility_risk: {
    factorKind: 'liquidity_volatility_risk',
    weight: 0.08,
    description:
      'Observed liquidity change variance derived from lifecycle events. High variance increases risk classification.',
    reasonCodePrefix: 'LIQUIDITY_VOLATILITY',
  },
  holder_concentration_risk: {
    factorKind: 'holder_concentration_risk',
    weight: 0.12,
    description:
      'Derived holder distribution concentration from lifecycle holder snapshot events.',
    reasonCodePrefix: 'HOLDER_CONCENTRATION',
  },
  creator_activity_risk: {
    factorKind: 'creator_activity_risk',
    weight: 0.10,
    description:
      'Observed creator activity pattern derived from lifecycle creator events.',
    reasonCodePrefix: 'CREATOR_ACTIVITY',
  },
  wallet_cluster_risk: {
    factorKind: 'wallet_cluster_risk',
    weight: 0.10,
    description:
      'Observed wallet cluster pattern from lifecycle wallet cluster events.',
    reasonCodePrefix: 'WALLET_CLUSTER',
  },
  early_volume_burst_risk: {
    factorKind: 'early_volume_burst_risk',
    weight: 0.10,
    description:
      'Derived early volume burst classification from lifecycle early volume events.',
    reasonCodePrefix: 'EARLY_VOLUME_BURST',
  },
  bundle_like_pattern_risk: {
    factorKind: 'bundle_like_pattern_risk',
    weight: 0.10,
    description:
      'Observed bundle-like pattern from lifecycle bundle pattern events.',
    reasonCodePrefix: 'BUNDLE_LIKE_PATTERN',
  },
  replay_integrity_risk: {
    factorKind: 'replay_integrity_risk',
    weight: 0.05,
    description:
      'Derived from Phase 57 replay report integrity. Mismatches or failures increase risk classification.',
    reasonCodePrefix: 'REPLAY_INTEGRITY',
  },
  safety_rejection_risk: {
    factorKind: 'safety_rejection_risk',
    weight: 0.05,
    description:
      'Observed safety rejection status from lifecycle safety rejection events.',
    reasonCodePrefix: 'SAFETY_REJECTION',
  },
} as const;

export function getLaunchRiskFactorWeight(factorKind: LaunchRiskFactorKind): number {
  return LAUNCH_RISK_FACTOR_DEFINITIONS[factorKind].weight;
}

export function getLaunchRiskFactorReasonCodePrefix(factorKind: LaunchRiskFactorKind): string {
  return LAUNCH_RISK_FACTOR_DEFINITIONS[factorKind].reasonCodePrefix;
}
