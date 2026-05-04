/**
 * Mock pump adapter implementation for Phase 6A tests.
 *
 * This adapter is inert — it makes no network calls, no RPC queries,
 * builds no transactions, signs nothing, sends nothing, and executes no trades.
 *
 * Use this implementation in tests and for local development only.
 */

import type { PumpAdapter } from './adapter.js';
import type { PumpAdapterStatusReport, PumpVenueType } from './venue-types.js';
import type {
  PumpBuyQuoteRequest,
  PumpSellQuoteRequest,
  PumpQuoteResult,
} from './quote-types.js';
import type { BondingCurveState } from './bonding-curve-types.js';
import type { PumpAdapterResult } from './errors.js';
import { pumpOk, pumpErr } from './errors.js';
import { validateTokenMint, validateQuoteRequest } from './validation.js';

/**
 * Configuration for the mock adapter.
 * All values are optional — sensible defaults are used for unspecified fields.
 */
export interface MockPumpAdapterConfig {
  /** Status to report — defaults to 'disabled' */
  readonly status?: PumpAdapterStatusReport['status'];
  /** Venue to return for detectVenue — defaults to 'pump_curve' */
  readonly venue?: PumpVenueType;
  /** Curve progress to include in mock bonding curve state — defaults to 0.5 */
  readonly curveProgress?: number;
  /** Whether the token is graduated — defaults to false */
  readonly isGraduated?: boolean;
}

/**
 * A mock PumpAdapter for use in tests and local development.
 *
 * - Returns configured or default mock values for all methods
 * - Validates all inputs and returns safe errors for invalid inputs
 * - Never makes network calls, RPC queries, or transaction operations
 * - Cannot execute trades (executionForbidden: true always)
 */
export class MockPumpAdapter implements PumpAdapter {
  private readonly config: Required<MockPumpAdapterConfig>;

  constructor(config: MockPumpAdapterConfig = {}) {
    this.config = {
      status: config.status ?? 'disabled',
      venue: config.venue ?? 'pump_curve',
      curveProgress: config.curveProgress ?? 0.5,
      isGraduated: config.isGraduated ?? false,
    };
  }

  getStatus(): PumpAdapterStatusReport {
    return {
      status: this.config.status,
      isLiveCapable: false,
      hasLiveRpc: false,
      executionForbidden: true,
      message:
        'Pump adapter: model-only / no live RPC / execution forbidden (Phase 6A)',
      phase: 6,
      checkedAt: new Date().toISOString(),
    };
  }

  detectVenue(tokenMint: string): PumpAdapterResult<PumpVenueType> {
    const validation = validateTokenMint(tokenMint);
    if (!validation.ok) return validation;

    if (this.config.status === 'disabled') {
      return pumpErr(
        'ADAPTER_DISABLED',
        'Pump adapter is disabled — venue detection is not available in Phase 6A',
      );
    }
    if (this.config.status === 'unavailable') {
      return pumpErr(
        'ADAPTER_UNAVAILABLE',
        'Pump adapter is unavailable',
      );
    }

    return pumpOk(this.config.venue);
  }

  getBondingCurveState(tokenMint: string): PumpAdapterResult<BondingCurveState> {
    const validation = validateTokenMint(tokenMint);
    if (!validation.ok) return validation;

    if (this.config.status === 'disabled') {
      return pumpErr(
        'ADAPTER_DISABLED',
        'Pump adapter is disabled — bonding curve state is not available in Phase 6A',
      );
    }
    if (this.config.status === 'unavailable') {
      return pumpErr(
        'ADAPTER_UNAVAILABLE',
        'Pump adapter is unavailable',
      );
    }

    const state: BondingCurveState = {
      tokenMint,
      virtualSolReserves: BigInt('30000000000'),
      virtualTokenReserves: BigInt('1073000000000000'),
      realSolReserves: BigInt('0'),
      realTokenReserves: BigInt('793100000000000'),
      curveProgress: this.config.curveProgress,
      isGraduated: this.config.isGraduated,
      venue: this.config.venue,
      modelledAt: new Date().toISOString(),
      isMockState: true,
    };

    return pumpOk(state);
  }

  getBuyQuote(request: PumpBuyQuoteRequest): PumpAdapterResult<PumpQuoteResult> {
    const validation = validateQuoteRequest(request);
    if (!validation.ok) return validation;

    if (this.config.status === 'disabled') {
      return pumpErr(
        'ADAPTER_DISABLED',
        'Pump adapter is disabled — buy quotes are not available in Phase 6A',
      );
    }
    if (this.config.status === 'unavailable') {
      return pumpErr(
        'ADAPTER_UNAVAILABLE',
        'Pump adapter is unavailable',
      );
    }

    const result: PumpQuoteResult = {
      side: 'buy',
      tokenMint: request.tokenMint,
      inputAmount: request.inputAmount,
      inputUnit: request.inputUnit,
      estimatedOutputAmount: '1000000',
      estimatedPrice: '0.000030',
      estimatedFees: '0.000005',
      slippageBps: request.maxSlippageBps,
      venue: this.config.venue,
      curveProgress: this.config.curveProgress,
      safeToDisplay: true,
      isMockResult: true,
      generatedAt: new Date().toISOString(),
    };

    return pumpOk(result);
  }

  getSellQuote(request: PumpSellQuoteRequest): PumpAdapterResult<PumpQuoteResult> {
    const validation = validateQuoteRequest(request);
    if (!validation.ok) return validation;

    if (this.config.status === 'disabled') {
      return pumpErr(
        'ADAPTER_DISABLED',
        'Pump adapter is disabled — sell quotes are not available in Phase 6A',
      );
    }
    if (this.config.status === 'unavailable') {
      return pumpErr(
        'ADAPTER_UNAVAILABLE',
        'Pump adapter is unavailable',
      );
    }

    const result: PumpQuoteResult = {
      side: 'sell',
      tokenMint: request.tokenMint,
      inputAmount: request.inputAmount,
      inputUnit: request.inputUnit,
      estimatedOutputAmount: '0.030000',
      estimatedPrice: '0.000030',
      estimatedFees: '0.000005',
      slippageBps: request.maxSlippageBps,
      venue: this.config.venue,
      curveProgress: this.config.curveProgress,
      safeToDisplay: true,
      isMockResult: true,
      generatedAt: new Date().toISOString(),
    };

    return pumpOk(result);
  }
}

/**
 * Create a mock adapter configured as disabled (Phase 6A default).
 */
export function createDisabledMockAdapter(): MockPumpAdapter {
  return new MockPumpAdapter({ status: 'disabled' });
}

/**
 * Create a mock adapter configured as available (for testing non-disabled paths).
 */
export function createAvailableMockAdapter(
  config?: Omit<MockPumpAdapterConfig, 'status'>,
): MockPumpAdapter {
  return new MockPumpAdapter({ ...config, status: 'available' });
}
