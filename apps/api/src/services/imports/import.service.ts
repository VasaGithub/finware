import type { Import, Prisma, TransactionSource } from '@prisma/client';
import { db } from '../../lib/db.js';
import { logger } from '../../lib/logger.js';
import { parseCsv } from '../parsers/csv.parser.js';
import { generateFingerprint } from '../parsers/fingerprint.js';

type ProcessImportInput = {
  accountId: string;
  userId: string;
  filename: string;
  buffer: Buffer;
  source: TransactionSource;
};

export async function processImport(input: ProcessImportInput): Promise<Import> {
  const record = await db.import.create({
    data: {
      userId: input.userId,
      source: input.source,
      filename: input.filename,
      status: 'PENDING',
    },
  });

  try {
    const parsed = parseCsv(input.buffer);

    const data = parsed.transactions.map((tx) => ({
      accountId: input.accountId,
      date: tx.date,
      amount: tx.amount,
      currency: tx.currency,
      description: tx.description,
      source: input.source,
      importId: record.id,
      fingerprint: generateFingerprint(tx.date, tx.amount, tx.description),
      ...(tx.rawData !== undefined
        ? { rawData: tx.rawData as Prisma.InputJsonValue }
        : {}),
    }));

    const result = await db.transaction.createMany({ data, skipDuplicates: true });
    const duplicates = data.length - result.count;

    return await db.import.update({
      where: { id: record.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        metadata: {
          total: parsed.total,
          imported: result.count,
          skipped: parsed.skipped,
          duplicates,
        },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    logger.error({ importId: record.id, errorMessage: message }, 'Import failed');
    return await db.import.update({
      where: { id: record.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        metadata: { error: message },
      },
    });
  }
}
