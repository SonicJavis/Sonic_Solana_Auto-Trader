import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { IAuditRepository } from '@sonic/db';
import { getTelegramUserInfo, requireAdmin } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { PHASE } from '@sonic/shared';
import {
  formatAuditRecords,
  formatAuditStats,
  formatAuditHelp,
} from '../formatters/audit.js';

const PAGE_SIZE = 10;
const MAX_PAGE = 100;

/** Parse the text after /audit into sub-command + args */
function parseAuditArgs(text: string | undefined): { sub: string; arg: string } {
  if (!text) return { sub: 'recent', arg: '' };
  // Remove /audit prefix (e.g. "/audit severity warn" → "severity warn")
  const body = text.replace(/^\/audit\s*/, '').trim();
  if (!body) return { sub: 'recent', arg: '' };
  const parts = body.split(/\s+/);
  return { sub: (parts[0] ?? '').toLowerCase(), arg: parts.slice(1).join(' ').trim() };
}

export async function handleAudit(ctx: Context, config: AppConfig, auditLogger: IAuditRepository): Promise<void> {
  const info = getTelegramUserInfo(ctx);

  const allowed = await requireAdmin(ctx, config, '/audit', async (uInfo, action, accepted, reason) => {
    await auditTelegramCommand(auditLogger, { info: uInfo, command: action, accepted, reason });
  });
  if (!allowed) return;

  // Persist TELEGRAM_AUDIT_REQUESTED
  const msgText = 'text' in (ctx.message ?? {})
    ? (ctx.message as { text?: string }).text
    : undefined;

  auditLogger.record({
    eventType: 'TELEGRAM_AUDIT_REQUESTED',
    severity: 'info',
    source: 'telegram',
    phase: `Phase ${PHASE}`,
    message: `/audit requested by user ${info.userId}`,
    details: {
      userId: info.userId,
      username: info.username,
      chatId: info.chatId,
      query: msgText ?? '/audit',
    },
  });

  const { sub, arg } = parseAuditArgs(msgText);

  switch (sub) {
    case 'recent':
    case '': {
      const records = auditLogger.listRecent(PAGE_SIZE);
      await ctx.reply(formatAuditRecords(records, 'Recent Audit Events'));
      break;
    }

    case 'page': {
      const pageNum = parseInt(arg, 10);
      if (!Number.isFinite(pageNum) || pageNum < 1 || pageNum > MAX_PAGE) {
        await ctx.reply('Invalid page number. Use /audit page 1, page 2, … (max 100).');
        return;
      }
      const offset = (pageNum - 1) * PAGE_SIZE;
      const records = auditLogger.query({ limit: PAGE_SIZE, offset });
      await ctx.reply(formatAuditRecords(records, `Audit Events — Page ${pageNum}`));
      break;
    }

    case 'severity': {
      const valid = ['debug', 'info', 'warn', 'error', 'critical'];
      if (!arg || !valid.includes(arg.toLowerCase())) {
        await ctx.reply(`Invalid severity. Use: ${valid.join(', ')}`);
        return;
      }
      const records = auditLogger.query({ severity: arg.toLowerCase(), limit: PAGE_SIZE });
      await ctx.reply(formatAuditRecords(records, `Audit Events — Severity: ${arg}`));
      break;
    }

    case 'type': {
      if (!arg) {
        await ctx.reply('Usage: /audit type <EVENT_TYPE>');
        return;
      }
      const records = auditLogger.query({ eventType: arg.toUpperCase(), limit: PAGE_SIZE });
      await ctx.reply(formatAuditRecords(records, `Audit Events — Type: ${arg.toUpperCase()}`));
      break;
    }

    case 'source': {
      if (!arg) {
        await ctx.reply('Usage: /audit source <source>');
        return;
      }
      const records = auditLogger.query({ source: arg.toLowerCase(), limit: PAGE_SIZE });
      await ctx.reply(formatAuditRecords(records, `Audit Events — Source: ${arg}`));
      break;
    }

    case 'stats': {
      const stats = auditLogger.getStats();
      await ctx.reply(formatAuditStats(stats));
      break;
    }

    case 'help':
    default: {
      await ctx.reply(formatAuditHelp());
    }
  }
}
