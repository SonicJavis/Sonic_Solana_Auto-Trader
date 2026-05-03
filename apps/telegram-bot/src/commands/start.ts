import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditRepository } from '@sonic/db';
import { getTelegramUserInfo, hasConfiguredAdmins } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';

export async function handleStart(ctx: Context, config: AppConfig, modeManager: ModeManager, auditLogger: IAuditRepository): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const mode = modeManager.getMode();
  await auditTelegramCommand(auditLogger, { info, command: '/start', accepted: true });
  const adminNote = hasConfiguredAdmins(config)
    ? ''
    : '\n\nWarning: No admin IDs are configured. Control commands are locked.';
  await ctx.reply(
    [
      'Sonic Solana Auto-Trader',
      'Phase 2 - Telegram Control Layer Hardening',
      '',
      'This system is a defensive intelligence and control foundation.',
      '',
      'Current status:',
      '  Live trading: DISABLED',
      '  Execution engine: DISABLED',
      '  Wallet / private key handling: NOT IMPLEMENTED',
      '  Auto trading: DISABLED',
      '',
      `Current mode: ${mode}`,
      '',
      'Use /help to see available commands.',
      'Use /status for full system status.',
      'Use /safety to see the safety posture.',
      adminNote,
    ]
      .join('\n')
      .trim(),
  );
}
