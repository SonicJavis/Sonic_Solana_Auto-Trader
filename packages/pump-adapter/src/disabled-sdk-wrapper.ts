/**
 * Phase 6C: Disabled Pump SDK Wrapper — implementation.
 *
 * This is the only Pump SDK wrapper implementation available in Phase 6C.
 * It is permanently disabled and returns safe error/disabled results for
 * all live/executable method calls.
 *
 * SAFETY NOTICE:
 * - No Pump SDK runtime is imported.
 * - No Solana SDK is imported.
 * - No live RPC is used.
 * - No instructions are built.
 * - No account metas are returned.
 * - No binary instruction data is returned.
 * - No transactions are constructed, simulated, signed, or sent.
 * - No wallets or private keys are accessed.
 * - FULL_AUTO and LIMITED_LIVE remain locked.
 */

import type { PumpAdapterResult } from './errors.js';
import { pumpErr } from './errors.js';
import type {
  PumpSdkWrapper,
  PumpSdkWrapperCapabilities,
  PumpSdkWrapperConfig,
  PumpSdkWrapperDisabledResult,
  PumpSdkWrapperMode,
  PumpSdkWrapperStatus,
} from './sdk-wrapper-types.js';
import {
  DISABLED_WRAPPER_CONFIG,
  PUMP_SDK_WRAPPER_CAPABILITIES,
} from './sdk-wrapper-types.js';

/** Human-readable reason shown for all disabled-wrapper responses. */
const DISABLED_REASON =
  'Pump SDK wrapper is disabled in Phase 6C. ' +
  'No Pump SDK runtime is installed. ' +
  'No Solana SDK is present. ' +
  'Live RPC, real instruction building, account metas, binary instruction data, ' +
  'transaction construction, simulation, signing, sending, wallet access, ' +
  'and execution are all forbidden. ' +
  'FULL_AUTO and LIMITED_LIVE remain locked.';

/**
 * Constructs a safe disabled result object.
 * Never contains raw secrets, private keys, stack traces, RPC URLs,
 * or sensitive environment values.
 */
function makeDisabledResult(
  code: PumpSdkWrapperDisabledResult['code'],
  message: string,
  mode: PumpSdkWrapperMode = 'disabled',
): PumpSdkWrapperDisabledResult {
  return {
    ok: false,
    code,
    message,
    safeToDisplay: true,
    wrapperMode: mode,
  };
}

/**
 * The disabled Pump SDK wrapper implementation.
 *
 * All methods return safe disabled/forbidden results.
 * No network calls, SDK clients, wallets, instructions, or execution paths exist.
 */
export class DisabledPumpSdkWrapper implements PumpSdkWrapper {
  private readonly mode: PumpSdkWrapperMode = 'disabled';

  getStatus(): PumpSdkWrapperStatus {
    return 'disabled';
  }

  getCapabilities(): PumpSdkWrapperCapabilities {
    return PUMP_SDK_WRAPPER_CAPABILITIES;
  }

  getConfig(): PumpSdkWrapperConfig {
    return DISABLED_WRAPPER_CONFIG;
  }

  assertDisabled(): PumpSdkWrapperDisabledResult {
    return makeDisabledResult(
      'SDK_WRAPPER_DISABLED',
      'Pump SDK wrapper is disabled. No live capability is available in Phase 6C.',
      this.mode,
    );
  }

  explainDisabledReason(): string {
    return DISABLED_REASON;
  }

  getLiveQuote(
    _tokenMint: string,
    _side: string,
  ): PumpAdapterResult<PumpSdkWrapperDisabledResult> {
    return pumpErr(
      'EXECUTION_FORBIDDEN',
      'getLiveQuote is forbidden in Phase 6C — live RPC is not available and execution is forbidden.',
    );
  }

  getLiveBondingCurveState(
    _tokenMint: string,
  ): PumpAdapterResult<PumpSdkWrapperDisabledResult> {
    return pumpErr(
      'EXECUTION_FORBIDDEN',
      'getLiveBondingCurveState is forbidden in Phase 6C — live RPC is not available.',
    );
  }

  buildRealInstruction(
    _intentType: string,
  ): PumpAdapterResult<PumpSdkWrapperDisabledResult> {
    return pumpErr(
      'EXECUTION_FORBIDDEN',
      'buildRealInstruction is forbidden in Phase 6C — real instruction building is not available.',
    );
  }
}

/**
 * The single shared disabled wrapper instance.
 * Safe to use anywhere in Phase 6C.
 */
export const DISABLED_PUMP_SDK_WRAPPER = new DisabledPumpSdkWrapper();

/**
 * Returns the disabled Pump SDK wrapper.
 * Convenience factory for use in tests and system status.
 */
export function createDisabledSdkWrapper(): DisabledPumpSdkWrapper {
  return new DisabledPumpSdkWrapper();
}
