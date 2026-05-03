import type { AppMode } from '@sonic/shared';
import type { RuntimeSafetyStatus } from '@sonic/shared';
import { APP_VERSION, PHASE, PHASE_NAME } from '@sonic/shared';

export interface FormatStatusOpts {
  mode: AppMode;
  uptimeSeconds: number;
  telegramEnabled: boolean;
  adminConfigured: boolean;
  killSwitchActive: boolean;
  runtimeSafety?: RuntimeSafetyStatus | undefined;
}

export function formatStatus(opts: FormatStatusOpts): string {
  const now = new Date().toISOString();
  const safety = opts.runtimeSafety;
  const unsafeFlagsDetected = safety?.unsafeFlagsDetected ?? false;
  const unsafeFlagsList = safety?.unsafeFlags ?? [];

  return [
    '⚙️ System Status',
    `App: Sonic Solana Auto-Trader`,
    `Version: ${APP_VERSION}`,
    `Phase: ${PHASE} - ${PHASE_NAME}`,
    `Mode: ${opts.mode}`,
    `Uptime: ${opts.uptimeSeconds}s`,
    ``,
    `Telegram enabled: ${opts.telegramEnabled}`,
    `Admin allowlist configured: ${opts.adminConfigured}`,
    ``,
    `Trading enabled: false`,
    `Auto trading enabled: false`,
    `Execution enabled: false`,
    `Wallet loaded: false`,
    `Live providers connected: false`,
    `Solana RPC connected: false`,
    ``,
    `FULL_AUTO locked: true`,
    `LIMITED_LIVE locked: true`,
    `Kill switch active: ${opts.killSwitchActive}`,
    ``,
    `Unsafe flags detected: ${unsafeFlagsDetected}`,
    ...(unsafeFlagsList.length > 0
      ? [`Unsafe flags: ${unsafeFlagsList.join(', ')} (capabilities remain disabled)`]
      : []),
    ``,
    `Timestamp: ${now}`,
  ].join('\n');
}
