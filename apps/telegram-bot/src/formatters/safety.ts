import type { AppMode } from '@sonic/shared';

export function formatSafety(opts: {
  mode: AppMode;
  adminConfigured: boolean;
  killSwitchActive: boolean;
}): string {
  return [
    'Safety Posture',
    '',
    'READ_ONLY default: enabled',
    'Live trading: disabled',
    'Auto trading: disabled',
    'Transaction signing: disabled',
    'Transaction sending: disabled',
    'Private key handling: not implemented',
    'Wallet loading: not implemented',
    'Solana RPC connection: not implemented',
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
  ].join('\n');
}
