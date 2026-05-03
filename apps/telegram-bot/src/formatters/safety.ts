import type { AppMode } from '@sonic/shared';
import type { RuntimeSafetyStatus } from '@sonic/shared';

export interface FormatSafetyOpts {
  mode: AppMode;
  adminConfigured: boolean;
  killSwitchActive: boolean;
  runtimeSafety?: RuntimeSafetyStatus | undefined;
}

export function formatSafety(opts: FormatSafetyOpts): string {
  const safety = opts.runtimeSafety;
  const unsafeFlagsDetected = safety?.unsafeFlagsDetected ?? false;
  const unsafeFlags = safety?.unsafeFlags ?? [];
  const warnings = safety ? [...(safety.warnings ?? [])] : [];

  if (unsafeFlagsDetected && !warnings.some((w) => w.includes('Unsafe flags'))) {
    warnings.push(`Unsafe flags detected: ${unsafeFlags.join(', ')} — capabilities remain disabled`);
  }

  return [
    '🛡️ Safety Posture',
    '',
    'READ_ONLY default: enabled',
    'Live trading: disabled',
    'Auto trading: disabled',
    'Transaction signing: disabled',
    'Transaction sending: disabled',
    'Private key handling: not implemented',
    'Wallet loading: not implemented',
    'Solana RPC: disabled / not implemented',
    'Jito: disabled / not implemented',
    'Pump.fun trading: disabled / not implemented',
    '',
    'FULL_AUTO: locked',
    'LIMITED_LIVE: locked',
    '',
    'Risk engine: active',
    'Mode manager: active',
    'Kill switch: available',
    `Kill switch active: ${opts.killSwitchActive}`,
    `Admin allowlist: ${opts.adminConfigured ? 'configured' : 'not configured'}`,
    `Current mode: ${opts.mode}`,
    `Unsafe flags detected: ${unsafeFlagsDetected}`,
    ...(warnings.length > 0 ? ['', 'Warnings:', ...warnings.map((w) => `  ⚠️ ${w}`)] : []),
  ].join('\n');
}
