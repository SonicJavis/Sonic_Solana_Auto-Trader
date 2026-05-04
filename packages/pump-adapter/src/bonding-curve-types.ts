/**
 * Bonding curve state model for Phase 6A pump adapter.
 *
 * This is a pure data model — no Solana RPC, no network calls,
 * no transaction building, no signing, no sending.
 *
 * Live on-chain data fetching is NOT implemented in Phase 6A.
 */

import type { PumpVenueType } from './venue-types.js';

/**
 * A snapshot of a Pump.fun bonding curve state.
 *
 * This is a local model only — values are mock/estimated in Phase 6A.
 * No live RPC calls are made to fetch this data.
 */
export interface BondingCurveState {
  /** Solana token mint address (base58) */
  readonly tokenMint: string;
  /** Virtual SOL reserves in lamports (model value, not fetched from chain) */
  readonly virtualSolReserves: bigint;
  /** Virtual token reserves (model value, not fetched from chain) */
  readonly virtualTokenReserves: bigint;
  /** Real SOL reserves in lamports (model value, not fetched from chain) */
  readonly realSolReserves: bigint;
  /** Real token reserves (model value, not fetched from chain) */
  readonly realTokenReserves: bigint;
  /** Curve progress as a fraction 0.0–1.0 (0 = just launched, 1.0 = graduated) */
  readonly curveProgress: number;
  /** Whether the token has graduated from the bonding curve to an AMM */
  readonly isGraduated: boolean;
  /** The venue this state applies to */
  readonly venue: PumpVenueType;
  /** ISO timestamp when this state was modelled (not fetched from chain) */
  readonly modelledAt: string;
  /** Whether this is a mock/estimated state (always true in Phase 6A) */
  readonly isMockState: true;
}
