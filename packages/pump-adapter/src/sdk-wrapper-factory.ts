/**
 * Phase 6C: Pump SDK Wrapper Factory.
 *
 * Creates Pump SDK wrapper instances.
 * In Phase 6C, the factory always returns a disabled wrapper regardless of
 * input. Unsafe enable/live/executable configs are coerced to disabled.
 *
 * SAFETY NOTICE:
 * - No Pump SDK runtime is loaded.
 * - No Solana SDK is loaded.
 * - No live RPC config is accepted.
 * - No wallet config is accepted.
 * - No environment secrets are required.
 * - All live/executable config attempts fail closed.
 */

import type { PumpSdkWrapper } from './sdk-wrapper-types.js';
import { DisabledPumpSdkWrapper } from './disabled-sdk-wrapper.js';

/**
 * Input accepted by `createPumpSdkWrapper`.
 *
 * All fields are optional — passing nothing returns the disabled wrapper.
 * Passing any live/executable fields also returns the disabled wrapper;
 * unsafe attempts are coerced to disabled (fail-closed).
 *
 * No wallet config, RPC URL, SDK path, private key, or secret is accepted.
 */
export interface PumpSdkWrapperFactoryInput {
  /**
   * Whether to enable the wrapper.
   * Ignored in Phase 6C — always produces a disabled wrapper.
   */
  readonly enabled?: boolean;

  /**
   * Whether live RPC should be allowed.
   * Ignored in Phase 6C — always coerced to false (fail-closed).
   */
  readonly allowLiveRpc?: boolean;

  /**
   * Whether instruction building should be allowed.
   * Ignored in Phase 6C — always coerced to false (fail-closed).
   */
  readonly allowInstructionBuilding?: boolean;

  /**
   * Whether executable instructions should be allowed.
   * Ignored in Phase 6C — always coerced to false (fail-closed).
   */
  readonly allowExecutableInstructions?: boolean;

  /**
   * Whether signing should be allowed.
   * Ignored in Phase 6C — always coerced to false (fail-closed).
   */
  readonly allowSigning?: boolean;

  /**
   * Whether sending should be allowed.
   * Ignored in Phase 6C — always coerced to false (fail-closed).
   */
  readonly allowSending?: boolean;

  /**
   * Whether wallet access should be allowed.
   * Ignored in Phase 6C — always coerced to false (fail-closed).
   */
  readonly allowWalletAccess?: boolean;
}

/**
 * Creates a Pump SDK wrapper.
 *
 * In Phase 6C, this always returns a `DisabledPumpSdkWrapper`.
 * Any `config` values requesting live/executable behaviour are silently
 * coerced to disabled (fail-closed). Passing `undefined` or `null` also
 * returns the disabled wrapper safely.
 *
 * No Pump SDK runtime is loaded. No Solana SDK is loaded. No RPC URL,
 * wallet, private key, or secret is accepted.
 *
 * @param config - Optional factory input. All live/executable fields are ignored.
 * @returns A disabled `PumpSdkWrapper` instance.
 */
export function createPumpSdkWrapper(
  config?: PumpSdkWrapperFactoryInput | null | undefined,
): PumpSdkWrapper {
  // config is intentionally unused — the factory always returns disabled in Phase 6C.
  void config;
  return new DisabledPumpSdkWrapper();
}
