import type { AppMode } from '@sonic/shared';
import { APP_VERSION, PHASE, PHASE_NAME } from '@sonic/shared';

export function formatStatus(opts: {
  mode: AppMode;
  uptimeSeconds: number;
  telegramEnabled: boolean;
  adminConfigured: boolean;
  killSwitchActive: boolean;
}): string {
  const now = new Date().toISOString();
  return [
    'System Status',
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
    `Execution enabled: false`,
    `Wallet loaded: false`,
    `Live providers connected: false`,
    ``,
    `FULL_AUTO locked: true`,
    `LIMITED_LIVE locked: true`,
    `Kill switch active: ${opts.killSwitchActive}`,
    ``,
    `Timestamp: ${now}`,
  ].join('\n');
}
