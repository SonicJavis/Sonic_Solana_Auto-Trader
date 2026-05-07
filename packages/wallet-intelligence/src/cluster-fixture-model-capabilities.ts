/**
 * Phase 31 — Wallet Cluster Fixture Models v1: capability helpers.
 */

import type { WalletClusterFixtureModelCapabilities } from './cluster-fixture-model-types.js';

export function getWalletClusterFixtureModelCapabilities(): WalletClusterFixtureModelCapabilities {
  return {
    walletClusterIntelligenceFixtures: true,
    syntheticWalletClusters: true,
    walletClusterSignalFixtures: true,
    walletClusterRiskIndicators: true,
    walletClusterQualityIndicators: true,
    walletClusterFixtureSafetyValidation: true,
    walletClusterLiveData: false,
    walletClusterChainAccess: false,
    walletClusterRpcAccess: false,
    walletClusterIdentityResolution: false,
    walletClusterInvestmentAdvice: false,
    walletClusterTradingSignals: false,
    walletClusterExternalNetwork: false,
    walletClusterPersistence: false,
  };
}
